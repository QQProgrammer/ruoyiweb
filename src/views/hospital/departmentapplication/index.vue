<!--
1 医院科室申请审核 样式未修改
2 医院等级 接口已出
3 医院类型接口已出
4 取消管理员已出
-->



<template>
  <div class="everypage">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" label-width="75px" :inline="true">
          <el-form-item label="医院名称:" prop="hospName">
            <el-input v-model="ruleForm.hospName" size="mini" placeholder="请输入" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="申请人:" prop="realName">
            <el-input v-model="ruleForm.realName" size="mini" placeholder="请输入" style="width:200px"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" size="mini" @click="searchdepartmentapplication">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('ruleForm')" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 列表表格 -->
    <div class="tablemain">
      <el-table
        class="tablecss"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column prop="realName" label="申请人" width="76" align="center"></el-table-column>
        <el-table-column prop="hospName" label="医院名称" min-width="55" align="center"></el-table-column>
        <el-table-column prop="deptName" label="申请科室" width="80" align="center"></el-table-column>
        <el-table-column prop="linkUser" label="联系人" width="70" align="center"></el-table-column>
        <el-table-column prop="linkTel" label="联系电话" min-width="52" align="center"></el-table-column>
        <el-table-column prop="addTime" label="申请时间" min-width="56" align="center"></el-table-column>
        <el-table-column prop="authStatus" label="申请状态" width="86" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.authStatus | capitalizeauthStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="authTime" label="审核时间" min-width="56" align="center"></el-table-column>
        <el-table-column prop="" label="操作" min-width="110" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view"  @click="seeDetail(scope.row)" size="mini">查看详情</el-button>
            <el-button type="text" icon="el-icon-guide" v-if="scope.row.authStatus == 0"  @click="examine(scope.row)" size="mini">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
     <!-- 详情弹窗 -->
    <el-dialog title="详情" :visible.sync="dialogVisible" width="60%">
      <div>
        <div class="twocolumn">
          <p>申请信息</p>
          <div class="twocolumnlist">
            <div>
              <p>申请人：{{detailObj.realName}}</p>
              <p>申请医院：{{detailObj.hospName}}</p>
            </div>
            <div>
              <p>申请科室：{{detailObj.deptName}}</p>
              <p>联系人：{{detailObj.linkUser}}</p>
            </div>
            <div>
              <p>联系电话：{{detailObj.linkTel}}</p>
              <p>申请时间：{{detailObj.addTime}}</p>
            </div>
            <div>
              <p>申请状态：{{detailObj.authStatus | capitalizeauthStatus}}</p>
              <p>审核时间：{{detailObj.authTime}}</p>
            </div>
            <div>
              <p>审核备注：{{detailObj.authMsg}}</p>
              <p>审核人：{{detailObj.authUser}}</p>
            </div>
            <div>
              <!-- <p style="display:flex">
                <span>证明资料：</span>
                <img v-if="detailObj.certImg" :src="detailObj.certImg" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!detailObj.certImg">暂无</span>
              </p> -->
              <p>
                <span style="float:left">证明资料：</span>
                <img v-if="detailObj.certImg" :src="item" v-for="(item,index) in detailObj.certImg" :key="index" style="width:200px;height:200px;object-fit: scale-down;margin-right:10px">
                <span v-if="!detailObj.certImg">暂无</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 审核弹窗 -->
    <el-dialog title="审核" :visible.sync="dialogFormVisible" center :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="审核状态">
          <el-radio-group v-model="form.authStatus" @change="changeauthStatus">
            <el-radio :label="1">
              <span>通过</span>
            </el-radio>
            <el-radio :label="-1">
              <span>拒绝</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="拒绝原因" v-if="reasonshow">
          <el-input v-model="form.authMsg" type="textarea" :rows="2" style="width:83%" placeholder="请输入"></el-input>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="updateexamine">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { gethospEnterList,updatechangeStatus} from "@/api/hospital/departmentapplication";
export default {
  data() {
    return {
      ruleForm: {
        hospName:'',
        realName:''
      },
      total: 1,
      currentPage: 1,
      pagesize: 10,
      detailObj:{},
      tableData: [],
      dialogVisible: false,
      loading: false,
      dialogFormVisible: false,
      id:'',

      form: {
        authMsg:'',
        authStatus: 1
      },
      reasonshow:false,//审核拒绝原因
    };
  },
  filters: {
    capitalizeauthStatus: function(value) {
      if (value == -1) {
        return "拒绝";
      } else if (value == 0) {
        return "待审核";
      } else if (value == 1) {
        return "审核通过";
      }
    },
    capitalizeisDel: function(value) {
      if (value == 0) {
        return "删除";
      } else if (value == 1) {
        return "未删除";
      }
    }
  },
   created() {
    this. gethospEnterList(); //列表
  },
  methods: {
     // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //张敏敏点击 搜索按钮
    searchdepartmentapplication() {
      this.currentPage = 1;
      this. gethospEnterList();
    },
    // 列表
     gethospEnterList() {
      this.loading = true;
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        hospName: this.ruleForm.hospName,
        realName:this.ruleForm.realName
      };
       gethospEnterList(params).then(response => {
        this.loading = false;
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // 审核弹窗选择退单和拒绝
    changeauthStatus(val){
      val===-1?this.reasonshow = true:this.reasonshow = false
    },
    // 列表分页
    handleSizeChange(val) {
      this.pagesize = val;
      this. gethospEnterList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this. gethospEnterList();
    },
    seeDetail(row){
      this.dialogVisible = true
      this.detailObj = row
    },
    // 审核
     examine(val) {
      this.dialogFormVisible = true;
      this.form.authStatus = val.authStatus
      this.form.authMsg = val.authMsg
      if(val.authStatus===-1){
        this.reasonshow = true
      }else{
        this.reasonshow = false;
        this.form.authMsg = ''
      }
      this.examineobj = val;
    },
    // 提交审核信息
    updateexamine() {
      updatechangeStatus({
        authMsg:this.form.authMsg,
        authStatus:this.form.authStatus,
        id: this.examineobj.id
      }).then(response => {
        this.dialogFormVisible = false;
        this. gethospEnterList();
        this.$message({
          type: "success",
          message: "成功!"
        });
      });
    },
  }
};
</script>

