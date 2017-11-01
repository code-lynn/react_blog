import React,{Component} from 'react';
import echarts from 'echarts';
export default class Bar extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{height:"100%"}} ref={ref=>this.chart = ref}></div>
        );
    }
    componentDidUpdate(){
        // console.log(this.chart);
        // console.log(this.props.chartBarData);
        if(this.props.chartBarData.title){
            let option = {
                title: {
                    text:this.props.chartBarData.title
                },
                tooltip:{
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: {show: true, type: ['line', 'bar']},
                        saveAsImage: {show: true}
                    }
                },
                legend: {
                    right: 100,
                    data: this.props.chartBarData.legendData
                },
                calculable : true,
                grid: {
                    top: 80,
                    bottom: 100,
                    right:10,
                    left:50
                },
                xAxis: [
                    {
                        type:'category',
                        axisLabel:{'interval':parseInt(this.props.chartBarData.xAxisData.length/10)},
                        data:this.props.chartBarData.xAxisData,
                        splitLine: {show: false},
                        boundaryGap: true
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: ''
                    }
                ],
                series:this.props.chartBarData.seriesData
            };
            let myChart = echarts.init(this.chart);
            myChart.setOption(option);
        }
    }
}

////传入的数据  数据名字是  chartBarData
// var json = {
//     title:'司机生命周期',
//     legendData:['北京市', '全国'],
//     xAxisData:['新生期','成熟期','衰退期','流失期','沉默期','再激活期'],
//     seriesData:[
//         {
//             name: '北京市',
//             data: [500, 400, 1300, 834, 460, 120],
//             smooth: true,
//             areaStyle:{normal: {}},
//             type:'bar'
//         },
//         {
//             name: '全国',
//             data: [1220, 800, 400, 500, 1000, 450],
//             smooth: true,
//             areaStyle:{normal: {}},
//             type:'bar'
//         }
//     ]
// };