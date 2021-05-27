import { Component, ReactNode, FunctionComponent as FC } from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

interface NameData {
  name: string
  display_name: string
  intro: string
  text: string
}

const data: NameData[] = [{
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

const Name: FC<{data: NameData}> = props => {
  return (
    <div>
      <div>
        <span>{props.data.display_name}</span>
        <span>{props.data.intro}</span>
      </div>
      <div>
        {props.data.text}
      </div>
    </div>
  )
}

class Names extends Component<{}, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): ReactNode {
    const classes: string = clss('prenoms-names', styles.wrapper)
    return (
      <div className={classes}>
        {data.map((item: NameData, i: number): ReactNode => {
          return <Name data={item} key={i} />
        })}
      </div>
    )
  }
}

export default Names
