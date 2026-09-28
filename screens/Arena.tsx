import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { DebateStyle, DebateResult, DebateMode, TechnicalStrategy, SpeechSlotId } from '../types';
import { generateDebateCritique, generateSpeechCritique, getAISpeech, generateSpeech } from '../services/geminiService';

// Manual decode function for base64 to Uint8Array as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Manual decodeAudioData function for raw PCM data as per guidelines
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface ArenaProps {
  style: DebateStyle;
  mode: DebateMode;
  topic: string;
  side: 'Pro' | 'Con';
  order: '1st' | '2nd';
  techStrategy?: TechnicalStrategy;
  onFinish: (result: DebateResult) => void;
  onBack: () => void;
}

interface Step {
  id: SpeechSlotId;
  label: string;
  timeLimit: number;
  speaker: '1st' | '2nd' | 'both';
  folderId: string;
}

const Arena: React.FC<ArenaProps> = ({ style, mode, topic, side, order, techStrategy, onFinish, onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(240);
  const [prepTimeLeft, setPrepTimeLeft] = useState(180); // 3:00 total prep bank
  const [isPrepActive, setIsPrepActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isCrossfireActive, setIsCrossfireActive] = useState(false);
  const [isConFirst] = useState(() => mode === 'full_round' && Math.random() > 0.5);
  const [recordedSpeeches, setRecordedSpeeches] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [bars, setBars] = useState<number[]>(new Array(20).fill(10));
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['constructives']);
  const [viewingSpeech, setViewingSpeech] = useState<{ title: string; text: string } | null>(null);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [preppedSpeeches, setPreppedSpeeches] = useState<Record<string, { text: string; audioBase64: string }>>({});
  const preppingRef = useRef<Set<string>>(new Set());

  // AI Audio Refs for dynamic speed adjustment
  const aiSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const aiAudioCtxRef = useRef<AudioContext | null>(null);
  const aiStartTimeRef = useRef<number>(0);
  const aiBufferDurationRef = useRef<number>(0);
  const aiBufferPositionRef = useRef<number>(0);
  const aiLastTickTimeRef = useRef<number>(0);

  // Live API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const currentLiveSessionRef = useRef<any>(null);

  const steps: Step[] = useMemo(() => {
    const proFirst = !isConFirst;
    const firstSide = proFirst ? 'pro' : 'con';
    const secondSide = proFirst ? 'con' : 'pro';

    return [
      { id: `${firstSide}_const` as SpeechSlotId, label: '1st Constructive', timeLimit: 240, speaker: '1st', folderId: 'constructives' },
      { id: `${secondSide}_const` as SpeechSlotId, label: '2nd Constructive', timeLimit: 240, speaker: '2nd', folderId: 'constructives' },
      { id: 'cf_1', label: '1st Crossfire', timeLimit: 180, speaker: 'both', folderId: 'constructives' },
      { id: `${firstSide}_rebut` as SpeechSlotId, label: '1st Rebuttal', timeLimit: 240, speaker: '1st', folderId: 'rebuttals' },
      { id: `${secondSide}_rebut` as SpeechSlotId, label: '2nd Rebuttal', timeLimit: 240, speaker: '2nd', folderId: 'rebuttals' },
      { id: 'cf_2', label: '2nd Crossfire', timeLimit: 180, speaker: 'both', folderId: 'rebuttals' },
      { id: `${firstSide}_summ` as SpeechSlotId, label: '1st Summary', timeLimit: 180, speaker: '1st', folderId: 'summaries' },
      { id: `${secondSide}_summ` as SpeechSlotId, label: '2nd Summary', timeLimit: 180, speaker: '2nd', folderId: 'summaries' },
      { id: 'gcf', label: 'Grand Crossfire', timeLimit: 180, speaker: 'both', folderId: 'summaries' },
      { id: `${firstSide}_ff` as SpeechSlotId, label: '1st Final Focus', timeLimit: 120, speaker: '1st', folderId: 'final_focus' },
      { id: `${secondSide}_ff` as SpeechSlotId, label: '2nd Final Focus', timeLimit: 120, speaker: '2nd', folderId: 'final_focus' },
    ];
  }, [isConFirst]);

  const groups = [
    { id: 'constructives', title: 'Constructives', icon: 'edit_note' },
    { id: 'rebuttals', title: 'Rebuttals', icon: 'forum' },
    { id: 'summaries', title: 'Summaries', icon: 'contract' },
    { id: 'final_focus', title: 'Final Focus', icon: 'gavel' }
  ];

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (currentStepIndex === steps.length && !isLoading) {
      handleFinalAnalysis();
    }
  }, [currentStepIndex]);

  useEffect(() => {
    if (currentStep) {
      setTimerActive(false);
      setTimeLeft(currentStep.timeLimit);
      if (!expandedFolders.includes(currentStep.folderId)) {
        setExpandedFolders(prev => [...prev, currentStep.folderId]);
      }
    }
  }, [currentStepIndex]);

  useEffect(() => {
    let interval: any;
    if (timerActive) {
      interval = setInterval(() => setTimeLeft((prev) => {
        if (prev <= 0) {
          if (isCrossfireActive) stopCrossfire();
          // Force stop AI speech if time is up
          if (aiSourceRef.current) {
            aiSourceRef.current.stop();
            aiSourceRef.current = null;
          }
          return 0;
        }

        // Dynamic speed adjustment for AI speech
        if (isAiSpeaking && aiSourceRef.current && aiAudioCtxRef.current) {
          const now = aiAudioCtxRef.current.currentTime;
          const delta = now - aiLastTickTimeRef.current;
          aiBufferPositionRef.current += delta * aiSourceRef.current.playbackRate.value;
          aiLastTickTimeRef.current = now;

          const remainingAudio = aiBufferDurationRef.current - aiBufferPositionRef.current;
          const remainingTimer = prev;

          if (remainingTimer > 0 && remainingAudio > 0) {
            // Calculate required rate to finish on time
            const requiredRate = remainingAudio / remainingTimer;
            
            // Apply smoothing and limits to avoid robotic jumps
            const currentRate = aiSourceRef.current.playbackRate.value;
            const targetRate = Math.max(1.0, Math.min(requiredRate, 3.0)); // Max 3.0x speed
            
            // Gradually adjust toward target
            aiSourceRef.current.playbackRate.value = currentRate + (targetRate - currentRate) * 0.3;
          }
        }

        return prev - 1;
      }), 1000);
    }
    if (isPrepActive) {
      interval = setInterval(() => setPrepTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isCrossfireActive, isPrepActive]);

  useEffect(() => {
    const waveInterval = setInterval(() => {
      if (isRecording || isAiThinking || isAiSpeaking || isCrossfireActive) setBars(Array.from({ length: 20 }, () => Math.random() * 40 + 20));
      else setBars(Array.from({ length: 20 }, () => 10));
    }, 100);
    return () => clearInterval(waveInterval);
  }, [isRecording, isAiThinking, isAiSpeaking, isCrossfireActive]);

  const isAiTurn = (mode === 'ai' && currentStep?.speaker !== order && currentStep?.speaker !== 'both') || (mode === 'full_round' && currentStep?.speaker !== 'both');
  const isCrossfire = currentStep?.speaker === 'both';
  const isAiCrossfire = mode === 'full_round' && isCrossfire;

  // Pre-generation logic
  useEffect(() => {
    // Only pre-generate in full_round mode where the AI plays both parts
    if (mode !== 'full_round' || currentStepIndex >= steps.length || isLoading) return;

    const prepNextAiSpeech = async () => {
      // Look ahead for the next AI speech step
      let nextAiStepIndex = -1;
      for (let i = currentStepIndex; i < steps.length; i++) {
        const step = steps[i];
        const isStepAiTurn = step.speaker !== 'both';
        
        // If it's the current step and it's already prepped or being prepped, skip
        if (i === currentStepIndex && (preppedSpeeches[step.id] || preppingRef.current.has(step.id))) continue;
        
        if (isStepAiTurn) {
          nextAiStepIndex = i;
          break;
        }
      }

      if (nextAiStepIndex !== -1) {
        const nextStep = steps[nextAiStepIndex];
        if (preppedSpeeches[nextStep.id] || preppingRef.current.has(nextStep.id)) return;

        preppingRef.current.add(nextStep.id);
        try {
          const effectiveSide = nextStep.id.startsWith('pro_') ? 'Con' : 'Pro';
          
          const text = await getAISpeech(nextStep.id, effectiveSide, style, topic, techStrategy || 'Substance', recordedSpeeches);
          const audioBase64 = await generateSpeech(text, style);
          
          if (audioBase64) {
            setPreppedSpeeches(prev => ({ ...prev, [nextStep.id]: { text, audioBase64 } }));
          }
        } catch (e) {
          console.error("Pre-generation failed for", nextStep.id, e);
        } finally {
          preppingRef.current.delete(nextStep.id);
        }
      }
    };

    prepNextAiSpeech();
  }, [currentStepIndex, recordedSpeeches, mode, order, side, style, topic, techStrategy, steps]);

  const stopCrossfire = () => {
    if (currentLiveSessionRef.current) {
      currentLiveSessionRef.current.close();
      currentLiveSessionRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    setIsCrossfireActive(false);
    setTimerActive(false);
    setCurrentStepIndex(prev => prev + 1);
  };

  const startCrossfireSession = async () => {
    if (isCrossfireActive) return;
    setIsCrossfireActive(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = outputCtx;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    inputAudioContextRef.current = inputCtx;

    const historyContext = Object.entries(recordedSpeeches)
      .map(([id, text]) => `[SPEECH ${id.toUpperCase()}]: ${(text as string).substring(0, 500)}`)
      .join("\n");

    const isLay = style.toLowerCase().includes('lay');
    const aiSideLabel = side === 'Pro' ? 'CON' : 'PRO';

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          setTimerActive(true); // Start timer only when connection is established
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
            const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
            sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: LiveServerMessage) => {
          const audio = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            const buf = await decodeAudioData(decode(audio), outputCtx, 24000, 1);
            const src = outputCtx.createBufferSource();
            src.buffer = buf;
            src.connect(outputCtx.destination);
            src.addEventListener('ended', () => sourcesRef.current.delete(src));
            src.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buf.duration;
            sourcesRef.current.add(src);
          }
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        systemInstruction: `You are in a live ${currentStep.label} for a ${style} debate.
        TOPIC: "${topic}".
        Your side: ${aiSideLabel}.
        Your Strategy: ${techStrategy}.
        ROUND CONTEXT:
        ${historyContext}
        
        INSTRUCTIONS FOR CROSSFIRE: 
        1. Always speak strictly from your point of view as the ${aiSideLabel} debater. Never ask questions from the user's perspective.
        2. Ask the user (your opponent) challenging questions about their specific case points.
        3. Listen to their response, provide a brief rebuttal, and then invite them to ask you a question.
        4. Defend your case when asked.
        5. ${isLay ? "Do NOT use technical jargon (turn, impact, flow). Use plain English." : "Use professional debate jargon as appropriate."}
        6. Act as a competitive rival debater, not a coach or assistant.
        7. MANDATORY: If the timer hits zero while you are speaking, you MUST immediately say: "That's time but we'll address that in speech" and stop.`
      }
    });

    currentLiveSessionRef.current = await sessionPromise;
  };

  const playAiSpeech = async (stepId: SpeechSlotId) => {
    if (!currentStep) return;
    
    // Check if speech is already prepped
    if (preppedSpeeches[stepId]) {
      const { text, audioBase64 } = preppedSpeeches[stepId];
      setRecordedSpeeches(prev => ({ ...prev, [stepId]: text }));
      await startAudioPlayback(audioBase64, stepId);
      return;
    }

    setIsAiThinking(true);
    setTimerActive(false);
    
    try {
      // In full_round mode, determine the side from the stepId
      const effectiveSide = mode === 'full_round' 
        ? (stepId.startsWith('pro_') ? 'Con' : 'Pro') // getAISpeech flips the side, so we pass the opposite of what we want
        : side;
      
      const text = await getAISpeech(stepId, effectiveSide, style, topic, techStrategy || 'Substance', recordedSpeeches);
      setRecordedSpeeches(prev => ({ ...prev, [stepId]: text }));
      
      const audioBase64 = await generateSpeech(text, style);
      if (audioBase64) {
        await startAudioPlayback(audioBase64, stepId);
      } else {
        setIsAiThinking(false);
        setCurrentStepIndex(prev => prev + 1);
      }
    } catch (e) {
      console.error(e);
      setIsAiThinking(false);
      setIsAiSpeaking(false);
    }
  };

  const startAudioPlayback = async (audioBase64: string, stepId: string) => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    aiAudioCtxRef.current = audioCtx;
    
    const buffer = await decodeAudioData(decode(audioBase64), audioCtx, 24000, 1);
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    
    aiSourceRef.current = source;
    aiBufferDurationRef.current = buffer.duration;
    
    const audioDuration = Math.ceil(buffer.duration);
    const isLongSpeech = stepId.includes('const') || stepId.includes('rebut');
    const displayDuration = isLongSpeech ? 240 : audioDuration;
    
    source.onended = () => {
      setTimerActive(false);
      setIsAiSpeaking(false);
      aiSourceRef.current = null;
      aiAudioCtxRef.current = null;
      aiStartTimeRef.current = 0;
      setCurrentStepIndex(prev => prev + 1);
    };

    // Ensure context is running and start audio before starting the timer
    await audioCtx.resume();
    aiStartTimeRef.current = audioCtx.currentTime;
    aiLastTickTimeRef.current = audioCtx.currentTime;
    aiBufferPositionRef.current = 0;
    source.start(0);
    
    setIsAiThinking(false);
    setIsAiSpeaking(true);
    setTimeLeft(displayDuration);
    setTimerActive(true);
  };

  const toggleSpeechAction = async () => {
    if (!currentStep) return;

    if (isAiCrossfire) {
      if (isAiThinking || isAiSpeaking) return;
      await playAiSpeech(currentStep.id);
      return;
    }

    if (isCrossfire) {
      if (isCrossfireActive) stopCrossfire();
      else await startCrossfireSession();
      return;
    }

    if (isAiTurn) {
      if (isAiThinking || isAiSpeaking) return;
      await playAiSpeech(currentStep.id);
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      setTimerActive(false);
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsRecording(true);
      setTimerActive(true);
      setTimeLeft(currentStep.timeLimit);
      setRecordedSpeeches(prev => ({ ...prev, [currentStep.id]: `[User speech: ${currentStep.label}]` }));
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => prev.includes(folderId) ? prev.filter(f => f !== folderId) : [...prev, folderId]);
  };

  const handleFinalAnalysis = async () => {
    setIsLoading(true);
    try {
      const finalResult = await generateDebateCritique(recordedSpeeches, topic, mode === 'observer');
      onFinish({ ...finalResult, transcript: recordedSpeeches });
    } catch (error) {
      console.error("Evaluation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSlotLabel = (step: Step) => {
    if (mode === 'full_round') {
      const sideLabel = step.id.startsWith('pro_') ? 'Pro' : 'Con';
      if (step.id.includes('const')) return `${sideLabel} Constructive`;
      if (step.id.includes('rebut')) return `${sideLabel} Rebuttal`;
      if (step.id.includes('summ')) return `${sideLabel} Summary`;
      if (step.id.includes('ff')) return `${sideLabel} Final Focus`;
      return step.label;
    }
    if (mode === 'ai' && step.speaker !== order && step.speaker !== 'both') {
      return step.label.replace('1st ', 'Opponent ').replace('2nd ', 'Opponent ');
    }
    if (mode === 'ai' && step.speaker === order) {
      return step.label.replace('1st ', 'Your ').replace('2nd ', 'Your ');
    }
    return step.label;
  };

  const getFooterButtonText = () => {
    if (isLoading) return "Analyzing Round...";
    if (currentStepIndex === steps.length) return "View Final Ballot";
    if (isCrossfireActive) return "End Crossfire";
    if (isRecording) return `Finish ${getSlotLabel(currentStep)}`;
    if (isAiThinking) return "Structuring Speech...";
    if (isAiSpeaking) return "AI is Speaking...";
    if (isAiTurn || isAiCrossfire) return `Start AI ${getSlotLabel(currentStep)}`;
    if (isCrossfire) return `Start ${getSlotLabel(currentStep)}`;
    return `Start ${getSlotLabel(currentStep)}`;
  };

  const hasAiCase = !!recordedSpeeches[side === 'Pro' ? 'con_const' : 'pro_const'];

  return (
    <div className="flex flex-col h-screen bg-[#101522] text-white overflow-hidden">
      <header className="flex items-center p-4 justify-between pt-8 shrink-0 bg-[#101522] z-30">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/5">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="text-center">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {mode === 'observer' ? 'Live Observer' : (mode === 'full_round' ? 'Full Round' : 'AI Sparring')}
          </h2>
          <span className={`text-xl font-mono font-bold ${isAiThinking || isCrossfireActive ? 'text-amber-500 animate-pulse' : (isAiSpeaking ? 'text-emerald-500' : 'text-blue-500')}`}>
            {isAiThinking ? 'SEARCHING' : `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setShowFullTranscript(true)}
             className="size-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400"
             title="Full Transcript"
           >
             <span className="material-symbols-outlined">description</span>
           </button>
           <button 
             onClick={() => setIsPrepActive(!isPrepActive)}
             className={`px-3 py-1 rounded-lg border transition-all ${isPrepActive ? 'bg-orange-500 border-orange-600' : 'bg-slate-800 border-white/10'}`}
           >
             <span className="text-[10px] font-black uppercase tracking-widest">
               Prep: {Math.floor(prepTimeLeft / 60)}:{String(prepTimeLeft % 60).padStart(2, '0')}
             </span>
           </button>
        </div>
      </header>

      <div className="h-16 flex items-center justify-center gap-1.5 px-10 shrink-0 bg-[#101522] z-30">
        {bars.map((h, i) => (
          <div key={i} className={`w-1.5 rounded-full transition-all duration-100 ${(isRecording || isAiThinking || isAiSpeaking || isCrossfireActive) ? 'bg-blue-600' : 'bg-slate-800'}`} style={{ height: `${h}px` }} />
        ))}
      </div>

      <main className="flex-1 overflow-y-auto px-6 space-y-4 pb-36 pt-4">
        {groups.map(group => {
          const isExpanded = expandedFolders.includes(group.id);
          const groupSteps = steps.filter(s => s.folderId === group.id);
          const completedCount = groupSteps.filter((_, i) => steps.indexOf(groupSteps[i]) < currentStepIndex).length;
          return (
            <div key={group.id} className="space-y-2">
              <button onClick={() => toggleFolder(group.id)} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${isExpanded ? 'bg-blue-600/10 border border-blue-600/20' : 'bg-[#192033] border border-white/5'}`}>
                <div className="flex items-center gap-3">
                  <div className={`size-8 rounded-lg flex items-center justify-center ${isExpanded ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}><span className="material-symbols-outlined text-xl">{group.icon}</span></div>
                  <span className="font-bold text-sm">{group.title}</span>
                  {completedCount > 0 && <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-md font-black">{completedCount}/{groupSteps.length}</span>}
                </div>
                <span className={`material-symbols-outlined transition-transform ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              {isExpanded && (
                <div className="space-y-3 pl-2 border-l border-white/5 animate-in slide-in-from-top-2 duration-200">
                  {groupSteps.map(step => {
                    const stepIdx = steps.indexOf(step);
                    const isCurrent = stepIdx === currentStepIndex;
                    const isCompleted = stepIdx < currentStepIndex;
                    return (
                      <div key={step.id} className={`p-4 rounded-2xl border transition-all ${isCurrent ? 'border-blue-600 bg-blue-600/5 ring-1 ring-blue-600' : isCompleted ? 'border-emerald-600/20 bg-emerald-600/5 opacity-80' : 'border-white/5 bg-[#192033]/30 opacity-40'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {isCompleted && <span className="material-symbols-outlined text-emerald-500 text-xs font-bold">check_circle</span>}
                            {isCurrent && <span className="material-symbols-outlined text-blue-500 text-xs animate-pulse">radio_button_checked</span>}
                            <span className={`font-bold text-xs tracking-tight ${isCurrent ? 'text-white' : 'text-slate-400'}`}>{getSlotLabel(step)}</span>
                          </div>
                          <span className="text-[9px] font-medium text-slate-600 uppercase tracking-tighter">{step.timeLimit / 60}m</span>
                        </div>
                        {(isCurrent || isCompleted) && recordedSpeeches[step.id] && (
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-500 text-[14px]">description</span><span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Transcript</span></div>
                            <button onClick={() => setViewingSpeech({ title: getSlotLabel(step), text: recordedSpeeches[step.id] })} className="text-[9px] font-black text-blue-500 uppercase bg-blue-500/10 px-2 py-0.5 rounded hover:bg-blue-600 hover:text-white transition-colors">Read</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </main>

      {viewingSpeech && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#192033] w-full max-w-2xl rounded-[32px] border border-white/10 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
            <header className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3"><div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center"><span className="material-symbols-outlined text-white">description</span></div><div><h3 className="font-bold text-lg leading-none">{viewingSpeech.title}</h3><p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Review</p></div></div>
              <button onClick={() => setViewingSpeech(null)} className="size-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"><span className="material-symbols-outlined">close</span></button>
            </header>
            <div className="flex-1 overflow-y-auto p-8 text-slate-300 space-y-4 leading-relaxed whitespace-pre-wrap select-text">{viewingSpeech.text}</div>
            <footer className="p-6 bg-blue-600/5 flex justify-center"><button onClick={() => setViewingSpeech(null)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs">Close</button></footer>
          </div>
        </div>
      )}

      {showFullTranscript && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#192033] w-full max-w-3xl rounded-[32px] border border-white/10 flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
            <header className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">history_edu</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Full Round Transcript</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Complete Debate History</p>
                </div>
              </div>
              <button onClick={() => setShowFullTranscript(false)} className="size-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 select-text">
              {steps.map((step, idx) => {
                const speech = recordedSpeeches[step.id];
                if (!speech) return null;
                return (
                  <div key={step.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-white/10 text-slate-400 px-2 py-0.5 rounded font-black uppercase tracking-widest">Step {idx + 1}</span>
                      <h4 className="font-bold text-blue-500 uppercase tracking-wider text-xs">{getSlotLabel(step)}</h4>
                    </div>
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap bg-white/5 p-6 rounded-2xl border border-white/5">
                      {speech}
                    </div>
                  </div>
                );
              })}
              {Object.keys(recordedSpeeches).length === 0 && (
                <div className="text-center py-20 text-slate-500 italic">No speeches recorded yet.</div>
              )}
            </div>
            <footer className="p-6 bg-emerald-600/5 flex justify-center">
              <button onClick={() => setShowFullTranscript(false)} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs">Close Transcript</button>
            </footer>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 p-6 ios-blur bg-[#101522]/95 border-t border-white/5 z-40">
        <button 
          onClick={toggleSpeechAction} 
          disabled={isLoading || isAiThinking || isAiSpeaking} 
          className={`w-full h-16 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 disabled:opacity-50 ${isRecording || isAiThinking || isAiSpeaking || isCrossfireActive ? 'bg-red-500 shadow-red-500/40' : 'bg-blue-600 shadow-blue-600/40'}`}
        >
          {isLoading ? <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
            <><span className="material-symbols-outlined">{isRecording || isAiThinking || isAiSpeaking || isCrossfireActive ? 'stop' : (isAiTurn || isAiCrossfire ? 'play_arrow' : (isCrossfire ? 'forum' : 'mic'))}</span><span className="uppercase tracking-widest text-sm">{getFooterButtonText()}</span></>
          )}
        </button>
      </footer>
    </div>
  );
};

export default Arena;