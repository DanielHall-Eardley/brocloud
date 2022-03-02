const express = require('express');
const app = express();
const path = require('path');
const setupUtil = require('./util/setupUtil');

const initServer = () => {
  app.set('view-engine', 'ejs');
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  const staticUrl = path.join(__dirname, 'dist');
  const assetUrl = path.join(__dirname, 'assets');

  app.use(express.static(staticUrl));
  app.use(express.static(assetUrl));
  app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'static', 'landing', 'index.html');
    res.sendFile(filePath);
  })

  const musicRoutes = require('./routes/musicRoutes');
  const signupLoginRoutes = require('./routes/signupLoginRoutes');
  const youtubeApiRoutes = require('./routes/youtubeApiRoutes');

  app.use('/music', musicRoutes);
  app.use(signupLoginRoutes);
  app.use('/youtube-api', youtubeApiRoutes);
  app.use((error, req, res, next) => {
    console.log(error)
    const status = error.status || 500
    res.status(status).json({ error })
  })
  
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log('connected at ' + port)
  });

  return server
}

setupUtil.connect(initServer)
  .catch(error => { console.log(error)})


/*
  To do 
  - timestamp error
  - update squad section when additional people sign up
  - get people youtube login information to retrieve their playlists
 */


