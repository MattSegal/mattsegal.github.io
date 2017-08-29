'use strict'
import Automata from 'automata'
import Sierpinski from 'recursive'
import Portal from 'portal'
import ColorWheel from 'colors'

let lastChoice

// Draw random automata at random scales forever
const loopRandomAutomata = () => {
  const choice = Math.random()
  let animation
  if (choice < 0.33 && lastChoice !== Portal) {
    animation = new Portal()
    lastChoice = Portal
  } else if (choice < 0.33 && lastChoice !== Sierpinski) {
    animation = new Sierpinski()
    lastChoice = Sierpinski
  } else {
    animation = Automata.getRandomAutomata()
    lastChoice = Automata
  }
  animation.run().then(loopRandomAutomata)
}

// Run script
loopRandomAutomata()
