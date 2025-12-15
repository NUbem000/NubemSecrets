const GoogleStrategy = require('passport-google-oauth20').Strategy;

const initializePassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === 'production'
          ? 'https://nubemsecrets-api-y54rldgyva-ew.a.run.app/auth/google/callback'
          : 'http://localhost:8080/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = {
            id: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            photo: profile.photos[0]?.value,
            provider: 'google'
          };
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

module.exports = { initializePassport };
