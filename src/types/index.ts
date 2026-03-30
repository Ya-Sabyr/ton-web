export interface WalletData {
  mnemonic: string[];
  address: string;
}

export type WalletState = 'none' | 'unlocked';

export interface ParsedTransaction {
  hash: string;
  time: number;
  from: string;
  to: string;
  amount: string;
  fee: string;
  comment: string;
  isIncoming: boolean;
}

export interface Contact {
  address: string;
  label: string;
  lastUsed: number;
}

export type SpoofingRiskLevel = 'info' | 'warning' | 'danger';

export interface SpoofingWarning {
  level: SpoofingRiskLevel;
  title: string;
  message: string;
}
