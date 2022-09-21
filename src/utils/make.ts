export function generateRandomString(size: number) {
  let str = "";

  while (true) {
    str += Math.random().toString(16).substring(2, 11);
    if (str.length >= size) break;
  }

  str = str.substring(0, size);

  return str;
}
