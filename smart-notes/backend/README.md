# Smart Notes Backend API

A powerful backend API for the Smart Notes application with AI-powered summarization, note management, sharing, and PDF export capabilities.

## 🚀 Features

- **User Authentication** - JWT-based secure authentication
- **Note Management** - Full CRUD operations for notes
- **AI Summarization** - OpenAI integration for automatic note summaries
- **Search & Filter** - Advanced search with tag filtering
- **Note Sharing** - Secure note sharing with unique URLs
- **PDF Export** - Export single notes or all notes as PDF
- **Pin Notes** - Pin important notes to the top
- **Dashboard Stats** - User statistics and analytics
- **Tag Management** - Organize notes with tags

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **OpenAI API** - AI summarization
- **Puppeteer** - PDF generation
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── aiController.js       # AI summarization logic
│   ├── authController.js     # Authentication logic
│   ├── exportController.js   # PDF export logic
│   ├── noteController.js     # Note CRUD operations
│   └── shareController.js    # Note sharing logic
├── middleware/
│   ├── authMiddleware.js     # JWT authentication middleware
│   └── errorMiddleware.js    # Error handling middleware
├── models/
│   ├── Note.js              # Note data model
│   └── User.js              # User data model
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── noteRoutes.js        # Note management routes
│   └── shareRoutes.js       # Note sharing routes
├── utils/
│   └── generateToken.js     # JWT token generation
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── README.md              # Project documentation
└── server.js              # Main server file
```

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd smart-notes-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configurations:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/smartnotes
JWT_SECRET=your_super_secure_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:3000
```

### 4. Database Setup
Make sure MongoDB is running on your system, or use MongoDB Atlas for cloud database.

### 5. Start the server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Notes Endpoints
- `GET /api/notes` - Get all user notes (with search & filter)
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get single note by ID
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `GET /api/notes/stats` - Get dashboard statistics
- `PUT /api/notes/:id/pin` - Toggle pin/unpin note
- `POST /api/notes/:id/summarize` - Generate AI summary
- `PUT /api/notes/:id/share` - Toggle note sharing
- `GET /api/notes/:id/export` - Export single note as PDF
- `GET /api/notes/export/all` - Export all notes as PDF

### Sharing Endpoints
- `GET /api/share/public/:shareId` - Get shared note (Public)

### Health Check
- `GET /api/health` - API health check
- `GET /` - API information

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```javascript
Authorization: Bearer <your-jwt-token>
```

## 📖 Usage Examples

### Register a new user
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Create a note
```javascript
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content of my note...",
  "tags": ["work", "important"]
}
```

### Search notes
```javascript
GET /api/notes?search=work&tag=important
Authorization: Bearer <token>
```

## 🤖 AI Features

The app integrates with OpenAI's GPT-3.5-turbo model to provide:
- Automatic note summarization
- Intelligent content analysis
- Key point extraction

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes middleware
- Input validation
- Error handling
- CORS protection



### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=your_frontend_domain
```



## 🧪 Testing

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- cURL commands
- Frontend integration








**Happy Coding! 🎉**
