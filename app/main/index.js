import React,{Component} from 'react';
import Loading from '../components/Loading';
import HomeHeader from  './HomeHeader';
export default class Main extends Component{
    constructor(){
        super();
        this.state = {
            loading:false,
        }
    }
    render(){
        return (
            <div>
                <HomeHeader/>
                <div className="flexLayout">
                    <div className="flexLayout container" ref={"container"}>
                        {this.state.loading?
                            this.props.children:
                            <Loading/>
                        }
                    </div>
                </div>
            </div>
        )

    }
    componentDidMount(){



        this.setState({
            loading:true
        });
        let clientH = document.documentElement.clientHeight || document.body.clientHeight;
        this.refs.container.style["minHeight"] = (clientH-70) + 'px';


    }
}

