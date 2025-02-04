import { token } from '../../styled-system/tokens'
import viewportStore from '../stores/viewport'

/** Emulates position fixed on mobile Safari with positon absolute. Returns { position, overflowX, top } in absolute mode. */
const usePositionFixed = ({
  fromBottom,
  offset = 0,
}: {
  fromBottom?: boolean
  offset?: number
  /** Only for if `fromBottom = true`. For calculating position on mobile safari. */
  height?: number
} = {}): {
  position: 'fixed' | 'absolute'
  overflowX?: 'hidden' | 'visible'
  top?: string
  bottom?: string
} => {
  const position = 'fixed'
  const { currentKeyboardHeight } = viewportStore.useState()

  let top, bottom
  if (fromBottom) {
    bottom = `calc(${token('spacing.safeAreaBottom')} + ${offset + currentKeyboardHeight}px)`
  } else {
    top = `calc(${token('spacing.safeAreaTop')} + ${offset}px)`
  }

  return {
    position: position ?? 'fixed',
    overflowX: 'hidden',
    /* spacing.safeAreaTop applies for rounded screens */
    top,
    bottom,
  }
}

export default usePositionFixed
