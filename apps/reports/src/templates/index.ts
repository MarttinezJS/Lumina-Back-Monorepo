export const getTemplate = async (filename: string) =>
  await Bun.file(`${__dirname}/${filename}.html`).text();

export const getCss = async () =>
  await Bun.file(`${__dirname}/global.css`).text();
