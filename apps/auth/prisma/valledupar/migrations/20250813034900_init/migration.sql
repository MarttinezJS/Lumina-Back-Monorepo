-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('guardar', 'editar', 'eliminar', 'consultar');

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
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "correo" VARCHAR(50) NOT NULL,
    "usuario" VARCHAR(20) NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "cambiar_password" BOOLEAN DEFAULT false,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipo_Identificacion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tipo_Identificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rubros" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "income" BOOLEAN NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Rubros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "identificacion" INTEGER,
    "tipo_identificacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "dv" INTEGER,

    CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "Ingresos" (
    "id" SERIAL NOT NULL,
    "rubro_id" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "observacion" TEXT,
    "concepto" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "verificado" BOOLEAN DEFAULT false,

    CONSTRAINT "Ingresos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Egresos" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "proveedor_id" TEXT,
    "proveedor" TEXT,
    "concepto" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    "observacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "rubro_id" INTEGER NOT NULL,

    CONSTRAINT "Egresos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conceptos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Conceptos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_menu_pk" ON "Usuarios_Menu"("usuario_id", "menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_menu_unique_index" ON "Usuarios_Menu"("menu_id", "usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_correo_key" ON "Usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_usuario_key" ON "Usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_Identificacion_abreviatura_key" ON "Tipo_Identificacion"("abreviatura");

-- CreateIndex
CREATE UNIQUE INDEX "name_income_index" ON "Rubros"("nombre", "income");

-- CreateIndex
CREATE UNIQUE INDEX "type_identification_unique_index" ON "Proveedores"("tipo_identificacion", "identificacion", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Menu_endpoint_key" ON "Menu"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "Conceptos_nombre_key" ON "Conceptos"("nombre");

-- AddForeignKey
ALTER TABLE "Usuarios_Menu" ADD CONSTRAINT "Usuarios_Menu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios_Menu" ADD CONSTRAINT "Usuarios_Menu_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "ancestor___fk" FOREIGN KEY ("menu_padre") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingresos" ADD CONSTRAINT "Ingresos_rubro_id_fkey" FOREIGN KEY ("rubro_id") REFERENCES "Rubros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Egresos" ADD CONSTRAINT "Egresos_rubro_id_fkey" FOREIGN KEY ("rubro_id") REFERENCES "Rubros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
