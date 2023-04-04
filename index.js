import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import SequelizeStore from "connect-session-sequelize";
import ArticleRoute from "./routes/articleRoute.js";
import UserRoute from "./routes/userRoute.js";
import AuthRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use(express.json());
app.use(AuthRoute);
app.use(UserRoute);
app.use(ArticleRoute);

// store.sync();

app.listen(process.env.APP_PORT, console.log("server running at port 5000"));
