
import * as Types from '../constants';

let initState = {};
///改变sidebar的选中状态
export function changeHeader(state = initState,action) {
    switch (action.type){
        case Types.CHANGE_HEADER:
            return action.data;
        default:
            return state;
    }
}
