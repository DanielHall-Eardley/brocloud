const AppState = class AppState {
  constructor (initState = {}) {
    state = initState;
  }

  getState() {
    return this.state
  }

  updateState = newState => {
    this.state = newState
  }
}

module.exports = new AppState ({
  clubs: {}
})