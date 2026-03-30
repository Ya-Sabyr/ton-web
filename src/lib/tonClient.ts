import { TonClient } from '@ton/ton';
import { TONCENTER_ENDPOINT, TONCENTER_API_KEY } from '../constants';

let client: TonClient | null = null;

export function getTonClient(): TonClient {
  if (!client) {
    client = new TonClient({
      endpoint: TONCENTER_ENDPOINT,
      apiKey: TONCENTER_API_KEY,
    });
  }
  return client;
}
