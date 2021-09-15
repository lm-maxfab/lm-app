import { render } from 'preact'
import AppWrapper from './AppWrapper'

// Get App root node
const rootNodeId: string = 'lm-app-root'
const rootNode: HTMLElement|null = document.getElementById(rootNodeId)

// Render app
if (rootNode === null) console.error(`App root node '#${rootNodeId}' not found.`)
else render(<AppWrapper />, rootNode)
