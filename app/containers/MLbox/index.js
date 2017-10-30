import React,{Component} from 'react';
import './index.less';

export default class MLbox extends Component{
    constructor(props) {
        super(props);

    }
    render() {
        ///console.log('MLbox_hold_content');
        return (
            <div className='MLbox_hold_content'>
                <div className="MLbox_title">
                    <h2><span>MLbox</span></h2>
                    <p>基于Spark的大规模机器学习库</p>
                </div>
                <hr />
                <div className="MLbox_content">模型策略开发会用到很多机器学习算法和工具，比如Spark MLlib, XGBoost, LightGBM, libFM
                    等，这么多种工具提高了使用门槛，随着数据量的快速增加和模型规模的增长，现有的一些工具不一定能满足大型模型开发的需要。
                    同时，为了避免大家重复造轮子，规范机器学习模型开发的处理流程，提高模型开发的效率，我们开发了 MLbox。
                </div>
                <div className="MLbox_goal">
                    <h3>MLbox 的设计目标</h3>
                    <ul>
                        <li>
                            <div className="MLbox_item"><img src={require('./ic_bubble_chart_black_48px.svg')}  />大规模</div>
                            <p>最多支持十亿级特征</p>
                        </li>
                        <li>
                            <div className="MLbox_item"><img src={require('./ic_functions_black_48px.svg')}  />算法全</div>
                            <p>支持 LR, XGBoost, RandomForest, GBT 等</p>
                        </li>
                        <li>
                            <div className="MLbox_item"><img src={require('./ic_format_clear_black_48px.svg')}  />零门槛</div>
                            <p>支持命令行运行，无需编程，即开即用</p>
                        </li>
                    </ul>
                </div>

                <div className="MLbox_else">
                    <p>目前，基于模型分布式的 Parallel SGD 实现的 LRPlus，支持十亿级别特征的模型训练。</p>
                    <p>MLbox 已用于wifi分类、用户家公司地址识别、用户身份职业识别和拼车愿拼率等多个项目中。</p>
                    <p>另外，我们实现了一个兼容公司Spark集群的XGBoost包（官方XGBoost4j-0.7不兼容Spark 1.6X）</p>
                    <hr />
                    <p><span>MLbox</span></p>
                    <p>下载地址：<span>hdfs:///user/decision/lib/mlbox-0.3-jar-with-dependencies.jar</span></p>
                    <p>说明文档：<a target="_blank" href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=95322984">MLbox文档</a></p>
                    <p><span>XGBoost</span></p>
                    <p>下载地址：<span>hdfs:///user/decision/lib/xgboost4j-spark-0.7-jar-with-dependencies.jar</span></p>
                    <p>说明文档：<a target="_blank" href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=107440615">XGBoost文档</a></p>
                    <div>
                        <p> 欢迎加入钉钉用户交流群：MLBox&amp;XGBoost-spark用户群 </p>
                        <img src={require('./qrcode.png')} />
                    </div>
                </div>





            </div>
        );
    }
    componentDidMount() {

    }

}

