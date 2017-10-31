angular.module('FeaExtractApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])
    .controller('ListController', function ($scope, $http, $filter, $uibModal, extractService) {
        $scope.getQueryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        };
        if ($scope.getQueryString("page") && $scope.getQueryString("total")) {
            $scope.currentPage = $scope.getQueryString("page");
            $scope.totalItems = $scope.getQueryString("total");
        } else {
            $scope.currentPage = 1;//当前页
            $scope.totalItems = 0;
        }
        $scope.col = 'create_time';//默认按create_time列排序
        $scope.desc = true;//默认排序条件升序
        $scope.myColor = {cursor: 'pointer'};
        $scope.myId = {cursor: 'pointer',width:'8%'};
        $scope.url = "http://dpp.intra.xiaojukeji.com/index?hash=/apply/dataAuth?hiveDatabase=dm&hiveTable=caiyun#/apply/dataAuth?hiveDatabase=dm&hiveTable=caiyun";
        //存储中文与数字之间的对应关系
        $scope.Run_status = ["初始", "运行中", "成功", "失败"];
        //GET获取数据
        $scope.getDatas = function () {
            $http({
                method: 'GET',
                params: {
                    'page': $scope.currentPage,
                    'size': 10,
                },
                url: '/oceanus/feature_extract_request/getTaskList'
            }).then(function successCallback(response) {
                if (response.data.status == "11001") {
                    toastr.error(response.data.message);
                    location.reload();
                }
                else if (response.data.status == "success") {
                    $scope.datas = response.data.value;
                    $scope.totalItems = response.data.count;//总记录数量
                }
            }, function errorCallback(response) {
            });
        };
        $scope.getDatas();

        $scope.edit = function (item) {
            $scope.edit_id = item.id || '';
            $scope.edit_background = item.background || '';
            $scope.edit_current_situation = item.current_situation || '';
            $scope.edit_expect_gain = item.expect_gain || '';

            $('#editModal').modal({});
        };

        $scope.editSave = function (id) {
            var csrftoken = getCookie('csrftoken');
            //POST更新数据
            if ($scope.edit_background != '' && $scope.edit_current_situation != '' && $scope.edit_expect_gain != '') {
                $.ajax({
                    type: 'POST',
                    url: '/oceanus/feature_extract_request/editTask',
                    dataType: 'json',
                    data: {
                        id: id,
                        background: $scope.edit_background,
                        current_situation: $scope.edit_current_situation,
                        expect_gain: $scope.edit_expect_gain
                    },
                    beforeSend: function (xhr, settings) {
                        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                    },
                    success: function (response) {
                        if (response.status == "11001") {
                            toastr.warning(response.message);
                            location.reload();
                        } else if (response.status == "success") {
                            toastr.success("修改成功！");
                            $('#editModal').modal('hide');

                            $scope.edit_id = '';
                            $scope.edit_background = '';
                            $scope.edit_current_situation = '';
                            $scope.edit_expect_gain = '';

                            $scope.getDatas();
                        } else {
                            toastr.info(response.message);
                        }
                    },
                    error: function () {
                        toastr.error("修改失败！");
                    }
                })
            } else {
                toastr.warning("数据有误！");
            }
        };

        // 复制功能
        $scope.copy = function (item) {
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'copyModal.html',
                controller: 'MyTaskCopyModalCtrl',
                resolve: {
                    item: function () {
                        return item;
                    },
                    p_scope: function () {
                        return $scope;
                    }
                }
            }).result.then(function (param) {
                console.log("关闭窗口");
            }, function () {
                console.log("关闭窗口");
            });
        };

        $scope.copySave = function () {
            var csrftoken = getCookie('csrftoken');
            var start_day = $('#startTime').val();
            var end_day = $('#endTime').val();
            //POST更新数据
            if ($scope.copy_id != '' && start_day != '' && end_day != '') {
                $.ajax({
                    type: 'POST',
                    url: 'featureExtractCopy',
                    dataType: 'json',
                    data: {
                        id: $scope.copy_id,
                        start_day: start_day,
                        end_day: end_day
                    },
                    beforeSend: function (xhr, settings) {
                        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                    },
                    success: function (response) {
                        if (response.status == "11001") {
                            toastr.warning(response.message);
                            location.reload();
                        } else if (response.status == "success") {
                            toastr.success("复制成功！");
                            $('#copyModal').modal('hide');

                            $scope.edit_id = '';
                            $scope.start_day = '';
                            $scope.end_day = '';

                            $scope.getDatas();
                        } else {
                            toastr.info(response.message);
                        }
                    },
                    error: function () {
                        toastr.error("复制失败！");
                    }
                })
            } else {
                toastr.warning("数据有误！");
            }
        };

        $scope.stop = function (id) {
            var csrftoken = getCookie('csrftoken');
            //POST更新数据
            $.ajax({
                type: 'POST',
                url: '/oceanus/feature_extract_request/runError',
                dataType: 'json',
                data: {
                    id: id
                },
                beforeSend: function (xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                },
                success: function (response) {
                    if (response.status == "11001") {
                        toastr.warning(response.message);
                        location.reload();
                    } else if (response.status == "success") {
                        toastr.success("中止成功！");
                        $scope.getDatas();
                    } else {
                        toastr.info(response.message);
                    }
                },
                error: function () {
                    toastr.error("中止失败！");
                }
            });
        };
        $scope.fmt = ['', 'CSV', 'Hive表'];
        $scope.show = function (item) {
            $scope.status = item.status || '';
            $scope.selected_feature = item.feature_list || '';
            $scope.table_group = (eval('(' + item.table_group + ')')).join(', ') || '';
            $scope.background = item.background || '';
            $scope.model_type = item.model_type || '';
            $scope.current_situation = item.current_situation || '';
            $scope.expect_gain = item.expect_gain || '';
            $scope.cities = item.cities || "所有城市";
            $scope.output_fmt = $scope.fmt[item.output_fmt] || '';
            $scope.user_define_path = item.user_define_path || '';
            $scope.hive_table = item.hive_table || '';
            $scope.hadoop_user = item.hadoop_user || '';
            $scope.start_day = item.start_day || '';
            $scope.end_day = item.end_day || '';
            $scope.scene = item.task_scene;
            if(item.model_type == null){
                $scope.isModalOld = true;
                $scope.model_type_old = item.model_content;
            }else{
                $scope.model_type_num = item.model_type;
                $scope.model_content = item.model_content;
                $scope.isModalOld = false;
            }

            $scope.requireList = extractService.getRequireArray;
            angular.forEach($scope.requireList,function(req){
                if(req.purpose == $scope.model_type_num){
                    if(req.purpose == 1){
                        $scope.isModalshow = true;
                        $scope.model_type_new = item.model_content;
                        $scope.model_type = req.name;
                    }
                    if(req.purpose == 2){
                        $scope.isModalshow = false;
                        $scope.model_type = req.name;
                    }
                    if(req.purpose == 3){
                        $scope.model_type = item.model_content;
                        $scope.isModalshow = false;
                    }
                }
            });

            // 组织url
            if (item.hive_table) {
                var url = (item.hive_table).split('.');

                $scope.url = "http://dpp.intra.xiaojukeji.com/index?hash=/apply/dataAuth?hiveDatabase=" + url[0] + "&hiveTable=" + url[1] + "&hadoopAccount=" + item.hadoop_user + "#/apply/dataAuth?hiveDatabase=" + url[0] + "&hiveTable=" + url[1] + "&hadoopAccount=" + item.hadoop_user;
            } else {
                $scope.url = '';
            }
            console.log(url);
            $('#myModal3').modal({});
        };
        $scope.run = function (id) {
            var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
            if (isChrome) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'myModal2.html',
                    controller: 'RunmodalCtrl',
                    resolve: {
                        id: function () {
                            return id;
                        }
                    }
                }).result.then(function(param){
                    console.log("关闭窗口");
                },function(){
                    console.log("关闭窗口");
                });

            } else {
                $('#browserModal').modal({});
            }
        };

        $scope.viewLog = function (id) {
            var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
            if (isChrome) {
                window.location.href = '/oceanus/feature_extract_list/run?id=' + id + '&op=view';
            } else {
                $('#browserModal').modal({});
            }
        }
        ///点击下载
        $scope.downLoad = function (event,item){

            var event = event || window.event ;
            event.target.style.color = '#999'
            toastr.info('正在努力获取资源');
            console.log('download start')
            var inter = setInterval(function(){$.ajax({
                method:'GET',
                url: '/oceanus/feature_extract_request/getCSVDownloadStatus?table_name='+item.hive_table+'&start_day='+item.start_day+'&end_day='+item.end_day,
                dataType: 'json',
                success:function(res){
                    console.log(res);
                    if(res.download_finish == 2){
                        clearInterval(inter)
                        var downId = event.target.getAttribute('data-id');
                        if(downId == 0){
                            ///下载
                            toastr.info('开始下载，请稍等')
                            event.target.setAttribute('data-id',1);
                            event.target.style.color = '#fa8919'
                            event.target.innerHTML = '下载中';
                            var linkName = '/oceanus/feature_extract_request/downloadHiveDataToCSV';
                            $scope.getFile(linkName,item.hive_table);
                            event.target.innerHTML = '下载';
                            event.target.setAttribute('data-id',0);
                        }
                    }
                },
                error:function(){
                    toastr.error('下载失败')
                }
            })},1000)

        };
        $scope.getFile = function(link,para){
            extractService.getData(link,{table_name:para
            })
        }
        ///下载的函数
        $scope.downloadFile = function(fileName, content){
            var aLink = document.createElement('a');
            var blob = new Blob([content]);
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
            aLink.download = fileName;
            aLink.href = URL.createObjectURL(blob);
            aLink.dispatchEvent(evt);
        }
    })
    .controller('RunmodalCtrl',['$scope','$http','$uibModalInstance','id',function($scope, $http, $uibModalInstance, id){
        $scope.startway = "1";
        $scope.status = "1";
        $scope.id = id;
        $scope.chooseRunway = function(value){
            $scope.status = value;
        }
        $scope.submitRunState = function(){
            if($scope.status == "1"){
                window.location.href = '/oceanus/feature_extract_list/run?id=' + $scope.id + '&op=run&stage=0';
            }else if($scope.status == "0"){
                window.location.href = '/oceanus/feature_extract_list/run?id=' + $scope.id + '&op=run&stage=1';
            }
        }
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        }
    }])
    .controller('AllListController', function ($scope, $http, extractService) {
        $scope.getQueryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        };
        if ($scope.getQueryString("page") && $scope.getQueryString("total")) {
            $scope.currentPage = $scope.getQueryString("page");
            $scope.totalItems = $scope.getQueryString("total");
        } else {
            $scope.currentPage = 1;//当前页
            $scope.totalItems = 0;
        }
        $scope.col = 'create_time';//默认按create_time列排序
        $scope.desc = true;//默认排序条件升序
        $scope.myColor = {cursor: 'pointer'};
        $scope.myId = {cursor: 'pointer',width:'8%'};
        $scope.Run_status = ["初始", "运行中", "成功", "失败"];
        //GET获取数据
        $scope.getDatas = function () {
            $http({
                method: 'GET',
                params: {
                    'page': $scope.currentPage,
                    'size': 10
                },
                url: '/oceanus/feature_extract_all/getTaskList'
            }).then(function successCallback(response) {
                if (response.data.status == "11001") {
                    toastr.error(response.data.message);
                    location.reload();
                }
                else if (response.data.status == "success") {
                    $scope.datas = response.data.value;
                    $scope.totalItems = response.data.count;//总记录数量
                }
            }, function errorCallback(response) {
            });
        };
        $scope.getDatas();

        $scope.stop = function (id) {
            var csrftoken = getCookie('csrftoken');
            //POST更新数据
            $.ajax({
                type: 'POST',
                url: '/oceanus/feature_extract_request/runError',
                dataType: 'json',
                data: {
                    id: id
                },
                beforeSend: function (xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                },
                success: function (response) {
                    if (response.status == "11001") {
                        toastr.warning(response.message);
                        location.reload();
                    } else if (response.status == "success") {
                        toastr.success("中止成功！");
                        $scope.getDatas();
                    } else {
                        toastr.info(response.message);
                    }
                },
                error: function () {
                    toastr.error("中止失败！");
                }
            });
        };
        $scope.fmt = ['', 'CSV', 'Hive表'];
        $scope.show = function (item) {
            $scope.selected_feature = item.feature_list || '';
            $scope.table_group = item.table_group || '';
            $scope.background = item.background || '';
            $scope.model_type = item.model_type || '';
            $scope.current_situation = item.current_situation || '';
            $scope.expect_gain = item.expect_gain || '';
            $scope.cities = item.cities || "所有城市";
            $scope.output_fmt = $scope.fmt[item.output_fmt] || '';
            $scope.user_define_path = item.user_define_path || '';
            $scope.hive_table = item.hive_table || '';
            $scope.hadoop_user = item.hadoop_user || '';
            $scope.start_day = item.start_day || '';
            $scope.end_day = item.end_day || '';
            $scope.scene = item.task_scene;
            if(item.model_type == null){
                $scope.isModalOld = true;
                $scope.model_type_old = item.model_content;
            }else{
                $scope.model_type_num = item.model_type;
                $scope.model_content = item.model_content;
                $scope.isModalOld = false;
            }
            $scope.requireList = extractService.getRequireArray;
            angular.forEach($scope.requireList,function(req){
                if(req.purpose == $scope.model_type_num){
                    if(req.purpose == 1){
                        $scope.isModalshow = true;
                        $scope.model_type_new = item.model_content;
                        $scope.model_type = req.name;
                    }
                    if(req.purpose == 2){
                        $scope.isModalshow = false;
                        $scope.model_type = req.name;
                    }
                    if(req.purpose == 3){
                        $scope.model_type = item.model_content;;
                        $scope.isModalshow = false;
                    }
                }
            });

            $('#myModal3').modal({});
        };
        $scope.viewLog = function (id) {
            var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
            if (isChrome) {
                window.location.href = '/oceanus/feature_extract_list/run?id=' + id + '&op=view';
                // curItem.attr("href",'/oceanus/feature_extract_list/run?id='+id+'&op=view');
            } else {
                $('#browserModal').modal({});
            }
        };




        $scope.publicTask = function (id){
            if(confirm("确定要公开此任务吗?")){
                var csrftoken = getCookie('csrftoken');
                $.ajax({
                    type: 'POST',
                    url: ' /oceanus/feature_extract_all/publishTask',
                    data: {id: id},
                    dataType: 'json',
                    beforeSend: function (xhr, settings) {
                        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                    },
                    success: function (res) {
                        if (res.status == "success") {
                            toastr.success('公开成功!');
                            $scope.getDatas();
                        } else if (res.status == "11001") {
                            toastr.error(res.message);
                            location.reload();
                        } else {
                            toastr.error(res.message);
                        }

                    },
                    error: function () {
                        toastr.error("操作失败");
                    }
                });
            }
        }
    })
    .controller('ExcellentCaseController', function ($scope, $http) {
        $scope.getQueryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        };
        if ($scope.getQueryString("page") && $scope.getQueryString("total")) {
            $scope.currentPage = $scope.getQueryString("page");
            $scope.totalItems = $scope.getQueryString("total");
        } else {
            $scope.currentPage = 1;//当前页
            $scope.totalItems = 0;
        }
        $scope.col = 'create_time';//默认按create_time列排序
        $scope.desc = true;//默认排序条件升序
        $scope.myColor = {cursor: 'pointer'};
        $scope.myId = {cursor: 'pointer',width:'8%'};
        //GET获取数据
        $scope.getDatas = function () {
            $http({
                method: 'GET',
                params: {
                    'page': $scope.currentPage,
                    'size': 10
                },
                url: '/oceanus/feature_extract_publish/getFeatureExtractPublishList'
            }).then(function successCallback(response) {
                if (response.data.status == "11001") {
                    toastr.error(response.data.message);
                    location.reload();
                }
                else if (response.data.status == "success") {
                    $scope.datas = response.data.value;
                    $scope.totalItems = response.data.count;//总记录数量
                }
            }, function errorCallback(response) {
            });
        };
        $scope.getDatas();

        $scope.show = function (item) {;
            $scope.background = item.background || '';
            $scope.current_situation = item.current_situation || '';
            $scope.expect_gain = item.expect_gain || '';
            $('#myModal3').modal({});
        };

    })
    .controller('AuditController', function ($scope, $http, extractService) {
        $scope.totalItems = 0;
        $scope.currentPage = 1;//当前页
        $scope.col = 'create_time';//默认按create_time列排序
        $scope.desc = true;//默认排序条件升序
        $scope.myColor = {cursor: 'pointer'};
        $scope.myId = {cursor: 'pointer',width:'8%'};
        //GET获取数据
        $scope.getDatas = function () {
            $http({
                method: 'GET',
                params: {
                    'page': $scope.currentPage,
                    'size': 10,
                },
                url: '/oceanus/feature_extract_audit/getTaskList'
            }).then(function successCallback(response) {
                if (response.data.status == "11001") {
                    toastr.error(response.data.message);
                    location.reload();
                }
                else if (response.data.status == "success") {
                    $scope.datas = response.data.value;
                    $scope.totalItems = response.data.count;//总记录数量
                }
            }, function errorCallback(response) {
            });
        };
        $scope.getDatas();
        $scope.fmt = ['', 'CSV', 'Hive表'];
        $scope.edit = function (item) {
            $scope.id = item.id || '';
            $scope.feature_list = item.feature_list || '';
            $scope.cities = item.cities || "所有城市";
            $scope.output_fmt = $scope.fmt[item.output_fmt] || '';
            $scope.user_define_path = item.user_define_path || '';
            $scope.hive_table = item.hive_table || '';
            $scope.hadoop_user = item.hadoop_user || '';
            $scope.start_day = item.start_day || '';
            $scope.end_day = item.end_day || '';
            $scope.model_type = item.model_type || '';
            $scope.background = item.background || '';
            $scope.current_situation = item.current_situation || '';
            $scope.expect_gain = item.expect_gain || '';
            $scope.scene = item.task_scene;
            if(item.model_type == null){
                $scope.isModalOld = true;
                $scope.model_type_old = item.model_content;
            }else{
                $scope.model_type_num = item.model_type;
                $scope.model_content = item.model_content;
                $scope.isModalOld = false;
            }
            $scope.requireList = extractService.getRequireArray;
            angular.forEach($scope.requireList,function(req){
                if(req.purpose == $scope.model_type_num){
                    if(req.purpose == 1){
                        $scope.isModalshow = true;
                        $scope.model_type_new = item.model_content;
                        $scope.model_type = req.name;
                    }
                    if(req.purpose == 2){
                        $scope.isModalshow = false;
                        $scope.model_type= req.name;
                    }
                    if(req.purpose == 3){
                        $scope.model_type = item.model_content;;
                        $scope.isModalshow = false;
                    }
                }
            });

            $('#myModal3').modal({});
        };
        $scope.saveResult = function (id, feature_list) {
            var csrftoken = getCookie('csrftoken');
            if (id && feature_list) {
                $.ajax({
                    type: 'POST',
                    url: 'auditEdit',
                    dataType: 'json',
                    data: {
                        id: id,
                        feature_list: feature_list
                    },
                    beforeSend: function (xhr, settings) {
                        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                    },
                    success: function (response) {
                        if (response.status == "11001") {
                            toastr.warning(response.message);
                            location.reload();
                        } else if (response.status == "success") {
                            toastr.success("修改成功");
                            $scope.getDatas();

                            // 创建成功后隐藏模态框
                            $('#myModal3').modal('hide');
                        } else {
                            toastr.info(response.message);
                        }
                    },
                    error: function () {
                        toastr.error("修改失败");
                    }
                });
            } else {
                toastr.warning("信息有误！");
            }
        }
    })
    .controller('FeaStatisticsController', function ($scope, $http, extractService) {
        $scope.vm ={};
        $scope.vm.statistical_period = "1";
        $scope.vm.statistical_object = "1";
        $scope.username_test = extractService.getCookie('username');
        ///获取所有的数据 caller 和任务
        $scope.getAllCount = function(){
            $scope.getLoadModel();
            $scope.getLoadCaller();
            $scope.getFeaStatistics();
        };
        $scope.statistical_download = false;
        //获取下载特征统计的权限
        $http({
            method:'GET',
            url:'/oceanus/feature_extract_list/getWhiteTable?username='+$scope.username_test
        })
            .then(function success(res){
                    // console.log(res);
                    $scope.statistical_download = res.data.right.statistical_download == 1?true:false;
                },
                function error(error){
                    toastr.error(error);
                });


        //GET获取数据
        $scope.getFeaStatistics = function () {
            console.log($scope.vm.statistical_period,$scope.vm.statistical_object)
            if($scope.vm.statistical_period && $scope.vm.statistical_object){
                $http({
                    method: 'GET',
                    params: {
                        'statistical_period':$scope.vm.statistical_period,
                        'statistical_object':$scope.vm.statistical_object,
                        'page': $scope.currentPage,
                        'size': 9,
                    },
                    url: '/oceanus/feature_extract_statistics/getFeatureStatistics'
                }).then(function successCallback(response) {
                    if (response.data.status == "11001") {
                        toastr.error(response.data.message);
                        location.reload();
                    }
                    else if (response.data.status == "success") {
                        $scope.datas = response.data.value;
                        $scope.vm.total_times = response.data.total_times;
                        $scope.totalItems = response.data.count;//总记录数量
                    }
                }, function errorCallback(response) {
                });
            }

        };
        $scope.getFeaStatistics();
        $scope.getLoadCaller = function () {

            $http({
                method: 'GET',
                url: '/oceanus/feature_extract_statistics/getCallerCount',
                params:{
                    'statistical_period':$scope.vm.statistical_period,
                },
            }).then(function successCallback(response) {
                if (response.data.status == "11001") {
                    toastr.error(response.data.message);
                    location.reload();
                }
                else if (response.data.status == "success") {
                    $scope.datas = response.data.value;
                    $scope.vm.caller_count = $scope.datas[0].caller_count;
                }
            }, function errorCallback(response) {
            });
        }

        ;
        $scope.getLoadCaller();
        $scope.getLoadModel = function () {

            $http({
                method: 'GET',
                url: '/oceanus/feature_extract_statistics/getModelCount',
                params:{
                    'statistical_period':$scope.vm.statistical_period,
                },
            }).then(function successCallback(response) {
                if (response.data.status == "11001") {
                    toastr.error(response.data.message);
                    location.reload();
                }
                else if (response.data.status == "success") {
                    $scope.datasmodel = response.data.value;
                    $scope.vm.model_count = $scope.datasmodel[0].model_count;
                    $scope.vm.minning_count = $scope.datasmodel[0].minning_count;
                    $scope.vm.other_count = $scope.datasmodel[0].other_count;
                    $scope.vm.total = $scope.datasmodel[0].total;
                }
            }, function errorCallback(response) {
            });
        }

        ;
        $scope.getLoadModel();

        $scope.isFinish = true;
        $scope.showFileStatus = function(){
            if($scope.isFinish){
                var time = setInterval(function(){
                    extractService.getData('/oceanus/feature_extract_statistics/getDownloadStatus').then(function success(res){
                        console.log(res);
                        $scope.isFinish = res.download_finish;
                        if($scope.isFinish){
                            clearInterval(time);
                        }
                    },function error(){
                        console.log("调取接口出错");
                    });
                },500);
            }
        }
        $scope.getFile = function(){
            extractService.getData('/oceanus/feature_extract_statistics/downloadFeatureStatistics',{statistical_period:$scope.vm.statistical_period,
                statistical_object:$scope.vm.statistical_object}).then(function success(res){
                console.log(res);
            },function error(error){
                console.log("文件下载失败");
            });
        }

    })
    .controller('MyTaskCopyModalCtrl',['$scope','$http','$uibModalInstance','$filter','extractService','item','p_scope',function ($scope, $http, $uibModalInstance, $filter, extractService, item, p_scope){
        $scope.copy_id = item.id || '';
        $scope.copy_task_scene = item.task_scene || '';
        $scope.copy_start_day = item.start_day || '';
        $scope.copy_end_day = item.end_day || '';
        $scope.timeline = item.copy_date;


        if($scope.timeline == ""){
            $scope.startday = new Date(new Date()-24*60*60*1000);
            $scope.endday = new Date(new Date()-24*60*60*1000);
        }else{
            $scope.startday = $filter('dateformat')($scope.timeline);
            $scope.endday = $filter('dateformat')($scope.timeline);
        }
        $scope.endday_max = angular.copy($scope.endday);
        $scope.formats = [ 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate' ];
        $scope.format = $scope.formats[1];

        if ($scope.copy_task_scene == 4) {
            // 场景为常规时不可选日期
            $scope.istimeDisabled = true;
        } else {
            $scope.istimeDisabled = false;
        }

        //最大日期为当前日期的前一天
        $scope.fromdateOptions = {
            formatYear: 'yy',
            maxDate: $scope.startday,
            //minDate: new Date(),
            startingDay: 1
        };
        $scope.todateOptions = {
            formatYear: 'yy',
            maxDate: $scope.endday_max ,
            minDate: $scope.startday,
            startingDay: 1
        };
        $scope.$watch('startday',function(newVal,oldVal){
            if(newVal != oldVal){
                $scope.todateOptions.minDate = newVal;
                $scope.open.to = !$scope.open.to;
            }
            if($scope.timeline == ""){
                $scope.fromdateOptions.maxDate = $scope.startday;
            }
            console.log($scope.endday_max)
            var maxdate_now = new Date($scope.startday.getFullYear(),$scope.startday.getMonth()+1,$scope.startday.getDate());
            if(maxdate_now < $scope.endday_max){
                $scope.todateOptions.maxDate = maxdate_now;
                $scope.endday = maxdate_now;
            }else{
                $scope.todateOptions.maxDate = $scope.endday_max;
                $scope.endday = $scope.endday_max;
            }

            //$scope.fromdateOptions.minDate = new Date($scope.startday.getFullYear(),$scope.startday.getMonth()-2,$scope.startday.getDate());
            //$scope.todateOptions.maxDate = new Date($scope.endday.getFullYear(),$scope.endday.getMonth()-2,$scope.endday.getDate());
        });
        $scope.$watch('endday',function(newVal,oldVal){
            if(!!$scope.startday){
                var startmonth = $scope.startday.getMonth()+1;
                var endmonth = $scope.endday.getMonth()+1;
                if($scope.endday - $scope.startday >90*24*60*60*1000){
                    toastr.warning("选择的时间段过长，建议先用少量数据测试。如确实有需要，请联系管理员");
                }
            }

        });
        $scope.open = {
            from:false,
            to:false
        }
        $scope.timeInfoShow = false;
        $scope.showTimeInfo = function(){
            $scope.timeInfoShow = true;
        }
        $scope.hideTimeInfo = function(){
            $scope.timeInfoShow = false;
        }
        $scope.altInputFormats = ['M!/d!/yyyy'];
        $scope.toggleFromOpen = function(key) {
            $scope.open[key] = !$scope.open[key];
        };
        $scope.copySave = function () {
            var csrftoken = extractService.getCookie('csrftoken');
            var start_day = $filter('date')($scope.startday,'yyyy-MM-dd');
            var end_day = $filter('date')($scope.endday,'yyyy-MM-dd');
            //POST更新数据
            //POST更新数据

            //当为常规场景的时候开始时间与结束时间为同一天
            if($scope.istimeDisabled == true){
                $scope.timeData = {
                    id: $scope.copy_id,
                    start_day: start_day,
                    end_day: start_day
                }
            }else {
                $scope.timeData = {
                    id: $scope.copy_id,
                    start_day: start_day,
                    end_day: end_day
                }
            }
            if ($scope.copy_id != '' && start_day != '' && end_day != '') {
                $.ajax({
                    type: 'POST',
                    url: 'featureExtractCopy',
                    dataType: 'json',
                    data:$scope.timeData,
                    beforeSend: function (xhr, settings) {
                        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                    },
                    success: function (response) {
                        if (response.status == "11001") {
                            toastr.warning(response.message);
                            location.reload();
                        } else if (response.status == "success") {
                            toastr.success("复制成功！");
                            $scope.cancel();

                            $scope.edit_id = '';
                            $scope.start_day = '';
                            $scope.end_day = '';

                            p_scope.getDatas();
                        } else {
                            toastr.info(response.message);
                        }
                    },
                    error: function () {
                        toastr.error("复制失败！");
                    }
                })
            } else {
                toastr.warning("数据有误！");
            }
        };
        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        }
    }])
    .service('extractService', ['$http', '$q', function ($http, $q){
        var extractService = this;
        extractService.Run_status = ["初始", "运行中", "成功", "失败"];
        extractService.fmt = ['', 'CSV', 'Hive表'];
        extractService.getRequireArray = [
            {
                purpose:1,
                name: "模型开发"
            },
            {
                purpose:2,
                name: "数据挖掘/分析"
            },
            {
                purpose:3,
                name: "其他"
            }
        ];
        extractService.getQueryString = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        }
        extractService.csrfSafeMethod = function (method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        extractService.getCookie = function (name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        //将copy的日期字符串转换成日期格式
        extractService.changeTodate = function (str) {
            var start = str;
            str = str.replace(/-/g,"/");
            var date = new Date(str);
            return date;
        }

        extractService.getData = function (url, data) {
            var deferred = $q.defer();
            var promise = $http({
                method: 'GET',
                url: url,
                params: data
            });
            promise.then(
                // 通讯成功的处理
                function (answer) {
                    // 在这里可以对返回的数据集做一定的处理,再交由controller进行处理
                    answer.status = true;
                    deferred.resolve(answer.data);
                },
                // 通讯失败的处理
                function (error) {
                    // 可以先对失败的数据集做处理，再交由controller进行处理
                    error.status = false;
                    deferred.reject(error);
                });
            // 返回promise对象，交由controller继续处理成功、失败的业务回调
            return deferred.promise;
        }


    }])
    .config(function ($httpProvider,uibDatepickerPopupConfig) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

        uibDatepickerPopupConfig.currentText = '今天';
        uibDatepickerPopupConfig.clearText = '重置';
        uibDatepickerPopupConfig.closeText = '关闭';
    })
    .filter("delquotation", function () {
        return function (input) {
            var out = "";
            out = input.split('\"');
            if (out.length == 1) {
                return out[0];
            } else if (out.length == 3) {
                return out[1];
            }
            console.log(out);

        }
    })
    .filter('dateformat',function(){
        return function(input){
            var reg = /^(\d{4})(\d{2})(\d{2})$/;
            var str;
            if(reg.test(input)){
                str = new Date(Date.parse(input.replace(reg,'$1/$2/$3')));
            }else{
                console.log("日期错误");
            }

            return str;
        }
    })
    .run(function($rootScope, $templateCache) {
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            if (typeof(current) !== 'undefined'){
                $templateCache.remove(current.templateUrl);
            }
        });
    });

