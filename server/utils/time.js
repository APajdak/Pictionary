class TimeLeft{
    constructor(callback){
        this.time = 10;
        this.interval;
        this.callback = callback
    }

    startCountDown(){  
        this.interval = setInterval(this.countDown.bind(this), 1000)

    }
    countDown(){
        this.time--;
        this.callback(this.time)
    }

    stopInterval(){
        clearInterval(this.interval);
    }

    resetTime(){
        this.time = 10;
    }
}

module.exports = {TimeLeft}