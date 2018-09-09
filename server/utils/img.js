class Img{
    constructor(callback){
        this.stack = [];
        this.currentLength = this.stack.length;
        this.callback = callback;
        this.start = false;
        this.interval;
    }
    addPic (pic){
        this.stack.push(pic);

    }

    startInterval(){
        this.start = true;
        this.interval = setInterval(this.checkIfNewPic.bind(this), 2500);
    }

    checkIfNewPic(){        
        if(this.currentLength != this.stack.length){
            this.callback(this.stack[this.stack.length-1]);
            this.currentLength = this.stack.length;
        }
    }

    getLastImg(){
        return this.stack[this.stack.length-1]
    }
    
}

module.exports = {Img};