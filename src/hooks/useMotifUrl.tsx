import { WithRef } from "hooks/firestore/FirestoreDocument"
import { usePrediction } from "hooks/firestore/simple/usePrediction"
import { getSatori, useSatori } from "hooks/useSatori"
import { useMemo } from "react"
import { Prediction } from "types/firestore/prediction"

const dpi = 200
const width = 23.4
const height = 28.95

export const useMotifUrl = (predictionId?: string, options?: { small?: boolean }) => {
  const prediction = usePrediction(predictionId)

  const scale = options?.small ? 0.1 : 1

  const satoriOptions = useMemo(
    () => ({
      width: width * dpi,
      height: height * dpi,
      scale: scale,
    }),
    [scale]
  )

  const svg = useSatori(prediction, satoriOptions)

  return svg
}

export const getMotifUrl = async (prediction?: WithRef<Prediction>, options?: { small?: boolean }) => {
  if (!prediction?._ref.id || !prediction.resultUrl) {
    return undefined
  }

  const scale = options?.small ? 0.1 : 1

  const satoriOptions = {
    width: width * dpi,
    height: height * dpi,
    scale: scale,
  }

  const svg = await getSatori(prediction, satoriOptions)
  return svg
}
