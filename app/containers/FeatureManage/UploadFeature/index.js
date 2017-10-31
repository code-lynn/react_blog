import React,{Component} from 'react';
import './index.less';
import {message} from 'antd';
import $ from 'jquery';

export default class UploadFeature extends Component{
    constructor(props) {
        super(props);

    }
    render() {
        ////console.log('UploadFeature');
        return (
            <div className="upload_feature_hold_content">
                <div className="clearfix">
                    <a className="fr didi-btn didi-btn-ok" target="_blank" href="/oceanus/manage_feature/download_template_file">下载模板</a>
                </div>
                <div className="upload_feature_logo">
                    <img src={require('./ic_archive_black_48px.svg')} />
                        <p>导入特征</p>
                </div>

                <div className="upload_feature_input">
                    <form action="" encType="multipart/form-data">
                        <input type="hidden" name="csrfmiddlewaretoken" value="5mkfq9T23tMoGcSX1dbUc1pg7q8Xi6JLMmDVOI1WZi9Do3h1w4svWYWJZo9ILypJ" autoComplete="off" />
                        <div className="upload_feature_upload" >
                            <input type="text" ref="upload_url" className="upload_feature_upload-url" />
                            <input type="button" className="upload_feature_upload-btn" value="浏览文件" />
                            <input type="file" id="file" className="upload_feature_upload-input-file" onChange={this.handleChange.bind(this)} name="upload_feature_file" />
                        </div>
                        <div style={{"float": "left", "width": "60px"}}>
                            <input type="button" value="上传" className="upload_feature_submit" onClick={this.handleSubmit.bind(this)} />
                        </div>
                    </form>
                </div>

            </div>
        );
    }
    componentDidMount() {

    }
    handleSubmit(){
        let oFile = document.querySelector('#file');
        let data = oFile.files[0];
        ////console.log(data);
        if(data){
           this.postAjaxFrom('/oceanus/manage_feature/upload_feature_file',data,'upload_feature_file',this.formSubmitSuccess.bind(this))
        }else{
            message.error('还没有选文件');
        }

    }
    handleChange(e){
        let val = e.target.value;
        this.refs.upload_url.value = val;

    }
    formSubmitSuccess(data){
        message.success('上传成功');
        window.location.reload();
    }
    postAjaxFrom(url,data,fromName,fnSuc){
        let fd=new FormData();
        fd.append(fromName,data);
        $.ajax({
            type: 'POST',
            url: url,
            data: fd,
            dataType:'json',
            cache : false,
            processData : false,
            contentType : false,
            success: function (res) {
                if (res.error) {
                    message.error(res.error)
                }else{
                    fnSuc(res);
                }
            }
        })
    }

}

