/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@clerk/nextjs/server';
import { unstable_cache } from "next/cache";

/**
 * Cache decorator for caching method results using Next.js unstable_cache.
 * 
 * If no arguments are provided to the decorated method, the authenticated user's ID
 * will be used as the cache tag ID. Otherwise, the first parameter will be used
 * as the ID in the cache tag.
 * 
 * Example usage with userId:
 * ```ts
 * @cache(CacheTags.USERS)
 * static getUser() { // Will use authenticated user's ID
 *   // method implementation
 * }
 * ```
 * 
 * Example usage with custom ID:
 * ```ts
 * @cache(CacheTags.POSTS) 
 * static getPost(postId: string) { // Will use postId
 *   // method implementation
 * }
 * ```
 * 
 * @param tagKey - The base cache tag key that will be combined with the ID
 * @param global - When true, uses just the tagKey without combining with ID. Defaults to false.
 */
export function cache(tagKey: string, global = false) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value as (...args: unknown[]) => Promise<unknown>;

    if (typeof originalMethod !== 'function') {
      throw new Error('Original method is undefined or not a function');
    }

    descriptor.value = async function (...args: unknown[]) {
      const user = await auth();
      const entityId = args[0];

      if (typeof entityId !== 'string' && !global) {
        throw new Error('First argument must be a string ID');
      }

      if (!user?.userId && !global) {
        throw new Error('User not authenticated');
      }

      const cacheKey = global ? tagKey : `${tagKey}:${entityId as string || user.userId!}`;
      
      return unstable_cache(
        () => originalMethod.apply(this, args),
        [cacheKey],
        {
          tags: [cacheKey],
        }
      )();
    };

    return descriptor;
  };
}
