export default function setState(context, ...sources) {
  const newState = Object.assign({}, context.state, ...sources);
  context.setState(newState);
  return newState;
}
