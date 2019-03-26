const expect = require("expect");
const { Words } = require("../utils/words");

describe("Words", () => {
  let words = new Words();

  it("should return a word", () => {
    let word = words.getRandomWord();
    expect(typeof word).toBe("object");
    expect(typeof word.name).toBe("string");
    expect(typeof word.category).toBe("string");
  });

  it("should remove a word from WordList after picking one", () => {
    let wordsLength = words.wordsList.length;
    words.getRandomWord();
    expect(words.wordsList.length).toBe(wordsLength - 1);
  });
});
