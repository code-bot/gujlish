const express = require('express');
const path = require('path');
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
  res.sendFile(path.join(process.cwd(), '/../client/index.html'));
});

app.get('/transliterate', async (req, res) => {
  const text = req.query.text;
  const filename = req.query.filename;
  const src = 'gujurati';
  const dest = 'english';
  result = null;
  if (text) {
    result =
      transliterator.transliterate(text, src, dest);
  } else if (filename) {
    result = await transliterator.transliterateImage(filename, src, dest);
  }
  if (result == null) {
    console.log('No result');
  } else if (result.error) {
    console.log(result.error);
  } else {
    console.log(result.output);
  }
  res.send(result);
});

app.listen(port, () => {
  console.log(`Gujlish is listening on http://localhost:${port}`);
});
