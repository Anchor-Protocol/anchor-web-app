/**
 * @author Lorenzo Cadamuro / http://lorenzocadamuro.com
 */

import * as dat from 'dat.gui';

let gui;

const init = () => {
  if (!gui) {
    gui = new dat.GUI({width: 300})
  }
}

setTimeout(() => {
  if (process.env.NODE_ENV === 'development') {
    init()
  }
})

export default {
  get: (callback) => {
    setTimeout(() => {
      if (gui) {
        callback(gui)
      }
    })
  },
}
