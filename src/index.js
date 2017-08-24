'use strict'
import Automata from 'automata'
import Sierpinski from 'recursive'
import Portal from 'portal'

// Draw random automata at random scales forever
const loopRandomAutomata = () => {
  const guess = Math.random()
  let animation
  if (guess < 0) {
  	animation = Automata.getRandomAutomata()
  } else if (guess < 0) {
	animation = new Sierpinski()
  } else {
  	animation = new Portal()
  }
  animation.run().then(loopRandomAutomata)
}

// Run script
loopRandomAutomata()
