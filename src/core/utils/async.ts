export type TimeoutResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: 'timeout' | 'error'; error?: Error };

export function withTimeout<T>(promise: Promise<T>, ms: number = 8000): Promise<TimeoutResult<T>> {
  let timer: ReturnType<typeof setTimeout>;
  return new Promise<TimeoutResult<T>>((resolve) => {
    timer = setTimeout(() => resolve({ ok: false, reason: 'timeout' }), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve({ ok: true, value });
      })
      .catch((error) => {
        clearTimeout(timer);
        resolve({ ok: false, reason: 'error', error });
      });
  });
}

export function unwrapResult<T>(result: TimeoutResult<T>): T | null {
  if (result.ok) return result.value;
  return null;
}
