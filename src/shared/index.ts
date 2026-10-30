export function assetUrl(file: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  return `${base}/assets/${file.replace(/^\/+/, '')}`
}
