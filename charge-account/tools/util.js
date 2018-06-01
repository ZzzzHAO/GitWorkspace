import categoryList from './dictionary'
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//获取月份列表
const getMonthList = (beginDate, endDate) => {
  const monthList = [];
  const endY = endDate.getFullYear();
  const endM = endDate.getMonth() + 1;
  const endD = endDate.getDate();
  const beginY = beginDate.getFullYear();
  const beginM = beginDate.getMonth() + 1;
  const beginD = beginDate.getDate();
  for (let i = beginY; i <= endY; i++) {
    //开始年份和当年年份相同 直接从开始月份到当前月份
    if (beginY === endY) {
      for (let m = beginM; m <= endM; m++) {
        let monthObj = {
          year: i,
          month: m
        }
        monthList.push(monthObj);
      }
    } else {
      //循环变量年份和开始年份相同
      if (i === beginY) {
        for (let j = beginM; j <= 12; j++) {
          let monthObj = {
            year: i,
            month: j
          }
          monthList.push(monthObj);
        }
      }
      //循环变量年份即和开始年份不相同 又和当前年份不相同
      if (i !== beginY && i !== endY) {
        for (let k = 1; k <= 12; k++) {
          let monthObj = {
            year: i,
            month: k
          }
          monthList.push(monthObj);
        }
      }
      //循环变量年份和当前年份年份不相同
      if (i === endY) {
        for (let l = 1; l <= endM; l++) {
          let monthObj = {
            year: i,
            month: l
          }
          monthList.push(monthObj);
        }
      }
    }
  }
  return monthList;
}
//获取当前用户
const getUser = () => {
  const app = getApp();
  const user = app.globalData.userInfo;
  return user;
}
//通过id获取类别name
const getCategoryName = (id) => {
  let name = "";
  let length = categoryList.length;
  for (let i = 0; i < length; i++) {
    if (id === categoryList[i].id) {
      name = categoryList[i].name;
      break;
    }
  }
  return name;
}
//通过name获取类别color
const getCategoryColor = (name) => {
  let color = "";
  let length = categoryList.length;
  for (let i = 0; i < length; i++) {
    if (name === categoryList[i].name) {
      color = categoryList[i].color;
      break;
    }
  }
  return color;
}
//修复js浮点数运算精度问题
const calculate = (symbol, arg1, arg2) => {
  calculate["add"] = (arg1, arg2) => {
    let r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m;
  }

  calculate["reduce"] = (arg1, arg2) => {
    let r1, r2, m, n;
    try {
      r1 = arg1.toString().split(".")[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split(".")[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return (arg1 * m - arg2 * m) / m;
  }

  calculate["mul"] = (arg1, arg2) => {
    let m = 0,
      s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) {}
    try {
      m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  }

  calculate["division"] = (arg1, arg2) => {
    let t1 = 0,
      t2 = 0,
      r1, r2;
    try {
      t1 = arg1.toString().split(".")[1].length
    } catch (e) {}
    try {
      t2 = arg2.toString().split(".")[1].length
    } catch (e) {}
    r1 = Number(arg1.toString().replace(".", ""))
    r2 = Number(arg2.toString().replace(".", ""))
    return (r1 / r2) * Math.pow(10, t2 - t1);
  }
  if (symbol === "+") {
    return calculate["add"](arg1, arg2);
  } else if (symbol === "-") {
    return calculate["reduce"](arg1, arg2);
  } else if (symbol === "*") {
    return calculate["mul"](arg1, arg2);
  } else if (symbol === "/") {
    return calculate["division"](arg1, arg2);
  } else {
    return null;
  }

}
const formatMoney = (value, type) => {
  if (/[^0-9\.]/.test(value))
    return "0";
  if (value == null || value == "")
    return "0";
  value = value.toString().replace(/^(\d*)$/, "$1.");
  value = (value + "00").replace(/(\d*\.\d\d)\d*/, "$1");
  value = value.replace(".", ",");
  var re = /(\d)(\d{3},)/;
  while (re.test(value))
    value = value.replace(re, "$1,$2");
  value = value.replace(/,(\d\d)$/, ".$1");
  if (type == 0) { // 不带小数位(默认是有小数位)
    var a = value.split(".");
    if (a[1] == "00") {
      value = a[0];
    }
  }
  return value;
}
export {
  formatTime,
  getMonthList,
  getUser,
  getCategoryName,
  getCategoryColor,
  calculate,
  formatMoney
}