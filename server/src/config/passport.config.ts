
import { User } from "@/models/user.model";
import passport from "passport";
import { Strategy as GoogleStrategy, type Profile } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"), undefined);

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            provider: "google",
          });
        }

        done(null, user);
      } catch (err) {
        done(err as any, undefined);
      }
    }
  )
);
