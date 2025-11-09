const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./src/model/User");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/tp2_auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"));

app.set("view engine", "pug");
app.set("views", "./src/views");
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secretKey123",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: "Wrong password" });
    return done(null, user);
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const authRoutes = require("./src/routes/auth");
const bookRoutes = require("./src/routes/book");

app.use("/", authRoutes);
app.use("/books", bookRoutes);

const PORT = 9000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
