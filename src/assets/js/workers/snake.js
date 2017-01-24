importScripts('models/config.js');
importScripts('models/position.js');


var SnakePos_static = Config.pos;
var snakeGame = null;
var currentApple = null;

var SnakeBody_proto = {
    pos: [
        Object.create(SnakePos_proto).center()
    ],
    grow: 0,
    next: function(pos, grow){
        for(var index=0; index<this.pos.length; index++){
            if(this.pos[index].equals(pos)){
                return false;
            }
        }

        this.pos.unshift(pos);
        this.grow += grow!=undefined?grow:0;

        if(this.grow<=0){
            this.pos.pop();
        } else {
            this.grow--;
        }

        return true;
    },
    head: function(){
        return this.pos[0];
    }
};

var Snake_proto = {
    body: null,
    dir: 'right',
    stop: false,
    walk: function(){
        var snake = this;
        if(!this.stop){
            setTimeout(function(){
                snake.walk();
            }, Config.game.speed);
        }
        if(this.eatApple()){
            postMessage({cmd:"scoreInc"});
            if(!this.body.next(this.toDir(this.body.head(), this.dir), 1)){
                postMessage({cmd:"gameover"});
            } else {
                postMessage({cmd:"walk", body: snake.body.pos});
            }
        } else {
            if(!this.body.next(this.toDir(this.body.head(), this.dir), 0)){
                postMessage({cmd:"gameover"});
            } else{
                postMessage({cmd:"walk", body: snake.body.pos});
            }
        }
    },
    eatApple: function(){
        return this.body.head().equals(currentApple);
    },
    toDir: function(pos, dir){
        var res = pos.copy();
        switch(dir){
            case 'left':
                res.decX();
            break;
            case 'right':
                res.incX();
            break;
            case 'up':
                res.decY();
            break;
            case 'down':
                res.incY();
            break;
        }
        return res;
    }
};

var snake = Object.create(Snake_proto);
snake.body = Object.create(SnakeBody_proto);

onmessage = function(e){
    if(e.data.cmd == "walk"){
        currentApple = null;
        snake.walk();
        postMessage({cmd: "started"});
    } else if(e.data.cmd == "newApple") {
        currentApple = e.data.apple;
    } else if(e.data.cmd == "dir"){
        snake.dir = e.data.dir;
    }
};
