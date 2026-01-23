-- CreateTable
CREATE TABLE "Categorias_Reportes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "Categorias_Reportes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuarios_Reportes" (
    "reporte_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuarios_Reportes_pkey" PRIMARY KEY ("reporte_id","usuario_id")
);

-- CreateTable
CREATE TABLE "Reportes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "activo" BOOLEAN DEFAULT true,
    "app_id" INTEGER NOT NULL,
    "categorias_reportes_id" INTEGER NOT NULL,

    CONSTRAINT "Reportes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categorias_Reportes_nombre_key" ON "Categorias_Reportes"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Reportes_nombre_key" ON "Reportes"("nombre");

-- AddForeignKey
ALTER TABLE "Usuarios_Reportes" ADD CONSTRAINT "Usuarios_Reportes_reporte_id_fkey" FOREIGN KEY ("reporte_id") REFERENCES "Reportes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios_Reportes" ADD CONSTRAINT "Usuarios_Reportes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reportes" ADD CONSTRAINT "Reportes_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "Apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reportes" ADD CONSTRAINT "Reportes_categorias_reportes_id_fkey" FOREIGN KEY ("categorias_reportes_id") REFERENCES "Categorias_Reportes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
