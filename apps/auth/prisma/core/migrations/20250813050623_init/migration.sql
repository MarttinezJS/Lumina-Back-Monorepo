/*
  Warnings:

  - You are about to drop the `_TenantToUsuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_TenantToUsuarios" DROP CONSTRAINT "_TenantToUsuarios_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_TenantToUsuarios" DROP CONSTRAINT "_TenantToUsuarios_B_fkey";

-- DropTable
DROP TABLE "public"."_TenantToUsuarios";

-- CreateTable
CREATE TABLE "public"."UsuariosTenant" (
    "usuario" INTEGER NOT NULL,
    "tenant" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuariosTenant_pkey" PRIMARY KEY ("usuario","tenant")
);

-- AddForeignKey
ALTER TABLE "public"."UsuariosTenant" ADD CONSTRAINT "UsuariosTenant_usuario_fkey" FOREIGN KEY ("usuario") REFERENCES "public"."Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuariosTenant" ADD CONSTRAINT "UsuariosTenant_tenant_fkey" FOREIGN KEY ("tenant") REFERENCES "public"."Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
