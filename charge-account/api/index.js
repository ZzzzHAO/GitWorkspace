import {
    wilddog
} from '../lib/wilddog'
import {
    getUser
} from '../tools/util'


//获取服务器时间戳
const getServerTime = (callback = function () {}) => {
    let serverTsRef = wilddog.sync().ref("/.info/serverTimeOffset");
    serverTsRef.once('value', function (snapshot) {
        // 获取时钟偏差
        let offset = snapshot.val();
        // 可进一步计算出云端时间
        let serverTime = (new Date).getTime() + offset;
        callback(serverTime)
    }, function (error) {
        //获取系统时间报错
        wx.showModal({
            content: '系统错误，请重试（001）',
            showCancel: false
        })
    })
}
//野狗登录
const wilddogLogin = (callback = function () {}) => {
    const app = getApp(); //app实例
    wx.showLoading({
        title: '请稍候...',
        mask: true
    });
    wilddog.auth().signInWeapp(function (err, user) {
        if (user) {
            wx.hideLoading();
            //用户数据存入全局变量
            app.globalData.userInfo = user;
            //登录后获取用户数据
            getUserData();
            //执行回调
            callback(user);
        } else {
            wx.hideLoading();
            wx.showModal({
                content: '网络不给力，请重试(501)',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        wilddogLogin();
                    }
                }
            })
        }
    })
}
//获取用户所有数据
const getUserData = (successCallback = function () {}, failCallback = function () {}) => {
    const user = getUser();
    const ref = wilddog.sync().ref('users/' + user.uid);
    ref.once('value', (snapshot) => {
        const data = snapshot.val() || {};
        successCallback(data);
    }, function (error) {
        wx.showModal({
            content: '系统错误，请重试（002）',
            showCancel: false
        })
        failCallback(error);
    })
}
//获取记账记录
const getCostList = (params, successCallback = function () {}, failCallback = function () {}) => {
    const user = getUser(); //获取当前野狗用户
    const year = params.year,
        month = params.month;
    let refUrl = '';
    if (!year) {
        console.error("参数错误，请检查！（001）");
        return;
    }
    if (month) {
        refUrl = 'users/' + user.uid + '/' + year + '/' + month + '/costList';
    } else {
        refUrl = 'users/' + user.uid + '/' + year;
    }
    const ref = wilddog.sync().ref(refUrl);
    ref.once('value', (snapshot) => {
        let data = snapshot.val();
        if (month) {
            successCallback(data);
        } else {

        }
    }, function (error) {
        wx.showModal({
            content: '系统错误，请重试（003）',
            showCancel: false
        })
        failCallback(error);
    })
}
//设置记账记录
const addCostRecord = (params, successCallback = function () {}, failCallback = function () {}) => {
    const user = getUser();
    getServerTime((serverTime) => {
        const serverDate = new Date(serverTime);
        const year = serverDate.getFullYear(),
            month = serverDate.getMonth() + 1,
            date = serverDate.getDate();
        //如果之前没有记账记录 则记录开始时间
        getStartTime((startTime) => {
            if (startTime === null) {
                let ref = wilddog.sync().ref('users/' + user.uid + '/startTime');
                ref.set(serverTime, function (error) {
                    if (error !== null) {
                        wx.showModal({
                            content: '系统错误，请重试（004）',
                            showCancel: false
                        })
                        return;
                    }
                })
            }
        })
        getCostList({
            year: year,
            month: month
        }, (costList) => {
            let value = costList || [];
            params.timeStamp = serverTime; //存入时间戳 暂定为每一项的唯一标识
            params.year = year; //存入年份
            params.month = month; //存入月份
            params.date = date; //存入月份
            value.push(params);
            let ref = wilddog.sync().ref('users/' + user.uid + '/' + year + '/' + month + '/costList');
            ref.set(value, function (error) {
                if (error === null) {
                    successCallback();
                } else {
                    wx.showModal({
                        content: '系统错误，请重试（005）',
                        showCancel: false
                    })
                    failCallback(error);
                }
            })
        })

    })
}
//删除记录
const removeRecord = (params, successCallback = function () {}, failCallback = function () {}) => {
    const user = getUser();
    const timeStamp = params.timeStamp,
        year = params.year,
        month = params.month;
    if (!timeStamp || !year || !month) {
        console.error("参数错误，请检查！（002）");
        return;
    }
    getCostList({
        year: year,
        month: month
    }, (costList) => {
        let m = 0; //下标位置
        let value = costList || [];
        for (let i = 0; i < value.length; i++) {
            if (value[i].timeStamp === timeStamp) {
                m = i;
                break;
            }
        }
        value.splice(m, 1);
        let ref = wilddog.sync().ref('users/' + user.uid + '/' + year + '/' + month + '/costList');
        ref.set(value, function (error) {
            if (error === null) {
                successCallback();
            } else {
                wx.showModal({
                    content: '系统错误，请重试（007）',
                    showCancel: false
                })
                failCallback(error);
            }
        })
    })


}
//获取开始时间
const getStartTime = (successCallback = function () {}, failCallback = function () {}) => {
    const user = getUser();
    const ref = wilddog.sync().ref('users/' + user.uid + '/startTime');
    ref.once('value', (snapshot) => {
        let data = snapshot.val();
        successCallback(data);
    }, function (error) {
        wx.showModal({
            content: '系统错误，请重试（006）',
            showCancel: false
        })
        failCallback(error);
    })
}
export {
    getServerTime,
    wilddogLogin,
    getUserData,
    getCostList,
    addCostRecord,
    getStartTime,
    removeRecord
}