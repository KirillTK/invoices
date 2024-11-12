import { auth } from '@clerk/nextjs/server';

export function authRequired<T>() {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>,
  ) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    descriptor.value = async function (...args: unknown[]) {
      const user = await auth();
      
      if (!user.userId) {
        throw new Error("Unauthorized");
      }      

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
