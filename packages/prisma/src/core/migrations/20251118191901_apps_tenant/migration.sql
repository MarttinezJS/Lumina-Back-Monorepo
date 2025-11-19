/*
  Warnings:

  - The primary key for the `UsuariosApps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `TenantApps` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tenant_id` to the `UsuariosApps` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TenantApps" DROP CONSTRAINT "TenantApps_appsId_fkey";

-- DropForeignKey
ALTER TABLE "TenantApps" DROP CONSTRAINT "TenantApps_tenantId_fkey";

-- AlterTable
ALTER TABLE "UsuariosApps" DROP CONSTRAINT "UsuariosApps_pkey",
ADD COLUMN     "tenant_id" INTEGER NOT NULL,
ADD CONSTRAINT "UsuariosApps_pkey" PRIMARY KEY ("usuario_id", "app_id", "tenant_id");

-- DropTable
DROP TABLE "TenantApps";

-- AddForeignKey
ALTER TABLE "UsuariosApps" ADD CONSTRAINT "UsuariosApps_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
