import type { SpoofingWarning } from '../types';
import { getKnownAddresses } from './storage';

export function splitAddress(address: string): { first: string; middle: string; last: string } {
  if (address.length <= 12) return { first: address, middle: '', last: '' };
  return {
    first: address.slice(0, 4),
    middle: address.slice(4, -4),
    last: address.slice(-4),
  };
}

export function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  let matches = 0;
  const minLen = Math.min(a.length, b.length);
  for (let i = 0; i < minLen; i++) {
    if (a[i] === b[i]) matches++;
  }
  return matches / maxLen;
}

export function checkSpoofingRisks(
  targetAddress: string,
  ownAddress: string,
  recentAddresses: string[],
  balance: string,
  amount: string,
): SpoofingWarning[] {
  const warnings: SpoofingWarning[] = [];

  if (targetAddress === ownAddress) {
    warnings.push({
      level: 'warning',
      title: 'Self Transfer',
      message: 'You are sending to your own address.',
    });
  }

  const knownAddresses = getKnownAddresses();
  const isKnown = knownAddresses.includes(targetAddress) || recentAddresses.includes(targetAddress);

  if (!isKnown) {
    warnings.push({
      level: 'info',
      title: 'New Address',
      message: 'First interaction with this recipient detected.',
    });
  }

  for (const known of [...knownAddresses, ...recentAddresses]) {
    if (known === targetAddress) continue;
    const sim = calculateSimilarity(known, targetAddress);
    if (sim > 0.7) {
      warnings.push({
        level: 'warning',
        title: 'Similar Address',
        message: `This address looks similar to a known address (${known.slice(0, 6)}...${known.slice(-4)}). Possible address poisoning.`,
      });
      break;
    }
  }

  const amountNum = parseFloat(amount);
  const balanceNum = parseFloat(balance);
  if (balanceNum > 0 && amountNum > balanceNum * 0.5) {
    warnings.push({
      level: 'warning',
      title: 'High Amount',
      message: 'Above your average 30-day transfer volume.',
    });
  }

  return warnings;
}
