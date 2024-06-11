import { getMainLayout } from "layouts/MainLayout"
import { useEffect, useState } from "react"
import { OffscreenShirt } from "react-3d-shirt"

const MainPage = () => {
  const [worker, setWorker] = useState<Worker>()

  useEffect(() => {
    const worker = new Worker(new URL("../util/shirt.worker.ts", import.meta.url))
    setWorker(worker)

    return () => {
      worker.terminate()
    }
  }, [])
  console.log("rendre")

  const cover = (
    <img
      src={
        "http://127.0.0.1:9199/v0/b/text-to-shirt.appspot.com/o/images%2FOFBM1cUUFE%2Fpreview-288.webp?alt=media&token=2cb51df0-aabf-498e-af87-1c1ac1e33d10"
      }
      alt="placeholder"
      style={{ objectFit: "cover", height: "100%", width: "auto", marginLeft: "auto", marginRight: "auto" }}
    />
  )

  return (
    <>
      {/* <Tester /> */}
      {worker ? <OffscreenShirt worker={worker} color={"black"} cover={cover} /> : <div>Not ready</div>}
    </>
  )
}

MainPage.getLayout = getMainLayout

export default MainPage
