import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

console.log(styles)

interface Credits {
  id: string
  label: JSX.Element
  details: JSX.Element
}

interface Props {
  className?: string
  style?: React.CSSProperties
  credits: Credits[]
  outro: JSX.Element
}

class Outro extends React.Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const classes: string = clss('prenoms-outro', styles['wrapper'], props.className)
    const inlineStyle = { ...props.style }
    console.log(props.credits)
    return (
      <div className={classes} style={inlineStyle}>
        <div className={styles.outro}>
          <img className={styles.outro__image} src='https://assets-decodeurs.lemonde.fr/redacweb/1-2105-prenoms-assets/fee-poids.png' />
          <div className={styles.outro__text}>{props.outro}</div>
        </div>
        <div className={styles.credits}>
          {props.credits.map((credit, i) => {
            return <div
              key={credit.id}
              className={styles.credit}>
              <div className={styles.credit__label}>{credit.label}</div>
              <div className={styles.credit__details}>{credit.details}</div>
            </div>
          })}
        </div>
      </div>
    )
  }
}

export type { Credits, Props }
export default Outro
