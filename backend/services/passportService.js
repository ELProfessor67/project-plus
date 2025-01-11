import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
const GoogleStrategy = passportGoogle.Strategy;
import { prisma } from "../prisma/index.js";
import dotenv from 'dotenv';
dotenv.config();



export const initPassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
                clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                callbackURL: `${process.env.BACKEND_URL}/api/v1/user/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const { id, displayName, emails } = profile;
                    const email = emails[0].value;
                    // Check if user exists in the database
                    let user = await prisma.user.findUnique({
                        where: { email }
                    });



                    if (!user) {
                        const userData = {
                            name: displayName,
                            email,
                            password_hash: 'no_password',
                            account_name: displayName,
                            focus: ["Nothing"]
                        }
                        user = await prisma.user.create({
                            data: userData
                        });
                    }

                    // Pass user object to the done callback
                    done(null, user);
                } catch (err) {
                    done(err, null);
                }
            }
        )
    );
}
