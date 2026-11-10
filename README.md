# Kamalia Khaddar storefront + admin demo

## Run it
Open `index.html` in a browser for the storefront. The Admin link opens `admin.html`.

For the checkout flow, choose **Buy now** to open a dedicated customer-details/payment page, or **Add to cart** to add the product to the cart. The cart icon opens `checkout.html`, where cart items can be removed before placing an order.

## Admin pages
- `admin.html` — dashboard with stock total, estimated gross profit, sales, transactions, sales/profit graphs and stock graph.
- `admin-products.html` — add and delete products; use **Edit** to open the full product details page and update catalog information.
- `admin-bills.html` — create bills with customer and product details, save customer/order/transaction records, update stock, and print 80mm thermal receipts.
- `admin-customers.html` — separate customer directory and order totals.
- `admin-newsletter.html` — view email addresses collected by the storefront newsletter form.
- `admin-transactions.html` — payment transaction ledger and pending/successful status.
- `admin-reports.html` — sales, profit, units sold, low-stock report and CSV export.

The storefront contact form validates and saves enquiries to browser-local `kk_enquiries`; it does not send messages to a live inbox.
The newsletter form saves subscriber email addresses to browser-local `kk_newsletter`; it does not send marketing emails.

## Demo backend and sample data
`backend.js` provides a small browser-local data layer and seeds 8 products, 4 demo orders, customers and payment transactions the first time it runs. Data is stored in `localStorage`, so it remains in that browser profile and is shared between these pages on the same origin. Checkout creates an order and transaction and reduces stock. Product changes in the Admin Products page update the storefront catalog.

**This is a frontend demo backend, not a production server/database.** It has no secure admin login, shared multi-user database, online payment gateway, real payment verification, server-side stock locking, or live order notifications. For production, connect these screens to a secured API and database (for example Node/Express + PostgreSQL), add authentication/roles, and integrate a payment provider. The Bank Transfer/JazzCash/EasyPaisa options are demo-only; Cash on Delivery is recorded as pending until manually reconciled.

## Reset demo data
In the browser developer console, run:

```js
['products','orders','customers','transactions'].forEach(k => localStorage.removeItem('kk_' + k));
location.reload();
```

Existing product and banner artwork has been retained in `assets/`.
