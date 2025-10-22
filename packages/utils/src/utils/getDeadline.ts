export function getDeadline() {
  return (Math.floor(Date.now() / 1000) + 600).toString();
}
