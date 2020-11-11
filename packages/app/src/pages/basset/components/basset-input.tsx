import React from 'react'

interface BassetInputProps {
  caption: string
  askDenom: string
  offerDenom: string
  exchangeRate: number
  amount: number
  allowed: boolean
}

const BassetInput: React.FunctionComponent<BassetInputProps> = ({
  caption,
  askDenom,
  offerDenom,
  exchangeRate,
  amount,
  allowed
}) => {
  return (
    <>
      <header>
        {caption}
      </header>
      <div>
        {amount} {offerDenom}
      </div>
      <footer>
        {1} {offerDenom} = {1 * exchangeRate} {askDenom}
      </footer>
    </>
  )
}

export default BassetInput