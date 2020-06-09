<template>
  <!-- 健康日记
无详情接口
-->
  <div class="diary">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="queryParams"
                 :inline="true"
                 label-width="75px">
          <el-form-item prop="realName">
            <el-input v-model="queryParams.realName"
                      size="mini"
                      placeholder="请输入用户姓名"
                      style="width:100%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="time"
                            clearable
                            size="mini"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-search"
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
        <el-table-column prop="realName"
                         label="姓名"
                         align="center" />
        <el-table-column prop="stature"
                         label="身高"
                         align="center" />
        <el-table-column prop="weight"
                         label="体重"
                         align="center" />
        <el-table-column prop="bmi"
                         label="体重指数"
                         align="center" />
        <el-table-column prop="addTime"
                         label="提交时间"
                         align="center" />
        <el-table-column prop="name"
                         label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-view"
                       @click="clickInfo(scope.row)"
                       size="mini">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getAppUserhealthyList" />
    </div>

    <!-- 详情弹窗 -->
    <el-dialog title="健康详情"
               :visible.sync="dialogVisibleInfo"
               width="800px"
               class="dialog-info"
               :close-on-click-modal="false">
      <el-card class="box-card column"
               shadow="always">
        <div slot="header"
             class="clearfix">
          <span>基本信息</span>
        </div>
        <div class="text item">
          <el-form label-width="80px"
                   label-position="left"
                   :model="patDetailData">
            <el-row :gutter="50">
              <el-col :span="12">
                <el-form-item label="真实姓名:">
                  <span>{{patDetailData.realName||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号:">
                  <span>{{patDetailData.cardId||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号:">
                  <span>{{patDetailData.linkPhone||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别:">
                  <span>{{patDetailData.sex=1?'男':patDetailData.sex=2?'女':'未知'||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="职业:">
                  <span>{{patDetailData.occupation||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="民族:">
                  <span>{{patDetailData.race||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身高:">
                  <span>{{patDetailData.stature||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="体重:">
                  <span>{{patDetailData.weight||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="家庭关系:">
                  <span>{{patDetailData.familyRelation||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="婚姻状况:">
                  <span>{{patDetailData.marital||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="添加时间:">
                  <span>{{patDetailData.addTimeString||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地区:">
                  <span>{{patDetailData.cityId||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="体重指数:">
                  <span>{{patDetailData.bmi||'无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <el-card class="box-card column"
               shadow="always">
        <div slot="header"
             class="clearfix">
          <span>患者信息</span>
        </div>
        <div class="text item">
          <el-form label-width="80px"
                   label-position="left"
                   :model="patDetailData">
            <el-row :gutter="50">
              <el-col :span="24">
                <el-form-item label="个人史:">
                  <span>{{patDetailData.personInfo||'无'}}</span>
                  <!-- <el-input v-model="patDetailData.personInfo" type="textarea" :disabled="true" :autosize="{ minRows: 2}" size="mini" placeholder="暂无数据"/> -->
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="婚姻史:">
                  <span>{{patDetailData.maritalInfo||'无'}}</span>
                  <!-- <el-input v-model="patDetailData.maritalInfo" type="textarea" :disabled="true" :autosize="{ minRows: 2}" size="mini" placeholder="暂无数据"/> -->
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="既往史:">
                  <span>{{patDetailData.previousInfo||'无'}}</span>
                  <!-- <el-input v-model="patDetailData.previousInfo" type="textarea" :disabled="true" :autosize="{ minRows: 2}" size="mini" placeholder="暂无数据"/> -->
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="家族史:">
                  <span>{{patDetailData.geneticInfo||'无'}}</span>
                  <!-- <el-input v-model="patDetailData.geneticInfo" type="textarea" :disabled="true" :autosize="{ minRows: 2}" size="mini" placeholder="暂无数据"/> -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <el-card class="box-card column"
               shadow="always">
        <div slot="header"
             class="clearfix">
          <span>健康日志</span>
        </div>
        <div class="text item">
          <el-form label-position="left"
                   :model="patDetailData">
            <el-form-item>
              <el-input type="textarea"
                        :autosize="{ minRows: 4}"
                        :disabled="true"
                        v-model="patDetailData.real_name">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
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
import CountTo from "vue-count-to";
import { getUserPatDetail } from "@/api/consumer/patHome.js";
import { getUserhealthyList } from "@/api/consumer/healthy.js";
export default {
  components: {
    CountTo
  },
  data () {
    return {
      tableData: [{}, {}],
      patDetailData: {},
      loading: false,
      title: '',
      total: 0,
      time: '',
      dialogVisibleInfo: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        realName: '',
        beginDate: undefined,
        endDate: undefined
      },
      form: {}
    }
  },
  created () {
    //查询列表
    this.getAppUserhealthyList();
  },
  methods: {
    /** 获取列表 */
    getAppUserhealthyList () {
      this.loading = true
      if (this.time) {
        this.queryParams.beginDate = this.time[0]
        this.queryParams.endDate = this.time[1]
      }
      getUserhealthyList(this.queryParams).then(response => {
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
        realName: undefined,
        beginDate: undefined,
        endDate: undefined
      }
      this.time = ''
      this.getAppUserhealthyList();
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getAppUserhealthyList();
    },

    /** 详情(无接口) */
    clickInfo (row) {
      // alert('无接口')
      this.dialogVisibleInfo = true;
      getUserPatDetail(row.id).then(response => {
        this.patDetailData = response.data || {}
        this.dialogVisibleInfo = true;
      });
    }
  }
};
</script>

<style lang="scss">
.diary {
  .box-card {
    margin-bottom: 20px;
  }
  padding: 15px;
  label {
    font-weight: inherit;
  }
  .dialog-info {
    .column {
      .el-card__header {
        background: #e3e3e3;
      }
      .el-form-item {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.diary {
  padding: 30px;
  .pagination-container {
    background: none !important;
  }
}
</style>
