import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { connectPortfolioDB, connectVaultDB } from './config/db.js';
import { errorHandler } from './middleware/error.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); 
    if (origin.includes('.localhost:5173')) {
      return callback(null, true);
    }
    if (origin.endsWith('.josan.tech') || origin === 'https://josan.tech') {
      return callback(null, true);
    }
    const allowed = [
      process.env.CLIENT_URL1,
      process.env.CLIENT_URL2,
      'https://personaldb.josan.tech'
    ];
    if (allowed.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ✅ EXPRESS-SESSION must come BEFORE passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret_key_change_in_production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI_PORTFOLIO || 'mongodb://localhost:27017/portfolio',
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 15000,
    family: 4,
  }),
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    sameSite: 'lax',
  },
}));

// ✅ PASSPORT INITIALIZATION must come AFTER session
app.use(passport.initialize());
app.use(passport.session());

async function startServer() {

  await connectPortfolioDB();
  await connectVaultDB();

  console.log("✅ Databases connected");

  // ✅ IMPORT PASSPORT CONFIG AFTER DB CONNECTS (prevents circular dependency)
  await import('./config/passport.js');

  // IMPORT ROUTES AFTER DB CONNECTS
  const profileRoutes = (await import('./routes/portfolio/profileRoutes.js')).default;
  const educationRoutes = (await import('./routes/portfolio/educationRoutes.js')).default;
  const experienceRoutes = (await import('./routes/portfolio/experienceRoutes.js')).default;
  const projectRoutes = (await import('./routes/portfolio/projectRoutes.js')).default;
  const skillRoutes = (await import('./routes/portfolio/skillRoutes.js')).default;
  const certificationRoutes = (await import('./routes/portfolio/certificationRoutes.js')).default;
  const interestRoutes = (await import('./routes/portfolio/interestRoutes.js')).default;
  const portfolioUploadRoutes = (await import('./routes/portfolio/uploadRoutes.js')).default;

  const authRoutes = (await import('./routes/vault/authRoutes.js')).default;
  const itemRoutes = (await import('./routes/vault/itemRoutes.js')).default;
  const resumeRoutes = (await import('./routes/vault/resumeRoutes.js')).default;
  const vaultUploadRoutes = (await import('./routes/vault/uploadRoutes.js')).default;
  const publicRoutes = (await import('./routes/public.js')).default;
  const apiKeyRoutes = (await import('./routes/apiKeyRoutes.js')).default;
  const apiPortfolioRoutes = (await import('./routes/apiPortfolioRoutes.js')).default;
  const publicFileRoutes = (await import('./routes/publicFileRoutes.js')).default;

  const searchRoutes = (await import('./routes/searchRoutes.js')).default;
  const templateRoutes = (await import('./routes/templateRoutes.js')).default;
  const adminRoutes = (await import('./routes/adminRoutes.js')).default;
  const userRoutes = (await import('./routes/userRoutes.js')).default;
  const oauthRoutes = (await import('./routes/oauth.js')).default;
  const contactRoutes = (await import('./routes/contactRoutes.js')).default;
  const twoFactorRoutes = (await import('./routes/twoFactorRoutes.js')).default;
  const reviewRoutes = (await import('./routes/reviewRoutes.js')).default;
  const unusedUsersRoutes = (await import('./routes/unusedUsersRoutes.js')).default;

  // ✅ EXISTING ROUTES (JWT only, for web dashboard)
  app.use('/api/portfolio/profile', profileRoutes);
  app.use('/api/portfolio/education', educationRoutes);
  app.use('/api/portfolio/experience', experienceRoutes);
  app.use('/api/portfolio/projects', projectRoutes);
  app.use('/api/portfolio/skills', skillRoutes);
  app.use('/api/portfolio/certifications', certificationRoutes);
  app.use('/api/portfolio/interests', interestRoutes);
  app.use('/api/portfolio/upload', portfolioUploadRoutes);

  app.use('/api/auth', authRoutes);
  app.use('/api/auth', oauthRoutes);
  app.use('/api/auth/2fa', twoFactorRoutes);
  app.use('/public', publicFileRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/admin', unusedUsersRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/reviews', reviewRoutes);

  app.use('/api/vault/items', itemRoutes);
  app.use('/api/vault/resume', resumeRoutes);
  app.use('/api/vault/upload', vaultUploadRoutes);

  // ✅ NEW ROUTES (API Key + JWT, for external apps)
  app.use('/api/getport', apiPortfolioRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api', publicRoutes);
  app.use('/api/keys', apiKeyRoutes);

  app.get('/', (req, res) => res.send('Personal Database API is running...'));

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();