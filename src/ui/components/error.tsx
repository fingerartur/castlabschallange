import React from 'react'
import { styleCentered } from './style'

type Props = {
  error: string
}

const styleError = {
  ...styleCentered,
  backgroundColor: 'rgba(255,0,0,0.2)',
  color: 'rgb(255,200,200)',
}

/**
 * Error UI
 */
export const Error = React.memo((props: Props) => {
  const { error } = props

  return (
    <div style={styleError}>
      {error}
    </div>
  )
})
