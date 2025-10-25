---
description: "Task list for Groupee - Core Messaging and Paywalled Sharing implementation"
---

# Tasks: Groupee - Core Messaging and Paywalled Sharing

**Input**: Design documents from `/specs/master/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/
**Tests**: No tests requested explicitly, follow user story priorities for test inclusion.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `client/src/`, `server/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure for client and server directories per plan
- [ ] T002 [P] Initialize client project with React 19.1.1+, Vite 7.1.11+, TypeScript, @xmtp/browser-sdk
- [ ] T003 [P] Initialize server project with Hono 4.9.1+, x402 0.5.1+, x402-hono 0.4.1+, @coinbase/x402 0.4.2+, Pinata SDK 2.5.0, TypeScript
- [ ] T004 [P] Configure linting and formatting tools for both client and server
- [ ] T005 [P] Set up shared types for communication between client and server

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 [P] Setup XMTP client integration in client/src/services/xmtp-service.ts using @xmtp/browser-sdk
- [ ] T007 [P] Setup wallet connection service in client/src/services/wallet-service.ts using wagmi 2.16.9+, viem 2.37.6+
- [ ] T008 Setup Hono server with basic routing and CORS in server/src/index.ts using hono 4.9.1+
- [ ] T009 [P] Configure x402 payment middleware based on pinata-x402-server-example in server/src/utils/middleware.ts using x402-hono 0.4.1+
- [ ] T010 Create User entity/model based on data-model in client/src/types/index.ts
- [ ] T011 [P] Setup Pinata SDK integration in server/src/services/pinata-service.ts using pinata 2.5.0+
- [ ] T012 [P] Configure dynamic payment pricing for file uploads in server/src/utils/middleware.ts
- [ ] T013 [P] Setup authentication middleware in server/src/middleware/auth.ts
- [ ] T014 Setup server types based on pinata-x402-server-example in server/src/utils/types.ts
- [ ] T015 [P] Setup API service for client-server communication in client/src/services/api-service.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Wallet Connection and Authentication (Priority: P1) 🎯 MVP

**Goal**: User connects their cryptocurrency wallet to authenticate with the Groupee application and access features.

**Independent Test**: User can successfully connect their wallet, authenticate, and see their profile in the application.

### Implementation for User Story 1
- [ ] T016 [P] [US1] Create WalletConnect component in client/src/components/Auth/WalletConnect.tsx
- [ ] T017 [P] [US1] Implement wallet connection functionality using wagmi in client/src/services/wallet-service.ts
- [ ] T018 [P] [US1] Create useWallet hook in client/src/hooks/useWallet.ts
- [ ] T019 [US1] Create wallet context in client/src/contexts/WalletContext.tsx
- [ ] T020 [US1] Add wallet connection button to App header in client/src/components/App/AppHeader.tsx
- [ ] T021 [US1] Add wallet authentication UI feedback in client/src/components/App/ConnectWallet.tsx
- [ ] T022 [US1] Implement wallet signature verification for authentication using the data from spec.md

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Group Creation and Management (Priority: P1)

**Goal**: User creates and manages group chats with other wallet addresses, with automatic admin privileges upon creation.

**Independent Test**: User can create a new group (becoming admin), add members, remove members, and send a basic text message to the group.

### Implementation for User Story 2
- [ ] T023 [P] [US2] Create Group entity in client/src/types/index.ts according to data model
- [ ] T024 [P] [US2] Create GroupService in client/src/services/group-service.ts
- [ ] T025 [US2] Create GroupManager component in client/src/components/Groups/GroupManager.tsx
- [ ] T026 [US2] Create GroupList component in client/src/components/Groups/GroupList.tsx
- [ ] T027 [US2] Implement group creation functionality with admin privileges per data model
- [ ] T028 [US2] Implement member removal functionality for group admins
- [ ] T029 [US2] Create group creation API endpoint in server/src/routes/groups.ts
- [ ] T030 [US2] Create group member removal API endpoint in server/src/routes/groups.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Text Messaging via XMTP (Priority: P1)

**Goal**: Users in a group can send and receive basic text messages using XMTP protocol.

**Independent Test**: User can send a text message via XMTP and other group members can receive it.

### Implementation for User Story 3
- [ ] T031 [P] [US3] Create Message entity in client/src/types/index.ts according to data model
- [ ] T032 [P] [US3] Create Message component in client/src/components/Chat/Message.tsx
- [ ] T033 [US3] Create GroupChat component in client/src/components/Chat/GroupChat.tsx
- [ ] T034 [US3] Implement XMTP message sending functionality in client/src/services/xmtp-service.ts
- [ ] T035 [US3] Implement XMTP message receiving functionality in client/src/services/xmtp-service.ts
- [ ] T036 [US3] Create Composer component for message input in client/src/components/Chat/Composer.tsx
- [ ] T037 [US3] Implement basic text messaging UI in client/src/components/Chat/GroupChat.tsx

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - File Attachment with Payment Gate (Priority: P2)

