import React from 'react'
import { render, hydrate } from 'react-dom'
import 'whatwg-fetch'
import clss from 'classnames'
import styles from './styles.module.css'
import App from './App'

const rootNodeId: string = 'lm-app-root'
const rootNode: HTMLElement|null = document.getElementById(rootNodeId)
const classes: string = clss(styles.normalized, styles['app-root'])

const rendered = (
  <React.StrictMode>
    <App className={classes} />
  </React.StrictMode>
)

if (rootNode === null) console.error(`App root node '#${rootNodeId}' not found.`)
else if (rootNode.hasChildNodes()) hydrate(rendered, rootNode)
else render(rendered, rootNode)
