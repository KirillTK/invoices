export const fetcher = <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => 
  fetch(input, init).then(res => res.json() as Promise<T>)

export const getCacheTime = (minutes: number) => minutes * 60 * 1000;
