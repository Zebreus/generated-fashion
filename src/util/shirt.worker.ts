import { processEvent } from "react-3d-shirt/dist/processEvent"

addEventListener("message", (event: MessageEvent<{ canvas: any }>) => {
  processEvent(event.data)
})
