/*
  Warnings:

  - You are about to drop the `Investment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('RENDA_FIXA', 'ACAO_BR', 'ACAO_EUA', 'FII', 'BDR', 'ETF', 'CRIPTOMOEDA', 'OUTRO');

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_userId_fkey";

-- DropTable
DROP TABLE "Investment";

-- CreateTable
CREATE TABLE "investments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "type" "InvestmentType" NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "average_cost" DOUBLE PRECISION NOT NULL,
    "current_price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
