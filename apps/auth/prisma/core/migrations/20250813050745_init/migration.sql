/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `UsuariosTenant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."UsuariosTenant" DROP COLUMN "assignedAt",
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
