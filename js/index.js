const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const port = process.env.port || 3000;
const Transliterator = require('./transliterate/transliterator');
const transliterator = new Transliterator();

// Adding Helmet to enhance your API's security
app.use(helmet());

// Enabling CORS for all requests
app.use(cors());

// Adding morgan to log HTTP requests
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/transliterate', (req, res) => {
  const text = req.query.text;
  const src = req.query.src;
  const dest = req.query.dest;
  const result =
    transliterator.transliterate(text, src, dest);
  if (result.error) {
    console.log(result.error);
  } else {
    console.log(result.output);
  }
  res.send(result);
});

app.listen(port, () => {
  console.log(`Gujlish is listening on http://localhost:${port}`);
});
