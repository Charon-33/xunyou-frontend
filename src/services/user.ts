import myAxios from "../plugins/myAxios";
import { setCurrentUserState } from "../states/user";
import moment from "moment";
export const getCurrentUser = async () => {
    // const currentUser = getCurrentUserState();
    // if (currentUser) {
    //     return currentUser;
    // }
    // 不存在则从远程获取
    const res = await myAxios.get('/user/current');
    if (res.code === 0) {

        if(res.data.gender == 0){
            res.data.gender = '女'
        }else{
            res.data.gender = '男'
        }
        res.data.createTime = moment(res.data.createTime).format('yyyy-MM-DD')

        setCurrentUserState(res.data);
        return res.data;
    }
    return null;
}

