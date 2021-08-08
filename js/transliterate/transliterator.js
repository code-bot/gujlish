const constants = require('./constants');
const g2E = require('./mappings/gujurati_to_english.json');
const _supportedSourceAlphabets = [constants.alphabet.GUJURATI];
const _supportedDestinationAlphabets = [constants.alphabet.ENGLISH];
/**
 * A class that transliterates from one alphabet to another.
 */
class Transliterator {
  /**
   * Transliterates the input text from the source alphabet, to the destination
   * alphabet.
   * @param {string} text Input text to transliterate.
   * @param {alphabet} source Source alphabet.
   * @param {alphabet} destination Destination alphabet.
   * @return {Object} Transliterated text and any errors.
   */
  transliterate(text, source, destination) {
    let error = null;
    if (!_supportedSourceAlphabets.includes(source)) {
      error = `Unsupported source alphabet: ${source}`;
      return {
        output: null,
        error: error,
      };
    }
    if (!_supportedDestinationAlphabets.includes(destination)) {
      error = `Unsupported destination alphabet: ${destination}`;
      return {
        output: null,
        error: error,
      };
    }
    if (source == destination) {
      return {
        output: text,
        error: null,
      };
    }
    let transliteratedText = '';
    for (const codePoint of text) {
      console.log(codePoint);
      let transliteratedChar = codePoint;
      if (g2E[codePoint]) {
        transliteratedChar = g2E[codePoint];
      }
      console.log(transliteratedChar);
      transliteratedText += transliteratedChar;
    }
    return {
      output: transliteratedText,
      error: null,
    };
  }
}

module.exports = Transliterator;
