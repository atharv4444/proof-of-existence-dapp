-- CreateTable
CREATE TABLE "public"."Creator" (
    "id" TEXT NOT NULL,
    "stacksAddress" TEXT NOT NULL,
    "username" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Proof" (
    "id" TEXT NOT NULL,
    "fileHash" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "txId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Collaboration" (
    "id" TEXT NOT NULL,
    "proofId" TEXT NOT NULL,
    "collaboratorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collaboration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PeerVerification" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "verifierId" TEXT NOT NULL,
    "proofId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PeerVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Creator_stacksAddress_key" ON "public"."Creator"("stacksAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Proof_fileHash_key" ON "public"."Proof"("fileHash");

-- CreateIndex
CREATE UNIQUE INDEX "Proof_txId_key" ON "public"."Proof"("txId");

-- AddForeignKey
ALTER TABLE "public"."Proof" ADD CONSTRAINT "Proof_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Collaboration" ADD CONSTRAINT "Collaboration_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "public"."Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PeerVerification" ADD CONSTRAINT "PeerVerification_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PeerVerification" ADD CONSTRAINT "PeerVerification_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "public"."Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
