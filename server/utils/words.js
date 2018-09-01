class Words{
    constructor(){
        this.words = ['waterfall', 'stroller', 'church', 'ladybug', 'tram', 'highway to hell',
            'stairway to heaven', 'godzilla', 'door', 'thief', 'queen', 'whistle', 'treasure',
            'salt and pepper', 'aircraft', 'bicycle','bitcoin', 'key', 'frog', 'mailman', 'ghost',
            'milk', 'spider web', 'whale'];
    }
    getRandomWord (){
        if(this.words.length){
            let randomNumber = Math.floor(Math.random() * this.words.length);
            let newWord = this.words[randomNumber]
            this.deletePickedWord(this.words[randomNumber]);
            return newWord;
        }
        return false
    }
    deletePickedWord(word){
       this.words = this.words.filter(elem => elem !== word);
    }
}

module.exports = {Words};