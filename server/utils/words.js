class Words{
    constructor(){
        this.wordsList = [];
        this.addWords();
    }
    addWords(){
        this.wordsList.push(
            {name: 'Roof', category: 'Things'},
            {name: 'Glasses', category: 'Things'},
            {name: 'Toothbrush', category: 'Things'},
            {name: 'Snowball', category: 'Things'},
            {name: 'Lipstick', category: 'Things'},
            {name: 'Brain', category: 'Things'},
            {name: 'Pirate', category: 'People'},
            {name: 'Cowboy', category: 'People'},
            {name: 'Castle', category: 'Places'},
            {name: 'Lighthouse', category: 'Places'},
            {name: 'Park', category: 'Places'},
            {name: 'Cinema', category: 'Places'},
            {name: 'Theatre', category: 'Places'},
            {name: 'Church', category: 'Places'},
            {name: 'Hospital', category: 'Places'},
            {name: 'Cherry', category: 'Foods'},
            {name: 'Strawberry', category: 'Foods'},
            {name: 'Pizza', category: 'Foods'},
            {name: 'Football', category: 'Sports'},
            {name: 'Basketball', category: 'Sports'},
            {name: 'Fish', category: 'Animals'},
            {name: 'Bunny', category: 'Animals'},
            {name: 'Horse', category: 'Animals'},
            {name: 'Owl', category: 'Animals'},
            {name: 'Cat', category: 'Animals'},
            {name: 'Lion', category: 'Animals'},
            {name: 'Dolphin', category: 'Animals'},     
        )
    }

    getRandomWord (){
        if(this.wordsList.length){
            let randomNumber = Math.floor(Math.random() * this.wordsList.length);
            let newWord = this.wordsList[randomNumber]
            this.deletePickedWord(this.wordsList[randomNumber]);
            return newWord;
        }
        return false
    }
    deletePickedWord(word){
       this.wordsList = this.wordsList.filter(elem => elem !== word);
    }
}
module.exports = {Words};