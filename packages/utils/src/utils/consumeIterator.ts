export async function consumeIterator<T>(iterator: AsyncIterable<T>) {
  const results: T[] = [];
  for await (const result of iterator) {
    results.push(result);
  }
  return results;
}
