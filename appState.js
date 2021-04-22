module.exports = (initState = {}) => {
  let state = initState;

  const getState = () => state;
  const updateState = newState => {
    state = newState
  }

  return [getState, updateState]
}