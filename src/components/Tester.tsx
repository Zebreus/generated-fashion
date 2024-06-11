import { css } from "@emotion/react"
import { useEffect, useState } from "react"

export const Tester = () => {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const clear = setInterval(() => {
      setValue(v => (v + 5) % 300)
    }, 10)
    return () => {
      clearInterval(clear)
    }
  })
  return (
    <div
      css={css`
        height: 30px;
        width: 300px;
        position: relative;
        background-color: red;
      `}
    >
      <div
        css={css`
          position: absolute;
          height: 30px;
          width: ${value}px;
          background-color: green;
        `}
      ></div>
    </div>
  )
}
