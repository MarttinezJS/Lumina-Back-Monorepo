/*
  Warnings:

  - You are about to alter the column `usuario` on the `Usuarios` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - A unique constraint covering the columns `[correo]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellido` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correo` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('guardar', 'editar', 'eliminar', 'consultar');

-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "activo" BOOLEAN DEFAULT true,
ADD COLUMN     "apellido" VARCHAR(100) NOT NULL,
ADD COLUMN     "cambiar_password" BOOLEAN DEFAULT false,
ADD COLUMN     "correo" VARCHAR(50) NOT NULL,
ADD COLUMN     "nombre" VARCHAR(100) NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "usuario" SET DATA TYPE VARCHAR(20);

-- CreateTable
CREATE TABLE "Usuarios_Menu" (
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

    CONSTRAINT "Usuarios_Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "frontPath" TEXT NOT NULL,
    "descripcion" TEXT,
    "menu_padre" INTEGER,
    "leer" BOOLEAN DEFAULT false,
    "escribir" BOOLEAN DEFAULT false,
    "ver" BOOLEAN DEFAULT false,
    "editar" BOOLEAN DEFAULT false,
    "eliminar" BOOLEAN DEFAULT false,
    "imprimir" BOOLEAN DEFAULT false,
    "reporte" BOOLEAN DEFAULT false,
    "activo" BOOLEAN DEFAULT true,
    "posicion" INTEGER DEFAULT 0,
    "icono" TEXT,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apps" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "icono" TEXT,
    "url" TEXT NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "Apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuariosApps" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "app_id" INTEGER NOT NULL,
    "asignado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuariosApps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "endpoint" TEXT NOT NULL,
    "accion" "Actions" NOT NULL,
    "fecha" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "persistir" BOOLEAN DEFAULT true,
    "resp" TEXT NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_menu_pk" ON "Usuarios_Menu"("usuario_id", "menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_menu_unique_index" ON "Usuarios_Menu"("menu_id", "usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_endpoint_key" ON "Menu"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "Apps_nombre_key" ON "Apps"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_correo_key" ON "Usuarios"("correo");

-- AddForeignKey
ALTER TABLE "Usuarios_Menu" ADD CONSTRAINT "Usuarios_Menu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios_Menu" ADD CONSTRAINT "Usuarios_Menu_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "ancestor___fk" FOREIGN KEY ("menu_padre") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosApps" ADD CONSTRAINT "UsuariosApps_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosApps" ADD CONSTRAINT "UsuariosApps_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "Apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
