import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import toolRoutes from "./routes/tool.js";
import lendingRoutes from "./routes/lending.js";
import chatRoutes from "./routes/chat.routes.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import initializePassport from "./config/passport_config.js"; // Import passport configuration
import session from "express-session";

import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import passport from "passport";


/* OAUTH STUFF*/
initializePassport();


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
import { createServer } from "http";
import { Server } from "socket.io";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const server = createServer(app);
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(passport.initialize());
app.use(session({
    secret: process.env.JWT_SECRET,
    //secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/tools", toolRoutes);
app.use("/lendings", lendingRoutes);
app.use("/chat", chatRoutes);




/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
// mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
   server.listen(PORT, () => console.log(`Server Port: ${PORT}`));



    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: ["http://localhost:3000"],
        credentials: true,
      },
    });
    io.on("connection", (socket) => {
      console.log("socket io connected id is ___________ " + socket.id);
    

      global.socket = socket;

      socket.on("join_room", (userId) => {
        socket.join(userId); // creating a room for perticular user using it's own _id
        console.log("...............room joined" + userId);
        socket.emit("connected");
      });


socket.on("msg_received", (newMessageReceived) => {
  let chat = newMessageReceived.chat;

  if (!chat.users) return console.log("chat.users not defined");
  chat.users.forEach((user) => {
    if (user._id == newMessageReceived.sender._id) return;
    socket.in(user._id).emit("message received", newMessageReceived);
  });
});

      // Disconnect event
      socket.on("disconnect", () => {
        console.log("A client disconnected");
      });
    });
    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));



// Define routes for GitHub authentication
app.get("/home", (req, res) => {
    res.redirect("http://localhost:3000");
});

app.get("/auth/github", passport.authenticate("github"));
app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/home" }),
    function (req, res) {
        // Successful authentication, respond with JSON data
        console.log("Printing inside CB");
        console.log(req.user.id); // Access the GitHub user ID

        // Redirect to the login page with the GitHub ID in the URL
        res.redirect(`http://localhost:3000/login?githubId=${req.user.id}`);
    }
);


