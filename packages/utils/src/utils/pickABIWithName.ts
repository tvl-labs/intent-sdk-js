export function pickABIWithName<TAbi extends readonly { name?: string }[], TNames extends readonly string[]>(
  abi: TAbi,
  ...names: TNames
): Extract<TAbi[number], { name: TNames[number] }>[] {
  return abi.filter(
    (item): item is Extract<TAbi[number], { name: TNames[number] }> =>
      "name" in item && names.includes(item.name as TNames[number]),
  );
}
