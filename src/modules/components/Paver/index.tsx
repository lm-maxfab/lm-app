import { Component } from 'preact'
import styles from './styles.module.scss'
import generateNiceColor from '../../utils/generate-nice-color'
import StrToVNode from '../StrToVNodes'

export type ItemDescriptor = {
  type: 'item',
  content?: string,
  weight?: number
}

export type StripeDescriptor = {
  type: 'stripe'
  slots?: Array<ItemDescriptor|StripeDescriptor>,
  fitSlots?: boolean
  weight?: number
}

export type Props = {
  orientation?: 'vertical'|'horizontal'
  size?: string
  fitSlots?: boolean
  slots?: Array<ItemDescriptor|StripeDescriptor>
}

class Stripe extends Component<Props> {
  static flip (orientation: Props['orientation']) {
    if (orientation === 'horizontal') return 'vertical'
    return 'horizontal'
  }

  constructor (props: Props) {
    super(props)
    this.getSlotsSizes = this.getSlotsSizes.bind(this)
  }

  getSlotsSizes () {
    const { slots = [] } = this.props
    const total = slots.reduce((ttl, curr) => {
      return ttl + (curr.weight ?? 1)
    }, 0)
    return slots.map(slotData => {
      return (slotData.weight ?? 1) / total
    })
  }

  render () {
    const {
      orientation = 'horizontal',
      slots = [],
      size,
      fitSlots
    } = this.props
    const wrapperClasses = [styles['stripe']]
    if (orientation === 'vertical') wrapperClasses.push(styles['stripe_vertical'])
    else wrapperClasses.push(styles['stripe_horizontal'])

    const wrapperStyle: JSX.CSSProperties = {
      backgroundColor: 'blue'
    }
    if (orientation === 'vertical') wrapperStyle.width = size
    else wrapperStyle.height = size

    const slotsSizes = this.getSlotsSizes()

    return <div
      style={wrapperStyle}
      className={wrapperClasses.join(' ')}>
      {slots.map((slotData, slotPos) => {
        const slotStyle: JSX.CSSProperties = {
          backgroundColor: generateNiceColor()
        }
        if (fitSlots) {
          const slotSize = slotsSizes[slotPos] ?? 0
          slotStyle.height = orientation === 'vertical' ? `${slotSize * 100}%` : undefined//'100%'
          slotStyle.width = orientation !== 'vertical' ? `${slotSize * 100}%` : undefined // '100%'
        }
        return <div
          className={styles['slot']}
          style={slotStyle}>
          {slotData.type === 'item'
            ? <StrToVNode content={slotData.content} sanitize={false} />
            : <Stripe
              orientation={Stripe.flip(orientation)}
              fitSlots={slotData.fitSlots}
              slots={slotData.slots} />}
        </div>
      })}
    </div>
  }
}

export default Stripe
