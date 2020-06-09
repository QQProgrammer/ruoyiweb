<template>
<!-- 
  1、查看详情 身份证正面照片：身份证返面照片：职业资格证书照片：工作证明证书：可以提供一个照片地址测试一下
  2、新增医护的用户头像和用户类型比传的，当时让我写死给他的，接口还需修改
  3、编辑的时候去掉密码字段，需要修改接口，目前新增和编辑的接口密码都是必传的
 -->
  <div class="everypage">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :inline="true" label-width="75px">
          <el-form-item label="医院筛选" prop="hospId">
            <el-select v-model="ruleForm.hospId" size="mini" @change='changeHospInfo' clearable placeholder="请选择">
              <el-option
                v-for="item in selectAllHospInfoArr"
                :key="item.id"
                :label="item.hospName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室筛选" prop="deptId">
            <el-select v-model="ruleForm.deptId" size="mini" clearable placeholder="请选择">
            <el-option
              v-for="item in selectAllHospDeptArr"
              :key="item.id"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="认证状态" prop="authStatus">
            <el-select v-model="ruleForm.authStatus" size="mini" clearable placeholder="请选择">
              <el-option label="未认证" value="0"></el-option>
              <el-option label="已认证" value="1"></el-option>
              <el-option label="认证失败" value="-1"></el-option>
              <el-option label="认证失效" value="-2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职称" prop="hospName">
            <el-input v-model="ruleForm.hospName" size="mini" clearable placeholder="请输入" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item label="职务" prop="hospName">
            <el-input v-model="ruleForm.hospName" size="mini" clearable placeholder="请输入" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item label="教学职称" prop="hospName">
            <el-input v-model="ruleForm.hospName" size="mini" clearable placeholder="请输入" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="hospName">
            <el-input v-model="ruleForm.hospName" size="mini" clearable placeholder="请输入" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="medicalAllHospInfol">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('ruleForm')" size="mini">重置</el-button>
            <el-button type="warning" icon="el-icon-download" @click="handleExport" size="mini">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 列表表格 -->
    <!-- <table-service :loading="loading" :table-data="createListData" /> -->
    <div class="tablemain">
      <!-- <el-button type="primary" class="tabledeletebtn" size="mini">批量删除订单</el-button> -->
      <el-button type="primary" icon="el-icon-plus" class="tabledeletebtn" @click="add" size="mini">新增医护</el-button>
      <el-table
        class="tablecss"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
      >
        <!-- <el-table-column type="selection" width="28"></el-table-column> -->
        <el-table-column label="医护账号" min-width="50" align="center">
          <template slot-scope="scope">{{ scope.row.account }}</template>
        </el-table-column>
        <el-table-column prop="realName" label="医护姓名" min-width="60" align="center"></el-table-column>
        <el-table-column prop="jobTitle" label="职称" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.jobTitle | capitalizejobTitle}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="职务" min-width="52" align="center"></el-table-column>
        <el-table-column prop="" label="教学职称" min-width="52" align="center"></el-table-column>
        <el-table-column prop="" label="工作标签" min-width="52" align="center"></el-table-column>
        <el-table-column prop="hospName" label="所属医院" min-width="52" align="center"></el-table-column>
        <el-table-column prop="deptName" label="所属科室" width="75" align="center"></el-table-column>
        <el-table-column prop="authStatus" label="认证状态" width="75" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.authStatus | capitalizeauthStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="审核时间" min-width="52" align="center"></el-table-column>
        <el-table-column prop="validTime" label="认证审核时间" min-width="60" align="center"></el-table-column>
        <el-table-column prop="" label="操作" width="170" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-finished" v-if="scope.row.authStatus === '0'" @click="updateUserAuthStatus(scope.row)"size="mini">认证</el-button>
            <el-button type="text"  icon="el-icon-view"  @click="medicalDetail(scope.row)" size="mini">查看详情</el-button>
            <el-button type="text"  icon="el-icon-edit"  @click="edit(scope.row)" size="mini">编辑</el-button>
            <el-button type="text"  icon="el-icon-delete"  @click="deleteList(scope.row.uid)" size="mini">删除</el-button>
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
    <!-- 新增医护 -->
    <el-dialog class="ruleselform" :title="title" :visible.sync="dialogAddFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="用户账号" prop="account">
          <el-input v-model="form.account"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd" v-if="title==='新增医护'">
          <el-input v-model="form.pwd" type="password" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="cardId">
          <el-input v-model="form.cardId"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname"   placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone"  placeholder="请输入" ></el-input>
        </el-form-item>
        <el-form-item label="医院" prop="hospId">
            <el-select v-model="form.hospId" @change='changeHospInfo' clearable placeholder="请选择">
              <el-option
                v-for="item in selectAllHospInfoArr"
                :key="item.id"
                :label="item.hospName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label label="科室" prop="deptId">
            <el-select v-model="form.deptId" clearable placeholder="请选择">
              <el-option
                v-for="item in selectAllHospDeptArr"
                :key="item.id"
                :label="item.deptName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label label="职称" prop="jobTitle">
            <el-select v-model="form.jobTitle" placeholder="请选择">
              <el-option label="药师" value="1"></el-option>
              <el-option label="住院医师" value="2"></el-option>
              <el-option label="主治医师" value="3"></el-option>
              <el-option label="副主任医师" value="4"></el-option>
              <el-option label="正主任医师" value="5"></el-option>
              <el-option label="护士" value="6"></el-option>
              <el-option label="护士长" value="7"></el-option>
              <el-option label="管理人员" value="7"></el-option>
              <el-option label="其他" value="0"></el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitmedail('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情弹窗 -->
    <el-dialog title="医护详情" :visible.sync="dialogVisible" width="65%" >
      <div>
        <div class="twocolumn">
          <p>医护详情</p>
          <div class="twocolumnlist">
            <div>
              <p>医护账号：{{medicaldetail.account}}</p>
              <p>医护姓名：{{medicaldetail.realName}}</p>
            </div>
            <div>
               <p>职称：{{medicaldetail.jobTitle |capitalizejobTitle}}</p>
              <p>所属医院：{{medicaldetail.hospName}}</p>
            </div>
            <div>
              <p>所属科室：{{medicaldetail.deptName}}</p>
              <p>认证状态：{{medicaldetail.authStatus | capitalizeauthStatus}}</p>
            </div>
            <div>
              <p>认证时间：{{medicaldetail.addTime}}</p>
              <p>认证审核时间：{{medicaldetail.validTime}}</p>
            </div>
            <div>
              <p>身份证号码：{{medicaldetail.cardId}}</p>
              <p>职业资格证书编码：{{medicaldetail.certId}}</p>
            </div>
            <div>
              <p>认证信息：{{medicaldetail.authMsg}}</p>
              <p>是否通过科室审核：{{medicaldetail.isDept | capitalizeisDept}}</p>
            </div>
            <div>
              <p style="display:flex">
                <span>身份证正面照片：</span>
                <img v-if="medicaldetail.cardfImg" :src="medicaldetail.cardfImg" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!medicaldetail.cardfImg">暂无</span>
              </p>
              <p style="display:flex">
                <span>身份证返面照片：</span>
                <img v-if="medicaldetail.cardbImg" :src="medicaldetail.cardbImg" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!medicaldetail.cardbImg">暂无</span>
              </p>
            </div>
            <div>
              <p style="display:flex">
                <span>职业资格证书照片：</span>
                <img v-if="medicaldetail.certImg" :src="medicaldetail.certImg" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!medicaldetail.certImg">暂无</span>
              </p>
              <p style="display:flex">
                <span>工作证明证书：</span>
                <img v-if="medicaldetail.workImg" :src="medicaldetail.workImg" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!medicaldetail.workImg">暂无</span>
              </p>
            </div>
            <!-- <div>
              <p style="display:flex">
                <span>职业资格证书照片：</span>
                <img v-if="medicaldetail.otherImg" :src="medicaldetail.otherImg" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!medicaldetail.otherImg">暂无</span>
              </p>
            </div> -->
          </div>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectAllHospInfo,
  selectAllHospDept
 } from "@/api/hospital/hospitalmanagement";
 import {
  getuserAuthList,
  deleteUserAuthStatus,
  createInsertUserAuth,
  updateModifyUserAuth,
  updateHospDeptRemark,
  updateUserAuthStatus,
 } from "@/api/hospital/medicalmanagement";
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        // console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    }
    var accountPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入您的手机号为账号'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入您的手机号'));
        }
      }
    }
    
    var checkdeptId = (rule, value, callback) => {
      if (this.form.hospId == '') {
        return callback(new Error('请先选择医院'));
      }else {
        if (!value) {
          return callback(new Error('请选择科室'));
       }else{
         callback();
       }
      }
    }
    // 验证身份证
    var validID = (rule,value,callback) =>{
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('身份证号码不正确'))
      }
    }
    return {
      rules: {
        account: [
          { required: true, validator: accountPhone, trigger: 'blur' },
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
         cardId: [
            { required: true, message: '身份证号不能为空', trigger: 'blur' },
            { validator: validID, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        deptId: [
          { required: true, validator: checkdeptId, trigger: 'change' }
        ],
        hospId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        jobTitle: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        phone: [
          {required: true, validator: checkPhone, trigger: 'blur'}
        ]
      },
      currentPage: 1,
      pagesize: 10,
      total: 1,
      selectAllHospInfoArr:[], //医院列表
      selectAllHospDeptArr:[], //科室列表
      ruleForm: {
        hospId: "",
        deptId: "",
        authStatus: ""
      },
      medicaldetail:{},


      title:'新增医护',
      id:'',
      tableData1: [],
      loading1: false,

      tableData: [],
      dialogVisible: false,
      loading: false,
      dialogFormVisible: false,
      dialogAddFormVisible: false,


      form: {
        account	:'',
        pwd:'',
        realName:'',
        cardId:'',
        nickname:'',
        phone:'',
        deptId:'',
        hospId:'',
        jobTitle:'',
        avatar:'1234',
        loginType:0,
      },

      multipleSelection: []
    };
  },
   filters: {
    capitalizeisDel: function(value) {
      if (value == 0) {
        return "无效";
      } else if (value == 1) {
        return "有效";
      }
    },
    capitalizeisDept: function(value) {
      if (value == 0) {
        return "是";
      } else if (value == 1) {
        return "否";
      }
    },
    capitalizejobTitle: function(value) {
      if (value == 0) {
        return "其他";
      } else if (value == 1) {
        return "药师";
      } else if (value == 2) {
        return "住院医师";
      } else if (value == 3) {
        return "主治医师";
      } else if (value == 4) {
        return "副主任医师";
      } else if (value == 5) {
        return "正主任医师";
      } else if (value == 6) {
        return "护士";
      } else if (value == 7) {
        return "护士长";
      } else if (value == 8) {
        return "管理人员";
      }
    },
    capitalizeauthStatus: function(value) {
      if (value == 0) {
        return "未认证";
      } else if (value == 1) {
        return "已认证";
      } else if (value == -1) {
        return "认证失败";
      } else if (value == -2) {
        return "认证失效";
      }
    },



  },
  created() {
    this.getuserAuthList()
    this.selectAllHospInfo()//医院下拉列表
  },
  methods: {
    // 导出
    handleExport(){

    },
     // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 搜索
    medicalAllHospInfol() {
      this.currentPage = 1
      this.getuserAuthList()
    },
    // 列表
    getuserAuthList() {
       this.loading = true
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        hospId: this.ruleForm.hospId,
        deptId: this.ruleForm.deptId,
        authStatus: this.ruleForm.authStatus,
      };
      getuserAuthList(params).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // 认证
    updateUserAuthStatus(row){
      console.log(row)
      this.$confirm("你确定要认证吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateUserAuthStatus({
            uid:row.uid,
            authStatus:1,
            jobTitle:row.jobTitle,
            hospId:row.hospId,
            deptId:row.deptId,
          }).then(response => {
            this.getuserAuthList()
            this.$message({
              type: "success",
              message: "认证成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消认证"
          });
        });
    },
    // 查看详情
    medicalDetail(row) {
      this.medicaldetail = row
      this.dialogVisible = true;
    },
    // 提交新增编辑
    submitmedail(form){
      this.$refs[form].validate((valid) => {
          if (valid) {
            if(this.title === '新增医护'){
              console.log(3)
              createInsertUserAuth(this.form).then(response => {
                this.dialogAddFormVisible = false;
                this.getuserAuthList()
                this.$message({
                  type: "success",
                  message: "新增成功!"
                });
              });
            }else if(this.title === '编辑医护'){
              updateModifyUserAuth(this.form).then(response => {
                this.dialogAddFormVisible = false;
                this.getuserAuthList()
                this.$message({
                  type: "success",
                  message: "编辑成功!"
                });
              });
            }
          } else {
            return false;
          }
        });
      
    },
    // edit 编辑
    edit(row) {
      this.selectAllHospDept(row.hospId)
      this.dialogAddFormVisible = true;
      // row.deptId = row.deptId.toString()
      row.jobTitle = row.jobTitle.toString()
      // console.log(typeof row.deptId)
      this.title = '编辑医护'
      this.form = {
        uid:row.uid,
        account	:row.account,
        // pwd:'',
        realName:row.realName,
        cardId:row.cardId,
        nickname:row.nickname,
        phone:row.phone,
        deptId:row.deptId,
        hospId:row.hospId,
        jobTitle:row.jobTitle,
        // avatar:'1234',
        loginType:1,
      }
    },

    add(){
      this.dialogAddFormVisible = true;
      this.$refs['form'].resetFields();
      this.title = '新增医护'
      this.form = {
        account	:'',
        pwd:'',
        realName:'',
        cardId:'',
        nickname:'',
        phone:'',
        deptId:'',
        hospId:'',
        jobTitle:'',
        // avatar:'1234',
        loginType:1,
      }
    },
    // 医院列表
    selectAllHospInfo(){
      selectAllHospInfo().then(response => {
        this.selectAllHospInfoArr = response.data
        // this.selectAllHospDept()
      });
    },
    // 医院下拉改变
    changeHospInfo(val){
      this.form.deptId = ''
      this.selectAllHospDept(val)
    },
    // 科室下拉
    selectAllHospDept(val){
      selectAllHospDept({
        hospId:val
      }).then(response => {
        this.selectAllHospDeptArr = response.data
      });
    },
    // 切换分页
    handleSizeChange(val) {
      this.pagesize = val
      this.getuserAuthList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getuserAuthList()
    },
    // 单条删除
    deleteList(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUserAuthStatus({
            uid:val
          }).then(response => {
            this.getuserAuthList()
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.morehide{
    width:100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.ruleselform{
  .el-form-item{
    margin-bottom: 22px;
  }
}
</style>
