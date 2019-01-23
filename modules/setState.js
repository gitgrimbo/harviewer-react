export default function setState(context, ...sources) {
  context.setState((prevState) => {
    const newState = Object.assign({}, context.state, ...sources);
    return newState;
  });
}
