import {
    wilddog
} from '../lib/wilddog'
import {
    getUser
} from '../tools/util'


//获取服务器时间戳
const getServerTime = (successCallback = function () {}, failCallback = function () {}) => {
    const serverTsRef = wilddog.sync().ref("/.info/serverTimeOffset");
    const timestamp = new Date().getTime();
    console.info('--------------请求服务器时间开始' + timestamp + '---------------');
    wx.showLoading({
        mask: true
      });
    serverTsRef.once('value', function (snapshot) {
        wx.hideLoading();
        console.info('--------------请求服务器时间成功' + timestamp + '---------------');
        // 获取时钟偏差
        let offset = snapshot.val();
        // 可进一步计算出云端时间
        let serverTime = (new Date).getTime() + offset;
        successCallback(serverTime)
    }, function (error) {
        wx.hideLoading();
        console.info('--------------请求服务器时间失败' + timestamp + '---------------');
        failCallback();
        //获取系统时间报错
        wx.showModal({
            content: '系统错误，请重试（001）',
            showCancel: false,
            confirmColor:'#56abe4'
        })
    })
}
//野狗登录
const wilddogLogin = (successCallback = function () {}, failCallback = function () {}) => {
    const app = getApp(); //app实例
    const timestamp = new Date().getTime();
    console.info('--------------登录开始' + timestamp + '---------------');
    wx.showLoading({
        mask: true
      });
    wilddog.auth().signInWeapp(function (err, user) {
        wx.hideLoading();
        if (user) {
            console.info('--------------登陆成功' + timestamp + '---------------');
            successCallback(user);
            //用户数据存入全局变量
            app.globalData.userInfo = user;
            //记录用户信息
            setUserInfo(user);
            //登录后获取用户数据
            getUserData();
            //执行回调
        } else {
            console.info('--------------登录失败' + timestamp + '---------------');
            failCallback();
            wx.showModal({
                content: '网络不给力，请重试(501)',
                showCancel: false,
                confirmColor:'#56abe4',
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
    const timestamp = new Date().getTime();
    console.info('--------------获取用户所有数据开始' + timestamp + '---------------');
    wx.showLoading({
        mask: true
      });
    ref.once('value', (snapshot) => {
        wx.hideLoading();
        console.info('--------------获取用户所有数据成功' + timestamp + '---------------');
        const data = snapshot.val() || {};
        successCallback(data);
    }, function (error) {
        wx.hideLoading();
        console.info('--------------获取用户所有数据失败' + timestamp + '---------------');
        failCallback(error);
        wx.showModal({
            content: '系统错误，请重试（002）',
            showCancel: false,
            confirmColor:'#56abe4'
        })
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
    const timestamp = new Date().getTime();
    console.info('--------------获取用户记账记录开始' + timestamp + '---------------');
    wx.showLoading({
        mask: true
      });
    ref.once('value', (snapshot) => {
        wx.hideLoading();
        console.info('--------------获取用户记账记录成功' + timestamp + '---------------');
        const data = snapshot.val();
        if (month) {
            successCallback(data);
        } else {
            //TODO 方便以后以年来统计
        }
    }, function (error) {
        wx.hideLoading();
        console.info('--------------获取用户记账记录失败' + timestamp + '---------------');
        failCallback(error);
        wx.showModal({
            content: '系统错误，请重试（003）',
            showCancel: false,
            confirmColor:'#56abe4'
        })
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
                const ref = wilddog.sync().ref('users/' + user.uid + '/startTime');
                const timestamp = new Date().getTime();
                console.info('--------------记录用户第一笔记账时间开始' + timestamp + '---------------');
                wx.showLoading({
                    mask: true
                  });
                ref.set(serverTime, function (error) {
                    wx.hideLoading();
                    if (error !== null) {
                        console.info('--------------记录用户第一笔记账时间失败' + timestamp + '---------------');
                        wx.showModal({
                            content: '系统错误，请重试（004）',
                            showCancel: false,
                            confirmColor:'#56abe4'
                        })
                        return;
                    }
                    console.info('--------------记录用户第一笔记账时间成功' + timestamp + '---------------');
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
            params.date = date; //存入日期
            value.push(params);
            let ref = wilddog.sync().ref('users/' + user.uid + '/' + year + '/' + month + '/costList');
            const timestamp = new Date().getTime();
            console.info('--------------添加记账记录开始' + timestamp + '---------------');
            wx.showLoading({
                mask: true
              });
            ref.set(value, function (error) {
                wx.hideLoading();
                if (error === null) {
                    console.info('--------------添加记账记录成功' + timestamp + '---------------');
                    successCallback();
                } else {
                    console.info('--------------添加记账记录失败' + timestamp + '---------------');
                    failCallback(error);
                    wx.showModal({
                        content: '系统错误，请重试（005）',
                        showCancel: false,
                        confirmColor:'#56abe4'
                    })
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
        const timestamp = new Date().getTime();
        console.info('--------------删除记账记录开始' + timestamp + '---------------');
        wx.showLoading({
            mask: true
          });
        ref.set(value, function (error) {
            wx.hideLoading();
            if (error === null) {
                console.info('--------------删除记账记录成功' + timestamp + '---------------');
                successCallback();
            } else {
                console.info('--------------删除记账记录失败' + timestamp + '---------------');
                failCallback(error);
                wx.showModal({
                    content: '系统错误，请重试（007）',
                    showCancel: false,
                    confirmColor:'#56abe4'
                })
            }
        })
    })


}
//获取开始时间
const getStartTime = (successCallback = function () {}, failCallback = function () {}) => {
    const user = getUser();
    const ref = wilddog.sync().ref('users/' + user.uid + '/startTime');
    const timestamp = new Date().getTime();
    console.info('--------------获取用户第一笔记账时间开始' + timestamp + '---------------');
    wx.showLoading({
        mask: true
      });
    ref.once('value', (snapshot) => {
        wx.hideLoading();
        console.info('--------------获取用户第一笔记账时间成功' + timestamp + '---------------');
        let data = snapshot.val();
        successCallback(data);
    }, function (error) {
        wx.hideLoading();
        console.info('--------------获取用户第一笔记账时间失败' + timestamp + '---------------');
        failCallback(error);
        wx.showModal({
            content: '系统错误，请重试（006）',
            showCancel: false,
            confirmColor:'#56abe4'
        })
    })
}
//记录用户信息
const setUserInfo = (params, successCallback = function () {}, failCallback = function () {}) => {
    const user = getUser();
    const ref = wilddog.sync().ref('users/' + user.uid + '/userInfo');
    const timestamp = new Date().getTime();
    console.info('--------------记录用户信息开始' + timestamp + '---------------');
    wx.showLoading({
        mask: true
      });
    ref.set(params, function (error) {
        wx.hideLoading();
        if (error === null) {
            console.info('--------------记录用户信息成功' + timestamp + '---------------');
            successCallback();
        } else {
            console.info('--------------记录用户信息失败' + timestamp + '---------------');
            failCallback(error);
            wx.showModal({
                content: '系统错误，请重试（008）',
                showCancel: false,
                confirmColor:'#56abe4'
            })
        }
    })
}
export {
    getServerTime,
    wilddogLogin,
    getUserData,
    getCostList,
    addCostRecord,
    getStartTime,
    removeRecord,
    setUserInfo
}