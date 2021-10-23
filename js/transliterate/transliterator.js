const constants = require('./constants');
const chars = require('./mappings/gujurati_to_english/chars.json');
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
    let currChar = null;
    for (const codePoint of text) {
      console.log(codePoint);
      currChar = chars[codePoint];
      console.log(currChar);
      if (currChar == null || currChar.type == 'unknown') {
        transliteratedText += codePoint;
      } else if (currChar.type == 'consonant') {
        transliteratedText += currChar.iso;
      } else if (currChar.type == 'vowel') {
        if (currChar.subtype == 'independent') {
          transliteratedText += currChar.iso;
        } else if (currChar.subtype == 'diacritic') {
          transliteratedText = transliteratedText.slice(0, -1) +
            currChar.iso;
        }
      } else if (currChar.type == 'nasalization') {
        transliteratedText += currChar.iso;
      } else if (currChar.type == 'special') {
        // Handle each special character separately.
        // TODO: Add other special cases.
        switch (codePoint) {
          case '\u0acd':
            transliteratedText = transliteratedText.slice(0, -1);
            break;
          default:
            break;
        }
      }
      console.log(transliteratedText);
    }

    return {
      output: transliteratedText,
      error: null,
    };
  }
}

module.exports = Transliterator;
