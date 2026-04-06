import { seeniversURL } from '$lib';
import { createTRPCClientInstance } from '@seenivers/api/client';

export const api = createTRPCClientInstance(`${seeniversURL}/api/trpc`);
