var assert = require('should'),
    guess = require('./guess');

describe('calc_letters', function() {
  it('should return letter\'s count in word', function() {
    guess.calc_letters('word').should.eql({ w: 1, o: 1, r: 1, d: 1 });
    guess.calc_letters('iweekly').should.eql({ i: 1, w: 1, e: 2, k: 1, l: 1, y: 1 });
  });
});

describe('calc_board_letters', function() {
  it('should return letter\'s positions in board', function() {
    guess.calc_board_letters('aaaaabbbbbcccccdddddeeeee').should.eql({ a: [ 0, 1, 2, 3, 4 ], b: [ 5, 6, 7, 8, 9], c: [ 10, 11, 12, 13, 14 ], d: [ 15, 16, 17, 18, 19 ], e: [ 20, 21, 22, 23, 24 ] });
  });
});

describe('calc_step', function() {
  it('should return how a word put in board', function() {
    guess.calc_step('xray', guess.calc_board_letters('bedrmnkcyaejdrxyxuntcalkr')).should.have.length(24);
    guess.calc_step('mb', guess.calc_board_letters('bedrmnkcyaejdrxyxuntcalkr')).should.have.length(1);
    guess.calc_step('aa', guess.calc_board_letters('bedrmnkcyaejdrxyxuntcalkr')).should.have.length(1);
  });
});

describe('test_step', function() {
  it('should return how a word put in board', function() {
    guess.test_step(guess.new_board(), [3, 4, 9], 1).should.eql([ 0, 0, 0, 1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
  });
});

describe('new_board', function() {
  it('should return a new board', function() {
    guess.new_board().should.eql([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
  });
});

describe('calc_weight', function() {
  it('should return a word\'s weight', function() {
    guess.calc_weight(guess.new_board(), [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ], 1).should.equal(999);
    guess.calc_weight(guess.new_board(), [ 2, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 1).should.equal(4.5);
  });
});
