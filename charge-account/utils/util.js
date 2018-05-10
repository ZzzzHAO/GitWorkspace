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

module.exports = {
  formatTime: formatTime,
  getMonthList: getMonthList
}