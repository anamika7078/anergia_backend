# Anergia Backend API

Production-ready Node.js/Express backend API for the Anergia iGaming platform.

## 🚀 Features

- **RESTful API Architecture** - Clean and scalable API design
- **MongoDB Atlas Integration** - Cloud database with Mongoose ODM
- **JWT Authentication** - Secure admin authentication
- **Input Validation** - Express-validator for request validation
- **Security** - Helmet, CORS, Rate Limiting
- **Error Handling** - Centralized error handling middleware
- **MVC Pattern** - Organized folder structure

## 📁 Project Structure

```
Backend/
├── config/           # Configuration files
│   ├── database.js   # MongoDB connection
│   └── constants.js  # App constants
├── controllers/      # Route controllers
│   ├── adminController.js
│   ├── blogController.js
│   ├── contactFormController.js
│   ├── productController.js
│   ├── requestDemoController.js
│   ├── serviceController.js
│   └── websiteSettingsController.js
├── middleware/       # Custom middleware
│   ├── auth.js       # JWT authentication
│   ├── errorHandler.js
│   ├── notFound.js
│   └── validation.js
├── models/          # MongoDB models
│   ├── Admin.js
│   ├── Blog.js
│   ├── ContactForm.js
│   ├── Product.js
│   ├── RequestDemo.js
│   ├── Service.js
│   └── WebsiteSettings.js
├── routes/          # API routes
│   ├── adminRoutes.js
│   └── publicRoutes.js
├── utils/           # Utility functions
│   ├── generateToken.js
│   └── response.js
├── .env             # Environment variables (create from .env.example)
├── .gitignore
├── package.json
├── server.js        # Main server file
└── README.md
```

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=your-mongodb-atlas-connection-string
     JWT_SECRET=your-super-secret-jwt-key
     FRONTEND_URL=http://localhost:3000
     ```

3. **Start Server**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Public Routes (No Authentication)

#### Website Settings
- `GET /api/settings` - Get website settings

#### Services
- `GET /api/services` - Get all active services
- `GET /api/services?category=igaming` - Get services by category
- `GET /api/services/:slug` - Get service by slug

#### Products
- `GET /api/products` - Get all active products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID

#### Blogs
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:slug` - Get blog by slug

#### Contact Form
- `POST /api/contact` - Submit contact form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "Your message here"
  }
  ```

#### Request Demo
- `POST /api/request-demo` - Submit demo request
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Company Name",
    "phone": "+1234567890",
    "message": "Interested in demo",
    "productInterested": "iGaming Platform"
  }
  ```

### Admin Routes (Authentication Required)

#### Authentication
- `POST /api/admin/register` - Register admin (first time setup)
- `POST /api/admin/login` - Login admin
- `GET /api/admin/me` - Get current admin profile

#### Website Settings
- `PUT /api/admin/settings` - Update website settings

#### Services
- `GET /api/admin/services` - Get all services
- `POST /api/admin/services` - Create service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service

#### Products
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

#### Blogs
- `GET /api/admin/blogs` - Get all blogs
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog

#### Contact Forms
- `GET /api/admin/contacts` - Get all contact forms
- `GET /api/admin/contacts/:id` - Get contact form by ID
- `PUT /api/admin/contacts/:id` - Update contact form status
- `DELETE /api/admin/contacts/:id` - Delete contact form

#### Demo Requests
- `GET /api/admin/request-demos` - Get all demo requests
- `GET /api/admin/request-demos/:id` - Get demo request by ID
- `PUT /api/admin/request-demos/:id` - Update demo request status
- `DELETE /api/admin/request-demos/:id` - Delete demo request

## 🔐 Authentication

Admin routes require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Login Example
```bash
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@anergia.com",
  "password": "your-password"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "...",
      "email": "admin@anergia.com",
      "name": "Admin",
      "role": "admin"
    }
  }
}
```

## 📝 Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🗄️ Database Models

### WebsiteSettings
- `siteName` - String
- `logo` - String (URL)
- `contactEmail` - String
- `contactPhone` - String
- `address` - String
- `socialLinks` - Object (facebook, instagram, linkedin, twitter)
- `footerText` - String

### Service
- `title` - String
- `description` - String
- `icon` - String
- `image` - String (URL)
- `slug` - String (unique)
- `category` - Enum: 'igaming' | 'crypto'
- `order` - Number
- `isActive` - Boolean

### Product
- `name` - String
- `description` - String
- `image` - String (URL)
- `price` - Number (optional)
- `category` - String
- `featured` - Boolean
- `features` - Array of Strings
- `order` - Number
- `isActive` - Boolean

### Blog
- `title` - String
- `content` - String
- `excerpt` - String (auto-generated)
- `thumbnail` - String (URL)
- `author` - String
- `slug` - String (unique)
- `published` - Boolean
- `publishedAt` - Date

### ContactForm
- `name` - String
- `email` - String
- `phone` - String
- `message` - String
- `status` - Enum: 'new' | 'read' | 'replied' | 'archived'

### RequestDemo
- `name` - String
- `email` - String
- `company` - String
- `phone` - String
- `message` - String
- `productInterested` - String
- `status` - Enum: 'new' | 'contacted' | 'scheduled' | 'completed' | 'archived'

## 🔒 Security Features

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Prevents abuse (100 requests per 15 minutes)
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Validates all incoming requests
- **Password Hashing** - Bcrypt for secure password storage

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Update `MONGODB_URI` with your production MongoDB connection string
3. Set a strong `JWT_SECRET`
4. Update `FRONTEND_URL` with your production frontend URL
5. Deploy to your preferred hosting platform (Heroku, AWS, DigitalOcean, etc.)

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing

## 🐛 Error Handling

All errors are handled by the centralized error handler middleware. Errors return appropriate HTTP status codes and consistent error messages.

## 📞 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for Anergia iGaming Platform**

