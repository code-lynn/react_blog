/**
 * Created by dalyn on 2017/11/22.
 */
import React,{Component} from 'react';
import "./index.less"
import { resolve } from 'url';

export default class HTML extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="html">
                 <h2>一、canvas</h2>
                <section className="canvas">
                    <div className="clock_box">
                        <h3>1、clock</h3>
                        <canvas ref={"clock"} id="clock" height="300px" width="300px"></canvas>
                    </div> 
                    <div className="clock_box">
                        <h3>2、countDown</h3>
                        <canvas ref={"myCanvas"} id="myCanvas" height="300px" width="300px"></canvas>
                    </div>
                     <div className="clock_box">
                        <h3>3、点阵</h3>
                        <div id="lattice"></div>
                    <div>
                        <input type="text" id="lattice_input" defaultValue="点阵"/>>
                        <button onClick={this.drewLattice.bind(this)} id="lattice_btn">确定</button>
                    </div>
                    </div>
                </section>
                <section className="canvas">
                    <h2>二、test</h2>
                    <div className="clock_box">
                        <h3>1、clock</h3>
                        <canvas ref={"myCanvas"} id="myCanvas" height="300px" width="300px"></canvas>
                    </div>
                </section>
                
           </div>
        )
    }
    componentDidMount() {
        this.drewCanvas();
        this.countDown();
        this.drewLattice();
    }
    drewCanvas(){
        let clock = this.refs.clock;//获取dom
        let context = clock.getContext("2d");//获取canvas元素上下文
        let width = context.canvas.width;
        let height = context.canvas.height;
        let r = width/2;
        let rem = width/200;//基本比例值--根据宽高比例
        //背景圆
        let drewCircle = ()=>{
            context.save();//保存当前状态--与restore结合使用
            context.translate(r, r);//移动中心坐标点
            context.beginPath();//起始一条路径
            context.lineWidth = 10 * rem;//线条宽度
            context.arc(0, 0, r - 5 * rem, 0, 2 * Math.PI, false); //中心点x,y 半径，起始弧度，结束弧度。是否顺时针
            context.stroke(); //绘制路径

            let hourArr=[3,4,5,6,7,8,9,10,11,12,1,2];
            context.font = 18 * rem + "px Arial"; //填充文字之前设置文字属性
            context.textAlign='center';
            context.textBaseline = 'middle';
            hourArr.forEach((v,i)=>{
                let rad = 2*Math.PI/12*i;
                let x = Math.cos(rad) * (r - 30 * rem);
                let y = Math.sin(rad) * (r - 30 * rem);
                context.fillText(v, x, y); //填充文字
            });
            for (let i = 0; i < 60; i++) {//60次
                let rad = 2*Math.PI/60*i;
                let x = Math.cos(rad) * (r - 18 * rem);
                let y = Math.sin(rad) * (r - 18 * rem);
                context.beginPath();
                if(i%5 == 0){//小时数的时候
                    context.fillStyle = '#000'; //设置填充样式
                    context.arc(x, y, 2 * rem, 0, 2 * Math.PI, false);
                }else{
                    context.fillStyle='#ccc';//设置填充样式
                    context.arc(x, y, 2 * rem, 0, 2 * Math.PI, false);
                }
                context.fill();//填充--实心圆
            }
        }
        //时针
        let drewHour = (hour, minute) => {
            context.save();//保存当前状态
            context.beginPath();
            context.lineWidth = 6 * rem;
            context.lineCap='round';
            var rad = 2 * Math.PI / 12 * hour;
            var mrad = 2 * Math.PI /12/60 * minute;
            context.rotate(rad + mrad); //旋转
            context.moveTo(0, 10 * rem); //移动
            context.lineTo(0, -r / 2);//画线条
            context.stroke();
            context.restore();//返回之前状态--画hour之前的状态
        }
        let drewMinute = (minute) => {
            context.save();
            context.beginPath();
            context.lineWidth = 3 * rem;
            context.lineCap = 'round';
            var rad = 2 * Math.PI / 60 * minute;
            context.rotate(rad); //旋转
            context.moveTo(0, 10 * rem); //移动
            context.lineTo(0, -r + 25 * rem); //画线条
            context.stroke();
            context.restore();
        }
         let drewSecond = (second) => {
            context.save();
            context.beginPath();
            context.fillStyle='#c14543';
            var rad = 2 * Math.PI / 60 * second; 
            context.rotate(rad); //旋转
            context.moveTo(-2 * rem, 20 * rem); //移动--起始点
            context.lineTo(2 * rem, 20 * rem); //画线条-移动到
            context.lineTo(1 * rem, -r + 18 * rem); //画线条-移动到
            context.lineTo(-1 * rem, -r + 18 * rem); //画线条-移动到
            context.fill();//填充
            context.restore();
        }
        let drewDot = ()=>{
            context.beginPath();
            context.fillStyle='#fff';
            context.arc(0, 0, 3 * rem, 0, Math.PI * 2, false);
            context.fill(); //绘制路径
        }
        let drew = () => {
            context.clearRect(0, 0, width, height);
            let now = new Date();
            let hour = now.getHours();
            let minute = now.getMinutes();
            let second = now.getSeconds();
            drewCircle(); //绘制背景表盘
            drewHour(hour,minute);
            drewMinute(minute);
            drewSecond(second);
            drewDot();
            context.restore(); //因为每次重绘都设置了一次中心点(translate)，所以需要返回之前状态
        }
        drew();
        setInterval(drew,1000);
        /**
         * 总结：
         * 1、canvas是基于状态进行绘制的，save 与 restore 结合使用，重新绘制需要返回原来状态，圆点坐标、旋转角度等等
         * 2、 canvas是基于状态进行绘制的， 每次绘制 开始需要beginPath，clothPath(创建从当前点到起始点的路径)，最后绘制stroke或者fill等
         * 3、clearRect清空重绘
         * 4、 moveTo（指定点--不创建线条）、 lineTo（添加点--创建线条）用法
         * 5、不建议吧canvas的width和height设置在css中，（画布大小，像素大小）
         *      也可以在js中canvas.width 和 canvas.height的方式设置
         * 6、兼容处理--<canvas></canvas>：
         *      浏览器支持canvas，标签中内容完全被忽略，标签中可以放入浏览器不支持canvas时显示的内容
         *      js处理：if(canvas.getContext()){ 浏览器支持}else{浏览器不支持}
         * 7、 beginPath与clothPath  和 save 与 restore应用场景？？？
         * */ 
    }
    countDown() {
        let _this = this;
        var canvas = document.getElementById("myCanvas");
        canvas.width = 400;
        canvas.height = 300;
        var context = canvas.getContext("2d");
        var endTime = new Date().setDate(new Date().getDate() + 1);//比本地时间多一天
        this.diffSeconds_old=null;//全局变量
        this.digit = [
            [
                [0, 0, 1, 1, 1, 0, 0],
                [0, 1, 1, 0, 1, 1, 0],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [0, 1, 1, 0, 1, 1, 0],
                [0, 0, 1, 1, 1, 0, 0]
            ],//0
            [
                [0, 0, 0, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [1, 1, 1, 1, 1, 1, 1]
            ],//1
            [
                [0, 1, 1, 1, 1, 1, 0],
                [1, 1, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 0, 1, 1, 0, 0, 0],
                [0, 1, 1, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 1, 1, 1, 1, 1]
            ],//2
            [
                [1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 0, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [0, 1, 1, 1, 1, 1, 0]
            ],//3
            [
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 1, 1, 1, 0],
                [0, 0, 1, 1, 1, 1, 0],
                [0, 1, 1, 0, 1, 1, 0],
                [1, 1, 0, 0, 1, 1, 0],
                [1, 1, 1, 1, 1, 1, 1],
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 1, 1, 1, 1]
            ],//4
            [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 0, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [0, 1, 1, 1, 1, 1, 0]
            ],//5
            [
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 1, 1, 0, 0, 0],
                [0, 1, 1, 0, 0, 0, 0],
                [1, 1, 0, 0, 0, 0, 0],
                [1, 1, 0, 1, 1, 1, 0],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [0, 1, 1, 1, 1, 1, 0]
            ],//6
            [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 0, 1, 1, 0, 0, 0],
                [0, 0, 1, 1, 0, 0, 0],
                [0, 0, 1, 1, 0, 0, 0],
                [0, 0, 1, 1, 0, 0, 0]
            ],//7
            [
                [0, 1, 1, 1, 1, 1, 0],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [0, 1, 1, 1, 1, 1, 0],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [0, 1, 1, 1, 1, 1, 0]
            ],//8
            [
                [0, 1, 1, 1, 1, 1, 0],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [1, 1, 0, 0, 0, 1, 1],
                [0, 1, 1, 1, 0, 1, 1],
                [0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 0, 1, 1],
                [0, 0, 0, 0, 1, 1, 0],
                [0, 0, 0, 1, 1, 0, 0],
                [0, 1, 1, 0, 0, 0, 0]
            ],//9
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]//:
        ];
        this.colors=["red","blue","orange"];
        this.balls=[];
        var params = {
            x:0,
            y:0,
            width: canvas.width,
            height: canvas.height,
            radius: 2,//方格-小圆半径
            marginTop: 50,//数字顶部距离
            marginLeft: 30,//数字左侧距离
            endTime: endTime,
            diffSeconds: (endTime) => {
                var curTime = new Date();
                /*
                * endTime 写法1
                * */
                // var endTime = new Date("2018,6,17,23:15:00");
                // var ret = endTime.getTime() - curTime.getTime();
                // console.log(ret);
                /*
                * endTime 写法2
                * */
                // var ret1 = endTime - curTime;//直接相减即可
                // console.log(ret1);
                /*
                * endTime 写法3
                * */
                // var endTime = new Date().setDate(new Date().getDate() + 1);//比本地时间多一天
                var ret = endTime - curTime.getTime();
                // console.log(ret);
                ret = Math.round(ret / 1000);//毫秒---秒
                return ret > 0 ? ret : 0;
            }
        };
        setInterval(function () {
            _this.countRender(context, params);
            _this.update(context,params);
        },50)
        
    }
    update(context,params){
        //上一秒 差值 diffSeconds_old
        var diffSeconds_old = this.diffSeconds_old; 
        var hours_old = parseInt(diffSeconds_old / 3600);
        var minutes_old = parseInt((diffSeconds_old - hours_old * 3600) / 60);
        var seconds_old = diffSeconds_old % 60;
        //当前 diffSeconds_new
        var diffSeconds_new = params.diffSeconds(params.endTime);//当前时间距离endTime的相差秒数
        var hours_new = parseInt(diffSeconds_new / 3600);
        var minutes_new = parseInt((diffSeconds_new - hours_new * 3600) / 60);
        var seconds_new = diffSeconds_new % 60;
        if (seconds_new != seconds_old){//秒数不一样
            if (parseInt(hours_new / 10) != parseInt(hours_old / 10)){//两次的小时数的十位的数不一样
                //加小球--小时十位数数字的位置x，y和数字
                this.addBalls(params.marginLeft + 0, params.marginTop, parseInt(hours_old / 10), context, params)
            }
            if (parseInt(hours_new % 10) != parseInt(hours_old % 10)) {//两次的小时数的个位的数不一样
                //加小球--小时十位数数字的位置x，y和数字
                this.addBalls(params.marginLeft + 15 * (params.radius + 1), params.marginTop, parseInt(hours_old % 10), context, params)
            }
            if (parseInt(minutes_new / 10) != parseInt(minutes_old / 10)) {//分钟数--十位数
                //加小球--小时十位数数字的位置x，y和数字
                this.addBalls(params.marginLeft + 39 * (params.radius + 1), params.marginTop, parseInt(minutes_old / 10), context, params)
            }
            if (parseInt(minutes_new % 10) != parseInt(minutes_old % 10)) {//分钟数--个位数
                //加小球--小时十位数数字的位置x，y和数字
                this.addBalls(params.marginLeft + 54 * (params.radius + 1), params.marginTop, parseInt(minutes_old % 10), context, params)
            }
            if (parseInt(seconds_new / 10) != parseInt(seconds_old / 10)) {//秒数--十位数
                //加小球--小时十位数数字的位置x，y和数字
                this.addBalls(params.marginLeft + 78 * (params.radius + 1), params.marginTop, parseInt(seconds_old / 10), context, params)
            }
            if (parseInt(seconds_new % 10) != parseInt(seconds_old % 10)) {//秒数--个位数
                //加小球--小时十位数数字的位置x，y和数字
                this.addBalls(params.marginLeft + 93 * (params.radius + 1), params.marginTop, parseInt(seconds_old % 10), context, params)
            }
            //diffSeconds_old 赋值
            this.diffSeconds_old = diffSeconds_new;
        }
        this.updateBalls(context, params);//所有数字对应小球的变化函数
    }
    addBalls(x,y,num,context,params){
        var digit = this.digit;
        var colors = this.colors;
        var radius = params.radius;
        console.log(radius)
        //方格模型
        for (let i = 0; i < digit[num].length; i++) {
            let cur = digit[num][i];
            for (let j = 0; j < cur.length; j++) {
                let cur_j = cur[j];
                if (cur_j == 1) {
                    let ball = {
                        x: x + j * 2 * (radius + 1) + (radius + 1),//
                        y: y + i * 2 * (radius + 1) + (radius + 1),
                        g: 1.5+Math.random(),//y方向加速度 1.5~2.5  
                        vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 2,//4 -4  x轴每帧移动距离
                        vy: -5,//y轴每帧移动距离
                        color: colors[Math.floor(Math.random()*colors.length)]
                    }
                    // console.log(ball)
                    this.balls.push(ball);
                }
            }
        }
    }
    updateBalls(context, params){
        let balls = this.balls;
        let width = params.width;
        let height = params.height;
        for (let i = 0; i < balls.length; i++) {
            let cur = balls[i];
            balls[i].x += cur.vx;//x轴变化
            balls[i].y += cur.vy;//y轴变化
            balls[i].vy += cur.g;//y轴速度变化
            //边缘判断
            if (balls[i].y >= height){
                balls[i].y = height;
                balls[i].vy = -balls[i].vy*0.6;//速度递减
            }
        }
        this.balls = balls;
    }
    countRender(context, params) {
        context.clearRect(params.x, params.y, params.width, params.height);//重置
        var radius = params.radius;
        var marginTop = params.marginTop;
        var marginLeft = params.marginLeft;
        var diffSeconds = params.diffSeconds(params.endTime);
        var hours = parseInt(diffSeconds / 3600);
        var minutes = parseInt((diffSeconds - hours*3600)/ 60);
        var seconds = diffSeconds % 60;
        this.renderDigit(marginLeft, marginTop, parseInt(hours / 10), context, radius);//小时
        this.renderDigit(marginLeft + 15 * (radius + 1), marginTop, parseInt(hours % 10), context, radius);//小时
        this.renderDigit(marginLeft + 30 * (radius + 1), marginTop, 10, context, radius);//冒号
        this.renderDigit(marginLeft + 39 * (radius + 1), marginTop, parseInt(minutes / 10), context, radius);//分钟
        this.renderDigit(marginLeft + 54 * (radius + 1), marginTop, parseInt(minutes % 10), context, radius);//分钟
        this.renderDigit(marginLeft + 69 * (radius + 1), marginTop, 10, context, radius);//冒号
        this.renderDigit(marginLeft + 78 * (radius + 1), marginTop, parseInt(seconds / 10), context, radius);//秒
        this.renderDigit(marginLeft + 93 * (radius + 1), marginTop, parseInt(seconds % 10), context, radius);//秒
        //所有 动画小球 的绘制
        let balls = this.balls;
        for (let i = 0; i < balls.length; i++) {
            let cur = balls[i];
            context.fillStyle=cur.color;
            context.beginPath();
            context.arc(cur.x, cur.y,radius,0, 2*Math.PI, true);
            context.closePath();
            context.fill();
            
        }
    }
    renderDigit(x, y, num, context,radius){
        var digit = this.digit;
        context.fillStyle='rgb(0,102,153)';
        //方格模型
        for (let i = 0; i < digit[num].length; i++) {
            let cur = digit[num][i];
            for (let j = 0; j < cur.length; j++) {
                let cur_j = cur[j];
                if (cur_j == 1) {
                    context.beginPath();
                    context.arc(x + j * 2 * (radius + 1) + (radius + 1), y + i * 2 * (radius + 1) + (radius + 1), radius,0,2*Math.PI);
                    context.closePath();
                    context.fill();
                }
            }
        }
        
    }
    drewLattice() {
        // var text = document.getElementById('lattice_input');//可以省略
        var txt = lattice_input.value;
        if (txt) {
            this.lattice(txt);
        }
    }
    lattice(txt) {
         // var lattice = document.getElementById('lattice');//可以省略
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var cols = 16;
        var rows = 16;

        cols = txt.length * 16
        canvas.width = cols;
        canvas.height = rows;
        ctx.clearRect(0, 0, cols, rows);
        ctx.font = "16px SimSun";
        ctx.fillStyle = "#000";
        ctx.fillText(txt, 0, 14);
        var data = ctx.getImageData(0, 0, cols, rows)
        var len = data.data.length;
        var res = '';
        for (var i = 1; i <= rows; i++) {
            for (var j = 1; j <= cols; j++) {
                var pos = ((i - 1) * cols + (j)) * 4 - 1;
                if (data.data[pos] > 0) {
                    res += `<span class="black" style="left: ${j*10}px;top: ${i*10}px"></span>`
                }
            }
        }
        lattice.innerHTML = res; //lattice 可以直接获取id为 lattice 的元素
    }
}