// $(document).ready(function(){
//     var page=getQueryString("page");
//     if(page){
//         var controller=$("#getControll").attr("ng-controller");
//         var appElement = document.querySelector('[ng-controller='+controller+']');
//         var $scope = angular.element(appElement).scope();
//         $scope.currentPage = page;
//         // $scope.getDatas();
//         $scope.$apply();
//     }


// });
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
$("#extractRequest").click(function () {
    window.location.href = "/oceanus/feature_extract_request/";
});
$("#features_request_table").on('click', function (e) {
    if (e.target.tagName == "A") {
        var curItem = $(e.target);
        if (curItem.hasClass('cancel')) {
            var id = curItem.attr("data-id");
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                type: 'POST',
                url: '/oceanus/feature_extract_request/cancelRequest',
                data: {id: id, op: 'cancel'},
                dataType: 'json',
                beforeSend: function (xhr, settings) {
                    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                    console.log("正在进行，请稍候");
                },
                success: function (res) {
                    if (res.status == "success") {
                        var appElement = document.querySelector('[ng-controller=ListController]');
                        var $scope = angular.element(appElement).scope();
                        $scope.getDatas();

                    } else if (res.status == "11001") {
                        toastr.error(res.message);
                        location.reload();
                    } else {
                        toastr.error(res.message);

                    }

                },
                error: function () {
                    toastr.error("操作失败");
                }
            });
        } else if (curItem.hasClass('delete')) {
            var id = curItem.attr("data-id");
            var csrftoken = getCookie('csrftoken');
            if (confirm("确定删除吗？")) {
                $.ajax({
                    type: 'POST',
                    url: '/oceanus/feature_extract_request/cancelRequest',
                    data: {id: id, op: 'delete'},
                    dataType: 'json',
                    beforeSend: function (xhr, settings) {
                        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                        console.log("正在进行，请稍候");
                    },
                    success: function (res) {
                        if (res.status == "success") {
                            var appElement = document.querySelector('[ng-controller=ListController]');
                            var $scope = angular.element(appElement).scope();
                            $scope.getDatas();

                        } else if (res.status == "11001") {
                            toastr.error(res.message);
                            location.reload();
                        } else {
                            toastr.error(res.message);

                        }

                    },
                    error: function () {
                        toastr.error("操作失败");
                    }
                });
            }

        }
    }
});
$("#All_request_table").on('click', function (e) {
    if (e.target.tagName == "A") {
        var curItem = $(e.target);
        if (curItem.hasClass('show')) {
            var id = curItem.attr("data-id");
            var appElement = document.querySelector('[ng-controller=AllListController]');
            var $scope = angular.element(appElement).scope();
            $.each($scope.datas, function (i, obj) {
                if (obj.id == id) {
                    // console.log()
                    $('#selected_feature').val(obj.feature_list);
                    // console.log();
                    $('#table_group').val(obj.table_group);
                    $('#background').val(obj.background);
                    $('#current_situation').val(obj.current_situation);
                    $('#expect_gain').val(obj.expect_gain);
                    if (obj.cities == '') {
                        $('#cities').val('所有城市');
                    } else {
                        $('#cities').val(obj.cities);
                    }
                    $('#user_define_path').val(obj.user_define_path);
                    $('#start_day').val(qudiao(obj.start_day));
                    $('#end_day').val(qudiao(obj.end_day));

                }
            });
            $('#myModal3').modal({});
        }
    }
});
function qudiao(input) {
    var out = "";
    out = input.split('\"');
    if (out.length == 1) {
        return out[0];
    } else if (out.length == 3) {
        return out[1];
    }
}
$("#features_audit_table").on('click', function (e) {
    if (e.target.tagName == "A") {
        var curItem = $(e.target);
        if (curItem.hasClass('audit')) {
            var id = curItem.attr("data-id");
            getAuthorizedTable(id);
            $("#audit_idea").hide();

        } else if (curItem.hasClass('show')) {
            var id = curItem.attr("data-id");
            var appElement = document.querySelector('[ng-controller=AuditController]');
            var $scope = angular.element(appElement).scope();
            $.each($scope.datas, function (i, obj) {
                if (obj.id == id) {
                    // console.log()
                    $('#selected_feature').val(obj.feature_list);
                    if (obj.cities == '') {
                        $('#cities').val('所有城市');
                    } else {
                        $('#cities').val(obj.cities);
                    }
                    $('#user_define_path').val(obj.user_define_path);
                    $('#start_day').val(obj.start_day);
                    $('#end_day').val(obj.end_day);

                }
            });
            $('#myModal3').modal({});
        }

    }
});
$("#table_task").on('click', function (e) {
    var flag = false;
    if (e.target.tagName == "A") {
        var curItem = $(e.target);
        if (curItem.hasClass('pass') && curItem.hasClass('btn-abled')) {
            curItem.parent().prev().attr("data-status", 2);
            curItem.addClass('btn-disabled').removeClass('btn-abled');
            curItem.next().addClass('btn-abled').removeClass('btn-disabled');

        } else if (curItem.hasClass('nopass') && curItem.hasClass('btn-abled')) {
            curItem.parent().prev().attr("data-status", 3);
            curItem.addClass('btn-disabled').removeClass('btn-abled');
            curItem.prev().addClass('btn-abled').removeClass('btn-disabled');
        }

    }
    $(".nopass").each(function(key,value){
        if($(this).hasClass('btn-disabled')){
            flag = true;
        }
    });
    if(flag){
        $("#audit_idea").show();
    }else{
        $("#audit_idea").hide();
    }
});
$('#save_data').on('click', function () {
    var csrftoken = getCookie('csrftoken');
    var data = {};
    data.id = $('input[name=hidden]').val();
    data.table = '';
    data.value = '';
    data.audit_option = $("#audit_option").val();
    var label = $("#table_task").find('label');
    $.each(label, function (id, obj) {
        if (id == label.length - 1) {
            data.table += $(obj).html();
            data.value += $(obj).attr('data-status');
        } else {
            data.table += $(obj).html() + ',';
            data.value += $(obj).attr('data-status') + ',';
        }

    });
    console.log(data);
    $.ajax({
        type: 'POST',
        url: '/oceanus/feature_extract_audit/auditRequest',
        data: data,
        dataType: 'json',
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
            console.log("正在进行，请稍候");
        },
        success: function (res) {
            if (res.status == "success") {
                toastr.success("审核完毕");
                $('#myModal').modal('hide');
                location.reload();
            } else if (res.status == "11001") {
                toastr.error(res.message);
                location.reload();
            } else {
                toastr.error(res.message);
            }
        },
        error: function () {
            toastr.error("操作失败");
        },
    });
});


