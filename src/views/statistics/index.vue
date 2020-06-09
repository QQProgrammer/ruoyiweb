<template>

  <!-- 数据统计
  **********************************暂不开发
   搜索条件  医院，科室，医生姓名  查询医院和关联科室与之前接口 相同
列表接口 system/profile/list?pageNum=1&pageSize=10&hospId=&dept=&realName=

   返回数据

   {
	"total": 13,
	"rows": [{
		"teamHis": 0, 团队会诊量
		"uid": 1,    医生编码
		"realName": "刘继晖", 医生姓名
		"deptName": "五官科", //所属科室
		"plusHis": 0, 加号问诊数量
		"hospName": "济南市中心医院", 所属医院
		"graphicHis": 0,  图文问诊量
		"phoneHis": 0, 电话接诊量
		"videoHis": 0,  视频接诊量
		"id": 1  主键
	}],
	"code": 200,
	"msg": 0
}

统计接口  /system/profile/getProfileTotal?hospId=&dept=&realName=
teamHis    团队会诊总量
plusHis    加号问诊总接诊量
graphicHis 图文接诊总量
phoneHis  电话接诊总量
videoHis  视频问诊总量
{"msg":"操作成功","code":200,"data":{"teamHis":0,"plusHis":0,"graphicHis":0,"phoneHis":0,"videoHis":0}}




 -->
  <div class="statistics">
    <h1>暂无数据</h1>
    <!-- 筛选 -->
    <!-- <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="queryParams"
                 :model="queryParams"
                 label-width="75px">
          <el-form-item label="选择时间:"
                        prop="timeFlag">
            <el-radio-group v-model="queryParams.timeFlag"
                            size="mini">
              <el-radio-button label="0">全部 </el-radio-button>
              <el-radio-button label="1">今天 </el-radio-button>
              <el-radio-button label="2">本周 </el-radio-button>
              <el-radio-button label="3">本月 </el-radio-button>
              <el-radio-button label="4">本季度 </el-radio-button>
              <el-radio-button label="5">本年度 </el-radio-button>
              <el-radio-button label="6">自定义 </el-radio-button>
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
        <el-form ref="queryParams"
                 :model="queryParams"
                 :inline="true"
                 label-width="75px">
          <el-form-item>
            <el-select v-model="queryParams.region"
                       placeholder="状态"
                       clearable
                       size="mini">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="已完成"
                         value="1"></el-option>
              <el-option label="进行中"
                         value="2"></el-option>
              <el-option label="退单"
                         value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-cascader v-model="queryParams.region1"
                         size="mini"
                         placeholder="试试搜索：指南"
                         :options="options"
                         filterable />
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="queryParams.name"
                      size="mini"
                      clearable
                      placeholder="医生姓名"
                      style="width:100%" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="mini"
                       @click="handleQuery"
                       icon="el-icon-search">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card> -->

    <!-- 统计汇总 -->
    <!-- <el-row :gutter="10">
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>加号数量</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">加</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :end-val="102400"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>问诊数量</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">问</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :end-val="102400"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>会诊数量</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">会</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :end-val="102400"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>智连数量</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">智</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :end-val="102400"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>转诊数量</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">转</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :end-val="102400"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
    </el-row> -->

    <!-- 列表表格 -->
    <!-- <div>
      <el-table v-loading="loading"
                :data="tableData"
                style="width: 100%">
        <el-table-column type="index"
                         width="50"
                         label="序号"
                         align="center" />
        <el-table-column prop="name"
                         label="医院"
                         align="center" />
        <el-table-column prop="name"
                         label="科室"
                         align="center" />
        <el-table-column prop="address"
                         label="医生姓名"
                         align="center" />
        <el-table-column prop="address"
                         label="加号数量"
                         align="center" />
        <el-table-column prop="address"
                         label="问诊数量"
                         align="center" />
        <el-table-column prop="address"
                         label="会诊数量"
                         align="center" />
        <el-table-column prop="address"
                         label="智连数量"
                         align="center" />
        <el-table-column prop="address"
                         label="转诊数量"
                         align="center" />
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getRechargeList" />
    </div> -->
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import { getRechargeList } from "@/api/finance/rechange";

export default {
  components: {
    CountTo
  },
  data () {
    return {
      tableData: [],
      loading: false,
      time: undefined,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        region: "",
        region1: "",
        radio: "1",
        name: "",
        value: ""
      },
      form: {
        name: ""
      },
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    };
  },
  created () {
    //  this.getRechargeList();
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
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getRechargeList();
    }
  }
};
</script>

<style lang="scss">
.statistics {
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
  .el-form-item {
    margin-bottom: 5px;
  }
}
</style>
<style lang="scss" scoped>
.statistics {
  padding: 30px;
}
</style>
