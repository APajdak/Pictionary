class Users{
    constructor(){
        this.users = [];
    }

    addUser(id, name, canDraw, score = 0){
        let user = {id, name, canDraw, score};
        this.users.push(user);
        this.sortUsersByScore();
        return user;
    }

    getUser (id){
        return this.users.filter( user => user.id === id)[0];
    }
    getDrawer (){
        return this.users.filter( user => user.canDraw === true)[0];
    }

    sortUsersByScore(){
        this.users = this.users.sort( (a, b) => a.score < b.score );
    }

    pickRandomGuesser(){
        let guessers = this.users.filter(user => user.canDraw === false);
        if(guessers){
            let guesser = Math.floor(Math.random() * guessers.length);
            return guessers[guesser];
        }else{
            return false
        }
    }

    addScore (id){
        let user = this.getUser(id);
        user.canDraw ? user.score +=7 : user.score +=5;
        this.sortUsersByScore();
        return user;
    }
    removeUser (id) {
        let user = this.getUser(id);
        if(user) {
            this.users = this.users.filter( user => user.id !== id)
        }
        return user;
    }
}

module.exports = {Users};