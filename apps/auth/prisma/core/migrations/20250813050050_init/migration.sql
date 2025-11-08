-- CreateTable
CREATE TABLE "public"."Usuarios" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tenant" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_TenantToUsuarios" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TenantToUsuarios_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_usuario_key" ON "public"."Usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_nombre_key" ON "public"."Tenant"("nombre");

-- CreateIndex
CREATE INDEX "_TenantToUsuarios_B_index" ON "public"."_TenantToUsuarios"("B");

-- AddForeignKey
ALTER TABLE "public"."_TenantToUsuarios" ADD CONSTRAINT "_TenantToUsuarios_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TenantToUsuarios" ADD CONSTRAINT "_TenantToUsuarios_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
