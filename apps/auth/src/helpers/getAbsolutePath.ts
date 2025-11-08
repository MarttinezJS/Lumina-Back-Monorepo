export const getAbsolutePath = (): string => {
  const path = __dirname.split("/");
  path.pop();
  path.pop();
  return path.join("/");
};
