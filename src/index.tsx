import React from 'react'
import { render, hydrate } from 'react-dom'
import 'whatwg-fetch'
import clss from 'classnames'
import style from './normalize.module.css'
import App from './App'

const rootNodeId: string = 'lm-app-root'
const rootNode: HTMLElement|null = document.getElementById(rootNodeId)
const classes: string = clss('lm-app', style.normalized)

const rendered = (
  <div className={classes} style={{ fontSize: '1.6rem' }}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </div>
)

if (rootNode === null) console.error(`App root node '#${rootNodeId}' not found.`)
else if (rootNode.hasChildNodes()) hydrate(rendered, rootNode)
else render(rendered, rootNode)
