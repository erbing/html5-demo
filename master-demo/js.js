//创建tap事件
var bindTap = (function() {
    var Ev = function(dom, callback) {
        if (typeof callback !== 'function') return;

        var that = this;
        this.dom = dom;

        var moved; //是否移动

        this._start = function() {
            moved = false;
            this.addEventListener('touchmove', that._move, false);
            this.addEventListener('touchend', that._end, false);
        };

        this._move = function() {
            moved = true;
            this.removeEventListener('touchmove', that._move);
            this.removeEventListener('touchend', that._end);
        };

        this._end = function() {
            if (!moved) {
                callback();
            }
            this.removeEventListener('touchmove', that._move);
            this.removeEventListener('touchend', that._end);
        };

        dom.addEventListener('touchstart', that._start, false);
    };

    Ev.prototype.destroy = function() {
        var dom = this.dom;
        dom.removeEventListener('touchstart', this._start);
        dom.removeEventListener('touchmove', this._move);
        dom.removeEventListener('touchend', this._end);
        this._start = null;
        this._move = null;
        this._end = null;
    };

    return function(dom, callback) {
        return new Ev(dom, callback);
    };
}());

//创建move事件
var bindMove = (function() {
    var Ev = function(dom, callback) {
        if (typeof callback !== 'function') return;

        var that = this;
        this.dom = dom;

        var startX, endX, curX , oldX;  

        this._start = function(e) {
            var t = e.changedTouches[0]; // 获取当前 事件的
            startX = curX = t.clientX;   //开始的坐标和 当前的坐标相等
            this.addEventListener('touchmove', that._move, false);
            this.addEventListener('touchend', that._end, false);
        };

        this._move = function(e) {
            var t = e.changedTouches[0];
            endX = t.clientX;   // 此时为结束的坐标
            oldX = parseInt(this.style.left);
            console.log(oldX);
            callback(endX - curX, curX - startX,oldX);
            curX = endX;        //此时当前的 坐标等于 结束时候的坐标
        };

        this._end = function(e) {
            this.removeEventListener('touchmove', that._move);
            this.removeEventListener('touchend', that._end);
        };

        

        this.dom = dom;

        dom.addEventListener('touchstart', this._start, false);
    };

    Ev.prototype.destroy = function() {
        var dom = this.dom;
        dom.removeEventListener('touchstart', this._start);
        dom.removeEventListener('touchmove', this._move);
        dom.removeEventListener('touchend', this._end);
        this._start = null;
        this._move = null;
        this._end = null;
    };

    return function(dom, callback) {
        return new Ev(dom, callback);
    };
}());


(function() {
    var el = document.getElementById('demo');
    var myTap = bindTap(el, function() {
        //console.log('tap');
        console.log(this.event);
        if(this.event.target.tagName = 'LI'){

            for (var i = 0; i < this.event.target.parentNode.children.length; i++) {
                this.event.target.parentNode.children[i].removeAttribute("class");
            }
            this.event.target.setAttribute("class", "choice");

        }
    });

    var myMove = bindMove(el, function(x, moveX,oldX) {

        console.log('moveing', x, moveX,oldX);
        //回调返回的二个参数 x > 0 鼠标往右   x <= 0  鼠标往左
        //第二个参数 是移动的距离
        //第三个参数 是 之前移动后 的left 的值 

        if(oldX){
            oldX = oldX;
        }else{
            oldX = 0;
        }

        //获取当前ul 的实际宽度
        var ulWidth = el.offsetWidth;
        //获取当前可视范围的宽度
        var realWidth = document.body.clientWidth;
        //当前可以移动的宽度范围
        var canMove = ulWidth - realWidth;

        if(x>0){ 
            
            if(oldX === 0){

                el.style.left = 0 + "px"; 

            }else if(oldX < 0 ){

                if(moveX > (-oldX)){
                   el.style.left = 0 + "px";  
                }else{
                  el.style.left = (oldX + moveX) + "px";   
                }
                   
            }else if(oldX > 0){
                el.style.left = 0 + "px"; 
            }

        }else if(x<=0){
           
            if (oldX ===0) {
                if(moveX < canMove){
                    el.style.left = moveX + "px";
                }else{
                    el.style.left = 0 + "px";
                }
            }else if(oldX < 0){
                if((oldX + moveX) > (-canMove) ){
                    el.style.left = (oldX + moveX) + "px";
                }else{
                    el.style.left = (-canMove) + "px";
                }
            }else{
                el.style.left = 0 + "px";
            }
        }

    });

}());


