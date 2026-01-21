export const getTemplate = async (filename: string) =>
  await Bun.file(`./src/templates/${filename}.html`).text();
