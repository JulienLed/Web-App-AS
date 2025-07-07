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
const pgSession = require("connect-pg-simple")(session);
const pool = require("./middelwares/bd");

dotenv.config();

app.use(helmet());

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 6000,
  })
);
app.set("trust proxy", 1); // 👈 obligatoire sur Render

app.use(
  session({
    store: new pgSession({ pool }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      maxAge: 1000 * 60 * 30,
      secure: true,
      httpOnly: true,
      sameSite: "none",
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
  console.log("NODE_ENV =", process.env.NODE_ENV);
});
