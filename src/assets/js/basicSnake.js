(function(w, frame, hud){

    var snakeGame = {
        frame: frame,
        score: 0,
        speed: 150,
        render: 20
    };

    var SnakePos_static = {
        offset: 10,
        maxY: 50,
        maxX: 50,
        minXWithOffset: 0*10,
        minYWithOffset: 0*10,
        maxXWithOffset: 50*10,
        maxYWithOffset: 50*10,
    };

    var SnakePos_proto = {
        x: 0,
        y: 0,
        incX: function(){
            this.x += SnakePos_static.offset;
            this.x = this.testX(this.x);
        },
        incY: function(){
            this.y += SnakePos_static.offset;
            this.y = this.testY(this.y);
        },
        decX: function(){
            this.x -= SnakePos_static.offset;
            this.x = this.testX(this.x);
        },
        decY: function(){
            this.y -= SnakePos_static.offset;
            this.y = this.testY(this.y);
        },
        testX: function(x){
            if(x < SnakePos_static.minXWithOffset){
                return SnakePos_static.maxXWithOffset;
            } else if(x > SnakePos_static.maxXWithOffset){
                return SnakePos_static.minXWithOffset;
            } else {
                return x;
            }
        },
        testY: function(y){
            if(y < SnakePos_static.minYWithOffset){
                return SnakePos_static.maxYWithOffset;
            } else if(y > SnakePos_static.maxYWithOffset){
                return SnakePos_static.minYWithOffset;
            } else {
                return y;
            }
        },
        random: function(){
            this.x = SnakePos_static.offset * Math.floor(Math.random() * ((SnakePos_static.maxX) + 1));
            this.y = SnakePos_static.offset * Math.floor(Math.random() * ((SnakePos_static.maxY) + 1));
            return this;
        },
        center: function(){
            this.x = (SnakePos_static.maxXWithOffset-SnakePos_static.minXWithOffset)/2;
            this.y = (SnakePos_static.maxYWithOffset-SnakePos_static.minYWithOffset)/2;
            return this;
        },
        equals: function(pos){
            return pos.x == this.x && pos.y == this.y;
        },
        copy: function(){
            var res = Object.create(SnakePos_proto);
            res.x = 0 + this.x;
            res.y = 0 + this.y;
            return res;
        }
    };

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
        walk: function(){
            var snake = this;
            if(!snakeGame.gameOver){
                setTimeout(function(){
                    snake.walk();
                }, snakeGame.speed);
            }
            if(this.eatApple()){
                snakeGame.score++;
                SnakeApple_static.createNew();
                snakeGame.gameOver = !this.body.next(this.toDir(this.body.head(), this.dir), 1);
            } else {
                snakeGame.gameOver = !this.body.next(this.toDir(this.body.head(), this.dir), 0);
            }
        },
        eatApple: function(){
            return this.body.head().equals(SnakeApple_static.currentApple());
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


    var Game_proto = function(){
        var boxes = {};
        var appleBox = document.createElement("div");

        var snake = Object.create(Snake_proto);
            snake.body = Object.create(SnakeBody_proto);

        var render = function(){
            if(!snakeGame.gameOver){
                var applePos = SnakeApple_static.currentApple();
                appleBox.classList.add("box");
                appleBox.classList.add("apple");
                appleBox.style.position = "absolute";
                appleBox.style.height = SnakePos_static.offset;
                appleBox.style.width = SnakePos_static.offset;
                appleBox.style.marginLeft = applePos.x;
                appleBox.style.marginTop = applePos.y;
                frame.appendChild(appleBox);

                var hiddenBoxes = Object.keys(boxes);
                for(var index=0;index<snake.body.pos.length;index++){
                    var pos = snake.body.pos[index];
                    var posIndex = pos.x + '-' + pos.y;
                    if(undefined == boxes[posIndex]){
                        boxes[posIndex] = document.createElement("div");
                        boxes[posIndex].classList.add("box");
                        boxes[posIndex].style.position = "absolute";
                        boxes[posIndex].style.height = SnakePos_static.offset;
                        boxes[posIndex].style.width = SnakePos_static.offset;
                        boxes[posIndex].style.marginLeft = pos.x;
                        boxes[posIndex].style.marginTop = pos.y;
                        frame.appendChild(boxes[posIndex]);
                    } else {
                        if(hiddenBoxes.length>0){
                            hiddenBoxes.splice(hiddenBoxes.indexOf(posIndex), 1);
                        }
                    }
                    boxes[posIndex].style.visibility = 'visible';
                    boxes[posIndex].classList.add("boxVisible");
                }
                if(hiddenBoxes.length>0){
                    for(var indexBox in hiddenBoxes){
                        boxes[hiddenBoxes[indexBox]].remove();
                        delete boxes[hiddenBoxes[indexBox]];

                    }
                }

                snakeGame.hud.score.innerHTML = "0".repeat(10 - ("" + snakeGame.score).length) + snakeGame.score;
            } else {
                // render gameover;
            }

            setTimeout(render, snakeGame.render);
        };

        var timer = function(){
            var time = Object.create(timer_proto);
            time.run(function(){
                if(snakeGame.gameOver){
                    snakeGame.time = time.clock;
                    time.stop = true;
                } else {
                    snakeGame.hud.timer.innerHTML =
                        "0".repeat(2 - ("" + time.clock.min).length) + time.clock.min + ' : ' +
                        "0".repeat(2 - ("" + time.clock.sec).length) + time.clock.sec
                }
            });
        }

        return {
            hud: function(){
                // FRAME :
                frame.style.height = SnakePos_static.maxYWithOffset + SnakePos_static.offset;
                frame.style.width = SnakePos_static.maxXWithOffset + SnakePos_static.offset;
                frame.style.display = "block";
                frame.style.position = "absolute";
                frame.classList.add("frame");

                // HUD :
                snakeGame.hud = {};
                hud.style.width = SnakePos_static.maxXWithOffset + SnakePos_static.offset;
                hud.style.display = "block";
                hud.classList.add("hud");

                var score = document.createElement("div");
                score.classList.add("hud-score");
                snakeGame.hud.score = score;
                hud.appendChild(score);

                var timer = document.createElement("div");
                timer.classList.add("hud-timer");
                snakeGame.hud.timer = timer;
                hud.appendChild(timer);

            },
            run: function(){
                render();
                snake.walk();
                timer();
            },
            attachKeyEvent: function(){
                document.onkeydown = function(e) {
                  var evt = e.type
                  var code = e.keyCode?e.keyCode:e.which?e.which:null;
                  switch(code){
                      case 40:
                        snake.dir = 'down';
                      break;
                      case 38:
                        snake.dir = 'up';
                      break;
                      case 37:
                        snake.dir = 'left';
                      break;
                      case 39:
                        snake.dir = 'right';
                      break;
                  }
                }
            }
        };
    };


    var game = Game_proto();
    game.hud();
    game.attachKeyEvent();
    game.run();

})(window, document.getElementById("game"), document.getElementById("gameHUD"));
