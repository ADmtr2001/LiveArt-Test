export interface RenderTaskContext {
  revision: number
  isCurrent: () => boolean
}

export interface RenderScheduler {
  schedule: () => void
  invalidate: () => void
}

export function createRenderScheduler(
  task: (context: RenderTaskContext) => void | Promise<void>,
): RenderScheduler {
  let revision = 0
  let animationFrame: number | null = null

  function invalidate(): void {
    revision += 1

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }

  function schedule(): void {
    invalidate()
    const scheduledRevision = revision

    animationFrame = requestAnimationFrame(() => {
      animationFrame = null
      void task({
        revision: scheduledRevision,
        isCurrent: () => scheduledRevision === revision,
      })
    })
  }

  return { schedule, invalidate }
}
