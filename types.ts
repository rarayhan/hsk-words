export interface Word {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
  exampleSentence: string;
  exampleMeaning: string;
  createdAt: number;
}

export enum AppTab {
  REVIEW = 'REVIEW',
  LIST = 'LIST',
}

export interface WordDetailsResponse {
  pinyin: string;
  meaning: string;
  exampleSentence: string;
  exampleMeaning: string;
}