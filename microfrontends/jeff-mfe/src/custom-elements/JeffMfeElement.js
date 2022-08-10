import React from 'react';
import { createRoot } from 'react-dom/client';
import JeffMfe from '../JeffMfe';


class JeffMfeElement extends HTMLElement {
  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.appendChild(this.mountPoint);
    setTimeout(() => this.render(), 500);
  }

  render() {
    const root = createRoot(this.mountPoint);
    root.render(<JeffMfe />);
  }
}

customElements.define('jeff-mfe', JeffMfeElement);
