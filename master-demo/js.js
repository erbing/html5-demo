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

        var startX, startY, endX, endY, curX, curY;

        this._start = function(e) {
            var t = e.changedTouches[0];
            startX = curX = t.clientX;
            startY = curY = t.clientY;
            this.addEventListener('touchmove', that._move, false);
            this.addEventListener('touchend', that._end, false);
        };

        this._move = function(e) {
            var t = e.changedTouches[0];
            endX = t.clientX;
            endY = t.clientY;
            callback(endX - curX, endY - curX, curX - startX, curY - startY);
            curX = endX;
            curY = endY;
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

    var myMove = bindMove(el, function(x, y, maxX, maxY) {
        console.log('moveing', x, y, maxX, maxY);

         
        el.style.transform = "translate3d(0px,0px,0px)";

        if( y <= -150 ){
            el.style.transform = "translate3d(0px,0px,0px)";
        }

    });

    var getTranslate = function (_self) {
        var st = window.getComputedStyle(_self, null);
        var tr = st.getPropertyValue("-webkit-transform") || st.getPropertyValue("transform");
        var values = tr.split('(')[1].split(')')[0].split(',');
        return values;
    }

}());


