<template>
  <div class="part_panel">
    <el-card class="box-card">
      <div slot="header" class="card-title">
        <span>数据概况</span>
      </div>
      <div class="data-list">
        <el-row :gutter="10">
          <el-col :span="4" v-for="item in allDataList">
            <div class="data-item">
              <div class="title">{{ item.statisticsName }}</div>
              <div class="data-panel">
                <div class="data">{{ item.count }}</div>
                <div class="pre">
                  昨日新增:<span class="new">{{ item.preCount }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
  <div class="part_panel">
    <el-card>
      <div slot="header" class="card-title">
        <span>第一周数据</span>
      </div>
      <div class="data-list">
        <el-row :gutter="10">
          <el-col :span="12">
            <div ref="myChartsAppWeekDataRef" class="chart"></div>
          </el-col>
          <el-col :span="12">
            <div ref="myChartsContentWeekDataRef" class="chart"></div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, reactive, getCurrentInstance, nextTick, onMounted, shallowRef } from "vue"
const { proxy } = getCurrentInstance();
const api = {
  getAllData: '/api/index/getAllData',
  getAppWeekData: '/api/index/getAppWeekData',
  getContentWeekData: '/api/index/getContentWeekData'
}
const allDataList = ref([])
const loadAllData = async () => {
  let result = await proxy.Request({
    url: api.getAllData
  })
  if (!result) {
    return;
  }
  allDataList.value = result.data
}

const getOption = (title, xAxisData = [], seriesData = []) => {
  return {
    title: {
      x: 100,
      text: title,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        textStyle: {
          color: "red"
        }
      }
    },
    legend: {
      y: 15,
      x: 400,
    },
    grid: {
      left: 50,
      right: 0,
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: "#90979c"
        }
      },
      data: xAxisData,
      axisLabel: {
        interval: 0,
        rotate: 45,
      }
    },
    yAxis: {
      type: "value",
      min: 0,
    },
    series: seriesData,
  };
};
const myChartsAppWeekDataRef = ref()
const myChartsAppWeekData = ref()
const initAppWeekData = () => {
  nextTick(() => {
    myChartsAppWeekData.value = echarts.init(myChartsAppWeekDataRef.value)
    loadAppWeekData()
  })
}

const loadAppWeekData = async () => {
  let result = await proxy.Request({
    url: api.getAppWeekData
  })
  console.log(result);

  if (!result) {
    return;
  }
  const data = result.data
  const xAxisData = data.dateList
  const seriesData = []
  const colors = ['#189CFC', '#67C23A']
  data.itemDataList.forEach((item, index) => {
    seriesData.push({
      name: item.statisticsName,
      type: 'bar',
      smooth: true,
      data: item.listData,
      itemStyle: {
        color: colors[index]
      },
    })
  })
  myChartsAppWeekData.value.setOption(
    getOption('App下载注册用户统计', xAxisData, seriesData)
  )
}

const myChartsContentWeekDataRef = ref()
const myChartsContentWeekData = ref()
const initContentWeekData = () => {
  nextTick(() => {
    myChartsContentWeekData.value = echarts.init(myChartsContentWeekDataRef.value)
    loadContentWeekData()
  })
}

const loadContentWeekData = async () => {
  let result = await proxy.Request({
    url: api.getContentWeekData
  })
  console.log(result);

  if (!result) {
    return;
  }
  const data = result.data
  const xAxisData = data.dateList
  const seriesData = []
  const colors = ['#189CFC', '#67C23A', '#33166e', '#fb7993', '#a4c4fc']
  data.itemDataList.forEach((item, index) => {
    seriesData.push({
      name: item.statisticsName,
      type: 'bar',
      smooth: true,
      data: item.listData,
      itemStyle: {
        color: colors[index]
      }
    })
  })
  myChartsContentWeekData.value.setOption(
    getOption('内容统计', xAxisData, seriesData)
  )
}

onMounted(() => {
  loadAllData()
  initAppWeekData()
  initContentWeekData()
})
</script>

<style lang="scss" scoped>
.card-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}

.part_panel {
  margin-top: 10px;

  &:first-child {

    margin-top: 0px;
  }
}

.data-list {
  .data-item {
    background: #f4f9fd;
    color: #9a9fa6;
    // padding: 5px;
    border-radius: 5px;
    width: 100%;

    .title {
      margin-left: 35px;
    }

    .data-panel {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .data {
      font-size: 20px;
      color: #000012;
      font-weight: bold;
      margin-top: 10px;
      // margin-right: 130px;
    }

    .pre {
      margin-top: 5px;

      .new {
        color: #ff6873;
      }
    }
  }
}

.chart {
  height: calc(100vh - 400px);
}
</style>
