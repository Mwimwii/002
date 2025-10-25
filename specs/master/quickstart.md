# Groupee Quickstart Guide

## Overview
This guide will help you set up and run the Groupee decentralized messaging and paywalled file-sharing application locally.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- A cryptocurrency wallet (MetaMask recommended)
- Pinata account and API keys
- (For development) Git

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd groupee
```

### 2. Backend Server Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# - PINATA_JWT: Your Pinata JWT token
# - PINATA_API_KEY: Your Pinata API key
# - PINATA_SECRET_API_KEY: Your Pinata secret API key
```

### 3. Frontend Setup
```bash
# From the project root, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# - VITE_XMTP_ENV: XMTP environment (dev or production)
# - VITE_SERVER_URL: Your backend server URL (e.g., http://localhost:8787)
```

## Running the Application

### 1. Start the Backend Server
```bash
# From the backend directory
cd backend
npm run dev
```
The server will start on `http://localhost:8787`

### 2. Start the Frontend
```bash
# From the frontend directory
cd frontend
npm run dev
```
The frontend will start on `http://localhost:3000`

## Configuration

### API Keys
You'll need to obtain API keys from Pinata:
1. Visit [pinata.cloud](https://pinata.cloud)
2. Create an account and navigate to API Keys
3. Create a new API key with Upload permissions
4. Add your API keys to the environment files

### Wallet Setup
- Install MetaMask or another Web3 wallet
- Have some test ETH/tokens for payment testing
- Connect your wallet when prompted in the application

## Initial Usage

### 1. Connect Wallet
- Navigate to the application in your browser
- Click "Connect Wallet" button
- Select your wallet provider
- Confirm connection in your wallet

### 2. Create a Group
- Click "Create Group" button
- Enter group name and select members (by wallet address)
- You'll automatically be set as the group admin

### 3. Send a Message
- Select a group from your group list
- Type your message in the input field
- Click "Send" to send via XMTP

### 4. Share a File with Payment Gate
- Click the paperclip/file attachment button
- Select a file up to 50MB
- Set a price for file access (in ETH or test tokens)
- Click "Send" to upload to IPFS and share via XMTP
- Other group members will see a payment request to access the file

### 5. Access a Paid File
- When you see a message with a payment-gated file
- Click the payment button to initiate x402 payment flow
- Confirm the payment in your wallet
- After payment confirmation, a download button will appear
- Click the download button to retrieve the file from IPFS

## Development Commands

### Backend
```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Frontend
```bash
# Start development server
npm run dev

# Run tests
npm run test

# Lint code
npm run lint

# Build for production
npm run build
```

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Ensure your wallet extension is installed and unlocked
   - Try refreshing the page after unlocking your wallet

2. **File Upload Failures**
   - Ensure the file is not larger than 50MB
   - Check your internet connection
   - Verify your Pinata API keys are correct

3. **Payment Not Processing**
   - Ensure you have sufficient funds in your wallet
   - Check network settings in your wallet (should match file pricing token)

4. **Messages Not Appearing**
   - Ensure XMTP network is accessible
   - Verify the recipient wallet addresses are correct
   - Check browser console for errors

### API Endpoints
- POST /api/upload - Upload file to Pinata via server
- GET /api/file/:cid - x402-gated access to file content
- POST /api/payment/verify - Verify payment status for a CID