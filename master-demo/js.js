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

        //var startX, startY, endX, endY, curX, curY;
        var startX, endX, curX , oldX;  

        this._start = function(e) {
            var t = e.changedTouches[0]; // 获取当前 事件的
            startX = curX = t.clientX;   //开始的坐标和 当前的坐标相等
            //startY = curY = t.clientY;
            this.addEventListener('touchmove', that._move, false);
            this.addEventListener('touchend', that._end, false);
        };

        this._move = function(e) {
            var t = e.changedTouches[0];
            endX = t.clientX;   // 此时为结束的坐标
            oldX = this.style.left;
            console.log(oldX);
            //endY = t.clientY;
            //callback(endX - curX, endY - curY, curX - startX, curY - startY);
            callback(endX - curX, curX - startX);
            curX = endX;        //此时当前的 坐标等于 结束时候的坐标
            //curY = endY;
            // endX - curX  =  判断鼠标左右 移动 
            // curX - startX =  move 的距离
            
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

    
    // var myMove = bindMove(el, function(x, y,maxX, maxY) {
    var myMove = bindMove(el, function(x, moveX) {

        console.log('moveing', x, moveX);
        //回调返回的二个参数 x > 0 鼠标往右   x <= 0  鼠标往左
        //第二个参数 是 

        //获取当前ul 的实际宽度
        var ulWidth = el.offsetWidth;
        //获取当前可视范围的宽度
        var realWidth = document.body.clientWidth;
        //当前可以移动的宽度范围
        var canMove = ulWidth - realWidth;

        //console.log(ulWidth,realWidth,canMove); //504 414 90 
         
        //el.style.transform = "translate3d(0px,0px,0px)";
         

        // if(  maxX <= 0 ){
        //     if(maxX < canMove){
        //         el.style.transform = "translate3d("+maxX+"px,0px,0px)";
        //     }else{
        //         el.style.transform = "translate3d("+canMove+"px,0px,0px)";
        //     }
            
        // }
        if(x>0){
            //console.log('right');
            if(el.style.left <0){
                console.log(1);
            }
            //el.style.left = 0 +"px";
            //el.style.left = moveX + "px";

        }else if(x<=0){
            console.log('left');
            el.style.left = moveX + "px";
        }

    });

    var getTranslate = function (_self) {
        var st = window.getComputedStyle(_self, null);
        var tr = st.getPropertyValue("-webkit-transform") || st.getPropertyValue("transform");
        var values = tr.split('(')[1].split(')')[0].split(',');
        return values;
    }

}());


