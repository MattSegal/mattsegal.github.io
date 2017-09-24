'use strict'
import Automata from 'automata'
import Sierpinski from 'recursive'
import Portal from 'portal'
import Navigator from 'navigator'

const nav = new Navigator()
nav.addAnimation('automata', Automata)
nav.addAnimation('sierpinski', Sierpinski)
nav.addAnimation('portal', Portal)

// Draw random animations forever
const loop = () => {
  nav.navigateRandom().then(loop)
}

// Run script
loop()