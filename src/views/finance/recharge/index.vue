<template>
  <!-- 充值记录
接口bug：获取列表，rechargeType传参为空应返回所有数据
 -->
  <div class="recharge">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form :model="queryParams"
                 label-width="75px">
          <el-form-item label="选择时间:"
                        prop="timeFlag">
            <el-radio-group v-model="queryParams.timeFlag"
                            size="mini">
              <el-radio-button label="0">全部</el-radio-button>
              <el-radio-button label="1">今天</el-radio-button>
              <el-radio-button label="2">本周</el-radio-button>
              <el-radio-button label="3">本月</el-radio-button>
              <el-radio-button label="4">本季度</el-radio-button>
              <el-radio-button label="5">本年度</el-radio-button>
              <el-radio-button label="6">自定义</el-radio-button>
            </el-radio-group>
            <el-date-picker v-if="this.queryParams.timeFlag==='6'"
                            size="mini"
                            v-model="time"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-form :model="queryParams"
                 :inline="true"
                 label-width="75px">
          <el-form-item>
            <el-select v-model="queryParams.rechargeType"
                       placeholder="充值类型"
                       clearable
                       size="mini">
              <el-option v-for="item in rechargeTypeOptions"
                         :key="item.dictValue"
                         :label="item.dictName"
                         :value="item.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="realName">
            <el-input v-model="queryParams.realName"
                      size="mini"
                      clearable
                      placeholder="用户名称"
                      style="width:100%"></el-input>
          </el-form-item>
          <el-form-item prop="account">
            <el-input v-model="queryParams.account"
                      size="mini"
                      clearable
                      placeholder="用户账户"
                      style="width:100%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       icon="el-icon-search"
                       size="mini"
                       @click="handleQuery">搜索
            </el-button>
            <!--            <el-button type="primary" icon="el-icon-plus" size="mini">充值</el-button>-->
            <el-button icon="el-icon-refresh"
                       @click="resetParams"
                       size="mini">重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 统计汇总 -->

    <!-- // {"dictValue":"1","dictName":"微信"},{"dictValue":"2","dictName":"支付宝"},{"dictValue":"3","dictName":"银行卡"} -->
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>充值总金额</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">元
            </el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :decimals='2'
                      :end-val="Number(rechargeTotalInfo.allMoney)||0"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8"
              v-show="rechargeType==1||rechargeType==100">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>微信充值金额</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">元
            </el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :decimals='2'
                      :end-val="Number(rechargeTotalInfo.weixMoney)||0"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8"
              v-show="rechargeType==2||rechargeType==100">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>支付宝充值金额</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">元
            </el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :decimals='2'
                      :end-val="Number(rechargeTotalInfo.zhifuBao)||0"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 列表表格 -->
    <div>
      <el-table v-loading="loading"
                :data="tableData"
                style="width: 100%">
        <el-table-column type="index"
                         width="50"
                         label="序号"
                         align="center" />
        <!--        <el-table-column prop="uid" label="编号" align="center"></el-table-column>-->
        <el-table-column prop="realName"
                         label="用户姓名"
                         align="center" />
        <el-table-column prop="account"
                         label="用户账号"
                         align="center" />
        <el-table-column prop="givePrice"
                         label="赠送金额(￥)"
                         align="center" />
        <el-table-column prop="addTime"
                         label="充值时间"
                         align="center" />
        <el-table-column prop="orderId"
                         label="订单号"
                         align="center" />
        <!--        <el-table-column prop="payTime"-->
        <!--                         label="支付时间"-->
        <!--                         align="center" />-->
        <el-table-column prop="price"
                         label="充值金额(￥)"
                         align="center" />
        <el-table-column prop="rechargeType"
                         label="充值类型"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.rechargeType==='3'?'银行卡':scope.row.rechargeType==='2'?'支付宝':scope.row.rechargeType==='1'?'微信':"其他"}}
          </template>
        </el-table-column>
        <el-table-column prop="address"
                         label="操作"
                         min-width="100"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="clickInfo(scope.row)"
                       size="mini"
                       icon="el-icon-view">详细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getRechargeList" />
    </div>

    <!-- 弹窗 -->
    <el-dialog title="详情"
               :visible.sync="dialogVisibleInfo"
               width="800px"
               :close-on-click-modal="false">
      <el-card shadow="always">
        <el-form ref="form"
                 :model="rechargeDetailData"
                 label-width="80px"
                 :disabled="true">
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item label="用户账号:">
                <span>{{rechargeDetailData.account||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户姓名:">
                <span>{{rechargeDetailData.realName||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单号:">
                <span>{{rechargeDetailData.orderId||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="赠送金额:">
                <span>{{rechargeDetailData.givePrice||0}}元</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="充值时间:">
                <span>{{rechargeDetailData.addTime||'无'}}</span>
              </el-form-item>
            </el-col>
            <!--            <el-col :span="12">-->
            <!--              <el-form-item label="支付时间:">-->
            <!--                <span>{{rechargeDetailData.payTime||'无'}}</span>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col :span="12">
              <el-form-item label="充值金额:">
                <span>{{rechargeDetailData.price||0}}元</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="充值类型:">
                <span>{{rechargeDetailData.rechargeType==='3'?'银行卡':rechargeDetailData.rechargeType==='2'?'支付宝':rechargeDetailData.rechargeType==='1'?'微信':"其他"}}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <span slot="footer"
            class="dialog-footer">
        <el-button plain
                   @click="dialogVisibleInfo = false"
                   size="mini">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { getRechargeList, getRechargeDetail, getRechargeTotalInfo, getRechargeType } from '@/api/finance/rechange'

export default {
  components: {
    CountTo
  },
  data () {
    return {
      tableData: [],
      rechargeTypeOptions: [],
      rechargeDetailData: {},
      dialogVisibleInfo: false,
      rechargeType: 100,
      loading: false,
      time: undefined,
      total: 0,
      rechargeTotalInfo: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        rechargeType: '',
        beginDate: undefined,
        endDate: undefined,
        timeFlag: 0
      },
      form: {}
    }
  },
  created () {
    this.getRechargeList()
    this.getRechargeTotalInfo()
    this.getRechargeType()

  },
  methods: {
    // 获取列表
    getRechargeList () {
      this.loading = true
      if (this.queryParams.timeFlag == 6) {
        this.queryParams.beginDate = this.time[0]
        this.queryParams.endDate = this.time[1]
      }
      getRechargeList(this.queryParams).then(response => {
        this.loading = false
        this.tableData = response.rows
        this.total = response.total
      })
    },

    /** 获取统计 */
    getRechargeType () {
      getRechargeType().then(response => {
        this.rechargeTypeOptions = response.data || []
      });
    },

    /** 获取统计 */
    getRechargeTotalInfo () {
      this.queryParams.pageNum = 1
      getRechargeTotalInfo(this.queryParams).then(response => {
        this.rechargeTotalInfo = response.data || {}
        const status = Number(this.queryParams.rechargeType)
        switch (status) {
          case 1:
            this.rechargeType = 1;
            break;
          case 2:
            this.rechargeType = 2;
            break;
          case 3:
            this.rechargeType = 3;
            break;
          default:
            this.rechargeType = 100;
            break;
        }
      });
    },

    /** 详情按钮操作 */
    clickInfo (row) {
      this.dialogVisibleInfo = true
      getRechargeDetail(row.id).then(response => {
        this.rechargeDetailData = response.data || {}
        this.dialogVisibleInfo = true
      })
    },

    // 重置
    resetParams () {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        beginDate: undefined,
        endDate: undefined,
        timeFlag: 0
      }
      this.time = ''
      this.getRechargeList()
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getRechargeList()
      this.getRechargeTotalInfo()
    }
  }
}
</script>

<style lang="scss">
.recharge {
  .box-card {
    margin-bottom: 20px;
  }

  padding: 15px;

  label {
    font-weight: inherit;
  }

  .el-radio-button {
    margin-right: 0px;
  }

  .el-radio-button .el-radio-button__inner {
    border-radius: 4px;
  }

  .el-radio-button__inner {
    border-left: 1px solid #dcdfe6;
  }

  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    .radio-number {
      background: #0667c0;
    }
  }

  .el-radio-button--mini {
    padding: 7px 8px !important;
  }

  .el-radio-button--mini {
    padding: 7px 8px !important;
  }

  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 8px !important;
  }
}
</style>
<style lang="scss" scoped>
.recharge {
  padding: 30px;
  .pagination-container {
    background: none !important;
  }
}
</style>
