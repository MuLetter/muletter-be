export function generateRandomColor(length: number) {
  const colors: string[] = [];
  for (let i = 0; i < length; i++) {
    let color = Math.floor(Math.random() * 16777215).toString(16);
    while (color in colors) {
      color = Math.floor(Math.random() * 16777215).toString(16);
      console.log(color in colors);
    }
    colors.push(color);
  }
  return colors;
}
