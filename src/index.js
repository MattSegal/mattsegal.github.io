'use strict'
import Automata from 'automata'
import Sierpinski from 'sierpinski'
import Portal from 'portal'
import Tree from 'tree'
import Navigator from 'navigator'
import GameOfLife from 'life'

const nav = new Navigator()
nav.addAnimation('automata', Automata)
nav.addAnimation('sierpinski', Sierpinski)
nav.addAnimation('portal', Portal)
nav.addAnimation('tree', Tree)
nav.addAnimation('life', GameOfLife)
nav.setDefault('automata')

// Draw animations forever
nav.init()

// Setup UI events
const navbarButton = document.getElementById('navbar-btn')
const hideButton = document.getElementById('hide-btn')
const navbar = document.getElementById('navbar')
const content = document.getElementById('content')

const onNavbarButtonClick = () => {
 if (navbar.classList.contains('hidden')) {
  navbar.classList.remove('hidden')
 } else {
  navbar.classList.add('hidden')
 }
}

const onHideButtonClick = () => {
 if (content.classList.contains('hidden')) {
  content.classList.remove('hidden')
 } else {
  content.classList.add('hidden')
 }
}

for (let child of navbar.children) {
  child.onclick = onNavbarButtonClick
}
navbarButton.onclick = onNavbarButtonClick
hideButton.onclick = onHideButtonClick
