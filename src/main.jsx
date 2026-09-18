import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Protection against browser extensions (e.g. contentYt.js, autofill, translators)
// that manipulate DOM nodes causing React NotFoundError: "The node to be removed is not a child of this node."
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (console && console.warn) {
        console.warn('SafeDOM: Ignored removeChild for external node:', child)
      }
      return child
    }
    return originalRemoveChild.apply(this, arguments)
  }

  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console && console.warn) {
        console.warn('SafeDOM: Ignored insertBefore for external node:', referenceNode)
      }
      return newNode
    }
    return originalInsertBefore.apply(this, arguments)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
