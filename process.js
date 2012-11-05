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

function calc_letters(word) {
  var i, c, result = {};
  for (i = 0; i < word.length; i++) {
    c = word.charAt(i);
    if (result[c] === undefined) {
      result[c] = 1;
    } else {
      result[c]++;
    }
  }
  return result;
}

function calc_board_letters(board) {
  if (board.length !== 25) {
    return false;
  }
  var result = {};
  var i, c, row, col;
  for (i = 0; i < board.length; i++) {
    c = board.charAt(i);
    row = Math.floor(i / 5);
    col = i % 5;
    if (result[c] === undefined) {
      result[c] = [];
    }
    result[c].push([ row, col ]);
  }
  return result;
}

function calc_step(word, letters, board) {
  var calc_combination = function(items, length) {
    var result = [];
    if (length === 1) {
      items.forEach(function(item) {
        result.push([ item ]);
      });
      return result;
    } else {
      var i, subResult;
      for (i = 0; i < items.length - 1; i++) {
        subResult = calc_combination(items.slice(i + 1), length - 1);
        subResult.forEach(function(c) {
          c.push(items[i]);
          result.push(c);
        });
      }
      return result;
    }
  };
  var calc_steps_combination = function(steps) {
    var result = [];
    if (steps.length === 1) {
      steps[0].choices.forEach(function(choice) {
        var s = {};
        s[steps[0].letter] = choice.slice(0);
        result.push(s);
      });
    } else {
      var subResult = calc_steps_combination(steps.slice(1));
      steps[0].choices.forEach(function(choice) {
        subResult.forEach(function(subSteps) {
          var c, s = {};
          s[steps[0].letter] = choice.slice(0);
          for (c in subSteps) {
            s[c] = subSteps[c].slice(0);
          }
          result.push(s);
        });
      });
    }
    return result;
  };

  var c, steps = [];
  for (c in letters) {
    if (letters[c] === board[c].length) {
      steps.push({ letter: c, choices: [board[c]] });
    } else {
      steps.push({ letter: c, choices: calc_combination(board[c], letters[c]) });
    }
  }
  steps = calc_steps_combination(steps);
  var result = [];
  steps.forEach(function(step) {
    var i, c, s = [];
    for (i = 0; i < word.length; i++) {
      c = word.charAt(i);
      s.push(step[c].pop());
    }
    result.push(s);
  });
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

function read_word_list(dir) {
  var wordMap = {};
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
            prime: wordPrime,
            letters: calc_letters(word)
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

// read_word_list('words');
// console.log(calc_board_letters('bedrmnkcyaejdrxyxuntcalkr'));
var steps = calc_step('rarrxymya', calc_letters('rarrxymya'), calc_board_letters('bedrmnkcyaejdrxyxuntcalkr'));
console.log(steps.length);
steps.forEach(function(step) {
  console.log(step);
});


// var readline = require('readline'),
//     rl = readline.createInterface(process.stdin, process.stdout);

// rl.setPrompt('LETTERPRESS> ');
// rl.prompt();

// var inputPrime, result;
// rl.on('line', function(line) {
//   line = line.trim();
//   if (line.substr(0, 2) === 'go') {
//     inputPrime = process_word(line.substring(3));
//     result = calc_result(inputPrime);
//     result.slice(0, 30).forEach(function(word) {
//       console.log(word.word);
//     });
//   } else if (line.substr(0, 2) === 'in') {
//     var inPrime = process_word(line.substring(3));
//     var count = 0;
//     result.forEach(function(word) {
//       if (count < 30 && match(inPrime, word.prime)) {
//         console.log(word.word);
//         count++;
//       }
//     });
//   }
//   rl.prompt();
// }).on('close', function() {
//   console.log('Have a great day!');
//   process.exit(0);
// });
