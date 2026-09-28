import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface TopicInfo {
  month: string;
  topic: string;
  sources: Array<{ title: string; uri: string }>;
  isCurrent: boolean;
}

export const fetchCurrentTopics = async (): Promise<TopicInfo[]> => {
  const now = new Date();
  const currentMonthStr = now.toLocaleString('default', { month: 'long' });
  const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthStr = nextMonthDate.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();
  
  const prompt = `Find the current official NSDA Public Forum debate topics for ${currentMonthStr} ${currentYear} and ${nextMonthStr} ${currentYear}. 
  Identify the resolution for the current active competition period and the one announced for the following period. 
  Ensure the response distinguishes clearly between the "Current" (Active) and "Upcoming" (Next) topics.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              month: { type: Type.STRING, description: "The month(s) this topic is active for." },
              topic: { type: Type.STRING, description: "The full text of the resolution." },
              isCurrent: { type: Type.BOOLEAN, description: "True if this is the currently active resolution for competition." },
              sources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    uri: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["month", "topic", "isCurrent"]
          }
        }
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return parsed.length > 0 ? parsed : getDefaultTopics(currentMonthStr, nextMonthStr);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return getDefaultTopics(currentMonthStr, nextMonthStr);
  }
};

const getDefaultTopics = (currentMonth: string, nextMonth: string): TopicInfo[] => [
  { 
    month: `${currentMonth.toUpperCase()} (ACTIVE)`, 
    topic: "The United States should substantially increase its military presence in the Arctic.", 
    sources: [], 
    isCurrent: true 
  },
  { 
    month: `${nextMonth.toUpperCase()} (UPCOMING)`, 
    topic: "The United States should significantly increase its domestic production of semiconductors.", 
    sources: [], 
    isCurrent: false 
  }
];

export const getAISpeech = async (
  speechId: string, 
  userSide: 'Pro' | 'Con', 
  style: string, 
  topic: string, 
  techStrategy: string,
  history: Record<string, string>
) => {
  const aiSide = userSide === 'Pro' ? 'Con' : 'Pro';
  const styleLower = style.toLowerCase();
  const isLay = styleLower.includes('lay');
  const isTech = styleLower.includes('technical') || styleLower.includes('policy');
  
  let structuralPrompt = "";

  if (speechId.includes('const')) {
    structuralPrompt = `
      SPEECH TYPE: Constructive (4 Minutes).
      MANDATORY OPENING: You MUST start the speech with the exact phrase: "We ${aiSide === 'Pro' ? 'affirm' : 'negate'} the resolution, ${topic}."
      STRUCTURE: Deliver a full, structured constructive speech. Include at least 2 contentions. Do NOT explain or define the framework this round needs to be judged on; focus purely on the contentions.
      CONTENTIONS: Every contention MUST conclude with a specific, numerical, and quantifiable impact. ${isTech ? 'MANDATORY: For Technical style, every single impact MUST be explicitly linked to and framed as leading to human extinction (existential risk).' : '(e.g., specific number of lives, dollar amounts, or percentage changes).'}
      RESTRICTIONS: Focus EXCLUSIVELY on your own case. Do NOT mention, pre-empt, or speculate on what the other side may say.
      TECH REQUIREMENTS: ${isTech ? 'Approximately 950-1000 words. PURELY EVIDENCE-BASED. EVERY SINGLE SENTENCE MUST CONTAIN OR DIRECTLY REFERENCE CITED EVIDENCE. Target exactly 4 minutes of speaking time (can be +/- 5 seconds). Every major claim MUST have cited evidence, a warrant, and a clear link to the impact. You need evidence for everything that is not common sense. Every argument MUST link directly to human extinction. Maintain extreme evidence density.' : 'Maximum 700 words. Balanced persuasive case with clear logical warrants. Target exactly 4 minutes of speaking time (can be +/- 5 seconds). Use clear, accessible language. Evidence is MANDATORY for every claim that is not common sense; do not rely on analytics alone. Increase evidence density significantly.'}
      LENGTH: ${isTech ? '975 words' : '680 words'}.
    `;
  } else if (speechId.includes('rebut')) {
    const rebuttalsInHistory = Object.keys(history).filter(id => id.includes('rebut')).length;
    const isFirstRebuttal = rebuttalsInHistory === 0;
    
    structuralPrompt = `
      SPEECH TYPE: ${isFirstRebuttal ? '1st' : '2nd'} Rebuttal (4 Minutes).
      STRUCTURE:
      ${isFirstRebuttal ? `
      1. Overview: Provide a clear overview of the opponent’s case and main contentions first.
      2. Line-by-Line: Move into detailed line-by-line responses, directly answering: Each contention, Each warrant, Each internal link, and Each impact.
      ` : `
      1. Defense (Frontlining): Address the opponent's 1st Rebuttal first. Defend your own case and rebuild your contentions.
      2. Offense (Attacking): After defending your case, move into attacking the opponent's case and their constructive points.
      `}
      REQUIREMENTS: 
      - MAXIMIZE the amount of evidence used on both offense and defense.
      - Defensive responses MUST include qualified evidence and data, not just analytic responses.
      - Every claim that is not common sense MUST be backed by a specific piece of evidence or a study.
      - Offensive responses should extend evidence and generate impact turns where appropriate.
      - Ensure rebuttals are structured cleanly and clearly signposted.
      - TECH REQUIREMENTS: ${isTech ? 'Approximately 950-1000 words. PURELY EVIDENCE-BASED. EVERY SINGLE SENTENCE MUST CONTAIN OR DIRECTLY REFERENCE CITED EVIDENCE. Target exactly 4 minutes of speaking time (can be +/- 5 seconds). Maintain extreme evidence density. Every impact MUST be framed as leading to human extinction.' : 'Maximum 700 words. Target exactly 4 minutes of speaking time (can be +/- 5 seconds). Increase evidence density significantly.'}
      LENGTH: ${isTech ? '975 words' : '680 words'}.
    `;
  } else if (speechId.includes('summ')) {
    structuralPrompt = `
      SPEECH TYPE: Summary (Target exactly 3 Minutes 12 Seconds).
      STRUCTURE:
      - At least 30 Seconds: Frontlining. Devoted to defending your own case against the opponent's rebuttal.
      - 2 Minutes: Argument Extension. Focus primarily on offense first (extend the most important offensive responses), then extend key defensive responses that protect your offense.
      - 42 Seconds: Weighing. Devoted exclusively to weighing (magnitude, probability, etc.) in plain language.
      REQUIREMENTS: 
      - Collapse strategically.
      - Use weighing mechanisms: magnitude, probability, timeframe, reversibility.
      - ${isTech ? 'MANDATORY: For Technical style, every single impact MUST be explicitly linked to and framed as leading to human extinction.' : ''}
      - ${isLay ? "MANDATORY: Do NOT use technical weighing terms like 'timeframe' or 'reversibility'. Use plain English concepts instead (e.g., 'how long it lasts' or 'whether we can fix it later')." : ""}
      - DO NOT use jargon beyond "Lay", "Flow", or "Tech".
      LENGTH: ${isTech ? '800 words' : '480 words'}.
    `;
  } else if (speechId.includes('ff')) {
    structuralPrompt = `
      SPEECH TYPE: Final Focus (2 Minutes).
      STRUCTURE: Mirror the Summary speech structure but condensed.
      1. Collapse to the key voting issues.
      2. Extend offense clearly.
      3. Apply weighing again (magnitude, probability, timeframe, reversibility).
      ${isTech ? 'MANDATORY: For Technical style, every single impact MUST be explicitly linked to and framed as leading to human extinction.' : ''}
      REQUIREMENTS: 
      - Strict 2-minute time limit.
      - No new arguments.
      - DO NOT use jargon beyond "Lay", "Flow", or "Tech".
      LENGTH: ${isTech ? '450 words' : '380 words'}.
    `;
  } else if (speechId.includes('cf') || speechId.includes('gcf')) {
    structuralPrompt = `
      SPEECH TYPE: Crossfire (Target exactly 2 Minutes 34 Seconds).
      STRUCTURE: Simulate a 2-minute 34-second crossfire session between Pro and Con. 
      REQUIREMENTS: 
      - Represent BOTH sides in a dialogue format.
      - Pro asks a question, Con answers and asks back.
      - Focus on the key clash points from the previous speeches.
      - Maintain the competitive spirit of a real debate.
      - ${isLay ? "Use plain English, avoid jargon." : "Use professional debate jargon."}
      LENGTH: ${isTech ? '640 words' : '385 words'}.
    `;
  }

  const isSummaryOrFF = speechId.includes('summ') || speechId.includes('ff');

  const jargonInstruction = isLay 
    ? "MANDATORY: Use clear, accessible language. Normal conversational pacing (like speaking to a parent). Avoid overly technical framing. Focus on clarity and persuasion. Do NOT use the word 'impact' or technical debate terms like 'turn', 'link', 'warrant', 'flow', or 'card' unless they are 'Lay', 'Flow', or 'Tech'."
    : (isSummaryOrFF 
        ? "MANDATORY: Even in Technical style, for Summary and Final Focus, do NOT use jargon beyond 'Lay', 'Flow', or 'Tech'. Weigh clearly in plain language."
        : "MANDATORY: Use standard debate jargon ('turn', 'impact', 'link', 'non-unique', 'delink') as appropriate for the style.");

  const historyContext = Object.entries(history)
    .map(([id, text]) => `[${id.toUpperCase()}]: ${text.substring(0, 1500)}...`)
    .join("\n\n");

  const isCrossfireStep = speechId.includes('cf') || speechId.includes('gcf');
  const rolePrompt = isCrossfireStep 
    ? `Act as two world-class ${style} debaters (Pro and Con) in a crossfire session.`
    : `Act as a world-class ${style} debater on the ${aiSide} side.`;

  const prompt = `${rolePrompt}
  TOPIC: "${topic}"
  STRATEGY: ${techStrategy}
  ROUND HISTORY:
  ${historyContext}

  ${structuralPrompt}

  ${jargonInstruction}

  MANDATORY: 
  - Do NOT address the judge directly. Never say "Hey judge", "Dear judge", or anything similar. Focus strictly on the arguments.
  - Use current (2023-2025) data.
  - FUTURE-FACING IMPACTS: All impacts MUST be grounded in future predictions or probabilistic risks. 
  - NO REVERSE CAUSATION: You MUST avoid the "reverse causation" fallacy. Do NOT claim that implementing a policy today "saves" or "reverses" lives lost in the past (e.g., "stopping drone strikes now reverses the casualties of the War on Terror"). Instead, argue that the policy prevents *future* repetitions of those specific harms or prevents *future* escalations based on predictive trends. Historical data should ONLY be used as evidence for why a harm is likely to occur again in the future.
  - EVIDENCE DENSITY: You MUST provide specific, cited evidence for EVERY claim that is not common sense. Every warrant must be backed by data or expert testimony.
  - CITATION STYLE: Every piece of evidence MUST include a specific author name (e.g., "According to Dr. Jane Smith of CSIS" instead of just "According to CSIS"). Do NOT just cite organizations; find and name the specific authors, researchers, or experts responsible for the data.
  - For ${isTech ? 'Technical' : 'All'} styles, eliminate filler.
  - Directly reference the user's specific arguments.
  - If a specific argument was "dropped" (not mentioned in the history), capitalize on it.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { 
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 16000 }
    }
  });
  return response.text;
};