function getAuthorizedTable(id) {
    $.ajax({
        type: 'GET',
        url: '/oceanus/feature_extract_audit/getAuthorizedTable',
        data: {id: id},
        dataType: 'json',
        beforeSend: function (xhr, settings) {
        },
        success: function (res) {
            if (res.status == "success") {
                // me.quanTable=res.value;
                var appElement = document.querySelector('[ng-controller=AuditController]');
                var $scope = angular.element(appElement).scope();
                $.each($scope.datas, function (idx, obj) {
                    if (obj.id == id) {
                        var str = '';

                        $('input[name=hidden]').val(obj.id);
                        var status_json = JSON.parse(obj.table_status);

                        for (var key in status_json) {
                            var statusvv = false;
                            $.each(res.value, function (ind, obj2) {
                                if (key == obj2) {
                                    statusvv = true;
                                    return false;
                                }
                            });
                            // console.log(statusvv);
                            if (statusvv == true && status_json[key] == 1) {
                                str += '<div class="demo-line col-sm-12 form-group">'
                                    + '<label class="control-label col-sm-7" style="text-align: left; padding-top:0;word-wrap:break-word;word-break:break-all;" data-status="1">' + $.trim(key) + '</label>'
                                    + '<div class="col-sm-5">'
                                    + '<a class="btn-abled pass" style="margin-right:40px;">通过</a><a class="btn-abled nopass">不通过</a>'
                                    + '</div>'
                                    + '</div>'
                            } else if(!statusvv && status_json[key] == 1){
                                str += '<div class="demo-line col-sm-12 form-group">'
                                    + '<label class="control-label col-sm-7" style="text-align: left; padding-top:0;word-wrap:break-word;word-break:break-all;" data-status="' + status_json[key] + '">' + $.trim(key) + '</label>'
                                    + '<div class="col-sm-5">'
                                    + '<a class="btn-disabled pass" style="margin-right:40px;">未审核</a>'
                                    + '</div>'
                                    + '</div>'
                            }else if(!statusvv && status_json[key] != 1){
                                str += '<div class="demo-line col-sm-12 form-group">'
                                    + '<label class="control-label col-sm-7" style="text-align: left; padding-top:0;word-wrap:break-word;word-break:break-all;" data-status="' + status_json[key] + '">' + $.trim(key) + '</label>'
                                    + '<div class="col-sm-5">'
                                    + '<a class="btn-disabled pass" style="margin-right:40px;">已审核</a>'
                                    + '</div>'
                                    + '</div>'
                            }

                        }
                        $('#table_task').html(str);

                    }
                });
                $('#myModal').modal({});
            } else if (res.status == "11001") {
                toastr.error(res.message);
                location.reload();
            } else {
                console.log(res.message);
            }

        },
        error: function () {
            console.log("失败");
        },
    });
}