**Goal**: User attaches a file to a message and sets a payment price; other users must pay to access the file content stored on IPFS via Pinata.

**Independent Test**: User can attach a file (up to 50MB), set a price, upload to IPFS via Pinata, and other users see a payment prompt to access the file.

### Implementation for User Story 4
- [ ] T038 [P] [US4] Create FileAttachment entity in client/src/types/index.ts according to data model
- [ ] T039 [P] [US4] Create FileAttachment component in client/src/components/Chat/FileAttachment.tsx
- [ ] T040 [P] [US4] Create upload endpoint in server/src/routes/upload.ts based on contracts/api-contracts.md
- [ ] T041 [US4] Implement file upload to Pinata via server with payment setting in server/src/services/pinata-service.ts
- [ ] T042 [US4] Update XMTP message to include CID instead of file content per requirement FR-010
- [ ] T043 [US4] Create UI for file attachment with price setting in client/src/components/Chat/Composer.tsx
- [ ] T044 [US4] Implement payment prompt display in client/src/components/Chat/FileAttachment.tsx
- [ ] T045 [US4] Implement file upload API endpoint with x402 integration in server/src/routes/upload.ts

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---

## Phase 7: User Story 5 - Payment Processing and Access Control (Priority: P2)

**Goal**: System processes x402 payments and grants appropriate file access based on payment status, with persistent download access.

**Independent Test**: User pays for a file once, download button appears, and can access it multiple times without paying again across sessions.

### Implementation for User Story 5
- [ ] T046 [P] [US5] Create PaymentRecord entity in client/src/types/index.ts according to data model
- [ ] T047 [P] [US5] Create download/retrieve endpoint with x402 payment gate in server/src/routes/download.ts based on contracts/api-contracts.md
- [ ] T048 [P] [US5] Implement file access verification using x402 payment validation in server/src/services/x402-service.ts
- [ ] T049 [US5] Create PaymentButton component in client/src/components/Chat/PaymentButton.tsx
- [ ] T050 [US5] Implement persistent payment status using localStorage/IndexedDB per technical context
- [ ] T051 [US5] Create usePaymentStatus hook in client/src/hooks/usePaymentStatus.ts
- [ ] T052 [US5] Replace payment prompts with download buttons after successful payment as per requirement FR-013
- [ ] T053 [US5] Implement payment status tracking in client/src/services/api-service.ts
- [ ] T054 [US5] Implement payment verification endpoint in server/src/routes/payment.ts
- [ ] T055 [US5] Implement payment initiation functionality in server/src/routes/payment.ts

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T056 [P] Documentation updates in docs/
- [ ] T057 Code cleanup and refactoring
- [ ] T058 Performance optimization across all stories to meet 500ms message load and 15s file load requirements
- [ ] T059 [P] Additional unit tests in client/tests/unit/ and server/tests/unit/
- [ ] T060 Security hardening: verify all data is encrypted end-to-end and all cryptographic operations happen client-side
- [ ] T061 Run quickstart.md validation
- [ ] T062 Validate all data stored on IPFS instead of centralized servers
- [ ] T063 Confirm all messaging uses XMTP protocol for decentralization
- [ ] T064 Verify payment processing through x402 protocol
- [ ] T065 Add PWA capabilities for offline functionality per technical context
- [ ] T066 Implement accessibility features per WCAG 2.1 AA standards
- [ ] T067 Add proper error handling throughout the application
- [ ] T068 Implement proper logging for debug and monitoring
- [ ] T069 Add rate limiting to prevent abuse of upload/download endpoints

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (US1 → US2 → US3 → US4 → US5)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Within Each User Story

- Models before services
- Services before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories must proceed in priority order
  - Within each user story, tasks marked [P] can run in parallel
- Different user stories cannot run in parallel due to dependencies

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Wallet Connection)
4. Complete Phase 4: User Story 2 (Group Creation)
5. Complete Phase 5: User Story 3 (Text Messaging)
6. **STOP and VALIDATE**: Test basic chat functionality independently
7. Deploy/demo if ready

### Incremental Delivery

1. User Stories 1-3 → Basic group messaging (MVP!)
2. Add User Story 4 → File sharing with payment prompts
3. Add User Story 5 → Payment processing and persistent access
4. Each story adds value without breaking previous stories

### Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create WalletConnect component in client/src/components/Auth/WalletConnect.tsx"
Task: "Implement wallet connection functionality using wagmi in client/src/services/wallet-service.ts"
Task: "Create useWallet hook in client/src/hooks/useWallet.ts"
```

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence