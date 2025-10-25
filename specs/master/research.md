# Groupee Research & Technical Analysis

## Overview
This document captures the research findings for implementing Groupee, a decentralized messaging and paywalled file-sharing application using XMTP, IPFS/Pinata, x402 protocol, React/Vite frontend, and Hono backend.

## Technology Decisions

### Frontend Framework: React + Vite
**Decision**: Use React with Vite as the frontend framework
**Rationale**: 
- React provides a mature component-based architecture ideal for complex UIs like chat applications
- Vite offers fast development experience and optimized production builds
- Large ecosystem with excellent support for wallet integration (e.g., wagmi, web3-react)
- TypeScript support out of the box for type safety

**Alternatives considered**:
- Vue.js with Vite: Close second but React has better ecosystem for Web3 applications
- Angular: More overhead than needed for this application
- Vanilla TypeScript: Would require building UI framework from scratch

### Backend Framework: Hono
**Decision**: Use Hono as the backend framework
**Rationale**:
- Lightweight and fast, perfect for API services
- Excellent TypeScript support
- Works well with Cloudflare Workers if needed for scaling
- Simple to implement x402 payment protocol integration
- Perfect for handling file upload to Pinata and payment-gated file access

**Alternatives considered**:
- Express.js: More mature but heavier than needed
- Fastify: Good performance but Hono is more modern and lightweight
- Native Web API (Deno): Could work but Hono provides better structure

### Messaging Protocol: XMTP
**Decision**: Use XMTP for decentralized messaging
**Rationale**:
- Purpose-built for decentralized messaging with strong encryption
- Good documentation and examples for group chat functionality
- End-to-end encryption by default
- Supports rich content including metadata for file links
- Compatible with Web3 wallet authentication

### File Storage: IPFS via Pinata
**Decision**: Use IPFS via Pinata for file storage
**Rationale**:
- Decentralized storage aligned with project constitution
- Pinata provides reliable gateway and pinning services
- Handles large files (up to 50MB) efficiently
- CID-based addressing perfect for transmission via XMTP
- Good developer tools and documentation

### Payment Protocol: x402
**Decision**: Use x402 protocol for payment-gated file access
**Rationale**:
- Standard protocol for payment-required resource access
- Enables pay-per-download model
- Can be implemented on our Hono server to gate file access
- Good alignment with decentralized principles
- Supports various payment tokens (ETH and test tokens)

## Architecture Analysis

### Client-Server Interaction
The React client will communicate with the Hono server through a well-defined API contract:
1. Client uploads files to server (server handles Pinata upload)
2. Server returns IPFS CID and payment-gating information
3. Client sends CID via XMTP to group members
4. Recipients access file through server, which checks payment via x402
5. Server tracks payment status and serves file content after successful payment

### Security Considerations
- All cryptographic operations happen client-side as required by the constitution
- API keys for Pinata stored server-side only
- Payment verification handled server-side through x402 protocol
- User private keys never leave the browser wallet
- File content never stored on our servers, only IPFS CIDs transmitted via XMTP

### Performance Considerations
- Files up to 50MB need to be efficiently handled
- CID transmission via XMTP is lightweight
- IPFS provides distributed content delivery
- Client-side caching of payment status prevents repeated checks
- Progressive loading for large files to maintain UI responsiveness

## Implementation Challenges

### Large File Handling
Challenge: Efficiently handling 50MB files in a browser environment
Solution: Use streaming upload/download and proper memory management

### Payment Status Persistence
Challenge: Maintaining payment status across sessions
Solution: Store payment records in browser storage (indexedDB/localStorage) indexed by CID and user wallet

### Group Management
Challenge: Implementing group chat with admin privileges
Solution: Use XMTP conversations with group membership managed via wallet addresses; implement admin controls client-side with server validation

## API Contract Requirements

### Server Endpoints
1. POST /api/upload - Upload file to Pinata via server, returns CID
2. GET /api/file/:cid - x402-gated access to file content
3. POST /api/payment/verify - Verify payment status for a CID

### Client Responsibilities
1. Wallet connection and authentication
2. XMTP client management and message handling
3. UI for chat, file selection, and payment flow
4. Local storage of payment status and user preferences

## Dependencies & Ecosystem

### Frontend Dependencies
- @xmtp/client: For XMTP messaging
- react: For UI components
- viem/wagmi: For wallet integration (or similar libraries)
- axios/fetch: For API communication
- vite: For build tools

### Backend Dependencies
- hono: Web framework
- x402-protocol: For payment protocol implementation
- pinata-sdk: For IPFS pinning service
- @xmtp/message-kit: Potentially for group messaging