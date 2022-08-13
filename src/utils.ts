export function range(count: number): number[] {
  const r: number[] = []
  for (let i = 0; i < count; i += 1) {
    r.push(i)
  }
  return r
}

export function buildingLetter(buildingIdx0: number): string {
  return String.fromCharCode('A'.charCodeAt(0) + buildingIdx0)
}

export function selectRandomElement<T>(arr: T[]): T {
  return arr[Math.round(Math.random() * (arr.length - 1))]
}
