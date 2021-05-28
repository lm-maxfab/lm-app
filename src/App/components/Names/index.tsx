import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import Name from '../Name'
import type { Props as NameProps } from '../Name'

const data: NameProps[] = [{
  name: 'Jeanne',
  display_name: 'Jeanne',
  intro: ', lorem ipsum dolor sit amet !',
  text: 'Lorem ipsum dolor sit amet consectutor napam sed tortor !'
}, {
  name: 'Jean',
  display_name: 'Jean',
  intro: ', lorem ipsum dolor sit amet !',
  text: 'Lorem ipsum dolor sit amet consectutor napam sed tortor !'
}]

interface Props {
  className?: string
  style?: any
}

class Names extends React.Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const classes: string = clss('prenoms-names', styles.wrapper, props.className)
    const inlineStyle = { ...props.style }
    return (
      <div className={classes} style={inlineStyle}>
        {data.map((name: NameProps, i: number): React.ReactNode => {
          return <Name {...name} key={i} />
        })}
      </div>
    )
  }
}

export type { Props }
export default Names
