-- AlterTable
ALTER TABLE "user" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 5;

-- CreateTable
CREATE TABLE "credit_transaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "plan" TEXT,
    "credits" INTEGER NOT NULL,

    CONSTRAINT "credit_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credit_transaction_userId_idx" ON "credit_transaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "credit_transaction_provider_reference_key" ON "credit_transaction"("provider", "reference");

-- AddForeignKey
ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
