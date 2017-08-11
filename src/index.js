'use strict'
import Automata from 'automata'

// Draw random automata at random scales forever
const loopRandomAutomata = () => {
  const automata = Automata.getRandomAutomata()
  automata.run().then(loopRandomAutomata)
}


// Run script
loopRandomAutomata()
