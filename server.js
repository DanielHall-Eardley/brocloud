const express = require('express');
const app = express();
const path = require('path');
const mongoUtil = require('./mongoUtil');

const port = process.env.PORT || 3000;

mongoUtil.connect((err) => {
  try {
    if (err) throw new Error(err)
    console.log('db connected')
    app.listen(port, () => {
      console.log('connected at ' + port)
    });

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
    
    const routes = require('./routes');
    app.use(routes);
    app.use((error, req, res, next) => {
      console.log(error)
      const status = error.status || 500
      res.status(status).json({ error: error.message })
    })
  } catch (error) {
    console.log(error);
  } 
})





