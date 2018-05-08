import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height) {
  const size = height * 0.45;
  const chart = echarts.init(canvas, null, {
    width: width,
    height: size
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '本月消费：',
      x: 'center',
      top: '5%'
    },
    backgroundColor: "#f6f6f6",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    legend: {
      orient: 'horizontal',
      bottom: '2%',
      x: 'center',
      data: ['北京', '武汉', '杭州', '广州', '上海']
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
      },
      ],
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
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initChart
    }
  },

  onReady() {
  }
});
