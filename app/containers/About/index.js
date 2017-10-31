import React,{Component} from 'react';
import {connect} from 'react-redux';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
import Immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';
import Bar from '../../components/Echarts/Bar';
let data = Immutable.fromJS({ a: { b: { c: 1 } } });
// 让 cursor 指向 { c: 1 }
let cursor = Cursor.from(data, ['a', 'b'], newData => {
    // 当 cursor 或其子 cursor 执行 update 时调用
    ///console.log(newData);
});
class About extends Component{
    constructor(props) {
        super(props);
        this.state = {
            option:{}
        }
    }
    render() {
        return (
            <div>
                <DatePicker onChange={this.onChange} />
                <br />
                <RangePicker onChange={this.onChange} />
                <div style={{height:"300px"}}>
                    <Bar chartBarData={this.state.option}/>
                </div>
            </div>
        );
    }
    componentDidMount(){

    }
    onChange=(date, dateString)=>{
        // console.log(date, dateString);
        // console.log(cursor.get('c')); // 1
        // cursor = cursor.update('c', x => x + 1);
        // console.log(cursor.get('c')); // 2
        // console.log(this.props.changeSidebar);
        // console.log(this.props.getDepartmentList);
        // console.log(this.props.tagUt);
        // console.log(this.props.productGroupList);
        ////传入的数据  数据名字是  chartBarData
        let json = {
            title:'司机生命周期',
            legendData:['北京市', '全国'],
            xAxisData:['新生期','成熟期','衰退期','流失期','沉默期','再激活期'],
            seriesData:[
                {
                    name: '北京市',
                    data: [500, 400, 1300, 834, 460, 120],
                    smooth: true,
                    areaStyle:{normal: {}},
                    type:'bar'
                },
                {
                    name: '全国',
                    data: [1220, 800, 400, 500, 1000, 450],
                    smooth: true,
                    areaStyle:{normal: {}},
                    type:'bar'
                }
            ]
        };
        this.setState({
            option:json
        },function () {
            ///console.log(this.state.option);
        })

    }
}
export default connect(
    state => {
        return {
            changeSidebar:state.changeSidebar,
            getDepartmentList:state.getDepartmentList,
            tagUt:state.tagUt,
            productGroupList:state.productGroupList,
        }
    },
    dispatch =>{
        return {

        }
    }
)(About);