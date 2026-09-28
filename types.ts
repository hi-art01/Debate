
export enum DebateStyle {
  LAY = 'Lay (Persuasive)',
  FLAY = 'Flay (Moderate)',
  TECHNICAL = 'Technical (Policy)'
}

export type TechnicalStrategy = 'Substance' | 'K (Kritik)';

export type DebateMode = 'ai' | 'observer' | 'full_round';

export type SpeechSlotId = 
  | 'pro_const' | 'con_const' | 'cf_1'
  | 'pro_rebut' | 'con_rebut' | 'cf_2'
  | 'pro_summ' | 'con_summ' | 'gcf'
  | 'pro_ff' | 'con_ff';

export interface SpeechSlot {
  id: SpeechSlotId;
  label: string;
  timeLimit: number; // in seconds
  transcript?: string;
  critique?: string;
}

export interface DebateResult {
  score: number;
  rank: string;
  transcript?: Record<string, string>;
  metrics: {
    structure: number;
    rebuttal: number;
    evidence: number;
    vocabulary: number;
    pathos: number;
    logos: number;
  };
  insights: string;
  argumentReview: Array<{
    text: string;
    type: 'strength' | 'weakness';
    label: string;
    description: string;
  }>;
}

export interface LibraryItem {
  id: string;
  category: string;
  title: string;
  readTime: string;
  description: string;
  image: string;
  screen?: Screen;
}

export interface UserAccount {
  email: string;
  name: string;
  password?: string;
  isPro: boolean;
  credits: number;
  totalRounds: number;
}

export type Screen = 
  | 'home' 
  | 'library' 
  | 'timer' 
  | 'profile' 
  | 'arena' 
  | 'setup' 
  | 'analysis' 
  | 'login' 
  | 'forgot_password'
  | 'coinflip'
  | 'grandcrossfire'
  | 'evidencerules'
  | 'speechtiming'
  | 'flowingstrategy'
  | 'linkchains'
  | 'impactcalc'
  | 'theory101'
  | 'klayering'
  | 'topicality'
  | 'framing'
  | 'summary_strategy'
  | 'subscription';
