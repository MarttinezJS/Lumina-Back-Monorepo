/*
  Warnings:

  - You are about to drop the `Usuarios_Menu_Tenant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Usuarios_Menu_Tenant" DROP CONSTRAINT "Usuarios_Menu_Tenant_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios_Menu_Tenant" DROP CONSTRAINT "Usuarios_Menu_Tenant_tenant_id_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios_Menu_Tenant" DROP CONSTRAINT "Usuarios_Menu_Tenant_usuario_id_fkey";

-- DropTable
DROP TABLE "Usuarios_Menu_Tenant";

-- CreateTable
CREATE TABLE "Permisos" (
    "id" SERIAL NOT NULL,
    "leer" BOOLEAN DEFAULT false,
    "escribir" BOOLEAN DEFAULT false,
    "ver" BOOLEAN DEFAULT false,
    "editar" BOOLEAN DEFAULT false,
    "eliminar" BOOLEAN DEFAULT false,
    "imprimir" BOOLEAN DEFAULT false,
    "reporte" BOOLEAN DEFAULT false,
    "menu_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tenant_id" INTEGER NOT NULL,

    CONSTRAINT "Permisos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_menu_unique_index" ON "Permisos"("menu_id", "usuario_id", "tenant_id");

-- AddForeignKey
ALTER TABLE "Permisos" ADD CONSTRAINT "Permisos_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permisos" ADD CONSTRAINT "Permisos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permisos" ADD CONSTRAINT "Permisos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
