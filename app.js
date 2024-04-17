const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require('./auth/config')(passport);
const connectDB = require("./db/connect");
let cors = require("cors");
const { lockEndpoint, unlockEndpoint } = require("./middleware/lock-endpoint")
const { setupSub } = require("./middleware/pub-sub")
const WotInteraction = require("./middleware/wot-interaction")
const bodyParser = require('body-parser');

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: false,

  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

setupSub();
const controller = new WotInteraction("http://trout-sought-marlin.ngrok-free.app/light");
controller.connect().then(() => { console.log("Connected to WoT Thing") });

// Passport session serialization/deserialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Implement logic to retrieve user data from database (replace with your actual logic)

  done(null, user);
});

// Authentication route (redirect to Google OAuth consent screen)
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
  })
);

// Google OAuth callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/homepage",
    failureRedirect: "/login-error",
  })
);

// Protected route example (checks for authenticated user)
app.get("/protected", (req, res) => {

  if (req.isAuthenticated()) {
    res.send("Welcome, authenticated user!");
  } else {
    res.redirect("/login");
  }
});


// Error handling route for unauthorized login attempts
app.get("/login-error", (req, res) => {
  res.send(
    "Login failed. Please use a work or school account associated with mitwpu.edu.in"

  );
});

app.get("/success", (req, res) => {

  res.send("welcome " + req.user);
});

app.get('/user-info', (req, res) => {

  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user })
  } else {
    res.status(400).json({ message: "Not Authorized" })
  }
})

app.get("/logout", (req, res, next) => {
  console.log("Logout");
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).clearCookie("connect.sid", {
      path: "http://localhost:3000",
    });
    req.session.destroy(function (err) {
      res.redirect("http://localhost:3000");
    });
  });
});

app.get("/start", lockEndpoint, (req, res) => {
  console.log("111 " + req.user)
  res.status(200).json({ message: "Welcome, authenticated user!" });
})

app.get("/quit", unlockEndpoint, (req, res) => {
  res.json({ message: "Goodbye!" });
})

app.post("/wot/led1-intensity", (req, res) => {
  const intensity = req.body.intensity;
  controller.setLedIntensity("led1", intensity);
  res.json({ message: "Intensity set to " + intensity });
})

app.post("/wot/led2-intensity", (req, res) => {
  const intensity = req.body.intensity;
  controller.setLedIntensity("led2", intensity);
  res.json({ message: "Intensity set to " + intensity });
})

app.post("/wot/set-username", (req, res) => {
  const username = req.body.username;
  controller.setUsername(username);
  res.json({ message: "Username set to " + username });
})

app.post("/wot/oled-off", (req, res) => {
  controller.oledOff();
  res.json({ message: "OLED turned off" });
});

const start = async () => {
  try {
    await connectDB(process.env.db_connect);
    app.listen(5000, console.log(`Server listening on port 5000`));
  } catch (error) {
    console.log(error);
  }
};

start();
