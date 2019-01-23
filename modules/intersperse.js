export default function intersperse(arr, supplier) {
  const len = arr.length;
  return arr.reduce((arr2, existingItem, i) => {
    const isLastItem = (i === len - 1);
    const newItem = (typeof supplier === "function")
      ? supplier(existingItem, i)
      : supplier;
    arr2.push(existingItem);
    if (!isLastItem) {
      arr2.push(newItem);
    }
    return arr2;
  }, []);
}
