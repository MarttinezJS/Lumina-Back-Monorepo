/*
  Warnings:

  - The primary key for the `UsuariosApps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UsuariosApps` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsuariosApps" DROP CONSTRAINT "UsuariosApps_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UsuariosApps_pkey" PRIMARY KEY ("usuario_id", "app_id");
