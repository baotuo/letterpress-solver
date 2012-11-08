var solve = require('./solve'),
    guess = require('./guess');

var wordList = solve.read_word_list('words');

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('LETTERPRESS> ');
rl.prompt();

var inputPrime, possibleWordList, g;
rl.on('line', function(line) {
  line = line.trim();
  var command = line;
  if (line.indexOf(' ') > 0) {
    command = line.substr(0, line.indexOf(' '));
  }
  if (command === 'go') {
    var boardString = line.substring(3);
    inputPrime = solve.calc_word_prime(boardString);
    possibleWordList = solve.calc_possible_word_list(wordList, inputPrime);
    g = new guess.Guess(boardString, possibleWordList);
    console.log('possible words:' + possibleWordList.length);
  } else if (command === 'in') {
    var inPrime = solve.calc_word_prime(line.substring(3));
    var count = 0;
    possibleWordList.forEach(function(word) {
      if (count < 30 && solve.match(inPrime, word.prime)) {
        console.log(word.word);
        count++;
      }
    });
  } else if (command === 'guess') {
    console.log(g.guess());
  } else if (command === 'out') {
    g.output_board();
  } else if (command === 'run') {
    try {
      var step = line.substring(4).trim();
      if (step.length === 0) {
        var start = new Date().getTime();
        g.guess_and_apply();
        g.output_board();
        console.log('cost:' + (new Date().getTime() - start) + 'ms');
      } else {
        g.apply_step(JSON.parse(step));
      }
    } catch(e) {
      console.log(e);
      console.log('not valid step:' + step);
    }
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});
