/* eslint-disable @typescript-eslint/no-unsafe-argument */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const fetcher = (...args: unknown[]) => fetch(...args).then(res => res.json())
