/*
  Warnings:

  - Added the required column `app_id` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "app_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "Apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
