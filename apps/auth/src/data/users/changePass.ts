import { CoreClient, openPrisma } from "@lumina/prisma";

export const changePass = (id: number, password: string) =>
  openPrisma("Core", async (client: CoreClient) => {
    const result = await client.usuarios.update({
      where: {
        id,
      },
      data: {
        password,
        changePassword: false,
      },
    });
    return {
      data: null,
      message: "Contraseña cambiada correctamente.",
    };
  });
