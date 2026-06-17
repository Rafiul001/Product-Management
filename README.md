# NexVolt — E-Commerce Platform

A full-stack e-commerce platform built with Node.js/Express and React. Covers the complete product lifecycle — from inventory management and catalog to customer shopping, checkout, order tracking, and payment processing.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Authentication & Authorization](#authentication--authorization)

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Express.js v5 | HTTP server & routing |
| MongoDB + Mongoose | Database & ODM |
| TypeScript | Type safety |
| JWT + bcryptjs | Authentication & password hashing |
| Multer + Cloudinary | Image upload & cloud hosting |
| Nodemailer + otp-generator | Email OTP verification |
| SSLCommerz | Payment gateway (Bangladesh) |
| Zod | Schema validation |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| HeroUI | Pre-built UI components |
| Zustand | Lightweight state management |
| React Router v7 | Client-side routing |
| React Hook Form + Zod | Form handling & validation |
| Axios | HTTP client with refresh token interceptor |
| Framer Motion | Animations |

---

## Features

### Customer-Facing

#### Authentication
- Register with email OTP verification
- Login / Logout with JWT (HTTP-only cookies) + refresh token flow
- Resend OTP for unverified accounts

#### Profile & Delivery Address
- View and edit account details (name, email, phone, date of birth)
- Structured delivery address (Street/Road, Area/Thana, City/District, Postal Code)
- Address pre-filled at checkout and editable per order

#### Product Browsing
- Browse all products with search, category/sub-category filters, price range, sort options, and pagination
- Filter in-stock products only
- View product details with image, price, discounted price, stock status, and reviews
- New Arrivals section (in-stock only)
- Deals & Offers section with countdown banners (in-stock only)

#### Cart & Checkout
- Add / remove items, auto-calculated totals
- Checkout with delivery address confirmation (editable per order)
- Cash on Delivery, Online / Mobile Banking, or Visa / Mastercard (SSLCommerz — bKash, Nagad, cards)
- Buy Now flow (direct checkout without cart)
- After online payment, automatically redirected to an order success page

#### Orders
- View order history with status and item details
- Cancel confirmed orders
- Payment status tracking: `DUE` / `PAID` / `REFUNDED`
- Order status tracking: `PENDING` → `CONFIRMED` → `PACKAGING` → `OUT_FOR_DELIVERY` → `DELIVERED`

#### Reviews
- Leave a rating and review on purchased products
- Edit or delete own reviews

### Admin Dashboard

#### User Management
- List all users with profile and address details
- Edit user account information

#### Product Catalog
- **Categories** — Full CRUD
- **Sub-categories** — Full CRUD, linked to parent categories
- **Products** — Full CRUD with Cloudinary image uploads, pricing, stock quantity, and stock limit thresholds
- **Banners** — Promotional banner management with image uploads

#### Deals & Offers
- Create time-limited discount offers (percentage or flat amount)
- Set active date range, badge label, and description
- Offers automatically appear on the storefront when active

#### New Arrivals
- Tag / untag products as new arrivals
- Only in-stock products appear in the storefront New Arrivals section

#### Orders
- View all orders across users
- Update order status (`PENDING` → `CONFIRMED` → `PACKAGING` → `OUT_FOR_DELIVERY` → `DELIVERED` / `CANCELLED`)
- View delivery address per order

#### Inventory / Stock Entries
- Record incoming stock with product list, quantities, and unit costs
- Upload challan (purchase invoice) images
- Auto-calculated total cost per entry; full CRUD

---

## Project Structure

```
product-management/
├── src/
│   ├── server/                 # Backend application
│   │   ├── controllers/        # Route handlers (by feature)
│   │   ├── routes/             # Express routers (all mounted under /api/v1)
│   │   ├── middleware/         # Authenticator, validator, file uploader
│   │   ├── dbConnection/       # MongoDB connection setup
│   │   └── services/
│   │       ├── ssl/            # SSLCommerz payment service
│   │       └── email/          # Nodemailer email service
│   │
│   ├── client/                 # Frontend React application (Vite)
│   │   └── src/
│   │       ├── pages/          # Route-level pages (dashboard & user-facing)
│   │       ├── components/     # Reusable UI components (atoms → organisms → templates)
│   │       ├── layout/         # Layout wrappers (Root, Dashboard, Admin)
│   │       ├── api/            # Axios API integration modules
│   │       ├── store/          # Zustand state stores
│   │       └── utils/          # Utility functions & API URL constants
│   │
│   ├── shared/                 # Code shared between server and client
│   │   ├── models/             # Mongoose schema definitions
│   │   ├── validators/         # Zod validation schemas
│   │   ├── constants/          # Enums and app-wide constants
│   │   ├── config/             # App configuration
│   │   └── utils/              # JWT, password, OTP, upload, response helpers
│   │
│   └── server.ts               # Backend entry point
│
├── uploads/                    # Uploaded files (product images, challans)
├── dist/                       # Compiled output (post-build)
├── .env.template               # Environment variable template
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd product-management

# Install root dependencies
npm install

# Install client dependencies
cd src/client && npm install && cd ../..
```

### Development

```bash
# Run backend and frontend concurrently
npm run dev

# Run backend only
npm run dev:server

# Run frontend only
npm run dev:client
```

- Backend: `http://localhost:3000`
- Frontend (Vite): `http://localhost:5173`

### Production Build

```bash
npm run build        # Compile backend (tsc + tsc-alias) and build frontend (Vite)
npm start            # Run both concurrently

# Or individually
npm run start:server # node dist/server.js
npm run start:client # Vite preview mode
```

---

## Environment Variables

Copy `.env.template` to `.env` and fill in the values:

```env
PORT=3000
NODE_ENV=development

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000

JSON_WEB_TOKEN_SECRET=your_jwt_secret

# Nodemailer (Gmail App Password)
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

DB_CONNECTION_URL=mongodb://localhost:27017/
DATABASE=ecommerce

UPLOAD_DIR=/absolute/path/to/uploads

# SSLCommerz payment gateway
SSL_STORE_ID=your_store_id
SSL_STORE_PASSWORD=your_store_password
SSL_IS_LIVE=false

# Cloudinary (image hosting)
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

---

## API Reference

All routes are prefixed with `/api/v1`.

### User Routes `/api/v1/user`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/verify` | Verify email with OTP | Public |
| POST | `/resend` | Resend OTP | Public |
| POST | `/login` | User login | Public |
| POST | `/logout` | User logout | User |
| POST | `/refresh` | Refresh access token | Public |
| GET | `/me` | Get current user info | User |
| GET | `/profile` | Get full profile | User |
| PATCH | `/update-profile` | Update name, email, phone, DOB | User |
| PATCH | `/update-address` | Update delivery address | User |
| GET | `/admin/get-all` | List all users | Admin |
| PATCH | `/admin/update/:id` | Update a user | Admin |

### Admin Routes `/api/v1/admin`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/login` | Admin login | Public |
| GET | `/me` | Get current admin info | Admin |
| POST | `/logout` | Admin logout | Admin |

### Category Routes `/api/v1/category`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all categories | Public |
| POST | `/create` | Create a category | Admin |
| PUT | `/update/:id` | Update a category | Admin |
| DELETE | `/delete/:id` | Delete a category | Admin |

### Sub-Category Routes `/api/v1/sub-category`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all sub-categories | Public |
| POST | `/create` | Create a sub-category | Admin |
| PUT | `/update/:id` | Update a sub-category | Admin |
| DELETE | `/delete/:id` | Delete a sub-category | Admin |

### Product Routes `/api/v1/product`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/get-all` | List products (filterable, paginated) | Public |
| GET | `/admin/get-all` | List all products for admin | Admin |
| GET | `/get/:id` | Get product by ID | Public |
| POST | `/create` | Create a product (with image) | Admin |
| PUT | `/update/:id` | Update a product | Admin |
| DELETE | `/delete/:id` | Delete a product | Admin |

**Product query params:** `search`, `categories`, `subCategories`, `minPrice`, `maxPrice`, `inStock`, `offerId`, `sortBy`, `sortOrder`, `productStatus`, `newArrivalOnly`, `page`, `limit`

### Cart Routes `/api/v1/cart`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/get` | Get user's cart | User |
| POST | `/create` | Create a cart | User |
| PATCH | `/add-item` | Add item to cart | User |
| PATCH | `/remove-item` | Remove item from cart | User |
| DELETE | `/delete` | Clear the cart | User |

### Order Routes `/api/v1/order`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/my-orders` | Get current user's orders | User |
| POST | `/place-from-cart` | Place order from cart | User |
| POST | `/place-direct` | Place order directly (Buy Now) | User |
| PATCH | `/:id/cancel` | Cancel an order | User |
| GET | `/redirect-to-payment/:checkoutId` | Redirect to SSLCommerz | User |
| POST | `/confirm-payment` | Payment confirmation webhook — redirects browser to frontend `/order-success` | Public |
| POST | `/refund` | Request a refund | User |
| GET | `/admin/get-all` | List all orders | Admin |
| PATCH | `/admin/update-status/:id` | Update order status | Admin |

**Order body params:** `paymentMethod` (`CASH_ON_DELIVERY` | `ONLINE_MOBILE_BANKING` | `VISA_OR_MASTER_CARD`), `deliveryAddress` (optional — overrides saved address for this order)

### Offer Routes `/api/v1/offer`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/active` | List active offers | Public |
| GET | `/get-all` | List all offers | Admin |
| GET | `/get/:id` | Get offer by ID | Admin |
| POST | `/create` | Create an offer | Admin |
| PUT | `/update/:id` | Update an offer | Admin |
| DELETE | `/delete/:id` | Delete an offer | Admin |

### Review Routes `/api/v1/review`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/product/:productId` | Get reviews for a product | Public |
| POST | `/create` | Create a review | User |
| PUT | `/update/:id` | Update own review | User |
| DELETE | `/delete/:id` | Delete a review | User / Admin |

### New Arrival Routes `/api/v1/new-arrival`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/get-all` | Get all new arrival products (in-stock only) | Public |
| POST | `/add` | Tag a product as new arrival | Admin |
| DELETE | `/remove/:productId` | Remove a product from new arrivals | Admin |

### Stock Entry Routes `/api/v1/stock-entry`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all stock entries | Admin |
| POST | `/create` | Create a stock entry (with challan image) | Admin |
| PUT | `/update/:id` | Update a stock entry | Admin |
| DELETE | `/delete/:id` | Delete a stock entry | Admin |

### Banner Routes `/api/v1/banner`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/get-all` | List all banners | Public |
| GET | `/get/:id` | Get banner by ID | Public |
| POST | `/create` | Create a banner (with image) | Admin |
| PUT | `/update/:id` | Update a banner | Admin |
| DELETE | `/delete/:id` | Delete a banner | Admin |

---

## Authentication & Authorization

- **JWT access tokens** are issued on login and stored in HTTP-only cookies.
- **Refresh tokens** allow seamless session renewal — an Axios interceptor automatically retries failed requests after refreshing.
- **Email OTP verification** is required for new user accounts before login is permitted.
- **Role-based middleware** protects every non-public route. Each route specifies the permitted roles: `USER`, `ADMIN`, or `SECONDARY_ADMIN`.
- **Zod validation** middleware enforces request body, params, and form data schemas before any controller logic runs.
