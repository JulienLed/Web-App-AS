const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");
const initialize = require("./middelwares/passport");
const logInRouter = require("./routes/login");
const registrerRouter = require("./routes/registrer");
const isLogged = require("./middelwares/checkIsLog");
const clientRouter = require("./routes/client");
const rdvRouter = require("./routes/rdv");
const asRouter = require("./routes/as");
const logOutRouter = require("./routes/logout");

dotenv.config();

app.use(helmet());

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 600,
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 30,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
    },
    unset: "destroy",
  })
);

initialize(passport);
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;

app.use("/login", logInRouter);
app.use("/registrer", registrerRouter);
app.use(isLogged);
app.use("/client", clientRouter);
app.use("/rdv", rdvRouter);
app.use("/as", asRouter);
app.use("/logout", logOutRouter);

app.listen(PORT, () => {
  console.log("Server is listen on port " + PORT);
});
