export const fetcher = <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> =>
  fetch(input, init).then(async (res) => {
    if (!res.ok) throw await res.json();
    return res.json() as Promise<T>;
  });

export const getCacheTime = (minutes: number) => minutes * 60 * 1000;
