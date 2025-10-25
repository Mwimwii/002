# Groupee API Contracts

## Overview
This document defines the API contracts between the React/Vite frontend client and the Hono backend server for the Groupee application.

## Base URL
All API endpoints are prefixed with `/api` and served from the backend server.

## Authentication
Most endpoints require wallet authentication. The client must include:
- `X-Wallet-Address`: The user's wallet address
- `X-Signature`: Signature of a challenge message signed by the user's wallet

## Endpoints

### File Upload
**POST** `/api/upload`

Upload a file to Pinata and receive back the IPFS CID.

#### Request
- **Headers**:
  - `X-Wallet-Address`: User wallet address (required)
  - `X-Signature`: Wallet-signed challenge (required)
  - `Content-Type`: `multipart/form-data`
- **Body** (form-data):
  - `file`: The file to upload (max 50MB)
  - `price`: Payment amount required (number)
  - `tokenType`: Token type for payment (string, default: "ETH")

#### Response
- **Success** (200):
```json
{
  "success": true,
  "cid": "QmX123456789...",
  "filename": "document.pdf",
  "size": 1048576,
  "gatewayUrl": "https://gateway.pinata.cloud/ipfs/QmX123456789...",
  "price": 0.01,
  "tokenType": "ETH"
}
```

- **Error** (400, 401, 413, 500):
```json
{
  "success": false,
  "error": "Error message"
}
```

### File Download (x402 Gated)
**GET** `/api/file/{cid}`

Download a file from IPFS through the payment-gated endpoint.

#### Request
- **Headers**:
  - `X-Wallet-Address`: User wallet address (required)
  - `X-Signature`: Wallet-signed challenge (required)
- **Path Parameters**:
  - `cid`: The IPFS Content Identifier for the file

#### Response
- **Success with Payment Required** (402 - Payment Required):
```json
{
  "success": false,
  "error": "Payment required",
  "paymentRequired": true,
  "amount": "0.01",
  "tokenType": "ETH",
  "paymentEndpoint": "/api/payment/initiate",
  "paymentId": "pay_123456789"
}
```

- **Success - File Stream** (200):
  - Response contains the file data as a stream
  - Content-Type matches file's MIME type
  - Content-Disposition: attachment with filename

- **Error** (401, 404, 500):
```json
{
  "success": false,
  "error": "Error message"
}
```

### Payment Initiation
**POST** `/api/payment/initiate`

Initiate the x402 payment process for a file.

#### Request
- **Headers**:
  - `X-Wallet-Address`: User wallet address (required)
  - `X-Signature`: Wallet-signed challenge (required)
- **Body** (JSON):
```json
{
  "cid": "QmX123456789...",
  "amount": 0.01,
  "tokenType": "ETH"
}
```

#### Response
- **Success** (200):
```json
{
  "success": true,
  "paymentUrl": "x402://payment?...",
  "paymentId": "pay_123456789",
  "expiresAt": "2023-12-31T23:59:59Z"
}
```

- **Error** (400, 401, 404, 500):
```json
{
  "success": false,
  "error": "Error message"
}
```

### Payment Verification
**POST** `/api/payment/verify`

Verify if a user has paid for a specific file.

#### Request
- **Headers**:
  - `X-Wallet-Address`: User wallet address (required)
  - `X-Signature`: Wallet-signed challenge (required)
- **Body** (JSON):
```json
{
  "cid": "QmX123456789..."
}
```

#### Response
- **Success** (200):
```json
{
  "success": true,
  "hasPaid": true,
  "paymentRecordId": "rec_987654321",
  "paymentTimestamp": "2023-12-01T10:30:00Z"
}
```

- **Success - Not Paid** (200):
```json
{
  "success": true,
  "hasPaid": false
}
```

- **Error** (400, 401, 404, 500):
```json
{
  "success": false,
  "error": "Error message"
}
```

### Group Management
**POST** `/api/groups`

Create a new group chat.

#### Request
- **Headers**:
  - `X-Wallet-Address`: User wallet address (required)
  - `X-Signature`: Wallet-signed challenge (required)
- **Body** (JSON):
```json
{
  "name": "My New Group",
  "members": ["0x123...", "0x456...", "0x789..."]
}
```

#### Response
- **Success** (200):
```json
{
  "success": true,
  "groupId": "grp_123456789",
  "name": "My New Group",
  "creator": "0x123...",
  "members": ["0x123...", "0x456...", "0x789..."],
  "createdAt": "2023-12-01T10:00:00Z"
}
```

- **Error** (400, 401, 500):
```json
{
  "success": false,
  "error": "Error message"
}
```

**DELETE** `/api/groups/{groupId}/members/{walletAddress}`

Remove a member from a group (admin only).

#### Request
- **Headers**:
  - `X-Wallet-Address`: Admin's wallet address (required)
  - `X-Signature`: Wallet-signed challenge (required)
- **Path Parameters**:
  - `groupId`: The group ID
  - `walletAddress`: The wallet address of the member to remove

#### Response
- **Success** (200):
```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

- **Error** (400, 401, 403, 404, 500):
```json
{
  "success": false,
  "error": "Error message"
}
```

## Error Codes
- `400`: Bad Request - Invalid request parameters or body
- `401`: Unauthorized - Invalid or missing authentication
- `402`: Payment Required - Payment needed for resource access
- `403`: Forbidden - User doesn't have required permissions
- `404`: Not Found - Requested resource doesn't exist
- `413`: Payload Too Large - File exceeds size limits
- `500`: Internal Server Error - Server-side error occurred

## Security Notes
- All file uploads go through the backend to prevent direct access to Pinata API keys
- Payment verification happens server-side to prevent client-side manipulation
- Wallet authentication required for all sensitive operations
- File content is streamed directly from IPFS through the backend for payment verification