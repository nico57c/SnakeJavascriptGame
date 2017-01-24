var timer_proto = {
    started: null,
    stop: false,
    clock: {min: null, sec: null},
    run: function(callback){
        var that = this;
        if(!this.stop){
            setTimeout(function(){
                that.run(callback);
            }, 1000);
        }
        if(null == this.started){
            this.started = new Date().getTime()/1000;
        }
        var now = new Date().getTime()/1000;
        this.clock.min = Math.floor((now-this.started)/60);
        this.clock.sec = Math.floor((now-this.started)%60);
        callback();
    }
};

var time = Object.create(timer_proto);

onmessage = function(e){
    if(e.data.cmd == 'start'){
        time.run(function(){
            postMessage({msg: time.clock });
        });
    } else if(e.data.cmd == 'stop') {
        time.stop = true;
        postMessage({msg: time.clock });
    }
};
