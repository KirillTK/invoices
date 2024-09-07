export const fetcher = <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => 
  fetch(input, init).then(res => res.json() as Promise<T>)
