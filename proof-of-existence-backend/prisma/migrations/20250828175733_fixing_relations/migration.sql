/*
  Warnings:

  - You are about to drop the column `creatorId` on the `PeerVerification` table. All the data in the column will be lost.
  - You are about to drop the column `proofId` on the `PeerVerification` table. All the data in the column will be lost.
  - Added the required column `verifiedCreatorId` to the `PeerVerification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."PeerVerification" DROP CONSTRAINT "PeerVerification_creatorId_fkey";

-- DropIndex
DROP INDEX "public"."Proof_fileHash_key";

-- AlterTable
ALTER TABLE "public"."PeerVerification" DROP COLUMN "creatorId",
DROP COLUMN "proofId",
ADD COLUMN     "verifiedCreatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Collaboration" ADD CONSTRAINT "Collaboration_proofId_fkey" FOREIGN KEY ("proofId") REFERENCES "public"."Proof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PeerVerification" ADD CONSTRAINT "PeerVerification_verifiedCreatorId_fkey" FOREIGN KEY ("verifiedCreatorId") REFERENCES "public"."Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
