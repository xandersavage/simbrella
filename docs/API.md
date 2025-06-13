# API Documentation

## Overview

The Simbrella Vault API is a RESTful service that provides endpoints for managing digital wallet operations. All endpoints are prefixed with `/api`.

## Authentication

All API requests except for /api/auth/login and /api/auth/signup require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /api/auth/signup

Register a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "passwordConfirm": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+2349876545261"
}
```

**Response (201 Created):**

```json
{
  "message": "User registered and logged in successfully!",
  "token": "jwt_token_string",
  "user": {
    "id": "user_id_string",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "phoneNumber": "+2349876545261"
  }
}
```

#### POST /api/auth/login

Authenticate a user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**

```json
{
  "message": "Login successful!",
  "token": "jwt_token_string",
  "user": {
    "id": "user_id_string",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+2349876545261",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-07-11T12:00:00.000Z",
    "updatedAt": "2024-07-11T12:00:00.000Z"
  }
}
```

#### GET /api/auth/me

Get the authenticated user's profile. Requires JWT authentication.

**Response (200 OK):**

```json
{
  "message": "User profile retrieved successfully.",
  "user": {
    "id": "user_id_string",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+2349876545261",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-07-11T12:00:00.000Z",
    "updatedAt": "2024-07-11T12:00:00.000Z"
  }
}
```

### Wallet Operations

#### POST /api/wallets

Create a new user wallet. Requires JWT authentication.

**Request Body:**

```json
{
  "name": "Personal Savings",
  "type": "PERSONAL",
  "currency": "NGN"
}
```

**Response (201 Created):**

```json
{
  "message": "Wallet created successfully!",
  "wallet": {
    "id": "wallet_id_string",
    "name": "Personal Savings",
    "type": "PERSONAL",
    "balance": "0.00",
    "currency": "NGN",
    "isActive": true,
    "createdAt": "2024-07-11T12:00:00.000Z"
  }
}
```

#### GET /api/wallets

Get all wallets for the authenticated user. Requires JWT authentication.

**Response (200 OK):**

```json
{
  "message": "User wallets retrieved successfully.",
  "wallets": [
    {
      "id": "wallet_id_1",
      "name": "Personal Wallet",
      "type": "PERSONAL",
      "balance": "15000.00",
      "currency": "NGN",
      "isActive": true,
      "userId": "user_id_string",
      "serviceId": null,
      "createdAt": "2024-07-11T12:00:00.000Z",
      "updatedAt": "2024-07-11T12:00:00.000Z"
    },
    {
      "id": "wallet_id_2",
      "name": "Business Account",
      "type": "BUSINESS",
      "balance": "5000.00",
      "currency": "NGN",
      "isActive": true,
      "userId": "user_id_string",
      "serviceId": null,
      "createdAt": "2024-07-11T12:01:00.000Z",
      "updatedAt": "2024-07-11T12:01:00.000Z"
    }
  ]
}
```

#### POST /api/wallets/transfer

Transfer funds between two wallets. Requires JWT authentication.

**Request Body:**

```json
{
  "fromWalletId": "sender_wallet_id",
  "toWalletId": "recipient_wallet_id",
  "amount": 100.0
}
```

**Response (200 OK):**

```json
{
  "message": "Money transfer successful!",
  "data": {
    "fromWalletId": "sender_wallet_id",
    "toWalletId": "recipient_wallet_id",
    "amount": 100.0,
    "userId": "user_id_string"
  }
}
```

#### POST /api/wallets/fund

Fund a user's wallet from an external source. Requires JWT authentication.

**Request Body:**

```json
{
  "walletId": "target_wallet_id",
  "amount": 5000.0,
  "externalReference": "EXT_REF_12345"
}
```

**Response (200 OK):**

```json
{
  "message": "Wallet funded successfully!",
  "transaction": {
    "id": "transaction_id_string",
    "reference": "EXT_REF_12345",
    "amount": 5000,
    "type": "WALLET_FUNDING",
    "status": "COMPLETED",
    "toWalletId": "target_wallet_id"
  }
}
```

#### POST /api/wallets/pay-service

Process a payment from a user's wallet to a service. Requires JWT authentication.

**Request Body:**

```json
{
  "fromWalletId": "user_wallet_id",
  "serviceId": "service_id_string",
  "amount": 25.99,
  "serviceSpecificDetails": {
    "phoneNumber": "2348012345678",
    "bundle": "1GB"
  }
}
```

**Response (200 OK):**

```json
{
  "message": "Service payment processed successfully!",
  "transaction": {
    "id": "transaction_id_string",
    "reference": "TRX-16789012345-67890",
    "amount": 25.99,
    "type": "SERVICE_PAYMENT",
    "status": "COMPLETED"
  }
}
```

### Transaction History

#### GET /api/transactions

Get transaction history for the authenticated user. Requires JWT authentication.

**Response (200 OK):**

```json
{
  "message": "Transaction history retrieved successfully.",
  "transactions": [
    {
      "id": "tx_123",
      "type": "WALLET_FUNDING",
      "amount": "500.00",
      "description": "Wallet funding from external source (Ref: EXT_REF_XYZ)",
      "reference": "EXT_REF_XYZ",
      "status": "COMPLETED",
      "fromWalletId": null,
      "toWalletId": "wallet_id_1",
      "serviceType": null,
      "serviceProvider": null,
      "createdAt": "2024-07-11T10:00:00.000Z",
      "fromWallet": null,
      "toWallet": {
        "name": "Personal Wallet",
        "type": "PERSONAL",
        "currency": "NGN"
      }
    },
    {
      "id": "tx_124",
      "type": "WALLET_TRANSFER",
      "amount": "100.00",
      "description": null,
      "reference": "TRX-16789012345-67890",
      "status": "COMPLETED",
      "fromWalletId": "wallet_id_1",
      "toWalletId": "wallet_id_2",
      "serviceType": null,
      "serviceProvider": null,
      "createdAt": "2024-07-11T10:05:00.000Z",
      "fromWallet": {
        "name": "Personal Wallet",
        "type": "PERSONAL",
        "currency": "NGN"
      },
      "toWallet": {
        "name": "Business Account",
        "type": "BUSINESS",
        "currency": "NGN"
      }
    }
  ]
}
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "message": "Human readable error message",
  "error": "Optional detailed error string"
}
```

Common HTTP status codes and example messages:

- `400 Bad Request`: Returned for invalid input, missing required fields, or business logic validation failures (e.g., "Email and password are required.", "Invalid wallet type. Must be PERSONAL, BUSINESS, or SAVINGS.", "Transfer amount must be greater than zero.", "Insufficient balance in sender's wallet.", "Service not found.").

- `401 Unauthorized`: Returned for failed authentication (e.g., "Authentication failed: No token provided or malformed header.", "Authentication failed: Token has expired.", "Invalid email or password.").

- `403 Forbidden`: Returned when an authenticated user does not have permission to perform an action (e.g., "Access forbidden: Insufficient permissions.").

- `404 Not Found`: Returned when a requested resource does not exist (e.g., "Service not found.").

- `500 Internal Server Error`: Returned for unexpected server-side errors (e.g., "An unexpected internal server error occurred during login.").

## Rate Limiting

API requests are rate-limited to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1616234400
```
