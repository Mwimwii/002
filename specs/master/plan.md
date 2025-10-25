# Implementation Plan: Groupee - Core Messaging and Paywalled Sharing

**Branch**: `groupee-core-messaging` | **Date**: 2025-10-24 | **Spec**: [link to spec.md]
**Input**: Feature specification from `/specs/master/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Groupee is a decentralized messaging and paywalled file-sharing application that combines XMTP for secure messaging with IPFS/Pinata for decentralized file storage and x402 for payment gating. The solution consists of a React/Vite frontend client and a Hono server that handles Pinata uploads and x402 payment verification for file access. Users can connect wallets, create group chats with admin privileges, send text messages, and attach files up to 50MB that require payment for access.

## Technical Context

**Language/Version**: TypeScript 5.0+, Node.js 18+ for both client and server  
**Primary Dependencies**: React 19.1.1+, Vite 7.1.11+, @xmtp/browser-sdk (workspace:^), Hono 4.9.1+, x402 0.5.1+, x402-hono 0.4.1+, @coinbase/x402 0.4.2+, Pinata SDK 2.5.0, viem 2.37.6+, wagmi 2.16.9+  
**Storage**: IPFS via Pinata for file storage, XMTP for message storage, localStorage/IndexedDB for payment status persistence  
**Testing**: Vitest, React Testing Library, Playwright for E2E testing  
**Target Platform**: Web application (browser-based) with PWA capabilities  
**Project Type**: Web application (frontend + backend server)  
**Performance Goals**: Messages load within 500ms, files up to 50MB accessible within 15s, app loads under 3s on 3G  
**Constraints**: Client-side crypto operations, no storing of file content on server, wallet-based authentication  
**Scale/Scope**: Initially designed for small to medium groups (under 100 members per group)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Security-First Gate
- [x] End-to-end encryption implemented for all messages and files via XMTP
- [x] Payment integrity enforced through x402 protocol compliance
- [x] File integrity verified with cryptographic hashes before storage on IPFS
- [x] Authentication and authorization implemented at every layer
- [x] All cryptographic operations happen client-side

### Decentralized-First Gate
- [x] XMTP protocol used for messaging infrastructure
- [x] IPFS with Pinata gateway for file storage and distribution
- [x] No single point of failure in core systems
- [x] Off-chain storage for all user data where possible
- [ ] Smart contracts for payment verification when needed *(deferred to Phase 2)*

### UX-Driven Gate
- [x] UI follows familiar interaction patterns from popular messaging apps
- [x] Onboarding process under 2 minutes
- [x] Consistent design language throughout application
- [x] Accessibility standards (WCAG 2.1 AA) compliance verified
- [x] Progressive Web App (PWA) capabilities implemented

### Performance-Driven Gate
- [x] Messages load within 500ms of sending
- [ ] Files load within 2 seconds for sizes under 10MB *(Note: 50MB files have 15s target)*
- [x] Application initial load under 3 seconds on 3G connection
- [x] Image thumbnails available instantly via IPFS pre-caching
- [x] Smooth animations and transitions (60fps) maintained

## Project Structure

### Documentation (this feature)

```text
specs/master/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
server/
├── src/
│   ├── index.ts              # Hono server entry point
│   ├── routes/
│   │   ├── upload.ts         # Pinata file upload endpoint
│   │   └── download.ts       # x402 gated file download endpoint
│   ├── services/
│   │   ├── pinata-service.ts # Pinata IPFS interaction
│   │   └── x402-service.ts   # x402 payment protocol implementation
│   └── middleware/
│       └── auth.ts           # Authentication middleware
└── tests/
    ├── unit/
    └── integration/

client/
├── index.html
├── vite.config.ts
├── package.json
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── GroupChat.tsx    # Main chat interface
│   │   │   ├── Message.tsx      # Individual message component
│   │   │   ├── FileAttachment.tsx # File attachment display
│   │   │   └── PaymentButton.tsx # x402 payment button
│   │   ├── Groups/
│   │   │   ├── GroupList.tsx    # List of user's groups
│   │   │   └── GroupManager.tsx # Group creation and admin functions
│   │   └── Auth/
│   │       └── WalletConnect.tsx # Wallet connection component
│   ├── services/
│   │   ├── xmtp-service.ts      # XMTP client integration
│   │   ├── wallet-service.ts    # Wallet connection and signing
│   │   └── api-service.ts       # Communication with backend server
│   ├── utils/
│   │   ├── crypto.ts           # Client-side crypto operations
│   │   └── storage.ts          # Local storage for payment status
│   ├── types/
│   │   └── index.ts            # Type definitions
│   ├── hooks/
│   │   └── usePaymentStatus.ts # Hook for tracking payment status
│   └── App.tsx                 # Main application component
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

**Structure Decision**: The application is structured as a web application with separate client (React/Vite) and server (Hono) components. The client handles user interface, XMTP messaging, wallet integration, and client-side crypto, while the server handles Pinata uploads and x402 payment verification for file access. This separates concerns while maintaining the decentralized architecture.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Backend server required | x402 payment protocol and Pinata uploads cannot be handled client-side due to security and CORS restrictions | Client-side only would expose API keys and make payment verification impossible |
