import * as echarts from '../../ec-canvas/echarts';
import {
  getMonthList,
  getServerTime,
  getUserData,
  getCategoryName
} from '../../utils/util';
import {
  wilddog
} from '../../wilddog'

const app = getApp();

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
      lazyLoad: true // 延迟加载
    },
    monthList: getMonthList(new Date('6/16/2017'), new Date()),
    costList: [],
    legendData: [],
    seriesData: []
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
        const st = new Date(startTime),
          now = new Date(serverTime);

        monthList = getMonthList(st, now).reverse(); //获取月份列表
        monthList[0].active = true; //默认当前月份
        this.setData({
          monthList: monthList
        })
        this.pieComponent = this.selectComponent('#mychart-dom-pie');
        this.initChart();
      });
    })
  },
  //选择某个月份
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
  //获取某个月份的花费列表
  getCostList: function (year, month) {
    const costList = [];
    for (let i = 0; i < this.data.costList.length; i++) {
      if (this.data.costList[i].year == year && this.data.costList[i].month == month) {
        costList.push(this.data.costList[i])
      }
    }
    return costList;
  },
  //获取类别列表
  getLegendData: function (costList) {
    const categoryNameList = [];
    for (let i = 0; i < costList.length; i++) {
      let category = costList[i].category;
      let name = getCategoryName(category);
      if (categoryNameList.indexOf(name) == -1) {
        categoryNameList.push(name);
      }
    }
    return categoryNameList;
  },
  //初始化饼图数据列表
  initSeriesData: function (categoryNameList) {
    const seriesData = [];
    for (let i = 0; i < categoryNameList.length; i++) {
      let legendItem = {};
      legendItem.name = categoryNameList[i]
      legendItem.value = 0;
      seriesData.push(legendItem);
    }
    return seriesData;
  },
  //获取饼图数据列表
  getSeriesData: function (costList) {
    const categoryNameList = this.getLegendData(costList);
    const seriesData = this.initSeriesData(categoryNameList);
    for (let i = 0; i < seriesData.length; i++) {
      for (let j = 0; j < costList.length; j++) {
        const name = getCategoryName(costList[j].category)
        if (seriesData[i].name === name) {
          seriesData[i].value += Number(costList[j].amount);
        }
      }
    }
    return seriesData;
  },
  //设置echarts数据
  setEchartsData: function (year, month) {
    const costList = this.getCostList(year, month); //获取当前月份花费列表
    const legendData = this.getLegendData(costList); //获取类别列表
    const seriesData = this.getSeriesData(costList); //获取饼图数据列表
    console.log(legendData);
    console.log(seriesData);
    return {
      legendData: legendData,
      seriesData: seriesData
    }
  },
  showDetail: function (e) {
    wx.navigateTo({
      url: '../detail/index'
    })
  },
  initChart: function () {
    this.pieComponent.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      pieChart.setOption(this.getPieOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  //获取options
  getPieOption: function () {
    // getServerTime((serverTime) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      const EchartsData = this.setEchartsData(year, month);
      return {
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
          data: EchartsData.legendData,
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
          data: EchartsData.seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 2, 2, 0.3)'
            }
          }
        }]
      }
    // });
  }
});