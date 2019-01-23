export default function booleanFlipper(idx) {
  return (value, i) => (idx === i) ? !value : value;
}
