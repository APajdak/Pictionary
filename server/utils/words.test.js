const expect = require('expect');
const {Words} = require('./words');

describe('Words', ()=>{

    let words = new Words
    
    it('should return a word', ()=>{
        let wordsLenght = words.words.length;
        let word = words.getRandomWord();

        expect(typeof word).toBe('string');
        expect(words.words.length).toBe(wordsLenght-1)
    })

})