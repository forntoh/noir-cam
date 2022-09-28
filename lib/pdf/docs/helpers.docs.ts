export function buildFileName(text: string) {
  return `${text.replaceAll(" ", "_")}.pdf`;
}
