import { MouseEventHandler, PropsWithChildren } from 'react'
import { EDomElement } from './AnimatedDOMElement.enums'

interface IAnimatedDOMElement extends PropsWithChildren {
  element?: EDomElement
  classNames?: string
  onClick?:
    | MouseEventHandler<HTMLDivElement>
    | MouseEventHandler<HTMLParagraphElement>
}

export type { IAnimatedDOMElement }
