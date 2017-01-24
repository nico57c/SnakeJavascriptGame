importScripts('models/position.js');

var SnakeApple_static = Object.create({
    currentApple: function(){
        if(this.apple==undefined){
            this.apple = Object.create(SnakePos_proto).random();
            return this.apple;
        } else {
            return this.apple;
        }
    },
    createNew: function(){
        this.apple = undefined;
        return this.currentApple();
    }
});

onmessage = function(e){

    // RETURN
    if(e.data.cmd == 'currentApple'){
        postMessage({type:'currentApple', msg:SnakeApple_static.currentApple()});
    }
    if(e.data.cmd == 'createNew'){
        postMessage({type:'newApple', msg:SnakeApple_static.createNew()});
    }

};
