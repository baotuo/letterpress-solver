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

function calc_board_letters(boardString) {
  if (boardString.length !== 25) {
    return false;
  }
  var result = {};
  var i, c, row, col;
  for (i = 0; i < boardString.length; i++) {
    c = boardString.charAt(i);
    if (result[c] === undefined) {
      result[c] = [];
    }
    result[c].push(i);
  }
  return result;
}

function calc_step(word, boardLetters) {
  var letters = calc_letters(word);
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
    if (letters[c] === boardLetters[c].length) {
      steps.push({ letter: c, choices: [boardLetters[c]] });
    } else {
      steps.push({ letter: c, choices: calc_combination(boardLetters[c], letters[c]) });
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

function test_step(board, step, first) {
  board = board.slice(0);
  step.forEach(function(index) {
    if (board[index] != 2 * first * -1) {
      board[index] = first;
    }
  });
  var is_around_mine = function(index, offsetX, offsetY) {
    var row = Math.floor(index / 5) + offsetX, col = index % 5 + offsetY;
    if (row < 0 || row > 4 || col < 0 || col > 4) {
      return true;
    }
    return board[row * 5 + col] * board[index] > 0;
  };
  var index;
  for (index = 0; index < board.length; index++) {
    if (board[index] != 0) {
      board[index] = board[index] / Math.abs(board[index]);
    }
    if (is_around_mine(index, -1, 0) && is_around_mine(index, 1, 0) && is_around_mine(index, 0, -1) && is_around_mine(index, 0, 1)) {
      board[index] = 2 * first;
    }
  }
  return board;
}

function calc_weight(before, after, first) {
  var calc_count = function(board) {
    var light = 0, deep = 0, emtpy = 0;
    board.forEach(function(p) {
      if (p === first) {
        light++;
      } else if (p === first * 2) {
        deep++;
      } else if (p === 0) {
        emtpy++;
      }
    });
    return {
      light: light,
      deep: deep,
      emtpy: emtpy
    };
  };
  var afterCount = calc_count(after);
  if (afterCount.emtpy === 0) {
    if ((afterCount.light + afterCount.deep) > 12) {
      return 999;
    } else {
      return -1;
    }
  }
  if (afterCount.deep > 12) {
    return 499;
  }
  var beforeCount = calc_count(before);
  return afterCount.light - beforeCount.light + (afterCount.deep - beforeCount.deep) * 2.5;
}

function new_board() {
  var i, board = [];
  for (i = 0; i < 25; i++) {
    board[i] = 0;
  }
  return board;
}

function word_for_step(boardString, step) {
  var result = '';
  step.forEach(function(index) {
    result += boardString.charAt(index);
  });
  return result;
}

function is_played_word(playedWords, word) {
  var i;
  for (i = 0; i < playedWords.length; i++) {
    if (playedWords[i].length >= word.length) {
      if (playedWords[i].substring(0, word.length) == word) {
        return true; 
      }
    }
  }
  return false;
}

function is_valid_word(wordList, word) {
  var i;
  for (i = 0; i < wordList.length; i++) {
    if (wordList[i].word == word) {
      return true;
    }
  }
  return false;
}

function Guess(boardString, possibleWordList) {
  var self = this;
  self.boardString = boardString;
  self.board = new_board();
  self.boardLetters = calc_board_letters(boardString);
  self.wordList = possibleWordList.slice(0);
  self.first = 1;
  self.playedWords = [];

  // self.wordList.forEach(function(word) {
  //   word.letters = calc_letters(word);
  // });

  self.apply_step = function(step) {
    var stepWord = word_for_step(self.boardString, step);
    if (!is_valid_word(stepWord)) {
      console.log('not in dictionary');
      return false;
    }
    if (is_played_word(self.playedWords, stepWord)) {
      console.log('already played');
      return false;
    }
    console.log(stepWord + ' played');
    self.board = test_step(self.board, step, self.first);
    self.first *= -1;
    self.playedWords.push(stepWord);
  };

  var choose = function(board, playedWords, first, deep) {
    var choices = [], bestWeight = 0;
    self.wordList.forEach(function(word) {
      if (is_played_word(playedWords, word.word)) {
        return;
      }
      if (bestWeight === 999) {
        return;
      }
      var steps = calc_step(word.word, self.boardLetters);
      steps.forEach(function(step) {
        var after = test_step(board, step, first);
        var weight = calc_weight(board, after, first);
        choices.push({
          weight: weight,
          step: step,
          word: word.word,
          after: after
        });
      });
    });
    choices.sort(function(a, b) {
      return b.weight - a.weight;
    });
    if (deep === 0) {
      return choices;
    }
    var i, choice, nextChoices;
    for (i = 0; i < choices.length; i++) {
      choice = choices[i];
      nextChoices = choose(choice.after, playedWords.slice(0).push(choice.word), first * -1, deep - 1);
      if (nextChoices[0].weight !== 999) {
        return choices.slice(i);
      }
    }
    return [];
  };

  self.guess = function() {
    return choose(self.board, self.playedWords, self.first, 1)[0];
  };

  self.output_board = function() {
    var i, v;
    for (i = 0; i < self.board.length; i++) {
      v = '  ' + self.board[i];
      process.stdout.write(v.substring(v.length - 3) + '(' + self.boardString.charAt(i) + ') ');
      if ((i + 1) % 5 == 0) {
        console.log('');
      }
    }
  };
}

exports.calc_letters = calc_letters;
exports.calc_board_letters = calc_board_letters;
exports.calc_step = calc_step;
exports.test_step = test_step;
exports.calc_weight = calc_weight;
exports.new_board = new_board;
exports.Guess = Guess;