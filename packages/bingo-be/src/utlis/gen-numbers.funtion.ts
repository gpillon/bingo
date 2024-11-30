export function GenerateExtractions(min: number, max: number) {
  if (min > max)
    throw new Error('Il valore di MIN deve essere minore o uguale a MAX.');

  // Creiamo un array contenente tutti i numeri tra min e max
  const range: number[] = [];
  for (let i = min; i <= max; i++) {
    range.push(i);
  }

  // Mischiamo casualmente l'array
  for (let i = range.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [range[i], range[j]] = [range[j], range[i]]; // Swap
  }

  return range;
}
