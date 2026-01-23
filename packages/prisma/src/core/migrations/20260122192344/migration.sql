-- CreateTable
CREATE TABLE "Parametros_Reportes" (
    "id" SERIAL NOT NULL,
    "variante" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "url_autocomplete" TEXT,
    "tipo_input" TEXT,
    "reportes_id" INTEGER NOT NULL,

    CONSTRAINT "Parametros_Reportes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Parametros_Reportes" ADD CONSTRAINT "Parametros_Reportes_reportes_id_fkey" FOREIGN KEY ("reportes_id") REFERENCES "Reportes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
