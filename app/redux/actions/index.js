import * as Types from '../constants';
///改变changeHeader 的选中状态
export function changeHeader(data) {
    return {
        type:Types.CHANGE_HEADER,
        data
    }
}

