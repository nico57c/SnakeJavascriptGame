if (!window.Worker) {
    console.error("WORKER IS NOT SUPPORTED!");
} else {

(function(w, frame, hud){

    var snakeWorker = new Worker("assets/js/workers/snake.js");
    var timerWorker = new Worker("assets/js/workers/timer.js");
    var appleWorker = new Worker("assets/js/workers/apple.js");
    var SnakePos_static = Config.pos;
    var snakeGame = null;
    var applPos = null;

    var boxes = {};
    var snakeGame = {
        score: 0,
        hud: {},
        time: -1,
        gameover: false
    };

    var currentApple = null;
    var appleBox = document.createElement("div");
    appleBox.classList.add("box");
    appleBox.classList.add("apple");
    frame.appendChild(appleBox);

    appleWorker.onmessage = function(e){
        if(e.data.type=="newApple"){
            currentApple = e.data.msg;
            appleBox.style.position = "absolute";
            appleBox.style.height = SnakePos_static.offset;
            appleBox.style.width = SnakePos_static.offset;
            appleBox.style.marginLeft = e.data.msg.x;
            appleBox.style.marginTop = e.data.msg.y;
            snakeWorker.postMessage({ "cmd": "newApple", "apple": currentApple });
        }
    }


    timerWorker.onmessage = function(e){
        snakeGame.hud.timer.innerHTML =
            "0".repeat(2 - ("" + e.data.msg.min).length) + e.data.msg.min + ' : ' +
            "0".repeat(2 - ("" + e.data.msg.sec).length) + e.data.msg.sec;
        snakeGame.time = e.data.msg.min*60 + e.data.msg.sec;
    }

    var Game_proto = {
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
        attachKeyEvent: function(){
            document.onkeydown = function(e) {
              var evt = e.type
              var code = e.keyCode?e.keyCode:e.which?e.which:null;
              switch(code){
                  case 40:
                    snakeWorker.postMessage({cmd:"dir", dir:'down'});
                  break;
                  case 38:
                    snakeWorker.postMessage({cmd:"dir", dir:'up'});
                  break;
                  case 37:
                    snakeWorker.postMessage({cmd:"dir", dir:'left'});
                  break;
                  case 39:
                    snakeWorker.postMessage({cmd:"dir", dir:'right'});
                  break;
              }
            }
        }
    };

    var game = Object.create(Game_proto);
    game.hud();
    game.attachKeyEvent();

    snakeWorker.onmessage = function(e){
        switch(e.data.cmd){
            case "started":
                appleWorker.postMessage({cmd: "createNew"});
                timerWorker.postMessage({cmd: 'start'});
            case "scoreInc":
                appleWorker.postMessage({cmd: "createNew"});
                snakeGame.score++;
                snakeGame.hud.score.innerHTML = "0".repeat(10 - ("" + snakeGame.score).length) + snakeGame.score;
            break;
            case "gameover":
                snakeGame.gameover = true;
                timerWorker.postMessage({cmd: 'stop'});
            break;
            case "walk":
                if(!snakeGame.gameover){
                    var hiddenBoxes = Object.keys(boxes);
                    for(var index=0;index<e.data.body.length;index++){
                        var pos = e.data.body[index];
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
                }
            break;
        }
    };

    snakeWorker.postMessage({ "cmd": "walk", "SnakePos_static": SnakePos_static });

})(window, document.getElementById("game"), document.getElementById("gameHUD"));

}
