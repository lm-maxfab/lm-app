import React from 'react'
import { render, hydrate } from 'react-dom'
import 'whatwg-fetch'
import smoothscroll from 'smoothscroll-polyfill'
import App from './App2'

// test

// Enable smoothscroll polyfill
smoothscroll.polyfill()

// Select DOM root node for the React app
const rootNodeId: string = 'lm-app-root'
const rootNode: HTMLElement|null = document.getElementById(rootNodeId)

// Rendered app
const rendered = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Render app
if (rootNode === null) console.error(`App root node '#${rootNodeId}' not found.`)
else if (rootNode.hasChildNodes()) hydrate(rendered, rootNode)
else render(rendered, rootNode)
