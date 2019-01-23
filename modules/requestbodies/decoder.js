export function canDecode(encoding) {
  if (!encoding) {
    return true;
  }

  if (encoding !== "base64") {
    // only base64 supported
    return false;
  }

  if (typeof atob === "undefined") {
    // it's base64 but we can't decode it.  E.g. IE9.
    return false;
  }

  return true;
}

export function decode(text, encoding) {
  return (encoding === "base64") ? atob(text) : text;
}