function loadDateTime(start, end) {
    var date1 = new Date();
    date1.setDate(date1.getDate() - 1);
    var checkin = $('#' + start).datepicker({
        format: 'yyyy-mm-dd',
        startDate: date1,
        parseFormat: function (format) {
            return {separator: separator, parts: parts};
        },
        onRender: function (date) {
            return date.valueOf() > date1 ? 'disabled' : '';
        }

    }).on('changeDate', function (ev) {
        if (ev.date.valueOf() > checkout.date.valueOf()) {
            var newDate = new Date(ev.date);
            newDate.setDate(newDate.getDate());
            checkout.setValue(newDate);
        }
        else {
            checkout.setValue(date1);
        }
        checkin.hide();
        $('#' + end)[0].focus();
    }).data('datepicker');
    // checkin.date.valueOf(this.valueOf()-1);
    checkin.setValue(date1);
    var checkout = $('#' + end).datepicker({
        format: 'yyyy-mm-dd',
        startDate: '-3d',
        onRender: function (date) {
            return date.valueOf() < checkin.date.valueOf() || date.valueOf() > date1 ? 'disabled' : '';
        }
    }).on('changeDate', function (ev) {
        var endMonth = ev.date.getMonth()+1;
        var startMonth= new Date($('#' + start).val()).getMonth() +1;
        if(endMonth - startMonth > 3){
            $("#datelimit").show();
        }else{
            $("#datelimit").hide();
            checkout.hide();
        }
    }).data('datepicker');
    checkout.setValue(date1);

}