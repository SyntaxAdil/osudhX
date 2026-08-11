# Category / Product / Order Services

Only the pieces you asked for — services, controllers, routes — plus the small
shared bits they depend on (`lib/prisma.ts`, `lib/ApiError.ts`, `lib/sendResponse.ts`,
`lib/pagination.ts`) and your existing `utils/asyncHandler.ts` and `middlewares/`
files (copied in unchanged so the package compiles standalone).

## Wire-up

In `src/app.ts`:

```ts
import routes from "./routes";
app.use("/api", routes);
```

This mounts:

- `/api/categories` — public GET, seller-only POST/PATCH/DELETE
- `/api/products` — public GET, seller-only POST/PATCH/DELETE (owner-checked)
- `/api/orders` — auth required for everything
  - `POST /api/orders` — customer places an order (transactional stock check + decrement)
  - `GET /api/orders` — customer sees own orders, seller sees orders containing their products
  - `GET /api/orders/:id` — same access rule as above
  - `PATCH /api/orders/:id/status` — seller advances order status
  - `PATCH /api/orders/:id/cancel` — customer cancels a still-pending order (stock restored)

## Notes

- `req.user.sub` is used as the user id — that's the standard JWT subject
  claim; if your better-auth JWT plugin names it differently, adjust the two
  spots in each controller that read `req.user?.sub`.
- `req.user.role` is expected on the token payload (already typed in
  `src/types/express/index.d.ts`) — make sure the better-auth JWT plugin
  includes `role` as a custom claim, since it isn't a default JWT field.
- All list endpoints (`GET /categories`, `GET /products`, `GET /orders`)
  return `{ success, message, data, meta }` where `meta` has
  `page / limit / total / totalPages`.
- Soft delete only — nothing is ever hard-deleted.
- No `any` anywhere; every request body / query is typed via the interfaces
  in `src/types/`.
