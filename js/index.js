const express = require('express');
const app = express();
const port = process.env.port || 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/transliterate', (req, res) => {
  console.log('something else');
});

app.listen(port, () => {
  console.log(`Gujlish is listening on http://localhost:${port}`);
});
