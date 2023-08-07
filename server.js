const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(8080, () => {
  console.log('Server started on http://localhost:8080');
});

app.use((req, res, next) => {
    // Set Cache-Control headers to prevent caching of script.js
    if (req.url === '/script.js') {
      res.setHeader('Cache-Control', 'no-cache');
    }
    next();
  });
  