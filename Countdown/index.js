/*
* 功能:倒计时
*/

(function(window){

    //获取Dom节点
    var getId = function(str){
        return function(){
            return document.getElementById(str);
        };
    };

    //check 时间
    var checkTime = function(time){
        if(time < 10){
            time = "0" + time;
            return time;
        }else{
            return time;
        }
    };

    var day = getId("day")();   //日
    var hour = getId("hour")(); //小时
    var min = getId("min")();   //分
    var sec = getId("sec")();   //秒

    //目标日期
    var endTime = new Date("2016 08 08 0:0:01");

    setTimeout("showTime()",1000);

    window.showTime = function(){

        //当前时间
        var currTime = new Date();
        //相隔的秒数 
        var distanceTime = endTime.getTime() - currTime.getTime();  
        //定时器
        var timer;

        if(distanceTime > 0){
            var dayTime = Math.floor(distanceTime/86400000);
            distanceTime -= Math.floor(distanceTime/86400000) * 86400000;

            var hourTime = Math.floor(distanceTime/3600000);
            distanceTime -= Math.floor(distanceTime/3600000) * 3600000;

            var minTime = Math.floor(distanceTime/60000);
            distanceTime -= Math.floor(distanceTime/60000) * 60000;

            var secTime = Math.floor(distanceTime/1000);

            sec.innerHTML = checkTime(secTime);
            min.innerHTML = checkTime(minTime);
            hour.innerHTML = checkTime(hourTime);
            day.innerHTML = checkTime(dayTime);

            timer = setTimeout("showTime()",1000);
        }else{
            clearTimeout(timer);
            var timeHtml = getId("timeHtml")();
            timeHtml.innerHTML = "时间到啦~";
            timeHtml.style.fontSize = 100 + 'px';
            timeHtml.style.marginTop = 25 + 'px';
        }
        
        
    };

})(window);