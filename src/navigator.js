import CancellationToken from 'token'

const RANDOM_SLUG = 'random'

export default class Navigator {
  constructor(defaultSlug) {
    this.defaultSlug = RANDOM_SLUG
    this.animations = {}
    this.lastAnimation = null
    this.token = new CancellationToken(false)
    window.onhashchange = this.onHashChanged
  }

  setDefault(slug) {
    this.defaultSlug = slug
  }

  addAnimation(slug, animation) {
    this.animations[slug] = animation
  }

  init() {
    const initialSlug = window.location.hash.slice(1)
    if (initialSlug in this.animations) {
      this.loopAnimation(initialSlug)
    } else {
      window.location.hash = this.defaultSlug
      this.loopAnimation(this.defaultSlug)
    }
  }

  loopAnimation(slug) {
    const isRandom =  window.location.hash.slice(1) === RANDOM_SLUG
    const chosenSlug = isRandom
      ? this.chooseRandomSlug()
      : slug

    this.token = new CancellationToken()
    this.lastAnimation = chosenSlug
    this.animations[chosenSlug].run(this.token)
      .then(() => this.loopAnimation(chosenSlug))
      .catch(console.warn)
  }

  onHashChanged = () => {
    const chosenSlug = window.location.hash.slice(1)
    const isAlreadyRunning = chosenSlug === this.lastAnimation
    const slugFound = chosenSlug in this.animations || chosenSlug === RANDOM_SLUG
    if (!isAlreadyRunning && slugFound ) {
      this.switchAnimation(chosenSlug)
    }
  }

  switchAnimation(slug) {
      this.token.startCancel()
      if (this.token.isCancelled()) {
        this.loopAnimation(slug)
      } else {
        setTimeout(() => this.switchAnimation(slug), 50)
      }
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
}