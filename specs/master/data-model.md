# Groupee Data Model

## Overview
This document defines the data models for the Groupee application based on the entities identified in the feature specification.

## Core Entities

### User
**Description**: Represents a user who connects via cryptocurrency wallet
- **walletAddress** (string): The user's wallet address (primary identifier)
- **profileInfo** (object): Optional profile information
  - displayName (string)
  - avatarURL (string)
- **paymentHistory** (array): List of payment records for the user

**Relationships**:
- One-to-many with Group (as admin or member)
- One-to-many with Message (as sender)
- One-to-many with PaymentRecord (as payer)

### Group
**Description**: A group chat entity with admin privileges
- **id** (string): Unique identifier for the group
- **name** (string): Display name for the group
- **creator** (string): Wallet address of the group creator (admin)
- **members** (array): List of wallet addresses of group members
- **createdAt** (Date): Timestamp of group creation
- **permissions** (object): Role-based permissions

**Relationships**:
- Many-to-one with User (creator/admin)
- One-to-many with Message (group messages)

### Message
**Description**: A message sent in a group chat
- **id** (string): Unique identifier for the message
- **sender** (string): Wallet address of the sender
- **groupId** (string): ID of the group where the message was sent
- **content** (string): Text content of the message
- **timestamp** (Date): When the message was sent
- **type** (enum): 'text' | 'file'
- **fileAttachment** (object, optional): If type is 'file'
  - cid (string): IPFS Content Identifier
  - filename (string): Original filename
  - size (number): File size in bytes
  - price (number): Required payment amount
  - tokenType (string): Token type for payment (e.g., 'ETH', 'test')

**Relationships**:
- Many-to-one with User (sender)
- Many-to-one with Group (recipient group)

### FileAttachment
**Description**: Metadata for files shared via IPFS
- **cid** (string): IPFS Content Identifier (primary identifier)
- **filename** (string): Original filename
- **size** (number): File size in bytes
- **mimeType** (string): MIME type of the file
- **uploadTimestamp** (Date): When the file was uploaded to IPFS
- **uploader** (string): Wallet address of the user who uploaded
- **price** (number): Required payment amount
- **tokenType** (string): Token type for payment
- **pinataGatewayURL** (string): Gateway URL for accessing the file

**Relationships**:
- Many-to-one with User (uploader)
- One-to-many with PaymentRecord (as the resource being paid for)

### PaymentRecord
**Description**: Record of payments made for file access
- **id** (string): Unique identifier for the payment record
- **payer** (string): Wallet address of the user who made payment
- **fileId** (string): CID of the file that was paid for
- **amount** (number): Amount paid
- **tokenType** (string): Token type used for payment
- **transactionHash** (string): Blockchain transaction hash
- **paymentTimestamp** (Date): When the payment was made
- **paymentStatus** (enum): 'pending' | 'confirmed' | 'failed'

**Relationships**:
- Many-to-one with User (payer)
- Many-to-one with FileAttachment (paid resource)

## State Transitions

### PaymentRecord States
```
'pending' → 'confirmed' (after successful blockchain transaction)
'pending' → 'failed' (after failed blockchain transaction)
```

### Group Membership States
```
'user invited' → 'user joined' → 'user active' (standard membership)
'user active' → 'user removed' (by admin)
```

## Validation Rules

### User Validation
- walletAddress must be a valid blockchain address format
- displayName (if provided) must be 3-50 characters
- profile information is optional

### Group Validation
- Group name must be 3-100 characters
- Creator must be the initial admin
- Max 100 members per group (for Phase 1)

### Message Validation
- Content must be 1-10000 characters for text messages
- Type must be either 'text' or 'file'
- If type is 'file', fileAttachment must be provided

### FileAttachment Validation
- CID must be a valid IPFS content identifier
- Filename must be 1-255 characters
- Size must be 1-52428800 bytes (1 byte to 50MB)
- Price must be a non-negative number
- MimeType must be a valid format

### PaymentRecord Validation
- Payer must be a valid wallet address
- Amount must be positive
- Payment status must be one of the defined enum values
- Transaction hash must be provided after payment confirmation

## Indexes & Optimizations

### Required Indexes
- User.walletAddress (primary)
- Group.id (primary) + Group.members[] (lookup)
- Message.groupId + Message.timestamp (chronological lookup)
- FileAttachment.cid (primary + lookup)
- PaymentRecord.payer + PaymentRecord.fileId (payment status lookup)

## Data Flow Patterns

### New File Sharing Flow
1. User selects file and sets price
2. File uploaded to Pinata via backend service
3. CID returned and stored in Message.fileAttachment
4. Message with CID sent via XMTP to group
5. Other users see payment request for the file
6. After payment, user gets access to download file from IPFS

### Payment Status Tracking
1. User pays for file access via x402 flow
2. PaymentRecord created with transaction details
3. Client stores payment confirmation locally
4. When user returns to chat, local storage checked first
5. If payment exists locally, download button displayed
6. For new sessions, client can verify payment status if needed