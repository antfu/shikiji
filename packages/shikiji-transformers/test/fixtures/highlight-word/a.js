export function foo() {
  const a = "Hello World" // [!code highlight[a]]

  // should not be transformed:
  console.log('!code highlight[a]')
}
