// eslint-disable-next-line import/no-namespace
import { WithRef } from "hooks/firestore/FirestoreDocument"
import { useEffect, useState } from "react"
import { Prediction } from "types/firestore/prediction"
import { SatoriWorkerResult } from "util/satori.worker"

export type UseSatoriOptions = {
  width: number
  height: number
  scale?: number
}

let satoriWorker: Worker

export const useSatori = (shirt: WithRef<Prediction> | undefined, options: UseSatoriOptions) => {
  const [svg, setSvg] = useState<string>()

  useEffect(() => {
    if (!shirt) {
      setSvg(undefined)
      return
    }
    let currentlyActive = true
    const f = async () => {
      const generatedSvg = await getSatori(shirt, options)
      if (!currentlyActive) {
        return
      }
      setSvg(generatedSvg)
    }
    f()
    return () => {
      currentlyActive = false
    }
  }, [shirt, options])
  return svg
}

export const getSatori = async (shirt: WithRef<Prediction>, options: UseSatoriOptions) => {
  if (!satoriWorker) {
    satoriWorker = new Worker(new URL("../util/satori.worker.tsx", import.meta.url))
  }

  const id = Math.random().toString(36).substring(7)

  const resolveResultPromise = new Promise<Blob>((resolve, reject) => {
    satoriWorker.addEventListener("message", (event: MessageEvent<SatoriWorkerResult>) => {
      if (event.data.id === id) {
        if (event.data.error) {
          reject(event.data.error)
          return
        }
        if (event.data.result) {
          resolve(event.data.result)
        }
      }
    })
  })

  const cleanShirt = { ...shirt, _ref: { id: shirt._ref.id } }

  satoriWorker.postMessage({
    id: id,
    shirt: cleanShirt,
    options,
  })

  const result = await resolveResultPromise
  const resultUrl = URL.createObjectURL(result)

  return resultUrl
  // console.log("START SATORI")
  // const timeStart = performance.now()

  // const robotoRequest = await fetch("/roboto.woff")
  // const robotoArrayBuffer = await robotoRequest.arrayBuffer()
  // const timeFont = performance.now()

  // const svg = await satori(element, {
  //   width: options.width,
  //   height: options.height,
  //   fonts: [
  //     {
  //       name: "Roboto",
  //       data: robotoArrayBuffer,
  //       weight: 400,
  //       style: "normal",
  //     },
  //   ],
  // })
  // const timeSatori = performance.now()

  // const scale = options.scale || 1
  // const scaledSvg = svg
  //   .replace(`width="${options.width}"`, `width="${options.width * scale}"`)
  //   .replace(`height="${options.height}"`, `height="${options.height * scale}"`)

  // const svgBlob = new Blob([scaledSvg], { type: "image/svg+xml" })
  // const svgUrl = URL.createObjectURL(svgBlob)
  // const timeSvgBlob = performance.now()

  // if (!initPromise) {
  //   initPromise = resvg.initWasm(fetch("https://unpkg.com/@resvg/resvg-wasm/index_bg.wasm")).catch(e => {
  //     console.error("Ignoring error", e)
  //   })
  //   // initPromise = resvg.initWasm(resvgWasm)
  // }
  // await initPromise

  // const opts = {
  //   fitTo: {
  //     mode: "width", // If you need to change the size
  //     value: 800,
  //   },
  // } as const

  // //const svg = "<svg> ... </svg>" // Input SVG, String or Uint8Array
  // const resvgJS = new resvg.Resvg(svg, opts)
  // const pngData = resvgJS.render() // Output PNG data, Uint8Array
  // const pngBuffer = pngData.asPng()
  // const pngUrl = URL.createObjectURL(new Blob([pngBuffer], { type: "image/png" }))
  // const timeResvg = performance.now()
  // // document.getElementById("output").src = svgURL

  // // const canvas = document.createElement("canvas")
  // // canvas.width = options.width * scale
  // // canvas.height = options.height * scale
  // // const ctx = canvas.getContext("2d")
  // // if (!ctx) {
  // //   throw new Error("Could not get canvas context")
  // // }
  // // const timeCreateContext = performance.now()

  // // let timeLoadImage = 0
  // // const drawFinished = new Promise<void>(resolve => {
  // //   const img = new Image()
  // //   img.onload = function () {
  // //     timeLoadImage = performance.now()
  // //     ctx.drawImage(img, 0, 0)
  // //     resolve()
  // //   }
  // //   img.src = svgUrl
  // // })

  // // await drawFinished
  // // const timeDrawToCanvas = performance.now()

  // // const url = canvas.toDataURL("image/bmp")
  // // const timeConvertToPng = performance.now()

  // console.log("time font", timeFont - timeStart, "ms")
  // console.log("time satori", timeSatori - timeFont, "ms")
  // console.log("time svg blob", timeSvgBlob - timeSatori, "ms")
  // console.log("time resvg", timeResvg - timeSvgBlob, "ms")
  // // console.log("time create context", timeCreateContext - timeSvgBlob, "ms")
  // // console.log("time load image", timeLoadImage - timeCreateContext, "ms")
  // // console.log("time draw to canvas", timeDrawToCanvas - timeLoadImage, "ms")
  // // console.log("time convert to png", timeConvertToPng - timeDrawToCanvas, "ms")

  // return pngUrl
}
