/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Apps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "TenantApps" (
    "appsId" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,

    CONSTRAINT "TenantApps_pkey" PRIMARY KEY ("appsId","tenantId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Apps_url_key" ON "Apps"("url");

-- AddForeignKey
ALTER TABLE "TenantApps" ADD CONSTRAINT "TenantApps_appsId_fkey" FOREIGN KEY ("appsId") REFERENCES "Apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantApps" ADD CONSTRAINT "TenantApps_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
