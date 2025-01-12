import { revalidateTag } from 'next/cache';

export function revalidateCache(tagKey: string, entityId: string) {
  revalidateTag(`${tagKey}:${entityId}`);
}
