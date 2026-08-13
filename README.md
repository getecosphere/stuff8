# stuff8_core

Estate core repo for Stuff8. Owns `ecompose.yml`, the composition frontend
(`frontend/`), and any eco-generated runtime artifacts. The domain repos
(auth, inventory, marketplace, bidding, ...) are siblings composed via
`ecompose.yml` (LXS packages or `path:`).

---

# Stuff8 — Product Analysis & Vision
Version: 0.1

---

# Executive Summary

Stuff8 is **not another marketplace**.

It is a **personal inventory system** whose inventory can optionally become a public marketplace.

The marketplace is merely a secondary feature generated from a user's personal catalog.

This "Inventory First, Marketplace Second" philosophy fundamentally differentiates Stuff8 from existing marketplaces such as Facebook Marketplace, Craigslist, or eBay.

---

# Core Problem

People own hundreds—even thousands—of physical items.

Over time:

- They forget what they own.
- Items remain unused for years.
- Valuable assets become clutter.
- Selling something requires creating an entirely new listing.

Meanwhile, many of those unused items could be useful to someone else.

---

# Solution

Stuff8 allows users to build a digital inventory of everything they own.

Each inventory item contains:

- Photos
- Title
- Description
- Category
- Condition
- Purchase Date (optional)
- Estimated Value
- Storage Location
- Notes

Every item belongs to the owner's private inventory.

If the owner decides to sell it, they simply enable:

```
Sellable = true
```

Immediately, that inventory item appears on the public marketplace.

No duplicate listing.

No re-uploading photos.

No rewriting descriptions.

---

# Philosophy

Current marketplaces begin with:

> I want to sell something.

Stuff8 begins with:

> I want to organize my belongings.

Selling is optional.

Organization is permanent.

Marketplace is an extension.

---

# User Journey

## Step 1 — Build Personal Inventory

Users walk around their home and photograph items.

Examples:

- Laptop
- Camera
- Bicycle
- Books
- Action figures
- Vinyl records
- Furniture
- Musical instruments

Each becomes a permanent inventory record.

---

## Step 2 — Manage Inventory

Users can:

- Search
- Categorize
- Add tags
- Update condition
- Track estimated value
- Archive
- Record purchase information

Inventory is useful even without ever selling anything.

---

## Step 3 — Mark Item as Sellable

Toggle:

```
Available For Sale = YES
```

Immediately:

- appears publicly
- searchable
- browsable

The owner does not create another listing.

The inventory itself IS the listing.

---

## Step 4 — Marketplace

Visitors browse only sellable items.

Marketplace features:

- Search
- Categories
- Filters
- Nearby items
- Newest items
- Highest rated sellers
- Condition
- Price range

Each listing links back to the owner's inventory record.

---

## Step 5 — Offer System

Instead of instant checkout:

Buyer submits offer.

Example:

Asking Price:

$120

Offers:

- User A → $95
- User B → $110
- User C → $118

Owner decides:

- Accept
- Reject
- Negotiate

Highest bidder may be prioritized.

---

## Step 6 — Transaction

Version 1:

Cash On Delivery (COD)

No payment gateway.

No escrow.

No KYC.

No financial regulations.

The application only connects buyers and sellers.

Actual payment occurs offline.

---

# Why This Is Different

Traditional Marketplace

```
Want to sell
↓

Create listing

↓

Upload photos

↓

Write description

↓

Publish
```

Stuff8

```
Own something

↓

Inventory it

↓

Manage it

↓

Need to sell?

↓

Enable "Sell"

↓

Done
```

The listing already exists.

---

# Core Benefits

## Personal Organization

Users know exactly what they own.

---

## Decluttering

Unused items become visible.

People realize:

"I actually don't need this anymore."

---

## Marketplace Supply

Inventory naturally creates marketplace content.

No extra work required.

---

## Lower Friction

Selling requires one click.

---

## Asset Awareness

Users begin understanding the value of everything they own.

---

# Item Status

Suggested statuses:

- Collection
- Sellable
- Reserved
- Sold
- Lent
- Donated
- Lost
- Damaged
- Archived

Only Sellable appears publicly.

---

# Marketplace Visibility

