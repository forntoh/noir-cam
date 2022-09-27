const OUT_DIR = "lib/pdf/.tmp";

export function buildPath(text: string) {
  return `${OUT_DIR}/${text.replaceAll(" ", "_")}.pdf`;
}
