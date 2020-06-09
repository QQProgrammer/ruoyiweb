<template>
  <div class="dashboard-editor-container">
    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->
    <el-row :gutter="20" class="panel-group">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单</span>
         </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="parseInt(statisticsobj.readyToService)||0" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">待接诊</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单</span>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="parseInt(statisticsobj.yesTodyCount)||0" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">昨日支付订单数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>交易</span>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="parseInt(statisticsobj.yesTodyMoney)||0" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">昨日交易额</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>待提现</span>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="parseInt(statisticsobj.extractTalMoney)||0" :duration="2600" class="card-panel-num" />
            <div class="card-panel-text">待提现</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单</span>
      </div>
      <div>
        <line-chart-one :chart-data="lineChartDataOne" />
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户</span>
     </div>
      <div>
        <line-chart-two :chart-data="lineChartDataTwo" />
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>新增注册医生</span>
      </div>
      <div>
        <line-chart-three :chart-data="lineChartDataThree" />
      </div>
    </el-card>
  </div>
</template>

<script>
import LineChartOne from "./dashboard/LineChartOne";
import LineChartTwo from "./dashboard/LineChartTwo";
import LineChartThree from "./dashboard/LineChartThree";
import CountTo from "vue-count-to";
import { getOrderDetailInfo } from "@/api/index";


export default {
  name: "Index",
  components: {
    LineChartOne,
    LineChartTwo,
    LineChartThree,
    CountTo

    // RaddarChart,
    // PieChart,
    // BarChart
  },
  data() {
    return {
      statisticsobj:{},
      lineChartDataOne: {
        xdatatime:[],
        expectedData:[],
        actualData:[]
      },
      lineChartDataTwo: {
        xdatatime:[],
        expectedData:[]
      },
      lineChartDataThree: {
        xdatatime:[],
        expectedData:[]
      }
    };
  },
  created(){
    this.getOrderDetailInfo()
  },
  methods: {
    getOrderDetailInfo(){
      getOrderDetailInfo().then(response => {
        this.statisticsobj = response.data
      // 近30天每天的订单金额和订单数量
        response.data.totalNumLast.forEach(element => {
          this.lineChartDataOne.xdatatime.push(element.addTime)
          this.lineChartDataOne.expectedData.push(element.totalNum)
          this.lineChartDataOne.actualData.push(element.totalMoney)
        });
        // 用户
        response.data.totalUserNum.forEach(element => {
          this.lineChartDataTwo.xdatatime.push(element.addTime)
          this.lineChartDataTwo.expectedData.push(element.totalUserNum)
        });
        // 新增注册医生
        response.data.totalDoctorNum.forEach(element => {
          this.lineChartDataThree.xdatatime.push(element.addTime)
          this.lineChartDataThree.expectedData.push(element.totalUserNum)
        });
          console.log(this.lineChartDataOne)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .box-card {
    margin-top: 20px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
