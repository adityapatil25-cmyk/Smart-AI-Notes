# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Smart Notes Frontend

A modern, responsive React frontend for the Smart Notes application with AI-powered features, dark mode, and beautiful UI.

## 🚀 Features

- **Modern React App** - Built with React 18 and functional components
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support** - Automatic system preference detection with manual toggle
- **AI Integration** - Generate summaries for your notes
- **Real-time Search** - Search through notes with instant results
- **Tag Management** - Organize notes with tags and filters
- **Note Sharing** - Share notes with unique public URLs
- **PDF Export** - Export single notes or all notes as PDF
- **Pin Notes** - Pin important notes to the top
- **Toast Notifications** - Beautiful notifications for user feedback
- **Context API** - Efficient state management
- **Loading States** - Smooth loading indicators
- **Error Handling** - Comprehensive error handling

## 🛠️ Tech Stack

- **React** 18.2.0 - UI framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Toastify** - Toast notifications
- **Axios** - HTTP client
- **Context API** - State management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── NoteCard.jsx    # Note display card
│   ├── Sidebar.jsx     # Filter and stats sidebar
│   └── ThemeToggle.jsx # Dark mode toggle
├── context/            # React Context providers
│   ├── AuthContext.jsx    # Authentication state
│   ├── NotesContext.jsx   # Notes state management
│   └── ThemeContext.jsx   # Theme state
├── hooks/              # Custom React hooks
│   └── useAuth.js      # Authentication hook
├── pages/              # Page components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Login.jsx       # Login page
│   ├── Signup.jsx      # Registration page
│   ├── NoteEditor.jsx  # Note creation/editing
│   └── Profile.jsx     # User profile page
├── services/           # API services
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication API
│   └── noteService.js  # Notes API
├── App.jsx             # Main app component
├── App.css             # Global styles
├── index.css           # Base styles
└── main.jsx           # App entry point
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Smart Notes Backend running

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd smart-notes-frontend
npm install
```

### 2. Environment Setup
Copy the environment example file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=Smart Notes
REACT_APP_VERSION=1.0.0
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📱 Features Overview

### 🔐 Authentication
- User registration and login
- JWT token management
- Protected routes
- Automatic token refresh

### 📝 Note Management
- Create, read, update, delete notes
- Rich text editing
- Tag management
- Search and filtering
- Pin/unpin functionality

### 🤖 AI Features
- Generate AI summaries using OpenAI
- Smart content analysis
- One-click summarization

### 🎨 UI/UX Features
- **Dark Mode** - System preference with manual override
- **Responsive Design** - Mobile-first approach
- **Loading States** - Skeleton loading and spinners
- **Toast Notifications** - Success, error, and info messages
- **Smooth Animations** - CSS transitions and animations
- **Accessibility** - ARIA labels and keyboard navigation

### 📊 Dashboard
- Statistics overview
- Filter by tags
- Search functionality
- Most used tags
- Activity metrics

### 🔗 Sharing & Export
- Generate shareable links
- Copy URLs to clipboard
- PDF export (single note or all notes)
- Public note viewing

## 🎯 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

## 🌙 Dark Mode

The app supports dark mode with:
- Automatic system preference detection
- Manual toggle in navigation
- Persistent user preference
- Smooth transitions

## 📱 Responsive Design

Breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔄 State Management

The app uses React Context API for state management:

- **AuthContext** - User authentication state
- **NotesContext** - Notes data and operations
- **ThemeContext** - Dark/light mode state

## 🚀 Performance Features

- Component lazy loading
- Debounced search
- Optimistic updates
- Efficient re-renders
- Image optimization

## 🛡️ Security Features

- JWT token handling
- Protected routes
- XSS protection
- CSRF protection
- Input sanitization

## 📚 API Integration

The frontend communicates with the backend through:
- RESTful API endpoints
- JWT authentication
- Error handling
- Loading states
- Offline support (coming soon)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Bug Reports

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and device information

## 💡 Feature Requests

We welcome feature requests! Please include:
- Clear description of the feature
- Use case and benefits
- Mockups or examples if possible

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Lucide for the beautiful icons
- OpenAI for AI capabilities
- All contributors and users

## 📞 Support

- GitHub Issues: [Create an issue](https://github.com/yourusername/smart-notes-frontend/issues)
- Email: your.email@example.com
- Documentation: [Wiki](https://github.com/yourusername/smart-notes-frontend/wiki)

---

**Happy Coding! 🎉**

Made with ❤️ for organizing thoughts and ideas.