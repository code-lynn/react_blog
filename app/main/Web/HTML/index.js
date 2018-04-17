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
                <section className="canvas">
                    <h2>一、canvas</h2>
                    <div className="clock_box">
                        <h3>1、clock</h3>
                        <canvas ref={"clock"} id="clock" height="300px" width="300px"></canvas>
                    </div>
                </section>
           </div>
        )
    }
    componentDidMount() {
        this.drewCanvas();
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
         * 2、 canvas是基于状态进行绘制的， 每次绘制 开始需要beginPath， 结束时clothPath，最后绘制stroke或者fill等
         * 3、clearRect清空重绘
         * 4、 moveTo（指定点--不创建线条）、 lineTo（添加点--创建线条）用法
         * 5、不建议吧canvas的width和height设置在css中，（画布大小，像素大小）
         *      也可以在js中canvas.width 和 canvas.height的方式设置
         * 6、兼容处理--<canvas></canvas>：
         *      浏览器支持canvas，标签中内容完全被忽略，标签中可以放入浏览器不支持canvas时显示的内容
         *      js处理：if(canvas.getContext()){ 浏览器支持}else{浏览器不支持}
         * */ 
    }
}