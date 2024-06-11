// eslint-disable-next-line import/no-namespace
import { ShirtPrint } from "components/ShirtPrint"
import { WithRef } from "hooks/firestore/FirestoreDocument"
import { UseSatoriOptions } from "hooks/useSatori"
import satori from "satori"
import { Prediction } from "types/firestore/prediction"

const getSatori = async (shirt: WithRef<Prediction>, options: UseSatoriOptions) => {
  const robotoRequest = await fetch("/roboto.woff")
  const robotoArrayBuffer = await robotoRequest.arrayBuffer()

  const svg = await satori(<ShirtPrint shirt={shirt} height={options.height} width={options.width} />, {
    width: options.width,
    height: options.height,
    fonts: [
      {
        name: "Roboto",
        data: robotoArrayBuffer,
        weight: 400,
        style: "normal",
      },
    ],
  })

  const scale = options.scale || 0.1
  const scaledSvg = svg
    .replace(`width="${options.width}"`, `width="${options.width * scale}"`)
    .replace(`height="${options.height}"`, `height="${options.height * scale}"`)

  const svgBlob = new Blob([scaledSvg], { type: "image/svg+xml" })

  return svgBlob
}

export type SatoriWorkerRequest = { shirt: WithRef<Prediction>; id: string; options: UseSatoriOptions }

export type SatoriWorkerResult =
  | { id: string; result: Blob; error?: undefined }
  | { id: string; error: Error; result?: undefined }

addEventListener("message", async (event: MessageEvent<SatoriWorkerRequest>) => {
  const { shirt, id, options } = event.data
  if (!shirt) {
    console.error("No shirt provided")
    return
  }
  if (!id) {
    console.error("No id provided")
    return
  }
  if (!options) {
    console.error("No options provided")
    return
  }
  try {
    const satoriResult = await getSatori(shirt, options)
    postMessage({ id: id, result: satoriResult })
  } catch (e) {
    postMessage({ id: id, error: e })
  }
})
