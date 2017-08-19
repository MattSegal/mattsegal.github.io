'use strict'
import Automata from 'automata'
import Sierpinski from 'recursive'

// Draw random automata at random scales forever
const loopRandomAutomata = () => {
  const guess = Math.random()
  const animation = guess > 0.7
    ? new Sierpinski()
    : Automata.getRandomAutomata()
  animation.run().then(loopRandomAutomata)
}

// Run script
loopRandomAutomata()
