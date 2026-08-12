# OSUDHX — Smart Pharmacy Management System

**Client Repository:** [github.com/SyntaxAdil/osudhx](https://github.com/SyntaxAdil/osudhx)
**Server Repository:** [github.com/SyntaxAdil/osudhx-server](https://github.com/SyntaxAdil/osudhx-server)
**Live App:** [osudhx.vercel.app](https://osudhx.vercel.app)

A pharmacy management REST API — categories, products, orders, and wishlist — built with Express, TypeScript, Prisma, and PostgreSQL, with authentication handled by better-auth.

---

## Tech Stack

- Express.js + TypeScript
- Prisma ORM + PostgreSQL
- better-auth (registration, login, sessions, JWT issuance)
- JWT verified on protected routes via `jose` against better-auth's JWKS endpoint

---

## Roles

Two roles only:

- **customer** — browses products, places orders, manages their own wishlist
- **seller** — manages categories and their own products, updates order status on orders containing their products

There is no admin/pharmacist role in this version.

---

## Services

Four services, plus user management handled entirely by better-auth:

1. **User** — better-auth (registration, login, sessions, JWT) — not custom-built
2. **Category** — CRUD, seller-only writes, public reads
3. **Product** — CRUD, seller-only writes (owner-restricted), public reads, search/filter/sort
4. **Order** — customer creates orders, stock-checked and computed in a single transaction; seller updates status; customer cancels while pending
5. **Wishlist** — customer adds/views/removes saved products

---

## Data Models

**Category** — `id, name, description?, image?, isDeleted, createdAt, updatedAt`

**Product** — `id, name, sellerId (FK User), description, price (int), stock, status (available/sold/stockout), image, manufacturer, categoryId (FK Category), isDeleted, createdAt, updatedAt`

**Order** — `id, userId (FK User), totalAmount (int), shippingAddress, phone, status (pending/confirmed/shipped/delivered/cancelled), isDeleted, createdAt, updatedAt`

**OrderItem** — `id, orderId (FK Order), productId (FK Product), quantity, price (int, snapshotted at order time)`

**Wishlist** — `id, userId (FK User), productId (FK Product), createdAt` — unique on `(userId, productId)`

### Enums

```
User_Role:            customer | seller
PRODUCT_STATUS_ENUM:  available | sold | stockout
ORDER_STATUS:          pending | confirmed | shipped | delivered | cancelled
```

---

## API Documentation

Base URL (local): `http://localhost:5000/api`
Auth: `Authorization: Bearer <token>` (token issued by better-auth)

### Categories

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/categories` | Seller |
| GET | `/api/categories` | Public |
| GET | `/api/categories/:id` | Public |
| PATCH | `/api/categories/:id` | Seller |
| DELETE | `/api/categories/:id` | Seller (soft delete) |

### Products

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/products` | Seller |
| GET | `/api/products` | Public — query: `search, categoryId, status, page, limit, sortBy, sortOrder` |
| GET | `/api/products/:id` | Public |
| PATCH | `/api/products/:id` | Seller (owner only) |
| DELETE | `/api/products/:id` | Seller (owner only, soft delete) |

### Orders

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/orders` | Customer — body: `{ shippingAddress, phone, items: [{ productId, quantity }] }` |
| GET | `/api/orders` | Customer (own orders) / Seller (orders containing their products) |
| GET | `/api/orders/:id` | Order owner or seller with an item in it |
| PATCH | `/api/orders/:id/status` | Seller — body: `{ status }` |
| PATCH | `/api/orders/:id/cancel` | Customer (owner, only while `pending`) — restores stock |

Order creation runs in a single Prisma transaction: validates every item's availability and stock, computes `totalAmount` server-side, snapshots each `OrderItem.price`, decrements stock, and flips a product to `stockout` if stock hits 0.

### Wishlist

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/wishlist` | Customer — body: `{ productId }` |
| GET | `/api/wishlist` | Customer (own wishlist) |
| GET | `/api/wishlist/:id` | Customer (owner) |
| DELETE | `/api/wishlist/:id` | Customer (owner, hard delete) |

### Response Format

**Success**
```json
{ "success": true, "message": "Product retrieved successfully", "data": {}, "meta": {} }
```
`meta` (`page, limit, total, totalPages`) appears only on paginated list endpoints.

**Error**
```json
{ "success": false, "message": "Product not found" }
```

### Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad request / insufficient stock / invalid state transition |
| 401 | Missing or invalid JWT |
| 403 | Wrong role or not the resource owner |
| 404 | Not found or soft-deleted |
| 409 | Duplicate category name / duplicate wishlist entry |
| 500 | Unhandled server error |

---

## Soft Delete

Category, Product, and Order use an `isDeleted` boolean instead of hard deletes, so historical orders and references stay intact. Wishlist entries are hard-deleted — they're a simple save/unsave toggle with no other state.

---

## Environment Variables

```env
DATABASE_URL="your_database_url"
BETTER_AUTH_URL="http://localhost:5000"
PORT=5000
CLIENT_URL="your_frontend_url"
```

---

## Local Development Setup

```bash
git clone https://github.com/SyntaxAdil/osudhx-server.git
cd osudhx-server
bun install
# configure .env
bunx prisma generate
bunx prisma migrate dev
bun dev
```

---

## License

MIT License.