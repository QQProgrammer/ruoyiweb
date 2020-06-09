<template>
  <!-- 资金记录（完成）-->
  <div class="capital">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="queryParams"
                 :model="queryParams"
                 :inline="true"
                 label-width="75px">
          <el-form-item>
            <el-date-picker size="mini"
                            v-model="time"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.type"
                       placeholder="请选择明细类型"
                       clearable
                       size="mini">
              <el-option label="充值"
                         value="recharge"></el-option>
              <el-option label="提现"
                         value="extract"></el-option>
              <el-option label="线上服务"
                         value="service"></el-option>
              <el-option label="云盘"
                         value="cdisk"></el-option>
              <el-option label="打赏"
                         value="reward"></el-option>
              <el-option label="分享"
                         value="share"></el-option>
              <el-option label="购买文章"
                         value="news"></el-option>
              <el-option label="礼物"
                         value="gift"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.pm"
                       placeholder="请选择类型"
                       clearable
                       size="mini">
              <el-option label="支出"
                         value="0"></el-option>
              <el-option label="收入"
                         value="1"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="realName">
            <el-input v-model="queryParams.realName"
                      size="mini"
                      clearable
                      placeholder="用户名称"
                      style="width:100%"></el-input>
          </el-form-item> -->
          <el-form-item prop="account">
            <el-input v-model="queryParams.account"
                      size="mini"
                      clearable
                      placeholder="用户账户"
                      style="width:100%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="mini"
                       @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh"
                       @click="resetParams"
                       size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 列表表格 -->
    <div>
      <el-table v-loading="loading"
                :data="tableData"
                style="width: 100%">
        <el-table-column type="index"
                         width="50"
                         label="序号"
                         align="center" />
        <el-table-column prop="id"
                         label="会员ID"
                         align="center" />
        <el-table-column prop="realName"
                         label="用户姓名"
                         align="center" />
        <el-table-column prop="account"
                         label="用户账号"
                         align="center" />
        <el-table-column prop="number"
                         label="变动金额（元）"
                         align="center" />
        <el-table-column prop="balance"
                         label="变动后金额（元）"
                         align="center" />
        <el-table-column prop="title"
                         label="账单标题"
                         align="center" />
        <el-table-column prop="linkId"
                         label="关联信息"
                         align="center" />
        <el-table-column prop="category"
                         label="明细种类"
                         align="center">
          <template slot-scope="scope">
            <span>{{scope.row.category | capitalizecategory }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type"
                         label="明细类型"
                         align="center">
          <template slot-scope="scope">
            <span>{{scope.row.type | capitalizetype }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pm"
                         label="类型"
                         align="center">
          <template slot-scope="scope">
            <span>{{scope.row.pm | capitalizepm }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="addTime"
                         label="创建时间"
                         align="center" />
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getMoneyLists" />
    </div>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import { getMoneyList } from "@/api/finance/money";

export default {
  components: {
    CountTo
  },
  data () {
    return {
      tableData: [{}, {}],
      loading: false,
      time: '',
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pm: undefined,
        account: undefined,
        realName: undefined,
        beginDate: undefined,
        endDate: undefined
      },
      form: {}
    };
  },
  filters: {
    capitalizepm: function (value) {
      if (value == 0) {
        return "支出";
      } else if (value == 1) {
        return "收入";
      }
    },
    capitalizetype: function (value) {
      if (value === 'recharge') {
        return "充值";
      } else if (value === 'extract') {
        return "提现";
      } else if (value === 'service') {
        return "线上服务";
      } else if (value === 'cdisk') {
        return "云盘";
      } else if (value === 'reward') {
        return "打赏";
      } else if (value === 'share') {
        return "分享";
      } else if (value === 'news') {
        return "购买文章";
      } else if (value === 'gift') {
        return "礼物";
      }
    },
    capitalizecategory: function (value) {
      if (value == 'money') {
        return "现金";
      } else if (value == 'integral') {
        return "积分";
      }
    },
  },
  created () {
    // 获取列表
    this.getMoneyLists()
  },
  methods: {
    // 获取列表
    getMoneyLists () {
      this.loading = true
      if (this.time !== '') {
        this.queryParams.beginDate = this.time[0] || ''
        this.queryParams.endDate = this.time[1] || ''
      }
      getMoneyList(this.queryParams).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // 重置
    resetParams () {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        account: undefined,
        pm: undefined,
        beginDate: undefined,
        endDate: undefined
      }
      this.time = ''
      this.getMoneyLists();
    },

    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getMoneyLists();
    }
  }
};
</script>

<style lang="scss">
.capital {
  .box-card {
    margin-bottom: 20px;
  }
  padding: 15px;
  label {
    font-weight: inherit;
  }
  .el-form-item {
    margin-bottom: 5px;
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
.capital {
  padding: 30px;
  .pagination-container {
    background: none !important;
  }
}
</style>