export const getAIConstructive = async (userSide: 'Pro' | 'Con', style: string, topic: string, techStrategy?: string) => {
  return getAISpeech('ai_const', userSide, style, topic, techStrategy || 'Substance', {});
};

export const generateSpeech = async (text: string, style: string): Promise<string | undefined> => {
  const isTechnical = style.toLowerCase().includes('technical') || style.toLowerCase().includes('policy');
  
  const speechPrompt = isTechnical 
    ? `Read this at an extremely high speed (spreading style), minimizing pauses between words and sentences. Accelerate the delivery even further than standard spreading to simulate a competitive technical debater. If possible, slightly distort the voice to sound more intense: ${text}`
    : `Read this at a professional, clear, and conversational debate pace, like speaking to a parent: ${text}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: speechPrompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: { 
        voiceConfig: { 
          prebuiltVoiceConfig: { 
            voiceName: 'Kore' 
          } 
        } 
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const generateSpeechCritique = async (transcript: string, speechType: string) => {
  const prompt = `Critique this specific ${speechType} speech: "${transcript}". Focus on warrants, clarity, and technical drops.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text;
};

export const generateDebateCritique = async (transcript: string | Record<string, string>, topic?: string, isObserver: boolean = false) => {
  const fullText = typeof transcript === 'string' ? transcript : Object.values(transcript).join("\n\n---\n\n");
  const prompt = `Judge this full debate on "${topic}": "${fullText}". 
  Provide a high-level ballot story and technical metrics. 
  Focus on which side had better evidence-based reasoning.
  ${isObserver ? "This is an Observer Mode / Live Judge session. Provide an extremely detailed, deep-dive analysis of the strategy, evidence quality, and technical execution. Work extra long on this critique to ensure professional-grade feedback." : ""}
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: isObserver ? 32000 : 16000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          rank: { type: Type.STRING },
          metrics: {
            type: Type.OBJECT,
            properties: {
              structure: { type: Type.NUMBER },
              rebuttal: { type: Type.NUMBER },
              evidence: { type: Type.NUMBER },
              vocabulary: { type: Type.NUMBER },
              pathos: { type: Type.NUMBER },
              logos: { type: Type.NUMBER },
            },
            required: ["structure", "rebuttal", "evidence", "vocabulary", "pathos", "logos"]
          },
          insights: { type: Type.STRING },
          argumentReview: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                type: { type: Type.STRING },
                label: { type: Type.STRING },
                description: { type: Type.STRING },
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const getDebateOpponentResponse = async (userPoint: string, style: string, topic: string) => {
  const isLay = style.toLowerCase().includes('lay');
  const jargonConstraint = isLay ? "Use plain English, avoid terms like 'turn' or 'impact'." : "Use technical jargon.";
  const prompt = `Rebut this in 2 sentences with specific, author-cited evidence: "${userPoint}" on the topic "${topic}". 
  ${jargonConstraint} 
  MANDATORY: 
  - Include the specific author's name for all evidence (e.g., "According to Dr. Smith...").
  - FUTURE-FACING IMPACTS: All impacts MUST be grounded in future predictions or probabilistic risks. Do NOT claim past events are reversed by current actions.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text;
};

export const getDebateTip = async () => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Provide one high-level, technical Public Forum debate strategy tip. One sentence only.",
  });
  return response.text;
};