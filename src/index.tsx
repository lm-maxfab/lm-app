import React from 'react'
import { render, hydrate } from 'react-dom'
import 'whatwg-fetch'
import smoothscroll from 'smoothscroll-polyfill'
import AppWrapper from './AppWrapper'

// Get App root node
const rootNodeId: string = 'lm-app-root'
const rootNode: HTMLElement|null = document.getElementById(rootNodeId)

// Enable smoothscroll polyfill
smoothscroll.polyfill()

// Render app
if (rootNode === null) console.error(`App root node '#${rootNodeId}' not found.`)
else if (rootNode.hasChildNodes()) hydrate(<AppWrapper />, rootNode)
else render(<AppWrapper />, rootNode)
