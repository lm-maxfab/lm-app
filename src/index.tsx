import React from 'react'
import { render, hydrate } from 'react-dom'
import AppWrapper from './AppWrapper'

// Get App root node
const rootNodeId: string = 'lm-app-root'
const rootNode: HTMLElement|null = document.getElementById(rootNodeId)

// Render app
const Rendered = (): JSX.Element => <React.StrictMode><AppWrapper /></React.StrictMode>
if (rootNode === null) console.error(`App root node '#${rootNodeId}' not found.`)
else if (rootNode.hasChildNodes()) hydrate(<Rendered />, rootNode)
else render(<Rendered />, rootNode)
