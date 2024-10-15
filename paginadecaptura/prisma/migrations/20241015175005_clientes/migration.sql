/*
  Warnings:

  - You are about to drop the `Residentes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Veiculos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClienteToEndereco` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClienteToResidentes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClienteToVeiculos` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `feedback` on table `Cliente` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_ClienteToEndereco" DROP CONSTRAINT "_ClienteToEndereco_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClienteToEndereco" DROP CONSTRAINT "_ClienteToEndereco_B_fkey";

-- DropForeignKey
ALTER TABLE "_ClienteToResidentes" DROP CONSTRAINT "_ClienteToResidentes_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClienteToResidentes" DROP CONSTRAINT "_ClienteToResidentes_B_fkey";

-- DropForeignKey
ALTER TABLE "_ClienteToVeiculos" DROP CONSTRAINT "_ClienteToVeiculos_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClienteToVeiculos" DROP CONSTRAINT "_ClienteToVeiculos_B_fkey";

-- AlterTable
ALTER TABLE "Cliente" ALTER COLUMN "feedback" SET NOT NULL;

-- AlterTable
ALTER TABLE "Endereco" ADD COLUMN     "clienteId" TEXT;

-- DropTable
DROP TABLE "Residentes";

-- DropTable
DROP TABLE "Veiculos";

-- DropTable
DROP TABLE "_ClienteToEndereco";

-- DropTable
DROP TABLE "_ClienteToResidentes";

-- DropTable
DROP TABLE "_ClienteToVeiculos";

-- CreateTable
CREATE TABLE "Residente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tipoDocumento" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "clienteId" TEXT,

    CONSTRAINT "Residente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "clienteId" TEXT,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Residente" ADD CONSTRAINT "Residente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
