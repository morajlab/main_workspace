export async function settleAll<T>(
  promises: Array<Promise<T>>
): Promise<Array<T>> {
  let error: any;
  let results: Array<T> = [];

  for (let promise of promises) {
    try {
      results.push(await promise);
    } catch (err) {
      error = err;
    }
  }

  if (error) {
    throw error;
  } else {
    return results;
  }
}
