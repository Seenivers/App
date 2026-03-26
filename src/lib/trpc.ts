import { seeniversURL } from '$lib';
import { createTRPCClientInstance } from '@seenivers/api';

export const api = createTRPCClientInstance(`${seeniversURL}/api/trpc`);
