/*
A token instance is passed to each animation so that we can
cancel it while it is running, and then run a different animation
*/

const STATE = {
  RUNNING: 1,
  CANCELLING: 2,
  CANCELLED: 3
}

export default class CancellationToken {
  constructor(isRunning=true) {
    if (isRunning) {
      this.state = STATE.RUNNING
    } else {
      this.state = STATE.CANCELLED
    }
    
  }

  startCancel() {
    if (this.state === STATE.RUNNING) {
      this.state = STATE.CANCELLING
    }
  }

  finishCancel() {
    if (this.state === STATE.CANCELLING) {
      this.state = STATE.CANCELLED
    }
  }

  isCancelling() {
    return this.state === STATE.CANCELLING
  }

  isCancelled() {
    return this.state === STATE.CANCELLED
  }
}