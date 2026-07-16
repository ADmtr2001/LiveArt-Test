export function createSafeFileStem(sourceName: string): string {
  const baseName = sourceName.replace(/\.[^.]+$/, '')

  return (
    baseName
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
      .replace(/[. ]+$/g, '')
      .trim() || 'image'
  )
}
