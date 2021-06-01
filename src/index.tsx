import React from 'react'
import { render, hydrate } from 'react-dom'
import 'whatwg-fetch'
import App from './App'

const rootNodeId: string = 'lm-app-root'
const rootNode: HTMLElement|null = document.getElementById(rootNodeId)

const rendered = <React.StrictMode><App /></React.StrictMode>

if (rootNode === null) console.error(`App root node '#${rootNodeId}' not found.`)
else if (rootNode.hasChildNodes()) hydrate(rendered, rootNode)
else render(rendered, rootNode)
