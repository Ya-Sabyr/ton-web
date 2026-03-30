import { mnemonicNew, mnemonicToPrivateKey, mnemonicValidate } from '@ton/crypto';
import type { KeyPair } from '@ton/crypto';
import { WalletContractV4 } from '@ton/ton';
import { Address, toNano, fromNano, internal, SendMode } from '@ton/core';
import { getTonClient } from './tonClient';
import { WORKCHAIN } from '../constants';
import type { ParsedTransaction } from '../types';

export async function generateMnemonic(): Promise<string[]> {
  return mnemonicNew(24);
}

export async function validateMnemonic(words: string[]): Promise<boolean> {
  return mnemonicValidate(words);
}

export async function mnemonicToKeys(words: string[]): Promise<KeyPair> {
  return mnemonicToPrivateKey(words);
}

export function deriveWalletAddress(publicKey: Buffer): string {
  const wallet = WalletContractV4.create({
    workchain: WORKCHAIN,
    publicKey,
  });
  return wallet.address.toString({ testOnly: true, bounceable: false });
}

export function getWalletContract(publicKey: Buffer) {
  return WalletContractV4.create({
    workchain: WORKCHAIN,
    publicKey,
  });
}

export async function getBalance(address: string): Promise<string> {
  const client = getTonClient();
  const balance = await client.getBalance(Address.parse(address));
  return fromNano(balance);
}

export async function isContractDeployed(address: string): Promise<boolean> {
  const client = getTonClient();
  return client.isContractDeployed(Address.parse(address));
}

export async function getTransactions(address: string, limit = 20): Promise<ParsedTransaction[]> {
  const client = getTonClient();
  const addr = Address.parse(address);
  const txs = await client.getTransactions(addr, { limit });

  return txs.map((tx) => {
    const inMsg = tx.inMessage;
    const outMsgs = tx.outMessages;

    let from = '';
    let to = '';
    let amount = '0';
    let comment = '';
    let isIncoming = true;

    if (outMsgs.size > 0) {
      const outMsg = outMsgs.get(outMsgs.keys()[0])!;
      isIncoming = false;
      from = address;
      to = outMsg.info.dest?.toString() ?? '';
      if (outMsg.info.type === 'internal') {
        amount = fromNano(outMsg.info.value.coins);
      }
      if (outMsg.body) {
        try {
          const slice = outMsg.body.beginParse();
          if (slice.remainingBits >= 32) {
            const op = slice.loadUint(32);
            if (op === 0 && slice.remainingBits > 0) {
              comment = slice.loadStringTail();
            }
          }
        } catch { /* not a text comment */ }
      }
    } else if (inMsg) {
      isIncoming = true;
      from = inMsg.info.src?.toString() ?? '';
      to = address;
      if (inMsg.info.type === 'internal') {
        amount = fromNano(inMsg.info.value.coins);
      }
      if (inMsg.body) {
        try {
          const slice = inMsg.body.beginParse();
          if (slice.remainingBits >= 32) {
            const op = slice.loadUint(32);
            if (op === 0 && slice.remainingBits > 0) {
              comment = slice.loadStringTail();
            }
          }
        } catch { /* not a text comment */ }
      }
    }

    return {
      hash: tx.hash().toString('hex'),
      time: tx.now,
      from,
      to,
      amount,
      fee: fromNano(tx.totalFees.coins),
      comment,
      isIncoming,
    };
  });
}

export async function sendTransaction(
  secretKey: Buffer,
  publicKey: Buffer,
  recipientAddress: string,
  amount: string,
  comment?: string,
): Promise<void> {
  const client = getTonClient();
  const wallet = getWalletContract(publicKey);
  const contract = client.open(wallet);
  const seqno = await contract.getSeqno();

  const deployed = await isContractDeployed(recipientAddress);

  await contract.sendTransfer({
    seqno,
    secretKey,
    messages: [
      internal({
        to: Address.parse(recipientAddress),
        value: toNano(amount),
        bounce: deployed,
        body: comment || undefined,
      }),
    ],
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
  });
}

export function isValidAddress(address: string): boolean {
  try {
    Address.parse(address);
    return true;
  } catch {
    return false;
  }
}

export function formatAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
