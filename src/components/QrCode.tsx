import QrCodeSvg from "qrcode-svg"

type QrCodeProps = {
  data?: string
  darkBackground?: boolean
}

export const QrCode = ({ data = "https://www.w3.org", darkBackground }: QrCodeProps) => {
  const code = new QrCodeSvg(data)
  const modules = code.qrcode.modules
  const length = modules.length

  const size = 100 / length

  const dotColor = darkBackground ? "white" : "black"

  const divs = modules
    .map((row, colIndex) =>
      row.map((field, rowIndex) => {
        const isTransparent = field !== !!darkBackground

        return isTransparent ? (
          <div
            key={`${colIndex}-${rowIndex}`}
            style={{
              display: "flex",
              position: "absolute",
              width: `${size}%`,
              height: `${size}%`,
              transform: "scale(1.15)",
              background: dotColor,
              left: `${rowIndex * size}%`,
              top: `${colIndex * size}%`,
            }}
          />
        ) : null
      })
    )
    .flat()

  const element = (
    <div
      style={{
        display: "flex",

        position: "relative",
        width: `100%`,
        height: `100%`,
        background: "transparent",
      }}
    >
      {divs}
    </div>
  )

  return element
}