import * as echarts from '../../ec-canvas/echarts';
import {
  getMonthList,
  getServerTime,
  getUserData,
  getCategoryName,
  getCategoryColor,
  calculate
} from '../../utils/util';
import {
  wilddog
} from '../../wilddog'

const app = getApp();
let seriesDataCatch = []; //缓存变量 用于填充列表data

Page({
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    monthList: getMonthList(new Date('1/1/2018'), new Date()), //月份列表 默认从2018/1/1至当前客户端月份
    costList: [], //用户所有记账数据
    hasData: false, //选中月是否有记账数据
    seriesData: [] //列表渲染数据
  },
  onLoad: function (option) {
    let monthList = [];
    getUserData((userData) => {
      //用户所有记账记录
      const costList = userData.costList || [];
      //用户开始记账时间戳
      const startTime = userData.startTime;
      this.setData({
        costList: costList,
      })
      getServerTime((serverTime) => {
        //用户开始记账时间
        const st = new Date('1/1/2018');
        //服务器当前时间
        const now = new Date(serverTime);
        //获取月份列表
        monthList = getMonthList(st, now).reverse();
        //默认当前月份
        monthList[0].active = true;
        this.setData({
          monthList: monthList
        })
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        //当前月份饼状图展示逻辑
        this.pieComponentCtrl(year, month);
      });
    })
  },
  //选择某个月份
  pick: function (e) {
    //月份列表选中样式控制
    const id = e.target.dataset.index;
    const monthList = this.data.monthList;
    for (let i = 0; i < monthList.length; i++) {
      monthList[i].active = false;
    }
    monthList[id].active = true;
    this.setData({
      monthList: monthList
    })
    //选中月份饼状图展示逻辑
    this.pieComponentCtrl(monthList[id].year, monthList[id].month);
  },
  //获取某个月份的记账记录列表
  getCostList: function (year, month) {
    const costList = [];
    for (let i = 0; i < this.data.costList.length; i++) {
      if (this.data.costList[i].year == year && this.data.costList[i].month == month) {
        costList.push(this.data.costList[i])
      }
    }
    return costList;
  },
  //获取消费类别列表
  getLegendData: function (costList) {
    const legendData = [];
    for (let i = 0; i < costList.length; i++) {
      let category = costList[i].category;
      let name = getCategoryName(category);
      if (legendData.indexOf(name) == -1) {
        legendData.push(name);
      }
    }
    return legendData;
  },
  //初始化饼图系列数据列表
  initSeriesData: function (legendData) {
    const seriesData = [];
    for (let i = 0; i < legendData.length; i++) {
      let legendItem = {};
      legendItem.name = legendData[i]
      legendItem.value = 0;
      seriesData.push(legendItem);
    }
    return seriesData;
  },
  //获取饼图系列数据列表
  getSeriesData: function (costList) {
    const legendData = this.getLegendData(costList);
    const seriesData = this.initSeriesData(legendData);
    for (let i = 0; i < seriesData.length; i++) {
      for (let j = 0; j < costList.length; j++) {
        const name = getCategoryName(costList[j].category)
        if (seriesData[i].name === name) {
          seriesData[i].value = calculate('+', seriesData[i].value, costList[j].amount);
        }
      }
    }
    return seriesData;
  },
  //获取类别对应颜色列表
  getColorData: function (legendData) {
    const colorData = [];
    for (let i = 0; i < legendData.length; i++) {
      let color = '';
      color = getCategoryColor(legendData[i]);
      colorData.push(color);
    }
    return colorData;
  },
  //封装echarts options所需数据
  getEchartsData: function (year, month) {
    const costList = this.getCostList(year, month); //获取当前月份花费列表
    const legendData = this.getLegendData(costList); //获取类别列表
    const seriesData = this.getSeriesData(costList); //获取饼图数据列表
    const colorData = this.getColorData(legendData); //获取饼图对应颜色列表
    return {
      legendData: legendData,
      seriesData: seriesData,
      colorData: colorData,
    }
  },
  showDetail: function (e) {
    wx.navigateTo({
      url: '../detail/index'
    })
  },
  //画布初始化
  initChart: function (year, month) {
    this.pieComponent.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      pieChart.setOption(this.getPieOption(year, month));
      //设置seriesData 用于列表渲染
      this.setData({
        seriesData: seriesDataCatch
      })
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  //获取options
  getPieOption: function (year, month) {
    const EchartsData = this.getEchartsData(year, month);
    return {
      backgroundColor: "#f6f6f6",
      color: EchartsData.colorData,
      legend: {
        orient: 'horizontal',
        bottom: '0',
        x: 'center',
        data: EchartsData.legendData,
        selectedMode: false
      },
      series: [{
        label: {
          normal: {
            //获取echarts 数据 用于列表渲染
            formatter: function (params) {
              const item = {};
              item.name = params.data.name;
              item.value = params.data.value;
              item.percent = params.percent;
              //不知道为什么执行两次 所以只push一次
              if (seriesDataCatch.length < EchartsData.legendData.length) {
                seriesDataCatch.push(item);
              }
              return item.name + ':' + item.percent + '%'
            }
          }
        },
        type: 'pie',
        center: ['50%', '43%'],
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
  },
  //饼状图展示控制
  pieComponentCtrl: function (year, month) {
    const costList = this.getCostList(year, month);
    //把选中月份花费列表缓存到全局
    app.globalData.selectedMonthData = costList;
    const EchartsData = this.getEchartsData(year, month);
    if (EchartsData.legendData.length == 0 || EchartsData.seriesData.length == 0) {
      this.setData({
        hasData: false
      })
    } else {
      this.setData({
        hasData: true,
      })
      //初始化pie图
      this.pieComponent = this.selectComponent('#mychart-dom-pie');
      this.initChart(year, month);
      seriesDataCatch = []; //清空数据
    }
  }
});