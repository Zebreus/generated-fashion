import { usePageTransitionsAvailable } from "hooks/usePageTransitionsAvailable"
import { useShirtWorker } from "hooks/useShirtWorker"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

let globalLoaded = false
const informLoaded: Array<(state: boolean) => void> = []
const OffscreenShirt = dynamic(
  () =>
    import("react-3d-shirt").then(i => {
      globalLoaded = true
      informLoaded.forEach(cb => cb(true))
      return i.OffscreenShirt
    }),
  {
    suspense: false,
  }
)

type CoolShirtProps = {
  url: string | undefined
  fallback?: string | undefined
  noMovement?: boolean
  color?: string
  /** Do not load the 3d model */
  onlyImage?: boolean
}

export const CoolShirt = ({ url, fallback, noMovement, onlyImage, color }: CoolShirtProps) => {
  const [clientside, setClientside] = useState(typeof window !== "undefined")
  const [loaded, setLoaded] = useState(globalLoaded)
  const worker = useShirtWorker(!!onlyImage)
  useEffect(() => {
    informLoaded.push(setLoaded)
    return () => {
      informLoaded.splice(informLoaded.indexOf(setLoaded), 1)
    }
  }, [])
  useEffect(() => {
    setClientside(true)
  }, [])
  const fallbackElement = fallback ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fallback}
      alt="placeholder"
      style={{ objectFit: "cover", height: "100%", width: "auto", marginLeft: "auto", marginRight: "auto" }}
    />
  ) : (
    <div style={{ height: "100%", width: "100%" }}></div>
  )

  const pageTransitionsAvailable = usePageTransitionsAvailable()

  return (
    <>
      {clientside && !onlyImage ? (
        <>
          {loaded ? null : fallbackElement}
          <OffscreenShirt
            worker={worker}
            motif={url}
            color={color ?? `white`}
            coverLoading={!!fallback}
            cover={fallback ? fallbackElement : null}
            {...(noMovement ? { wobbleRange: 0, wobbleSpeed: 0 } : {})}
            renderDelay={pageTransitionsAvailable ? 0 : 0}
          />
        </>
      ) : (
        fallbackElement
      )}
    </>
  )
}
