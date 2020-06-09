<template>
  <!-- 患者管理（完成）-->
  <div class="sufferer">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form :model="queryParams"
                 :inline="true"
                 label-width="75px">
          <el-form-item prop="realName">
            <el-input v-model="queryParams.realName"
                      size="mini"
                      placeholder="请输入患者姓名"
                      clearable
                      style="width:100%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-search"
                       @click="handleQuery">搜索</el-button>
            <!--            <el-button type="primary" @click="clickAdd" size="mini" icon="el-icon-plus">新增</el-button>-->
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
                         label="真实姓名"
                         align="center" />
        <el-table-column prop="linkPhone"
                         label="手机号"
                         align="center" />
        <el-table-column prop="familyRelation"
                         label="与主账户关系"
                         align="center">
          <template slot-scope="scope">{{scope.row.family_relation===1?'本人':scope.row.family_relation===2 ?'家庭成员':scope.row.family_relation===3 ?'亲戚':scope.row.family_relation===4 ?'朋友':'其他'}} </template>
        </el-table-column>
        <el-table-column prop="sex"
                         label="性别"
                         align="center">
          <template slot-scope="scope">{{scope.row.sex=1?'男':scope.row.sex=2?'女':'未知'}} </template>
        </el-table-column>
        <!--        <el-table-column prop="geneticInfo" label="家族史" align="center"/>-->
        <el-table-column prop="occupation"
                         label="职业"
                         align="center" />
        <el-table-column prop="race"
                         label="民族"
                         align="center" />
        <el-table-column prop="addTimeString"
                         label="添加时间"
                         align="center" />
        <el-table-column prop="name"
                         label="操作"
                         align="center"
                         width="230">
          <template slot-scope="scope">
            <el-button type="text"
                       icon="el-icon-view"
                       @click="clickInfo(scope.row)"
                       size="mini">详细</el-button>
            <!--            <el-button type="primary" @click="clickEdit(scope.row)" size="mini">编辑</el-button>-->
            <el-button type="text"
                       icon="el-icon-delete"
                       @click="clickDelete(scope.row)"
                       size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getAppPatList" />
    </div>

    <!-- 新增编辑 -->
    <!-- <el-dialog :title="title" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false">
      <el-card shadow="always">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="家庭账户" prop="pid">
              <el-select v-model="form.pid" placeholder="请选择" clearable style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.patId"
                :label="item.realName"
                :value="item.patId">
              </el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="form.realName" clearable size="small" placeholder="请输入真实姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="cardId">
              <el-input v-model="form.cardId" clearable size="small" placeholder="请输入身份证号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="手机号" prop="linkPhone">
              <el-input v-model="form.linkPhone" clearable  maxlength="11" size="small" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关系" prop="familyRelation">
            <el-select v-model="form.familyRelation" placeholder="请选择关系" clearable size="small" style="width:100%">
                <el-option label="本人" value="1"></el-option>
                <el-option label="家庭成员" value="2"></el-option>
                <el-option label="亲戚" value="3"></el-option>
                <el-option label="朋友" value="4"></el-option>
                <el-option label="其他" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
            <el-col :span="12">
            <el-form-item label="体重" prop="weight">
            <el-input v-model="form.weight" clearable size="small" placeholder="请输入体重"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择性别" clearable size="small" style="width:100%">
                <el-option label="男" value="1" ></el-option>
                <el-option label="女" value="2" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="婚姻" prop="marital">
            <el-select v-model="form.marital" placeholder="请选择婚姻" clearable size="small" style="width:100%">
                <el-option label="未婚" value="1"></el-option>
                <el-option label="已婚" value="2"></el-option>
                <el-option label="离异" value="3"></el-option>
                <el-option label="丧偶" value="4"></el-option>
                <el-option label="未知" value="5"></el-option>
              </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker v-model="form.birthday" format="yyyy 年 MM 月 dd 日" value-format="timestamp" type="date" placeholder="选择日期" style="width:100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="既往史" prop="previousInfo">
              <el-input v-model="form.previousInfo" clearable size="small" placeholder="请输入既往史"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="个人史"  prop="personInfo">
            <el-input v-model="form.personInfo" clearable size="small" placeholder="请输入个人史"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item label="婚姻史" prop="maritalInfo">
            <el-input v-model="form.maritalInfo" clearable size="small" placeholder="请输入婚姻史"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="家族史"  prop="geneticInfo">
            <el-input v-model="form.geneticInfo" clearable size="small" placeholder="请输入家族史"></el-input>
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="cancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')" size="mini">确 定</el-button>
      </div>
    </el-dialog> -->

    <!-- 详情弹窗 -->
    <el-dialog title="患者详情"
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
                  <span>{{patDetailData.familyRelation===1?'本人':patDetailData.familyRelation===2?'家庭成员':patDetailData.familyRelation===3?'亲戚':patDetailData.familyRelation===4?'朋友':'其他'||'无'}}</span>
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
          <span>健康背景</span>
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
import { getUserPatList, getUserPatDetail, deleteUserPat, addUserPat, updateUserPat, getRelationUser } from "@/api/consumer/patHome.js";
export default {
  components: {
    CountTo
  },
  data () {
    return {
      tableData: [],
      patDetailData: {},
      title: '',
      total: 0,
      dialogVisible: false,
      loading: false,
      dialogVisibleInfo: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined
      },
      form: {
        pat_id: undefined,
        uid: undefined,
        pid: undefined,
        realName: undefined,
        cardId: undefined,
        linkPhone: undefined,
        familyRelation: undefined,
        weight: undefined,
        sex: undefined,
        birthday: undefined,
        marital: undefined,
        previousInfo: undefined,
        maritalInfo: undefined,
        geneticInfo: undefined,
        personInfo: undefined
      },
      options: [],
      // 表单校验
      // rules: {
      //   pid: [
      //     { required: true, message: "标识不能为空", trigger: "change" }
      //   ],
      //   realName: [
      //     { required: true, message: "真实姓名不能为空", trigger: "blur" }
      //   ],
      //   maritalInfo: [
      //     { required: true, message: "婚姻史不能为空", trigger: "blur" }
      //   ],
      //   geneticInfo: [
      //     { required: true, message: "家族史不能为空", trigger: "blur" }
      //   ],
      //   familyRelation: [
      //     { required: true, message: "关系不能为空", trigger: "change" }
      //   ],
      //   weight: [
      //     { required: true, message: "体重不能为空", trigger: "blur" }
      //   ],
      //   sex: [
      //     { required: true, message: "性别不能为空", trigger: "change" }
      //   ],
      //   birthday: [
      //     { required: true, message: "生日不能为空", trigger: "blur" }
      //   ],
      //   marital: [
      //     { required: true, message: "婚姻不能为空", trigger: "change" }
      //   ],
      //   previousInfo: [
      //     { required: true, message: "既往史不能为空", trigger: "blur" }
      //   ],
      //   personInfo: [
      //     { required: true, message: "个人史不能为空", trigger: "blur" }
      //   ],
      //   cardId: [
      //     { required: true, message: "身份证号不能为空", trigger: "blur" },
      //     {
      //       pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      //       message: "请输入正确的身份证号",
      //       trigger: "blur"
      //     }
      //   ],
      //   linkPhone: [
      //     { required: true, message: "手机号不能为空", trigger: "blur" },
      //     {
      //       pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      //       message: "请输入正确的手机号码",
      //       trigger: "blur"
      //     }
      //   ]
      // }
    }
  },
  created () {
    //查询列表
    this.getAppPatList();
    // this.getRelationUserList();
  },
  methods: {
    /** 获取列表 */
    getAppPatList () {
      this.loading = true
      getUserPatList(this.queryParams).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });
    },

    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getAppPatList();
    },

    // 重置
    resetParams () {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        userName: undefined
      }
      this.getAppPatList();
    },

    /** 详情按钮操作 */
    clickInfo (row) {
      this.dialogVisibleInfo = true;
      getUserPatDetail(row.pat_id).then(response => {
        this.patDetailData = response.data || {}
        this.dialogVisibleInfo = true;
      });
    },

    /** 删除按钮操作 */
    clickDelete (row) {
      this.$confirm("此操作将删除该患者, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUserPat(row.pat_id).then(response => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getAppPatList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /** 查询患者所属用户 */
    // getRelationUserList() {
    //   getRelationUser().then(response => {
    //     this.options = response.data;
    //   });
    // }

    /** 新增按钮操作 */
    // clickAdd() {
    //   this.reset();
    //   this.dialogVisible = true;
    //   this.title="新增患者"
    // },

    /** 编辑按钮操作 */
    // clickEdit(row) {
    //   this.reset();
    //   const pat_id = row.pat_id;
    //   getUserPatDetail(pat_id).then(response => {
    //     this.form = response.data;
    //     this.dialogVisible = true;
    //     this.title="编辑患者";
    //   });
    // },

    /** 取消按钮 *///
    // cancel() {
    //   this.dialogVisible = false;
    //   this.reset();
    // },

    /**  表单重置 */
    // reset() {
    //   this.form = {
    //     uid:undefined,
    //     pid:undefined,
    //     pat_id:undefined,
    //     realName: "",
    //     cardId: "",
    //     linkPhone: "",
    //     familyRelation: "",
    //     weight:"",
    //     sex: "",
    //     birthday: "",
    //     marital:  "",
    //     previousInfo:  "",
    //     maritalInfo:  "",
    //     geneticInfo:  "",
    //     personInfo:  ""
    //   };
    //   this.resetForm("form");
    // },

    /** 提交按钮 */
    // submitForm: function() {
    //   this.$refs["form"].validate(valid => {
    //     if (valid) {
    //       if (this.form.pat_id != undefined) {
    //         updateUserPat(this.form).then(response => {
    //           if (response.code === 200) {
    //             this.msgSuccess("修改成功");
    //             this.dialogVisible = false;
    //             this.getAppPatList();
    //           } else {
    //             this.msgError(response.msg);
    //           }
    //         });
    //       } else {
    //         addUserPat(this.form).then(response => {
    //           if (response.code === 200) {
    //             this.msgSuccess("新增成功");
    //             this.dialogVisible = false;
    //             this.getAppPatList();
    //           } else {
    //             this.msgError(response.msg);
    //           }
    //         });
    //       }
    //     }
    //   });
    // }
  }
};
</script>

<style lang="scss">
.sufferer {
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
.sufferer {
  padding: 30px;
  .pagination-container {
    background: none !important;
  }
}
</style>
