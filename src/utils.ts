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

export function saveFile(contents: string, filename: string) {
  const file = new Blob([contents], { type: 'text/plain' })
  const a = document.createElement('a')
  const url = URL.createObjectURL(file)
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(function () {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 0)
}
