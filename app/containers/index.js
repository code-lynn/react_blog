import React,{Component} from 'react';
import {Router, Route, hashHistory, IndexRoute } from 'react-router';
import Container from './Container';
import Home from './Home';///首页
import FeatureView from './FeatureView';///特征仓库
import FeatureExtractList from './FeatureExtractList'; ///特征提取
import MyTask from './FeatureExtractList/MyTask/'; ///特征提取  我的任务
import AllTask from './FeatureExtractList/AllTask/';///特征提取  所有任务
import AuditTask from './FeatureExtractList/AuditTask/';///特征提取  待审核
import ExcellentCase from './FeatureExtractList/ExcellentCase/';///特征提取  优秀案例
import FeatureStatistics from './FeatureExtractList/FeatureStatistics/';///特征提取 特征统计
import WeatherFeature from './FeatureExtractList/WeatherFeature/';///特征提取  天气特征
import SelectedFeature from './FeatureExtractList/SelectedFeature/';///特征提取  选取特征
import RunLog from './FeatureExtractList/RunLog/';  ///特征提取  运行的页面（待完善）
import FeatureService from './FeatureService';  ///特征服务
import MyCaller from './FeatureService/MyCaller/'   ///特征服务  我的caller
import AllCaller from './FeatureService/AllCaller/'   ///特征服务  全部caller
import MyService from './FeatureService/MyService/'  ///特征服务  我的服务
import AllService from './FeatureService/AllService/'   ///特征服务  全部服务
import ApplyService from './FeatureService/ApplyService/'  ///特征服务  申请服务
import MLbox from './MLbox'  ///MLbox
import FeatureManage from './FeatureManage';  ///特征管理
import UploadFeature from './FeatureManage/UploadFeature/'; ///特征管理  导入特征
import ManageFea from './FeatureManage/ManageFea/'; ///特征管理  管理特征
import feature_ad from './FeatureManage/FeatureAdjunction/'; ///特征管理  特征接入
import feature_ad_list from './FeatureManage/FeatureAdjunctionList/'; ///特征管理  接入数据
import SystemManage from './SystemManage';  ///系统管理
import DataSourceManage from './SystemManage/DataSourceManage/';  ///系统管理  数据源管理
import AdminManage from './SystemManage/AdminManage/';  ///系统管理  权限管理
import UpdateManage from './SystemManage/UpdateManage/';  ///系统管理  更新管理
import FeatureUse from './SystemManage/FeatureUse/';  ///系统管理  特征使用统计

export default class App extends Component{
    render(){
        return (
            <Router history={hashHistory}>
                <Route path="/" component={Container}>
                    {/*首页*/}
                    <IndexRoute component={Home} />
                    {/*特征仓库*/}
                    <Route path="feature_view" component={FeatureView} />
                    {/*首页*/}
                    <Route path="home" component={Home} />
                    {/*特征提取*/}
                    <Route path="feature_extract_list" component={FeatureExtractList}>
                        <IndexRoute component={MyTask} />
                        <Route path="my_task" component={MyTask} />
                        <Route path="all_task(/:id)" component={AllTask} />
                        <Route path="audit_task" component={AuditTask} />
                        <Route path="excellent_case" component={ExcellentCase} />
                        <Route path="feature_statistics" component={FeatureStatistics} />
                        <Route path="weather_feature" component={WeatherFeature} />
                        <Route path="selected_feature(/:id)" component={SelectedFeature} />
                        <Route path="run_log/:log_data" component={RunLog} />
                    </Route>
                    {/*特征服务*/}
                    <Route path="feature_service" component={FeatureService}>
                        <IndexRoute component={MyService} />
                        <Route path="my_caller" component={MyCaller} />
                        <Route path="all_caller" component={AllCaller} />
                        <Route path="my_service" component={MyService} />
                        <Route path="all_service" component={AllService} />
                        <Route path="apply_service(/:id)" component={ApplyService} />

                    </Route>
                    {/*mlbox*/}
                    <Route path="mlbox" component={MLbox}></Route>
                    {/*特征管理*/}
                    <Route path="feature_manage" component={FeatureManage}>
                        <IndexRoute component={UploadFeature} />
                        <Route path="upload_feature" component={UploadFeature} />
                        <Route path="manage_fea" component={ManageFea} />
                        <Route path="feature_ad(/:id)" component={feature_ad} />
                        <Route path="feature_ad_list" component={feature_ad_list} />
                        
                    </Route>
                    {/*系统管理*/}
                    <Route path="system_manage" component={SystemManage}>
                        <IndexRoute component={DataSourceManage} />
                        <Route path="data_source_manage" component={DataSourceManage} />
                        <Route path="admin_manage" component={AdminManage} />
                        <Route path="update_manage" component={UpdateManage} />
                        <Route path="feature_use" component={FeatureUse} />

                    </Route>
                </Route>
            </Router>
        )
    }
}
