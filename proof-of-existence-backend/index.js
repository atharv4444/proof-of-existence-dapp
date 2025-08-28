const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// Create or get a creator profile
app.post('/api/creators', async (req, res) => {
  console.log("--> Received POST /api/creators"); // LOG
  const { stacksAddress } = req.body;
  try {
    let creator = await prisma.creator.findUnique({ where: { stacksAddress } });
    if (!creator) {
      creator = await prisma.creator.create({ data: { stacksAddress } });
    }
    res.json(creator);
  } catch (error) {
    console.error("ERROR in POST /api/creators:", error); // ERROR LOG
    res.status(500).json({ error: 'Could not process creator profile.' });
  }
});

// Submit proof metadata
app.post('/api/proofs', async (req, res) => {
  console.log("--> Received POST /api/proofs"); // LOG
  const { fileHash, fileName, creatorAddress, txId } = req.body;
  try {
    const proof = await prisma.proof.create({
      data: {
        fileHash,
        fileName,
        txId,
        creator: { connect: { stacksAddress: creatorAddress } },
      },
    });
    res.json(proof);
  } catch (error) {
    console.error("ERROR in POST /api/proofs:", error); // ERROR LOG
    res.status(500).json({ error: 'Could not save proof metadata.' });
  }
});

// Get proofs for a creator
app.get('/api/creators/:address/proofs', async (req, res) => {
  console.log(`--> Received GET /api/creators/${req.params.address}/proofs`); // LOG
  const { address } = req.params;
  try {
    const proofs = await prisma.proof.findMany({
      where: { creator: { stacksAddress: address } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(proofs);
  } catch (error) {
    console.error(`ERROR in GET /api/creators/.../proofs:`, error); // ERROR LOG
    res.status(500).json({ error: 'Could not retrieve proofs.' });
  }
});

// Get all creators
app.get('/api/creators', async (req, res) => {
  console.log("--> Received GET /api/creators"); // LOG
  try {
    const creators = await prisma.creator.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(creators);
  } catch (error) {
    console.error("ERROR in GET /api/creators:", error); // ERROR LOG
    res.status(500).json({ error: 'Could not retrieve creators.' });
  }
});

// Get verifications made by a user
app.get('/api/verifications/:address', async (req, res) => {
  console.log(`--> Received GET /api/verifications/${req.params.address}`); // LOG
  const { address } = req.params;
  try {
    const verifications = await prisma.peerVerification.findMany({
      where: { verifier: { stacksAddress: address } },
      select: { verifiedCreator: { select: { stacksAddress: true } } }
    });
    const verifiedAddresses = verifications.map(v => v.verifiedCreator.stacksAddress);
    res.json(verifiedAddresses);
  } catch (error) {
    console.error("ERROR in GET /api/verifications:", error); // ERROR LOG
    res.status(500).json({ error: 'Could not retrieve verifications.' });
  }
});

// Create a peer verification
app.post('/api/verifications', async (req, res) => {
  console.log("--> Received POST /api/verifications"); // LOG
  const { verifierAddress, creatorToVerifyAddress } = req.body;
  if (verifierAddress === creatorToVerifyAddress) {
    return res.status(400).json({ error: 'You cannot verify yourself.' });
  }
  try {
    const newVerification = await prisma.peerVerification.create({
      data: {
        verifier: { connect: { stacksAddress: verifierAddress } },
        verifiedCreator: { connect: { stacksAddress: creatorToVerifyAddress } }
      }
    });
    res.status(201).json(newVerification);
  } catch (error) {
    console.error("ERROR in POST /api/verifications:", error); // ERROR LOG
    res.status(500).json({ error: 'Could not create verification.' });
  }
});

// Get collaborations for a proof
app.get('/api/proofs/:proofId/collaborations', async (req, res) => {
  console.log(`--> Received GET /api/proofs/${req.params.proofId}/collaborations`); // LOG
  const { proofId } = req.params;
  try {
    const collaborations = await prisma.collaboration.findMany({
      where: { proofId },
      include: { collaborator: { select: { stacksAddress: true } } }
    });
    res.json(collaborations);
  } catch (error) {
    console.error("ERROR in GET /api/proofs/.../collaborations:", error); // ERROR LOG
    res.status(500).json({ error: 'Could not retrieve collaborations.' });
  }
});

// Create a collaboration
app.post('/api/collaborations', async (req, res) => {
  console.log("--> Received POST /api/collaborations"); // LOG
  const { proofId, collaboratorAddress } = req.body;
  try {
    const collaborator = await prisma.creator.findUnique({ where: { stacksAddress: collaboratorAddress } });
    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found.' });
    }
    const newCollaboration = await prisma.collaboration.create({
      data: {
        proofId,
        collaboratorId: collaborator.id,
        status: 'PENDING'
      }
    });
    res.status(201).json(newCollaboration);
  } catch (error) {
    console.error("ERROR in POST /api/collaborations:", error); // ERROR LOG
    res.status(500).json({ error: 'Could not create collaboration.' });
  }
});

// Get incoming collaborations
app.get('/api/collaborations/incoming/:address', async (req, res) => {
  console.log(`--> Received GET /api/collaborations/incoming/${req.params.address}`); // LOG
  const { address } = req.params;
  try {
    const requests = await prisma.collaboration.findMany({
      where: {
        collaborator: { stacksAddress: address },
        status: 'PENDING'
      },
      include: {
        proof: {
          select: {
            fileName: true,
            creator: { select: { stacksAddress: true } }
          }
        }
      }
    });
    res.json(requests);
  } catch (error) {
    console.error("ERROR in GET /api/collaborations/incoming:", error); // ERROR LOG
    res.status(500).json({ error: 'Could not retrieve incoming requests.' });
  }
});

// Update a collaboration
app.put('/api/collaborations/:id', async (req, res) => {
  console.log(`--> Received PUT /api/collaborations/${req.params.id}`); // LOG
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedCollaboration = await prisma.collaboration.update({
      where: { id },
      data: { status }
    });
    res.json(updatedCollaboration);
  } catch (error) {
    console.error("ERROR in PUT /api/collaborations:", error); // ERROR LOG
    res.status(500).json({ error: 'Could not update collaboration.' });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));