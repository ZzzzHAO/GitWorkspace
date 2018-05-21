import * as echarts from '../../ec-canvas/echarts';
import {
  getMonthList,
  getServerTime,
  getUserData
} from '../../utils/util';
import {
  wilddog
} from '../../wilddog'

const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.on('click', function (params) {
    console.log(params);
  });
  var option = {
    title: {
      text: '本月消费：',
      x: 'left',
      top: '2%',
      textStyle: {
        fontSize: '15'
      }
    },
    backgroundColor: "#f6f6f6",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    legend: {
      orient: 'horizontal',
      bottom: '2%',
      x: 'center',
      data: ['北京', '武汉', '杭州', '广州', '上海'],
      selectedMode: false
    },
    series: [{
      label: {
        normal: {
          fontSize: 14,
          formatter: '{d}%'
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      }],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () {},
      fail: function () {}
    }
  },
  data: {
    ec: {
      onInit: initChart
    },
    monthList: getMonthList(new Date('6/16/2017'), new Date()),
    costList: []
  },

  onReady() {},
  onLoad: function (option) {
    let monthList = [];
    getUserData((userData) => {
      const costList = userData.costList || [];
      const startTime = userData.startTime;
      this.setData({
        costList: costList,
      })
      getServerTime((serverTime) => {
        monthList = getMonthList(new Date('6/6/2017'), new Date(serverTime)).reverse();
        monthList[0].active = true; //默认当前月份
        console.log(monthList);
        this.setData({
          monthList: monthList
        })
      });
    })
  },
  pick: function (e) {
    const id = e.target.dataset.index;
    const monthList = this.data.monthList;
    for (let i = 0; i < monthList.length; i++) {
      monthList[i].active = false;
    }
    monthList[id].active = true;
    this.setData({
      monthList: monthList
    })
  },
  getCostList: function (year, month) {
    const costList = [];
    for (let i = 0; i < this.data.costList; i++) {
      if (this.data.costList[i].year == year && this.data.costList[i].month == month) {
        costList.push(this.data.costList[i])
      }
    }
    return costList;
  },
  getCategoryList: function (costList) {
    const categoryList = [];
    for (let i = 0; i < costList.length; i++) {
      
    }
  },
  showDetail: function (e) {
    wx.navigateTo({
      url: '../detail/index'
    })
  }
});