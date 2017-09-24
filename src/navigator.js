export default class Navigator {
  constructor() {
    this.animations = {}
    this.lastAnimation = null
    this.cancel = false
    window.onhashchange = this.onHashChanged
  }

  addAnimation(slug, animation) {
    this.animations[slug] = animation
  }

  navigateRandom() {
    let hash = window.location.hash.slice(1)
    let slug
    if (hash in this.animations && !this.lastAnimation) {
      slug = hash
    } else {
      slug = this.chooseRandomSlug()
    }

    this.lastAnimation = slug
    window.location.hash = slug
    this.cancel = false
    return this.animations[slug].run(this.cancel)
  }

  chooseRandomSlug() {
    const slugs = Object.keys(this.animations)
    let slug
    while(true) {
      let randomIdx = Math.floor(Math.random() * slugs.length)
      slug = slugs[randomIdx]
      if (slugs.length <= 1 || slug !== this.lastAnimation) {
        break
      }
    }
    return slug
  }

  onHashChanged = () => {
    const chosenSlug = window.location.hash.slice(1)
    const isAlreadyRunning = chosenSlug === this.lastAnimation
    const slugFound = chosenSlug in this.animations
    if (isAlreadyRunning || !slugFound) {
      return
    }

    // this.switchAnimations(chosenSlug)
  }

  switchAnimations() {
      this.cancel = true
      while (this.cancel) {
        // burn CPU cycles
      }
  }
}