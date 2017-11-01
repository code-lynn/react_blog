import React,{Component} from 'react';
import './index.less';
export default class RunLog extends Component{
    render(){
        return (
            <div className="run_log_container">
                <div className="run_log_title">上次运行结果(重构时做)</div>
                <div className="run_log_content">
                    2017-09-14 10:35:00,883 Stage-1 map = 7%,  reduce = 0%, Cumulative CPU 4884.29 sec
                    2017-09-14 10:35:01,920 Stage-1 map = 9%,  reduce = 0%, Cumulative CPU 5757.74 sec
                    2017-09-14 10:35:02,993 Stage-1 map = 11%,  reduce = 0%, Cumulative CPU 6733.62 sec
                    2017-09-14 10:35:04,081 Stage-1 map = 13%,  reduce = 0%, Cumulative CPU 7760.65 sec
                    2017-09-14 10:35:05,126 Stage-1 map = 14%,  reduce = 0%, Cumulative CPU 8526.93 sec
                    2017-09-14 10:35:06,170 Stage-1 map = 15%,  reduce = 0%, Cumulative CPU 9093.4 sec
                    2017-09-14 10:35:07,209 Stage-1 map = 16%,  reduce = 0%, Cumulative CPU 9619.88 sec
                    2017-09-14 10:35:08,256 Stage-1 map = 17%,  reduce = 0%, Cumulative CPU 10046.88 sec
                    2017-09-14 10:35:09,294 Stage-1 map = 18%,  reduce = 0%, Cumulative CPU 10335.24 sec
                    2017-09-14 10:35:11,361 Stage-1 map = 19%,  reduce = 0%, Cumulative CPU 10834.32 sec
                    2017-09-14 10:35:14,470 Stage-1 map = 20%,  reduce = 0%, Cumulative CPU 11652.98 sec
                    2017-09-14 10:35:16,556 Stage-1 map = 21%,  reduce = 0%, Cumulative CPU 12500.86 sec
                    2017-09-14 10:35:17,594 Stage-1 map = 22%,  reduce = 0%, Cumulative CPU 13583.9 sec
                    2017-09-14 10:35:18,633 Stage-1 map = 23%,  reduce = 0%, Cumulative CPU 14283.47 sec
                    2017-09-14 10:35:19,669 Stage-1 map = 25%,  reduce = 0%, Cumulative CPU 15479.15 sec
                    2017-09-14 10:35:20,707 Stage-1 map = 27%,  reduce = 0%, Cumulative CPU 16382.9 sec
                    2017-09-14 10:35:21,744 Stage-1 map = 28%,  reduce = 0%, Cumulative CPU 17184.7 sec
                    2017-09-14 10:35:22,785 Stage-1 map = 29%,  reduce = 0%, Cumulative CPU 17967.49 sec
                    2017-09-14 10:35:23,822 Stage-1 map = 31%,  reduce = 0%, Cumulative CPU 18664.15 sec
                    2017-09-14 10:35:24,859 Stage-1 map = 32%,  reduce = 0%, Cumulative CPU 19208.12 sec
                    2017-09-14 10:35:26,928 Stage-1 map = 33%,  reduce = 0%, Cumulative CPU 20142.48 sec
                    2017-09-14 10:35:27,963 Stage-1 map = 34%,  reduce = 0%, Cumulative CPU 20596.06 sec
                    2017-09-14 10:35:28,997 Stage-1 map = 35%,  reduce = 0%, Cumulative CPU 21002.78 sec
                    2017-09-14 10:35:31,070 Stage-1 map = 36%,  reduce = 0%, Cumulative CPU 21937.22 sec
                    2017-09-14 10:35:32,102 Stage-1 map = 37%,  reduce = 0%, Cumulative CPU 22246.27 sec
                    2017-09-14 10:35:34,169 Stage-1 map = 38%,  reduce = 0%, Cumulative CPU 22908.4 sec
                    2017-09-14 10:35:36,231 Stage-1 map = 39%,  reduce = 0%, Cumulative CPU 23407.7 sec
                    2017-09-14 10:35:39,332 Stage-1 map = 40%,  reduce = 0%, Cumulative CPU 24046.98 sec
                    2017-09-14 10:35:41,405 Stage-1 map = 41%,  reduce = 0%, Cumulative CPU 25050.82 sec
                    2017-09-14 10:35:43,482 Stage-1 map = 42%,  reduce = 0%, Cumulative CPU 26085.85 sec
                    2017-09-14 10:35:44,521 Stage-1 map = 43%,  reduce = 0%, Cumulative CPU 26585.79 sec
                    2017-09-14 10:35:45,558 Stage-1 map = 45%,  reduce = 0%, Cumulative CPU 27847.27 sec
                    2017-09-14 10:35:46,598 Stage-1 map = 47%,  reduce = 0%, Cumulative CPU 28994.16 sec
                    2017-09-14 10:35:47,637 Stage-1 map = 48%,  reduce = 0%, Cumulative CPU 29564.66 sec
                    2017-09-14 10:35:48,678 Stage-1 map = 49%,  reduce = 0%, Cumulative CPU 30158.89 sec
                    2017-09-14 10:35:49,716 Stage-1 map = 50%,  reduce = 0%, Cumulative CPU 30804.49 sec
                    2017-09-14 10:35:50,752 Stage-1 map = 51%,  reduce = 0%, Cumulative CPU 31266.67 sec
                    2017-09-14 10:35:51,788 Stage-1 map = 52%,  reduce = 0%, Cumulative CPU 31812.24 sec
                    2017-09-14 10:35:52,824 Stage-1 map = 53%,  reduce = 0%, Cumulative CPU 32233.32 sec
                    2017-09-14 10:35:53,861 Stage-1 map = 54%,  reduce = 0%, Cumulative CPU 32585.75 sec
                    2017-09-14 10:35:45,558 Stage-1 map = 45%,  reduce = 0%, Cumulative CPU 27847.27 sec
                    2017-09-14 10:35:46,598 Stage-1 map = 47%,  reduce = 0%, Cumulative CPU 28994.16 sec
                    2017-09-14 10:35:47,637 Stage-1 map = 48%,  reduce = 0%, Cumulative CPU 29564.66 sec
                    2017-09-14 10:35:48,678 Stage-1 map = 49%,  reduce = 0%, Cumulative CPU 30158.89 sec
                    2017-09-14 10:35:49,716 Stage-1 map = 50%,  reduce = 0%, Cumulative CPU 30804.49 sec
                    2017-09-14 10:35:50,752 Stage-1 map = 51%,  reduce = 0%, Cumulative CPU 31266.67 sec
                    2017-09-14 10:35:51,788 Stage-1 map = 52%,  reduce = 0%, Cumulative CPU 31812.24 sec
                    2017-09-14 10:35:52,824 Stage-1 map = 53%,  reduce = 0%, Cumulative CPU 32233.32 sec
                    2017-09-14 10:35:53,861 Stage-1 map = 54%,  reduce = 0%, Cumulative CPU 32585.75 sec
                    2017-09-14 10:35:45,558 Stage-1 map = 45%,  reduce = 0%, Cumulative CPU 27847.27 sec
                    2017-09-14 10:35:46,598 Stage-1 map = 47%,  reduce = 0%, Cumulative CPU 28994.16 sec
                    2017-09-14 10:35:47,637 Stage-1 map = 48%,  reduce = 0%, Cumulative CPU 29564.66 sec
                    2017-09-14 10:35:48,678 Stage-1 map = 49%,  reduce = 0%, Cumulative CPU 30158.89 sec
                    2017-09-14 10:35:49,716 Stage-1 map = 50%,  reduce = 0%, Cumulative CPU 30804.49 sec
                    2017-09-14 10:35:50,752 Stage-1 map = 51%,  reduce = 0%, Cumulative CPU 31266.67 sec
                    2017-09-14 10:35:51,788 Stage-1 map = 52%,  reduce = 0%, Cumulative CPU 31812.24 sec
                    2017-09-14 10:35:52,824 Stage-1 map = 53%,  reduce = 0%, Cumulative CPU 32233.32 sec
                    2017-09-14 10:35:53,861 Stage-1 map = 54%,  reduce = 0%, Cumulative CPU 32585.75 sec
                    2017-09-14 10:35:45,558 Stage-1 map = 45%,  reduce = 0%, Cumulative CPU 27847.27 sec
                    2017-09-14 10:35:46,598 Stage-1 map = 47%,  reduce = 0%, Cumulative CPU 28994.16 sec
                    2017-09-14 10:35:47,637 Stage-1 map = 48%,  reduce = 0%, Cumulative CPU 29564.66 sec
                    2017-09-14 10:35:48,678 Stage-1 map = 49%,  reduce = 0%, Cumulative CPU 30158.89 sec
                    2017-09-14 10:35:49,716 Stage-1 map = 50%,  reduce = 0%, Cumulative CPU 30804.49 sec
                    2017-09-14 10:35:50,752 Stage-1 map = 51%,  reduce = 0%, Cumulative CPU 31266.67 sec
                    2017-09-14 10:35:51,788 Stage-1 map = 52%,  reduce = 0%, Cumulative CPU 31812.24 sec
                    2017-09-14 10:35:52,824 Stage-1 map = 53%,  reduce = 0%, Cumulative CPU 32233.32 sec
                    2017-09-14 10:35:53,861 Stage-1 map = 54%,  reduce = 0%, Cumulative CPU 32585.75 sec
                </div>
            </div>
        )
    }
}