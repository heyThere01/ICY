# 🌸 ICY - Influencer Outreach Agent

> **AI-Powered Influencer Discovery & Outreach Platform**

ICY is a beautiful, modern influencer outreach platform that helps brands discover the right influencers, analyze their compatibility, and send personalized outreach messages powered by OpenAI GPT. Built with a stunning pink-themed UI and advanced AI capabilities.

![ICY Platform](https://img.shields.io/badge/Platform-Full--Stack-pink)
![License](https://img.shields.io/badge/License-MIT-pink)
![Status](https://img.shields.io/badge/Status-Demo-pink)

## ✨ Features

### 🎯 **Core Features**
- **Brand Setup Form**: Multi-step form to capture product details, target audience, brand tone, and goals
- **Influencer Discovery Dashboard**: Visually appealing influencer cards with engagement heatmaps and trust badges
- **AI-Powered Analytics**: Brand fit scoring, engagement quality analysis, and fake follower detection
- **Message Generator**: AI-powered personalized outreach messages using OpenAI GPT
- **Campaign Tracker**: Real-time campaign analytics with animated stats and performance metrics

### 🤖 **AI Integration**
- **Influencer Persona Analysis**: Auto-generates influencer personas ("Eco-Beauty Guru", "Luxury Expert")
- **Brand Alignment Scoring**: AI calculates compatibility between brands and influencers
- **Smart Message Generation**: Personalized outreach based on recent posts and brand tone
- **Performance Prediction**: AI estimates campaign reach and engagement
- **Follow-up Optimization**: Smart timing recommendations for follow-up messages

### 🎨 **Beautiful Pink UI/UX**
- **Neo-morphic Design**: Soft, modern cards with pink gradients
- **Glass Morphism**: Backdrop blur effects and translucent elements
- **Smooth Animations**: Framer Motion animations and micro-interactions
- **Responsive Layout**: Mobile-first design with split views
- **Custom Pink Theme**: Soft pinks, rose, blush, dusty rose, and magenta palette

## 🚀 Tech Stack

### **Frontend**
- **React.js 18** - Modern React with hooks
- **Tailwind CSS** - Custom pink theme configuration
- **Framer Motion** - Smooth animations and transitions
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling and validation
- **Recharts** - Beautiful charts and data visualization
- **React Hot Toast** - Elegant notifications

### **Backend**
- **Node.js + Express** - RESTful API server
- **MongoDB + Mongoose** - Database and ODM
- **Socket.io** - Real-time updates
- **OpenAI GPT-4** - AI message generation and analysis
- **JWT** - Authentication and authorization
- **SendGrid** - Email outreach integration
- **bcryptjs** - Password hashing
- **express-rate-limit** - API rate limiting

### **APIs & Integrations**
- **OpenAI API** - AI-powered features
- **YouTube Data API** - Influencer stats
- **Instagram Basic Display API** - Profile analytics
- **SendGrid API** - Email outreach
- **Socket.io** - Real-time notifications

## 📁 Project Structure

```
icy-influencer-outreach/
├── server/                  # Backend Node.js application
│   ├── models/             # MongoDB models
│   │   ├── User.js         # User authentication
│   │   ├── Brand.js        # Brand setup data
│   │   ├── Influencer.js   # Influencer profiles
│   │   ├── Campaign.js     # Campaign management
│   │   └── Message.js      # Outreach messages
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── brands.js       # Brand management
│   │   ├── influencers.js  # Influencer discovery
│   │   ├── campaigns.js    # Campaign tracking
│   │   ├── messages.js     # Message management
│   │   └── ai.js           # AI-powered features
│   ├── services/           # Business logic
│   │   └── aiService.js    # OpenAI integration
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Server dependencies
│   └── index.js            # Server entry point
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── Layout/     # Main layout component
│   │   ├── pages/          # Page components
│   │   │   ├── Auth/       # Login/Register
│   │   │   ├── Dashboard/  # Main dashboard
│   │   │   ├── Brand/      # Brand setup
│   │   │   ├── Influencer/ # Influencer discovery
│   │   │   ├── Message/    # Message generator
│   │   │   └── Campaign/   # Campaign tracker
│   │   ├── store/          # Zustand state management
│   │   ├── index.css       # Tailwind & custom styles
│   │   ├── App.js          # Main app component
│   │   └── index.js        # React entry point
│   ├── public/             # Static assets
│   ├── tailwind.config.js  # Tailwind pink theme
│   └── package.json        # Client dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- OpenAI API key
- SendGrid API key (optional)

### **1. Clone Repository**
```bash
git clone <repository-url>
cd icy-influencer-outreach
```

### **2. Install Dependencies**
```bash
# Install all dependencies (root, server, and client)
npm run install:all

# Or install separately
npm install              # Root dependencies
cd server && npm install # Server dependencies
cd ../client && npm install # Client dependencies
```

### **3. Environment Setup**
```bash
# Copy environment template
cp server/.env.example server/.env

# Edit server/.env with your values:
MONGODB_URI=mongodb://localhost:27017/icy-influencer-db
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
SENDGRID_API_KEY=your-sendgrid-api-key-here
# ... other API keys
```

### **4. Start Development**
```bash
# Start both server and client concurrently
npm run dev

# Or start separately:
npm run server:dev  # Server on http://localhost:5000
npm run client:dev  # Client on http://localhost:3000
```

### **5. Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## 🎨 UI/UX Design Philosophy

### **Pink Theme Palette**
```css
/* Custom Pink Colors */
--pink-50: #fdf2f8      /* Lightest pink background */
--pink-500: #ec4899     /* Primary pink */
--rose-500: #f43f5e     /* Primary rose */
--blush-500: #f27045    /* Warm blush */
--dusty-500: #ab7c6b    /* Dusty rose */
```

### **Design Principles**
- **Neo-morphism**: Soft, 3D-like elements with subtle shadows
- **Glass Morphism**: Translucent cards with backdrop blur
- **Gradient Magic**: Smooth pink-to-rose gradients throughout
- **Micro-interactions**: Hover effects, scale transforms, and gentle animations
- **Accessibility**: High contrast, keyboard navigation, screen reader support

### **Component Classes**
```css
.btn-primary        /* Pink gradient buttons */
.card-glass         /* Glass morphism cards */
.card-influencer    /* Influencer profile cards */
.input-field        /* Pink-themed form inputs */
.text-gradient      /* Pink gradient text */
.animate-float      /* Floating animations */
```

## 🤖 AI Features Deep Dive

### **1. Influencer Persona Analysis**
```javascript
// Auto-generates personas like "Eco-Beauty Guru"
const persona = await aiService.analyzeInfluencerPersona(influencerData);
// Returns: persona, communicationStyle, brandAlignment, collaborationPotential
```

### **2. Smart Message Generation**
```javascript
// Personalized outreach messages
const message = await aiService.generateOutreachMessage({
  influencer,
  brand,
  messageType: 'initial',
  tone: 'professional',
  recentPosts: []
});
```

### **3. Brand Fit Scoring**
```javascript
// AI calculates 0-100 compatibility score
const fitScore = await aiService.calculateBrandFitScore(influencer, brand);
// Considers: content alignment, audience overlap, engagement quality
```

## 📊 Database Schema

### **Key Models**
- **User**: Authentication, profile, subscription
- **Brand**: Setup form data, AI insights, campaign goals
- **Influencer**: Profile, analytics, AI analysis, contact info
- **Campaign**: Targeting, influencers, performance tracking
- **Message**: Content, AI generation data, delivery tracking

### **Relationships**
```
User (1) ──> (N) Brand
Brand (1) ──> (N) Campaign
Campaign (N) ──> (N) Influencer
User (1) ──> (N) Message
```

## 🚦 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Brands**
- `GET /api/brands` - Get user's brands
- `POST /api/brands` - Create new brand

### **Influencers**
- `GET /api/influencers` - Search/filter influencers
- `GET /api/influencers/:id` - Get influencer details

### **AI Features**
- `POST /api/ai/generate-message` - Generate outreach message
- `POST /api/ai/analyze-influencer` - Analyze influencer persona
- `POST /api/ai/predict-performance` - Predict campaign performance

## 🔧 Configuration

### **Tailwind Pink Theme**
```javascript
// tailwind.config.js - Custom pink color palette
colors: {
  pink: { /* 50-950 shades */ },
  rose: { /* 50-950 shades */ },
  blush: { /* Custom warm tones */ },
  dusty: { /* Custom dusty rose */ }
}
```

### **Environment Variables**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/icy-influencer-db

# Authentication
JWT_SECRET=your-jwt-secret

# AI Integration
OPENAI_API_KEY=your-openai-key

# Email Service
SENDGRID_API_KEY=your-sendgrid-key

# Social Media APIs
YOUTUBE_API_KEY=your-youtube-key
INSTAGRAM_APP_ID=your-instagram-id
```

## 🚀 Deployment

### **Frontend (Netlify/Vercel)**
```bash
cd client
npm run build
# Deploy dist/ folder
```

### **Backend (Heroku/Railway)**
```bash
cd server
# Configure environment variables
# Deploy with Node.js buildpack
```

### **Database (MongoDB Atlas)**
- Create cluster and get connection string
- Update `MONGODB_URI` in environment

## 🛣️ Roadmap

### **Phase 1: Core Features** ✅
- [x] Beautiful pink-themed UI
- [x] User authentication
- [x] Brand setup form
- [x] Basic dashboard
- [x] AI integration foundation

### **Phase 2: Advanced Features** 🚧
- [ ] Complete influencer discovery
- [ ] AI message generation
- [ ] Campaign management
- [ ] Real-time analytics
- [ ] Email integration

### **Phase 3: Scale & Polish** 📋
- [ ] Social media API integration
- [ ] Advanced AI features
- [ ] Mobile app
- [ ] Team collaboration
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Acknowledgments

- **Design Inspiration**: Modern SaaS platforms with beautiful gradients
- **AI Integration**: OpenAI GPT for intelligent message generation
- **UI Library**: Tailwind CSS for rapid beautiful styling
- **Animation**: Framer Motion for smooth micro-interactions

---

<div align="center">

**Built with 💖 and lots of ☕ by the ICY Team**

*Transforming influencer outreach with AI and beautiful design*

</div>
