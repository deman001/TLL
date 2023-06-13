import passport from "passport";
import FacebookStrategy from "passport-facebook";
import GitHubStrategy from "passport-github";
import GoogleStrategy from "passport-google-oauth";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const GITHUB_CLIENT_ID = "7b9ae8b3e8ce923fe4e6";
const GITHUB_CLIENT_SECRET = "03ee853e97743352984027630dcc16e1bad1fe67";


const initializePassport = () => {
    /*
    passport.use(
        new FacebookStrategy(
            {
                clientID: 'FACEBOOK_APP_ID',
                clientSecret: 'FACEBOOK_APP_SECRET',
                callbackURL: "http://localhost:3001/auth/facebook/callback",
            },
            function (accessToken, refreshToken, profile, cb) {
                User.findOrCreate({ facebookId: profile.id }, function (err, user) {
                    return cb(err, user);
                });
            }
        )
    );
     */
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // GitHub authentication callback
    passport.use(
        new GitHubStrategy(
            {
                clientID: GITHUB_CLIENT_ID,
                clientSecret: GITHUB_CLIENT_SECRET,
                callbackURL: "http://localhost:3001/auth/github/callback",
            },
            async function (accessToken, refreshToken, profile, done) {
                const { id, displayName, emails, username, _json } = profile;
                const { avatar_url } = _json;
                try {
                    let user = await User.findOne({githubId: id});

                    if (!user) {
                        // User is not registered, so let's create a new user
                        let firstName = "Default";
                        let lastName = "Name";

                        if (displayName) {
                            const nameParts = displayName.split(" ");
                            firstName = nameParts[0] || "";
                            lastName = nameParts.slice(1).join(" ");
                        }

                        // Extract the primary email from the emails array
                        const combineString = username + '@' + id;
                        const email = emails && emails.length > 0 ? emails[0].value : `${combineString}`;


                        const salt = await bcrypt.genSalt();
                        const passwordHash = await bcrypt.hash(id + username, salt);
                        // Create the new user instance
                        user = new User({
                            firstName,
                            lastName,
                            email,
                            picturePath: avatar_url,
                            password: passwordHash, // Provide a valid password value or generate one
                            username: "", // Include the GitHub username if needed
                            githubId: id,
                            location: "United States",
                            occupation: "Developer",
                            viewedProfile: 1000,
                            impressions: 1000,
                        });

                        try {
                            await user.validate();

                            // Save the user
                            await user.save();

                            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                            console.log("Logging token 1: ")
                            console.log(token);

                            delete user.password;
                            return done(null, { id, user });

                        } catch (error) {
                            // Redirect the user to the special registration form for GitHub sign-ups
                            const redirectURL = `http://localhost:3000/register/github?userId=${user._id}&firstName=${user.firstName}&lastName=${user.lastName}&email=${user.email}`;
                            return done(null, false, {message: "Incomplete registration", redirectURL});
                        }
                    }


                    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                    console.log("User ID:", user._id);
                    console.log("Token:", token);
                    console.log("GithubID:", id)
                    delete user.password;
                    return done(null, { id, user });
                } catch (err) {
                    return done(err);
                }
            }
        )
    );



    /*
    passport.use(
        new GoogleStrategy(
            {
                clientID: 'GOOGLE_CLIENT_ID',
                clientSecret: 'GOOGLE_CLIENT_SECRET',
                callbackURL: "http://localhost:3001/auth/google/callback",
            },
            function (accessToken, refreshToken, profile, cb) {
                User.findOrCreate({ googleId: profile.id }, function (err, user) {
                    return cb(err, user);
                });
            }
        )
    );
     */

};

export default initializePassport;
