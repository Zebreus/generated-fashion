import { useEffect, useState } from "react"

let shirtWorker: Worker | undefined

export const useShirtWorker = (dontLoad: boolean) => {
  // if (dontLoad) {
  //   return undefined
  // }
  // if (!shirtWorker) {
  //   shirtWorker = new Worker(new URL("../util/shirt.worker.ts", import.meta.url))
  // }
  // return shirtWorker
  const [worker, setWorker] = useState<Worker | undefined>(shirtWorker)

  useEffect(() => {
    if (dontLoad) {
      setWorker(undefined)
      return
    }
    if (worker) {
      return
    }
    if (!shirtWorker) {
      shirtWorker = new Worker(new URL("../util/shirt.worker.ts", import.meta.url))
    }
    setWorker(shirtWorker)
  }, [dontLoad, worker])

  return worker
}
