var group = 4;
var count = Math.ceil(26 / group);
var primeArray = [2,3,5,7,11,13,17,19,23,29,31];

function process_word(word) {
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

var wordList = [];
var wordMap = {};

function read_word_list(dir) {
  var fs = require('fs');
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    var lines = (fs.readFileSync(dir + '/' + file) + '').split('\n');
    lines.forEach(function(line) {
      var word = line.toLowerCase();
      if (!wordMap[word]) {
        wordMap[word] = true;
        var wordPrime = process_word(word);
        if (wordPrime !== false) {
          wordList.push({
            word: word,
            prime: wordPrime
          });
        }
      }
    });
  });
  console.log('I am ready!!');
}

function calc_result(inputPrime) {
  var start = (new Date()).getTime();
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
  var end = (new Date()).getTime();
  console.log('Cost:' + (end - start) + 'ms');
  return result;
}

read_word_list('words');

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('LETTERPRESS> ');
rl.prompt();

var inputPrime, result;
rl.on('line', function(line) {
  line = line.trim();
  if (line.substr(0, 2) === 'go') {
    inputPrime = process_word(line.substring(3));
    result = calc_result(inputPrime);
    result.slice(0, 30).forEach(function(word) {
      console.log(word.word);
    });
  } else if (line.substr(0, 2) === 'in') {
    var inPrime = process_word(line.substring(3));
    var count = 0;
    result.forEach(function(word) {
      if (count < 30 && match(inPrime, word.prime)) {
        console.log(word.word);
        count++;
      }
    });
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});
