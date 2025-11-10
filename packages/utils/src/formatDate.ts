export const getMonthName = (value: number): string => {
  switch (value) {
    case 1:
      return "ENERO";
    case 2:
      return "FEBRERO";
    case 3:
      return "MARZO";
    case 4:
      return "ABRIL";
    case 5:
      return "MAYO";
    case 6:
      return "JUNIO";
    case 7:
      return "JULIO";
    case 8:
      return "AGOSTO";
    case 9:
      return "SEPTIEMBRE";
    case 10:
      return "OCTUBRE";
    case 11:
      return "NOVIEMBRE";
    case 12:
      return "DICIEMBRE";

    default:
      return "";
  }
};

export const getNowDate = (): string => {
  const date = new Date(Date.now());
  return (
    date
      .toLocaleString("sv-SE", { timeZone: "America/Bogota" })
      .replace(" ", "T") + ".000Z"
  );
};
