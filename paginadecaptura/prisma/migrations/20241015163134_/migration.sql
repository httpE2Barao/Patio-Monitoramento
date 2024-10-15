/*
  Warnings:

  - You are about to drop the column `clienteId` on the `Endereco` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `Residentes` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `Veiculos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Residentes" DROP CONSTRAINT "Residentes_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Veiculos" DROP CONSTRAINT "Veiculos_clienteId_fkey";

-- AlterTable
ALTER TABLE "Endereco" DROP COLUMN "clienteId";

-- AlterTable
ALTER TABLE "Residentes" DROP COLUMN "clienteId";

-- AlterTable
ALTER TABLE "Veiculos" DROP COLUMN "clienteId";

-- CreateTable
CREATE TABLE "_ClienteToEndereco" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClienteToResidentes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClienteToVeiculos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClienteToEndereco_AB_unique" ON "_ClienteToEndereco"("A", "B");

-- CreateIndex
CREATE INDEX "_ClienteToEndereco_B_index" ON "_ClienteToEndereco"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClienteToResidentes_AB_unique" ON "_ClienteToResidentes"("A", "B");

-- CreateIndex
CREATE INDEX "_ClienteToResidentes_B_index" ON "_ClienteToResidentes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClienteToVeiculos_AB_unique" ON "_ClienteToVeiculos"("A", "B");

-- CreateIndex
CREATE INDEX "_ClienteToVeiculos_B_index" ON "_ClienteToVeiculos"("B");

-- AddForeignKey
ALTER TABLE "_ClienteToEndereco" ADD CONSTRAINT "_ClienteToEndereco_A_fkey" FOREIGN KEY ("A") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClienteToEndereco" ADD CONSTRAINT "_ClienteToEndereco_B_fkey" FOREIGN KEY ("B") REFERENCES "Endereco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClienteToResidentes" ADD CONSTRAINT "_ClienteToResidentes_A_fkey" FOREIGN KEY ("A") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClienteToResidentes" ADD CONSTRAINT "_ClienteToResidentes_B_fkey" FOREIGN KEY ("B") REFERENCES "Residentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClienteToVeiculos" ADD CONSTRAINT "_ClienteToVeiculos_A_fkey" FOREIGN KEY ("A") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClienteToVeiculos" ADD CONSTRAINT "_ClienteToVeiculos_B_fkey" FOREIGN KEY ("B") REFERENCES "Veiculos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