Private inventory fields:

- Storage location
- Purchase price
- Personal notes
- Warranty
- Receipts

Public fields:

- Photos
- Title
- Description
- Condition
- Asking price
- General location
- Seller profile

Sensitive information remains private.

---

# AI Opportunities

AI can greatly reduce friction.

## Automatic Recognition

Upload photo.

AI predicts:

- Item name
- Category
- Brand
- Model
- Color
- Material

---

## Suggested Description

Generate product description automatically.

---

## Estimated Price

Estimate market value using:

- historical sales
- marketplace prices
- condition

---

## Duplicate Detection

Warn:

"You already inventoried this item."

---

## Collection Analysis

Examples:

"You own 42 books."

"You own 15 cameras."

"You have not used this bicycle for two years."

---

## Sell Recommendation

AI identifies:

Items likely unused.

Example:

"This printer hasn't been opened in 3 years.

Consider selling?"

---

# Future Features

## Household Inventory

Multiple family members share inventory.

---

## Office Inventory

Companies track assets.

---

## QR Labels

Print QR stickers.

Scan storage boxes.

Instantly view contents.

---

## Warranty Tracking

Track:

- warranty
- receipts
- expiration

---

## Maintenance

Schedule:

- bicycle servicing
- camera cleaning
- AC maintenance

---

## Donation Mode

Instead of selling:

Mark item as:

Available for Donation

---

## Lending

Track:

Who borrowed what.

When.

Return date.

---

## Insurance Export

Generate household asset reports.

Useful for insurance claims.

---

## Moving Assistant

Generate complete inventory during relocation.

---

## Estate Planning

Maintain documented household assets.

Useful for inheritance documentation.

---

# Business Model

## Free Tier

Basic inventory.

---

## Premium

Unlimited inventory.

AI features.

Cloud backup.

Analytics.

Advanced organization.

---

## Featured Listings

Boost marketplace visibility.

---

## Professional Sellers

Subscription for resellers.

---

## Insurance Partnerships

Offer integrations.

---

## Moving Services

Partner with relocation companies.

---

## Future Transaction Fees

If online payment is introduced.

---

# Competitive Analysis

| Platform | Inventory | Marketplace | Personal Asset Management |
|-----------|------------|-------------|---------------------------|
| Facebook Marketplace | No | Yes | No |
| eBay | No | Yes | No |
| Craigslist | No | Yes | No |
| Sortly | Yes | No | Yes |
| Encircle | Yes | Limited | Yes |
| Stuff8 | Yes | Yes | Yes |

Stuff8 combines inventory management with marketplace exposure.

---

# Technical Architecture

## Item

```
Item
├── id
├── ownerId
├── title
├── description
├── category
├── condition
├── photos[]
├── tags[]
├── estimatedValue
├── askingPrice
├── sellable
├── visibility
├── status
├── createdAt
└── updatedAt
```

---

## Marketplace

Marketplace does NOT own products.

It queries:

```
SELECT *

FROM inventory

WHERE sellable = true
```

Marketplace is therefore a filtered projection of personal inventory.

This greatly reduces data duplication.

---

# Design Principle

Inventory is the source of truth.

Marketplace is only a view.

Never duplicate item data.

Only expose items that the owner explicitly marks as public.

---

# Long-Term Vision

Stuff8 aims to become the operating system for personal belongings.

Today:

- Organize what you own.

Tomorrow:

- Know what your assets are worth.
- Sell unused possessions effortlessly.
- Track warranties.
- Manage maintenance.
- Share inventories with family.
- Prepare insurance documentation.
- Donate items to others.
- Lend possessions safely.

The marketplace is only one expression of a much larger personal asset management platform.

---

# Product Positioning

**Stuff8**

> Know what you own.
>
> Sell what you don't need.

or

> Your personal inventory, connected to the marketplace.

or

> Inventory first. Marketplace second.

---

# Key Insight

The fundamental innovation is **not the marketplace**.

The innovation is making **inventory management the primary activity** and allowing commerce to emerge naturally from it.

This reduces listing friction, improves data quality, encourages long-term engagement, and creates a continuously growing marketplace sourced directly from users' real-world possessions.
