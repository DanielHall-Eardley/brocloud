const express = require("express");
const app = express();
const path = require("path");
const setupUtil = require("./util/setupUtil");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const initServer = () => {
  app.set("view-engine", "ejs");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const staticUrl = path.join(__dirname, "dist");
  const assetUrl = path.join(__dirname, "assets");

  app.use(express.static(staticUrl));
  app.use(express.static(assetUrl));
  app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "static", "landing", "index.html");
    res.sendFile(filePath);
  });

  const musicRoutes = require("./routes/musicRoutes");
  const signupLoginRoutes = require("./routes/signupLoginRoutes");
  const youtubeApiRoutes = require("./routes/youtubeApiRoutes");
  const { authorizeAccess } = require("./util/auth");

  app.use(signupLoginRoutes);
  app.use(authorizeAccess);
  app.use("/music", musicRoutes);
  app.use("/youtube-api", youtubeApiRoutes);

  app.use((error, req, res, next) => {
    console.log(error);
    const status = error.status || 500;
    const err = {
      message: error.message,
      status: error.status,
    };
    res.status(status).json(err);
  });

  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log("connected at " + port);
  });

  return server;
};

setupUtil.connect(initServer).catch((error) => {
  console.log(error);
});

/*
  To do 
  - get people youtube login information to retrieve their playlists
  - fix login and authorization
  - fix error display in front end
 */
