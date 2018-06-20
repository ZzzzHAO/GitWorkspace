import * as echarts from '../../components/ec-canvas/echarts';
import {
  getMonthList,
  getCategoryName,
  getCategoryColor,
  calculate,
  formatMoney
} from '../../tools/util';
import {
  getServerTime,
  getStartTime,
  getCostList
} from '../../api/index';

const app = getApp();
let _seriesDataCatch = []; //缓存变量 用于填充列表data
let _costList = []; //月消费列表
let isFirstTime = false; //首次进入标志位
let currentYear = new Date().getFullYear(); //当前选中年份
let currentMonth = new Date().getMonth() + 1; //当前选中月份

Page({
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    monthList: getMonthList(new Date('1/1/2018'), new Date()), //月份列表 默认从2018/1/1至当前客户端月份
    hasData: false, //选中月是否有记账数据
    seriesData: [], //列表渲染数据
    costSum: 0 //当月消费总额
  },
  onLoad: function (option) {
    isFirstTime = true;
    this.setDefaultMonth();
    getServerTime((data) => {
      //服务器当前时间
      const now = new Date(data);
      this.getRecords(now.getFullYear(), now.getMonth() + 1); //默认为服务器当前月份数据
      currentYear = now.getFullYear();
      currentMonth = now.getMonth() + 1;
    });
  },
  onShow: function () {
    //首次进入页面 onLoad会拉默认数据 所以onShow不拉
    if (!isFirstTime) {
      this.getRecords(currentYear, currentMonth);
    }
    isFirstTime = false; //还原标志位
  },
  //转发信息
  onShareAppMessage: function (res) {
    return {
      title: '快来记账吧，养成记账好习惯！',
      path: '/pages/amount/index',
      imageUrl: '../../image/bee.jpg'
    }
  },
  //第一次进入 设置月份列表并默认选中当前月份
  setDefaultMonth: function () {
    let monthList = [];
    getServerTime((data) => {
      //服务器当前时间
      const now = new Date(data);
      //获取用户开始有记录的时间
      getStartTime((data) => {
        //用户开始记账时间
        const st = new Date('1/1/2018');
        //获取月份列表
        monthList = getMonthList(st, now).reverse();
        //默认当前月份
        monthList[0].active = true;
        this.setData({
          monthList: monthList
        })
      })
    });
  },
  //选择某个月份
  pick: function (e) {
    //月份列表选中样式控制
    const id = e.currentTarget.dataset.index;
    const monthList = this.data.monthList;
    const selectedMonth = monthList[id];
    for (let i = 0; i < monthList.length; i++) {
      monthList[i].active = false;
    }
    selectedMonth.active = true;
    this.setData({
      monthList: monthList
    })
    //如果点击的是相同的 则不去拉数据
    if (selectedMonth.year !== currentYear || selectedMonth.month !== currentMonth) {
      currentYear = selectedMonth.year;
      currentMonth = selectedMonth.month;
      this.getRecords(currentYear, currentMonth);
    }
  },
  //获取月份记录 并计算月消费总额
  getRecords: function (year, month) {
    getCostList({
      year: year,
      month: month
    }, (data) => {
      //用户记账记录
      _costList = data || [];
      //当月花费总额
      this.setCostSum(_costList);
      //当前月份展示控制
      this.pieComponentCtrl(_costList);
      //把选中月份花费列表缓存到全局
      app.globalData.selectedMonthData = _costList;
    })
  },
  //计算当月花费总额
  setCostSum: function (costList) {
    let sum = 0;
    for (let i = 0; i < _costList.length; i++) {
      sum = calculate('+', sum, _costList[i].amount);
    }
    this.setData({
      costSum: formatMoney(sum)
    })
    console.log(this.data.costSum);
  },
  //饼状图展示控制
  pieComponentCtrl: function (costList) {
    if (costList.length == 0) {
      this.setData({
        hasData: false
      })
    } else {
      this.setData({
        hasData: true,
      })
      //初始化pie图
      this.pieComponent = this.selectComponent('#mychart-dom-pie');
      this.initChart(costList);
      _seriesDataCatch = []; //清空数据
    }
  },
  //初始化
  initChart: function (costList) {
    //画布初始化
    this.pieComponent.init((canvas, width, height) => {
      // 初始化图表
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      pieChart.setOption(this.getPieOption(costList));
      //设置seriesData 用于列表初始化
      for (let i = 0; i < _seriesDataCatch.length; i++) {
        let name = _seriesDataCatch[i].name;
        let color = getCategoryColor(name);
        _seriesDataCatch[i].color = color;
      }
      this.setData({
        seriesData: _seriesDataCatch
      })
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return pieChart;
    });
  },
  //获取options
  getPieOption: function (costList) {
    const EchartsData = this.getEchartsData(costList);
    return {
      backgroundColor: "#fff",
      color: EchartsData.colorData,
      series: [{
        label: {
          normal: {
            show: true,
            position: 'outside',
            //获取echarts 数据 用于列表渲染
            formatter: function (params) {
              const item = {};
              item.name = params.data.name;
              item.value = params.data.value;
              item.percent = params.percent;
              //不知道为什么执行两次 所以只push一次 
              if (_seriesDataCatch.length < EchartsData.legendData.length) {
                _seriesDataCatch.push(item);
              }
              return item.name;
              // return item.name + ':' + item.percent + '%'
            }
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
  },
  //封装echarts options所需数据
  getEchartsData: function (costList) {
    const legendData = this.getLegendData(costList); //获取类别列表
    const seriesData = this.getSeriesData(costList); //获取饼图数据列表
    const colorData = this.getColorData(legendData); //获取饼图对应颜色列表
    return {
      legendData: legendData,
      seriesData: seriesData,
      colorData: colorData,
    }
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
  showDetail: function (e) {
    wx.navigateTo({
      url: '../detail/index?year=' + currentYear + '&month=' + currentMonth
    })
  }
});