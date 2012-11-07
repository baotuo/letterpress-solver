var group = 4;
var count = Math.ceil(26 / group);
var primeArray = [2,3,5,7,11,13,17,19,23,29,31];

function calc_word_prime(word) {
  var i, c, result = [];
  for (i = 0; i < group; i++) {
    result[i] = 1;
  } 
  for (i = 0; i < word.length; i++) {
    c = word.charCodeAt(i) - 97;
    if (c < 0 || c > 25) {
      return false;
    }
    result[Math.floor(c / count)] *= primeArray[c % count];
  }
  return result;
}

function match(wordPrime, inputPrime) {
  var i;
  for (i = 0; i < group; i++) {
    if (inputPrime[i] % wordPrime[i] !== 0) {
      return false;
    }
  }
  return true;
}

function read_word_list(dir) {
  var wordList = [], wordMap = {};
  var fs = require('fs');
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    var lines = (fs.readFileSync(dir + '/' + file) + '').split('\n');
    lines.forEach(function(line) {
      var word = line.toLowerCase();
      if (word.length > 0 && !wordMap[word]) {
        wordMap[word] = true;
        var wordPrime = calc_word_prime(word);
        if (wordPrime !== false) {
          wordList.push({
            word: word,
            prime: wordPrime
          });
        }
      }
    });
  });
  return wordList;
}

function calc_possible_word_list(wordList, inputPrime) {
  var result = [];
  wordList.forEach(function(word) {
    if (match(word.prime, inputPrime)) {
      result.push(word);
    }
  });
  result.sort(function(a, b) {
    var al = a.word.length;
    var bl = b.word.length;
    if (al > bl) return -1;
    if (al < bl) return 1;
    return 0;
  });
  return result;
}

exports.read_word_list = read_word_list;
exports.calc_word_prime = calc_word_prime;
exports.calc_possible_word_list = calc_possible_word_list;
exports.match = match;