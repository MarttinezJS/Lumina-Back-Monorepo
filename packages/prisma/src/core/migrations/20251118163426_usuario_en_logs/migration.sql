/*
  Warnings:

  - Added the required column `usuario` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_usuario_id_fkey";

-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "usuario" TEXT NOT NULL,
ADD COLUMN     "usuariosId" INTEGER;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
