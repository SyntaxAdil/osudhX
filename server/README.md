# OSUDHX API Reference

**Base URL (production):** `[https://osudhx-server.vercel.app]`
**Base URL (local):** `http://localhost:5000/api`
**Repository:** [github.com/SyntaxAdil/osudhx/server](https://github.com/SyntaxAdil/osudhx/server)
**Version:** `v1` (unversioned path prefix — all routes under `/api`)

This document is the API reference for the OSUDHX backend. It is written for engineers integrating against the API (the OSUDHX frontend, Postman, or any third-party client) and reflects the **planned/specified contract** of the system as defined in the project's system design.

---

## Table of Contents

1. [Conventions](#conventions)
2. [Authentication](#authentication)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Pagination & Filtering](#pagination--filtering)
6. [Endpoints](#endpoints)
   - [Auth](#auth)
   - [Users](#users)
   - [Categories](#categories)
   - [Products](#products)
   - [Orders](#orders)
   - [Reviews](#reviews)
   - [Wishlist](#wishlist)
7. [Data Models](#data-models)
8. [Enums](#enums)
9. [Status Code Reference](#status-code-reference)
10. [Changelog](#changelog)

---

## Conventions

- All request and response bodies are `application/json`.
- All timestamps are ISO 8601 UTC strings (`createdAt`, `updatedAt`).
- All IDs are strings (Prisma CUID/UUID).
- Monetary values (`price`, `totalAmount`, `priceAtPurchase`) are decimal numbers in the system's base currency unit.
- Endpoints marked 🔒 require a valid JWT. Endpoints marked with a role (e.g. `Admin`) additionally require that role.
- Soft-deleted records are excluded from all `GET` list/detail responses by default.

---

## Authentication

OSUDHX uses stateless **JWT Bearer authentication**.

1. Obtain a token via `POST /api/auth/login`.
2. Send it on every subsequent authenticated request:

```http
Authorization: Bearer <token>
```

3. Tokens are verified and decoded by an authentication middleware before any protected route handler runs. Invalid or expired tokens return `401 Unauthorized`.
4. Role checks run after authentication via an authorization middleware. Insufficient role returns `403 Forbidden`.

---

## Response Format

Every response — success or error — follows the same envelope.

**Success**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "Product not found",
  "error": {}
}
```

`data` and `error` may be an object, array, or `null` depending on the endpoint. Clients should branch on `success`, not on HTTP status code alone, though status codes remain semantically correct (see [Status Code Reference](#status-code-reference)).

---

## Error Handling

All errors are funneled through a centralized Express error-handling middleware, so error shape is consistent regardless of where in the request lifecycle the failure occurred (validation, auth, database, or unexpected exceptions).

Typical error payload:

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "field": "email",
    "issue": "must be a valid email address"
  }
}
```

---

## Pagination & Filtering

List endpoints (`GET /api/products`, `GET /api/reviews`, etc.) support query-string filtering where noted per endpoint. Standard query parameters used across list endpoints:

| Parameter | Type | Description |
|---|---|---|
| `page` | number | Page number (1-indexed) |
| `limit` | number | Items per page |
| `search` | string | Free-text search (where supported) |
| `sortBy` | string | Field to sort by |
| `sortOrder` | `asc` \| `desc` | Sort direction |

---

## Endpoints

### Auth

#### `POST /api/auth/register`
Register a new account.

**Auth:** None

**Request body**
```json
{
  "name": "Ayesha Rahman",
  "email": "ayesha@example.com",
  "password": "StrongPassword123",
  "role": "CUSTOMER"
}
```

**Success — `201 Created`**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "usr_01h...",
    "name": "Ayesha Rahman",
    "email": "ayesha@example.com",
    "role": "CUSTOMER",
    "createdAt": "2026-08-10T09:15:00.000Z"
  }
}
```

**Errors:** `400` invalid input · `409` email already registered

---

#### `POST /api/auth/login`
Authenticate and receive a JWT.

**Auth:** None

**Request body**
```json
{
  "email": "ayesha@example.com",
  "password": "StrongPassword123"
}
```

**Success — `200 OK`**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "usr_01h...",
      "name": "Ayesha Rahman",
      "role": "CUSTOMER"
    }
  }
}
```

**Errors:** `400` invalid input · `401` invalid credentials

---

### Users

#### `POST /api/users` 🔒 `Admin`
Create a user directly (admin-managed account creation).

**Request body**
```json
{ "name": "New Pharmacist", "email": "pharm@example.com", "password": "TempPass123", "role": "PHARMACIST" }
```

**Success — `201 Created`** → user object (see [Data Models](#data-models))

---

#### `GET /api/users` 🔒 `Admin`
List all users.

**Query params:** `page`, `limit`, `search`

**Success — `200 OK`** → array of user objects

---

#### `GET /api/users/:id` 🔒 `Admin or Self`
Retrieve a single user.

**Success — `200 OK`** → user object
**Errors:** `403` accessing another user's record without Admin role · `404` not found

---

#### `PATCH /api/users/:id` 🔒 `Admin or Self`
Update a user's profile.

**Request body (partial)**
```json
{ "name": "Ayesha R. Khan" }
```

**Success — `200 OK`** → updated user object

---

#### `DELETE /api/users/:id` 🔒 `Admin`
Soft delete a user (`isDeleted = true`).

**Success — `200 OK`**
```json
{ "success": true, "message": "User deleted successfully", "data": null }
```

---

### Categories

#### `POST /api/categories` 🔒 `Pharmacist / Admin`
```json
{ "name": "Pain Relief", "description": "Analgesics and anti-inflammatory medicines" }
```
**Success — `201 Created`** → category object

#### `GET /api/categories`
**Auth:** None · **Success — `200 OK`** → array of category objects

#### `GET /api/categories/:id`
**Auth:** None · **Success — `200 OK`** → category object · **Errors:** `404`

#### `PATCH /api/categories/:id` 🔒 `Pharmacist / Admin`
Partial update. **Success — `200 OK`** → updated category object

#### `DELETE /api/categories/:id` 🔒 `Pharmacist / Admin`
Soft delete. **Success — `200 OK`**

---

### Products

#### `POST /api/products` 🔒 `Pharmacist / Admin`
```json
{
  "name": "Paracetamol 500mg",
  "description": "Pain and fever relief tablets",
  "price": 2.50,
  "stock": 500,
  "brand": "Square Pharmaceuticals",
  "genericName": "Paracetamol",
  "expiryDate": "2027-06-30",
  "status": "ACTIVE",
  "categoryId": "cat_01h..."
}
```
**Success — `201 Created`** → product object
**Errors:** `400`, `404` (invalid `categoryId`), `422`

#### `GET /api/products`
**Auth:** None
**Query params:** `search`, `categoryId`, `status`, `page`, `limit`, `sortBy`, `sortOrder`
**Success — `200 OK`** → paginated array of product objects

#### `GET /api/products/:id`
**Auth:** None · **Success — `200 OK`** → product object · **Errors:** `404`

#### `PATCH /api/products/:id` 🔒 `Pharmacist / Admin`
Partial update, including stock adjustments. **Success — `200 OK`**

#### `DELETE /api/products/:id` 🔒 `Pharmacist / Admin`
Soft delete. **Success — `200 OK`**

---

### Orders

#### `POST /api/orders` 🔒 `Customer`
Creates an order and validates stock for every line item before committing (see [Stock-Aware Ordering](#special-note-stock-aware-ordering)).

**Request body**
```json
{
  "items": [
    { "productId": "prd_01h...", "quantity": 2 },
    { "productId": "prd_02h...", "quantity": 1 }
  ]
}
```

**Success — `201 Created`**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "ord_01h...",
    "userId": "usr_01h...",
    "status": "PENDING",
    "totalAmount": 7.50,
    "items": [
      { "productId": "prd_01h...", "quantity": 2, "priceAtPurchase": 2.50 },
      { "productId": "prd_02h...", "quantity": 1, "priceAtPurchase": 2.50 }
    ],
    "createdAt": "2026-08-10T09:20:00.000Z"
  }
}
```

**Errors:** `400` invalid items · `404` product not found · `409` insufficient stock

#### `GET /api/orders` 🔒 `Admin / Pharmacist`
**Query params:** `status`, `page`, `limit`
**Success — `200 OK`** → array of order objects

#### `GET /api/orders/:id` 🔒 `Owner / Admin / Pharmacist`
**Success — `200 OK`** → order object with nested items

#### `GET /api/orders/customer/:customerId` 🔒 `Owner / Admin`
**Success — `200 OK`** → array of that customer's orders

#### `PATCH /api/orders/:id` 🔒 `Pharmacist / Admin`
Update order status.
```json
{ "status": "CONFIRMED" }
```
**Success — `200 OK`** → updated order object
**Errors:** `400` invalid status transition

#### `DELETE /api/orders/:id` 🔒 `Admin`
Soft delete. **Success — `200 OK`**

---

### Reviews

#### `POST /api/reviews` 🔒 `Customer`
```json
{ "productId": "prd_01h...", "rating": 5, "comment": "Worked quickly, good packaging." }
```
**Success — `201 Created`** → review object

#### `GET /api/reviews`
**Auth:** None · **Query params:** `productId`, `page`, `limit`
**Success — `200 OK`** → array of review objects

#### `GET /api/reviews/:id`
**Auth:** None · **Success — `200 OK`** → review object

#### `PATCH /api/reviews/:id` 🔒 `Owner / Admin`
**Success — `200 OK`** → updated review object
**Errors:** `403` non-owner, non-admin attempts edit

#### `DELETE /api/reviews/:id` 🔒 `Owner / Admin`
Soft delete. **Success — `200 OK`**

---

### Wishlist

#### `POST /api/wishlist` 🔒 `Customer`
```json
{ "productId": "prd_01h..." }
```
**Success — `201 Created`** → wishlist item object
**Errors:** `409` product already in wishlist

#### `GET /api/wishlist` 🔒 `Customer`
**Success — `200 OK`** → array of the current user's wishlist items (with product data)

#### `DELETE /api/wishlist/:id` 🔒 `Owner`
Remove an item from the wishlist. **Success — `200 OK`**

---

## Special Note — Stock-Aware Ordering

```text
Order Created
    ↓
Check Product Stock
    ↓
Enough Stock?
   /       \
 Yes       No
  ↓          ↓
Create     409 Conflict
Order      "Insufficient stock"
  ↓
Decrease Stock
```

Each order item's price is captured at creation time into `priceAtPurchase`, independent of later changes to `Product.price`.

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key |
| `name` | string | |
| `email` | string | Unique |
| `password` | string | Hashed (bcrypt); never returned in responses |
| `role` | `UserRole` | `ADMIN` \| `PHARMACIST` \| `CUSTOMER` |
| `isDeleted` | boolean | Soft delete flag |
| `createdAt` / `updatedAt` | datetime | |

### Category
| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key |
| `name` | string | |
| `description` | string | |
| `isDeleted` | boolean | |
| `createdAt` / `updatedAt` | datetime | |

### Product
| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key |
| `name` | string | |
| `description` | string | |
| `price` | decimal | |
| `stock` | integer | |
| `brand` | string | |
| `genericName` | string | |
| `expiryDate` | date | |
| `status` | `ProductStatus` | `ACTIVE` \| `INACTIVE` |
| `categoryId` | string | Foreign key → Category |
| `isDeleted` | boolean | |
| `createdAt` / `updatedAt` | datetime | |

### Order
| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key |
| `userId` | string | Foreign key → User |
| `totalAmount` | decimal | Sum of item subtotals |
| `status` | `OrderStatus` | See [Enums](#enums) |
| `isDeleted` | boolean | |
| `createdAt` / `updatedAt` | datetime | |

### OrderItem
| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key |
| `orderId` | string | Foreign key → Order |
| `productId` | string | Foreign key → Product |
| `quantity` | integer | |
| `priceAtPurchase` | decimal | Price snapshot at order time |

### Review
| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key |
| `userId` | string | Foreign key → User |
| `productId` | string | Foreign key → Product |
| `rating` | integer | 1–5 |
| `comment` | string | |
| `isDeleted` | boolean | |
| `createdAt` / `updatedAt` | datetime | |

### Wishlist
| Field | Type | Notes |
|---|---|---|
| `id` | string | Primary key |
| `userId` | string | Foreign key → User |
| `productId` | string | Foreign key → Product |
| `createdAt` | datetime | |

---

## Enums

```text
UserRole:      ADMIN | PHARMACIST | CUSTOMER
ProductStatus: ACTIVE | INACTIVE
OrderStatus:   PENDING | CONFIRMED | PROCESSING | DELIVERED | CANCELLED
```

---

## Status Code Reference

| Code | Meaning | When |
|---|---|---|
| `200` | OK | Successful GET / PATCH / DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Malformed body/params |
| `401` | Unauthorized | Missing/invalid/expired JWT |
| `403` | Forbidden | Authenticated but not permitted |
| `404` | Not Found | Resource missing or soft-deleted |
| `409` | Conflict | Duplicate resource / insufficient stock |
| `422` | Unprocessable Entity | Valid JSON, failed validation rules |
| `500` | Internal Server Error | Unhandled exception |

---

## Changelog

| Version | Date | Notes |
|---|---|---|
| `v1` (spec) | 2026-08-10 | Initial API specification, prior to implementation |

> This changelog will track actual API changes once development begins. Until then, this document reflects the specified — not yet implemented — contract.