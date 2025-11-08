import { StringFilter as StringC } from "../../generated/client-cuestecitas/commonInputTypes";
import { StringFilter as StringV } from "../../generated/client-valledupar/commonInputTypes";

export const convert2Boolean = (query: string) => {
  if (query == null) return;
  switch (query) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return undefined;
  }
};

export const convert2String = (
  query: string
): StringC | StringV | undefined => {
  if (query == null) return;
  return {
    contains: query,
    mode: "insensitive",
  };
};

export const convert2Number = (query: string) => {
  const number = Number.parseInt(query);
  return isNaN(number) ? undefined : number;
};
