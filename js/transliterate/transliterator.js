const constants = require('./constants');
const chars = require('./mappings/gujurati_to_english/chars.json');
const fs = require('fs');
const vision = require('@google-cloud/vision');
const _supportedSourceAlphabets = [constants.alphabet.GUJURATI];
const _supportedDestinationAlphabets = [constants.alphabet.ENGLISH];

/**
   * function to encode file data to base64 encoded string
   * @param {string} file Input file to encode.
   * @return {Object} Encoded file data.
   */
function base64Encode(file) {
  // read binary data
  const imageFile = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return Buffer.from(imageFile).toString('base64');
}

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
      currChar = chars[codePoint];
      if (currChar == null || currChar.type == 'unknown') {
        transliteratedText += codePoint;
      } else if (currChar.type == 'consonant' || currChar.type == 'numeric') {
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
    }
    return {
      output: transliteratedText,
      error: null,
    };
  }

  /**
   * Transliterates the input text from the source alphabet, to the destination
   * alphabet.
   * @param {string} filename Input image file to transliterate.
   * @param {alphabet} source Source alphabet.
   * @param {alphabet} destination Destination alphabet.
   * @return {Object} Transliterated text and any errors.
   */
  async transliterateImage(filename, source, destination) {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    const request = {
      'image': {
        'content': base64Encode(filename),
      },
      'imageContext': {
        'languageHints': ['gu'],
      },
    };
    // Performs text detection on the local file
    const [result] = await client.documentTextDetection(request);
    if (result.error) {
      return {
        output: null,
        error: result.error,
      };
    } else {
      const detections = result.textAnnotations;
      return this.transliterate(detections[0].description, source, destination);
    }
  }
}

module.exports = Transliterator;
