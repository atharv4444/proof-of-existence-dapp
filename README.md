# Proof of Existence dApp

## Project Overview
This is a full-stack Proof-of-Existence dApp built on the Stacks blockchain. Its core purpose is to allow creators to cryptographically prove that they possessed a certain file at a specific point in time, protecting their intellectual property. The app also includes features for building a creator network and handling collaborations.

## Technologies Used
* **Frontend:** React (Vite)
* **Blockchain Integration:** Stacks Connect Library
* **Backend:** Node.js, Express, and Prisma
* **Database:** PostgreSQL
* **Smart Contract:** Clarity

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm
* A Stacks Wallet (e.g., Leather)

### Installation
1.  Clone the repository:
    ```bash
    git clone [Your-GitHub-Repository-URL-Here]
    ```
2.  Navigate to the backend directory and install dependencies:
    ```bash
    cd proof-of-existence-backend
    npm install
    ```
3.  Set up your PostgreSQL database and update the database connection URL in your `.env` file.
4.  Navigate to the frontend directory and install dependencies:
    ```bash
    cd ../proof-of-existence-dapp
    npm install
    ```

### Running the Application

You need to run both the backend and frontend in separate terminals.

**Terminal 1: Backend**
1.  In the backend directory, run the server:
    ```bash
    node index.js
    ```

**Terminal 2: Frontend**
1.  In the frontend directory, run the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to the local URL provided by Vite (e.g., `http://localhost:5173/`).

## Project Features
* **Wallet Integration:** Securely connect to the dApp using a Stacks wallet.
* **Proof Submission:** Upload a file, generate a SHA-256 hash, and anchor it on the Stacks blockchain.
* **Proof History:** View a list of all your anchored proofs with a link to the Stacks Explorer.
* **Creator Network:** See other creators on the platform and send collaboration requests.

## Smart Contract

The core of this dApp is the **`proof-of-existence-v1.clar`** smart contract. It has a single public function, `store-proof`, which takes a file hash and permanently records it on the Stacks blockchain. This creates an immutable, timestamped record of the proof.