const express = require('express');
const app = express();
const port = process.env.port || 3000;
const Transliterator = require('./transliterate/transliterator');
const transliterator = new Transliterator();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/transliterate', (req, res) => {
  const result =
    transliterator.transliterate('તમે કેમ છો', 'gujurati', 'english');
  if (result.error) {
    console.log(result.error);
    res.send(result);
  } else {
    console.log(result.output);
    res.send(result);
  }
});

app.listen(port, () => {
  console.log(`Gujlish is listening on http://localhost:${port}`);
});
