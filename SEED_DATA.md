# Database Seeding Guide

This document explains how to seed the database with initial data for services, products, blogs, and website settings.

## Overview

The seed script (`scripts/seedData.js`) populates your MongoDB database with:
- **Services**: 30 services (16 iGaming + 14 Crypto)
- **Products**: 6 products
- **Blog Posts**: 5 blog posts
- **Website Settings**: Default website configuration

## Prerequisites

1. Ensure your `.env` file is configured with `MONGODB_URI`
2. Make sure MongoDB is accessible (local or Atlas)
3. Node.js and npm are installed

## Running the Seed Script

### Option 1: Using npm script (Recommended)
```bash
cd Backend
npm run seed
```

### Option 2: Direct execution
```bash
cd Backend
node scripts/seedData.js
```

## What the Script Does

1. **Connects to MongoDB** using the connection string from `.env`
2. **Clears existing data** (optional - you can comment this out if you want to keep existing data)
3. **Seeds the database** with:
   - Services with proper slugs, categories, and metadata
   - Products with features and images
   - Blog posts with content, excerpts, and publication dates
   - Website settings with contact info and social links

## Data Structure

### Services
- Each service has a unique `slug` (e.g., `turnkey-platform`)
- Services are categorized as `igaming` or `crypto`
- Icons are stored as strings (e.g., `FaGamepad`) which are mapped to React components in the frontend

### Products
- Products include features arrays
- Featured products are marked with `featured: true`
- Products are ordered by the `order` field

### Blogs
- Blog posts have slugs for URL-friendly paths
- Posts are marked as `published: true` to appear on the frontend
- Content includes full articles with excerpts

### Website Settings
- Single document containing all site-wide settings
- Includes contact information, social links, and hero section configuration

## Frontend Integration

The frontend pages are already configured to fetch data from the API:

- **Services Page** (`/services`): Fetches services by category
- **Products Page** (`/products`): Fetches all active products
- **Blog Page** (`/blog`): Fetches published blog posts
- **Blog Detail** (`/blog/[slug]`): Fetches individual blog posts by slug

## API Endpoints Used

- `GET /api/services` - Get all services
- `GET /api/services?category=igaming` - Get services by category
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:slug` - Get blog by slug
- `GET /api/settings` - Get website settings

## Notes

- The seed script will **delete all existing data** before seeding. Comment out the deletion lines if you want to preserve existing data.
- Icon names in the database are stored as strings (e.g., `FaGamepad`) and are mapped to React components in the frontend using `lib/iconMap.tsx`
- All seeded data is marked as `isActive: true` and `published: true` (for blogs) so they appear on the frontend immediately

## Troubleshooting

### Connection Error
- Verify your `MONGODB_URI` in `.env` is correct
- Ensure MongoDB is running and accessible

### Duplicate Key Error
- The script clears existing data first, but if you've commented that out, you may get duplicate key errors
- Delete existing documents manually or uncomment the deletion code

### Missing Fields
- All required fields are included in the seed data
- If you see validation errors, check the model schemas in `models/`

## Updating Seed Data

To update the seed data:
1. Edit `Backend/scripts/seedData.js`
2. Modify the data arrays (`servicesData`, `productsData`, `blogsData`, `websiteSettingsData`)
3. Run the seed script again

**Note**: Running the seed script will delete all existing data and replace it with the seed data.

