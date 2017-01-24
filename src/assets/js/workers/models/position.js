importScripts('models/config.js');

var SnakePos_proto = {
    x: 0,
    y: 0,
    incX: function(){
        this.x += Config.pos.offset;
        this.x = this.testX(this.x);
    },
    incY: function(){
        this.y += Config.pos.offset;
        this.y = this.testY(this.y);
    },
    decX: function(){
        this.x -= Config.pos.offset;
        this.x = this.testX(this.x);
    },
    decY: function(){
        this.y -= Config.pos.offset;
        this.y = this.testY(this.y);
    },
    testX: function(x){
        if(x < Config.pos.minXWithOffset){
            return Config.pos.maxXWithOffset;
        } else if(x > Config.pos.maxXWithOffset){
            return Config.pos.minXWithOffset;
        } else {
            return x;
        }
    },
    testY: function(y){
        if(y < Config.pos.minYWithOffset){
            return Config.pos.maxYWithOffset;
        } else if(y > Config.pos.maxYWithOffset){
            return Config.pos.minYWithOffset;
        } else {
            return y;
        }
    },
    random: function(){
        this.x = Config.pos.offset * Math.floor(Math.random() * ((Config.pos.maxX) + 1));
        this.y = Config.pos.offset * Math.floor(Math.random() * ((Config.pos.maxY) + 1));
        return this;
    },
    center: function(){
        this.x = (Config.pos.maxXWithOffset-Config.pos.minXWithOffset)/2;
        this.y = (Config.pos.maxYWithOffset-Config.pos.minYWithOffset)/2;
        return this;
    },
    equals: function(pos){
        if(null == pos || undefined == pos){
            return null;
        } else {
            return pos.x == this.x && pos.y == this.y;
        }
    },
    copy: function(){
        var res = Object.create(SnakePos_proto);
        res.x = 0 + this.x;
        res.y = 0 + this.y;
        return res;
    }
};
