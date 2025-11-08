/*
  Warnings:

  - You are about to drop the column `monto` on the `Egresos` table. All the data in the column will be lost.
  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuarios_Menu` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cantidad` to the `Egresos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Logs" DROP CONSTRAINT "Logs_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Menu" DROP CONSTRAINT "ancestor___fk";

-- DropForeignKey
ALTER TABLE "public"."Usuarios_Menu" DROP CONSTRAINT "Usuarios_Menu_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Usuarios_Menu" DROP CONSTRAINT "Usuarios_Menu_usuario_id_fkey";

-- AlterTable
ALTER TABLE "Egresos" DROP COLUMN "monto",
ADD COLUMN     "cantidad" INTEGER NOT NULL,
ADD COLUMN     "verificado" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "usuario" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Proveedores" ALTER COLUMN "identificacion" SET DATA TYPE TEXT,
ALTER COLUMN "dv" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "public"."Menu";

-- DropTable
DROP TABLE "public"."Usuarios";

-- DropTable
DROP TABLE "public"."Usuarios_Menu";

-- CreateTable
CREATE TABLE "Incidencias" (
    "id" SERIAL NOT NULL,
    "resuelto" BOOLEAN DEFAULT false,
    "descripcion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fecha_resuelto" TIMESTAMP(3),
    "egresos_id" INTEGER,
    "ingresos_id" INTEGER,

    CONSTRAINT "Incidencias_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Incidencias" ADD CONSTRAINT "Incidencias_egresos_id_fkey" FOREIGN KEY ("egresos_id") REFERENCES "Egresos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencias" ADD CONSTRAINT "Incidencias_ingresos_id_fkey" FOREIGN KEY ("ingresos_id") REFERENCES "Ingresos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
