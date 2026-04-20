import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { uploadGoogleProfilePicture } from '../controllers/vault/uploadController.js';

// ── Helper function to generate unique username ──────────────────────────────
const generateUniqueUsername = async (baseUsername) => {
  const { default: User } = await import('../models/common/User.js');
  
  let username = baseUsername;
  let exists = await User.findOne({ username });
  
  // If username exists, append a random suffix
  while (exists) {
    const randomSuffix = Math.floor(Math.random() * 10000);
    username = `${baseUsername}_${randomSuffix}`;
    exists = await User.findOne({ username });
  }
  
  return username;
};

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`, 
      session: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ✅ Defer User model import to avoid circular dependency
        const { default: User } = await import('../models/common/User.js');
        
        // Check if user already exists by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists by email (for linking accounts)
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google OAuth to existing account
          user.googleId = profile.id;
          user.googleEmail = profile.emails[0].value;
          user.authProvider = 'google';
          
          // If user doesn't have a profile image, try to upload Google's
          if (!user.profileImage && profile.photos && profile.photos[0]?.value) {
            try {
              const s3Key = await uploadGoogleProfilePicture(profile.photos[0].value, user._id.toString());
              if (s3Key) {
                user.profileImage = s3Key;
              }
            } catch (err) {
              // Continue without avatar if upload fails
            }
          }
          
          await user.save();
          return done(null, user);
        }

        // Create new user from Google profile
        const baseUsername = profile.displayName.replace(/\s+/g, '_').toLowerCase() || profile.emails[0].value.split('@')[0];
        const uniqueUsername = await generateUniqueUsername(baseUsername);

        const newUser = new User({
          username: uniqueUsername,
          googleId: profile.id,
          googleEmail: profile.emails[0].value,
          email: profile.emails[0].value,
          profileImage: null, // Will be set after upload
          authProvider: 'google',
          // No password for OAuth users
          password: null,
        });

        await newUser.save();

        // Mark as new user for welcome email
        newUser._isNewUser = true;

        // Download and upload Google profile picture to S3
        if (profile.photos && profile.photos[0]?.value) {
          try {
            const s3Key = await uploadGoogleProfilePicture(profile.photos[0].value, newUser._id.toString());
            if (s3Key) {
              newUser.profileImage = s3Key;
              await newUser.save();
            }
          } catch (err) {
            // Continue without avatar if upload fails
          }
        }

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ✅ These two are critical — most people miss this!
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // ✅ Defer User model import to avoid circular dependency
    const { default: User } = await import('../models/common/User.js');
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
