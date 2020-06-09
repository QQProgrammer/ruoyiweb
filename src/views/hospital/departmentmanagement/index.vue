<template>
<!-- 
  科室列表的在新增和编辑都去掉了科室编号，内存空间，已使用空间，相关接口可以修改一下（接口线管字段我已经去掉）
  1、添加管理员弹窗的设为管理员，取消管理员接口
  2、添加管理员弹窗的查看医生详情接口
  3、添加管理员弹窗列表里面的是否为管理员的标识未给
 -->
  <div class="everypage">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :inline="true" label-width="75px">
          <el-form-item label="医院筛选" prop="hospName">
            <el-select v-model="ruleForm.hospName" size="mini" @change='changeHospInfo' clearable placeholder="请选择">
            <el-option
              v-for="item in selectAllHospInfoArr"
              :key="item.id"
              :label="item.hospName"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label label="科室筛选" prop="deptName">
            <el-select v-model="ruleForm.deptName" size="mini" clearable placeholder="请选择">
            <el-option
              v-for="item in selectAllHospDeptArr"
              :key="item.id"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  icon="el-icon-search" size="mini" @click="searchAllHospInfol">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('ruleForm')" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 列表表格 -->
    <!-- <table-service :loading="loading" :table-data="createListData" /> -->
    <div class="tablemain">
      <el-button type="primary" icon="el-icon-plus" class="tabledeletebtn" @click="add" size="mini">新增科室</el-button>
      <el-table
        class="tablecss"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="28"></el-table-column> -->
        <el-table-column label="科室编码" min-width="50" align="center">
          <template slot-scope="scope">{{ scope.row.hospCode }}</template>
        </el-table-column>
        <el-table-column prop="deptName" label="科室名称" min-width="52" align="center"></el-table-column>
        <el-table-column prop="hospName" label="所属医院" min-width="52" align="center"></el-table-column>
        <el-table-column prop="deptInfo" label="科室简介" min-width="52" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.deptInfo">
              <span slot="reference" class="morehide">{{scope.row.deptInfo}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="memSize" label="云盘空间" min-width="52" align="center"></el-table-column>
        <el-table-column prop="memUsed" label="已使用云盘空间" min-width="52" align="center"></el-table-column>
        <el-table-column prop="hospDeptAdminUserID" label="账户管理员" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.hospDeptAdminUserID}}
              <span v-if="scope.row.hospDeptAdminUserID&&scope.row.hospDeptAdminUserRealName">/</span>
              {{scope.row.hospDeptAdminUserRealName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isDel" label="状态" min-width="35" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isDel | capitalizeisDel }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="状态" min-width="35" align="center"></el-table-column> -->
        <el-table-column prop="addTime" label="添加时间" min-width="62" align="center"></el-table-column>
        <el-table-column prop="" label="操作" min-width="155" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="departDetail(scope.row)" size="mini">科室详情</el-button>
            <el-button type="text" icon="el-icon-edit" @click="edit(scope.row)" size="mini">编辑</el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="departRemark(scope.row)" size="mini">科室备注</el-button>
            <el-button type="text" icon="el-icon-circle-plus-outline" @click="administrator(scope.row)" size="mini">关联管理员</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deletedepartlist(scope.row.id)" size="mini">删除</el-button>
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
    <!-- 新增科室 -->
    <el-dialog class="ruleselform" :title="title" :visible.sync="dialogAddFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="医院筛选" prop="hospId">
            <el-select v-model="form.hospId" clearable placeholder="请选择">
            <el-option
              v-for="item in selectAllHospInfoArr"
              :key="item.id"
              :label="item.hospName"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
        <el-form-item label="科室名称">
          <el-input v-model="form.deptName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="科室简介">
          <el-input v-model="form.deptInfo" type="textarea" :rows="2"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="门诊地址信息">
          <el-input v-model="form.clinicInfo" type="textarea" :rows="2" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="病房地址信息">
          <el-input v-model="form.roomInfo" type="textarea" :rows="2" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="备注信息">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitedit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情弹窗 -->
    <el-dialog title="科室详情" :visible.sync="dialogVisible" width="65%" >
      <div>
        <div class="twocolumn">
          <p>科室详情</p>
          <div class="twocolumnlist">
            <div>
              <p>科室编码：{{departdetail.hospCode}}</p>
              <p>科室名称{{departdetail.deptName}}</p>
            </div>
            <div>
               <p>病房地址信息：{{departdetail.roomInfo}}</p>
              <p>所属医院：{{departdetail.hospName}}</p>
            </div>
            <div>
              <p>云盘空间：{{departdetail.memSize}}</p>
              <p>已使用云盘空间：{{departdetail.memUsed}}</p>
            </div>
            <div>
              <p>账户管理员：{{departdetail.hospDeptAdminUserRealName}}</p>
              <p>状态：{{departdetail.isDel | capitalizeisDel}}</p>
            </div>
            <div>
              <p>创建时间：{{departdetail.addTime}}</p>
              <p>最后一次更新时间：{{departdetail.updTime}}</p>
            </div>
            <div>
              <p>科室简介：{{departdetail.deptInfo}}</p>
              <p>门诊地址信息：{{departdetail.clinicInfo}}</p>
            </div>
          </div>
        </div>
        <div class="twocolumn">
          <p>科室备注</p>
          <div class="twocolumnlist">
            <div>
              <p>科室备注：{{departdetail.remark}}</p>
            </div>
          </div>
        </div>
        <div class="twocolumn">
          <p>医护列表</p>
          <div class="">
            <el-table
              class="tablecss"
              ref="multipleTable"
              v-loading="loading1"
              :data="tableData1"
            >
              <el-table-column prop="realName" label="姓名" min-width="52" align="center"></el-table-column>
              <el-table-column prop="jobTitle" label="岗位" min-width="52" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.jobTitle | capitalizejobTitle}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="authStatus" label="认证状态" min-width="52" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.authStatus | capitalizeauthStatus}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="isDept" label="是否通过科室审核" min-width="52" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.isDept | capitalizeisDept}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="操作" min-width="52" align="center">
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-open" @click="setLoginPC(scope.row)" size="mini">设为可登陆PC管理端</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

      </div>
    </el-dialog>
    <!-- 关联管理员列表 -->
    <el-dialog title="管理员列表" :visible.sync="dialogVisible2" width="70%">
      <div>
        <div class="twocolumn">
          <p>管理员列表</p>
          <el-form ref="form2" :model="form2" label-width="75px" :inline="true">
            <el-form-item label="用户账号:" prop="realName">
              <el-input v-model="form2.account" size="mini" placeholder="请输入" style="width:200px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="searchform2">搜索</el-button>
            </el-form-item>
          </el-form>
          <div class="">
            <el-table
              class="tablecss"
              ref="multipleTable"
              v-loading="loading2"
              :data="tableData2">
              <el-table-column prop="realName" label="医生姓名" min-width="52" align="center"></el-table-column>
              <el-table-column prop="account" label="医生账号" min-width="60" align="center"></el-table-column>
              <el-table-column prop="nickname" label="昵称" min-width="52" align="center"></el-table-column>
              <el-table-column prop="jobTitle" label="职称" min-width="72" align="center"></el-table-column>
              <el-table-column prop="jobType" label="医生类型" min-width="72" align="center"></el-table-column>
              <el-table-column prop="addTime" label="注册时间" min-width="72" align="center"></el-table-column>
              <el-table-column prop="spreadNum" label="推广码" min-width="50" align="center"></el-table-column>
              <el-table-column prop="spreadName" label="推广人姓名" min-width="52" align="center"></el-table-column>
              <el-table-column prop="" label="操作" min-width="70" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.isManager == 0" type="text" icon="el-icon-folder-add" @click="setAdministrator(scope.row)" size="mini">设为管理员</el-button>
                  <el-button v-if="scope.row.isManager == 1" type="text" icon="el-icon-folder-remove" @click="cancelAdministrator(scope.row)" size="mini">取消管理员</el-button>
                  <el-button type="text" @click="seedetailtdxq(scope.row)" icon="el-icon-view" size="mini">查看医生信息</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page="currentPage2"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pagesize2"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total2"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
     <!-- 关联管理弹窗列表里面的查看弹窗 -->
    <el-dialog title="医生详情" :visible.sync="dialogVisible3" width="60%">
      <div>
        <div class="twocolumn">
          <p>服务请求信息</p>
          <div class="twocolumnlist">
            <div>
              <p>医生账号：{{doctorInfoObj.account}}</p>
              <p>昵称：{{doctorInfoObj.nickname}}</p>
            </div>
            <div>
              <p>医生姓名：{{doctorInfoObj.realName}}</p>
              <p>手机号：{{doctorInfoObj.phone}}</p>
            </div>
            <div>
              <p>身份证号：{{doctorInfoObj.cardId}}</p>
              <p>认证状态：{{doctorInfoObj.authStatus | capitalizeauthStatus}}</p>
            </div>
            <div>
              <p>详细地址：{{doctorInfoObj.addres}}</p>
              <p>职业资格证书编码：{{doctorInfoObj.certId}}</p>
            </div>
            <div>
              <p>所属医院：{{doctorInfoObj.hospName}}</p>
              <p>所属科室：{{doctorInfoObj.deptpName}}</p>
            </div>
            <div>
              <p>职称：{{doctorInfoObj.jobTitle}}</p>
              <p>擅长疾病：{{doctorInfoObj.disease}}</p>
            </div>
            <div>
              <p>职务：{{doctorInfoObj.duty}}</p>
            </div>
            <div>
              <p style="display:flex">
                <span>身份证正面照片地址：</span>
                <img v-if="doctorInfoObj.cardZ" :src="doctorInfoObj.cardZ" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!doctorInfoObj.cardZ">暂无</span>
              </p>
              <p style="display:flex">
                <span>身份证反面照片地址：</span>
                <img v-if="doctorInfoObj.cardF" :src="doctorInfoObj.cardF" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!doctorInfoObj.cardF">暂无</span>
              </p>
            </div>
            <div>
              <p style="display:flex">
                <span>职业资格证书照片：</span>
                <img v-if="doctorInfoObj.certImg" :src="doctorInfoObj.certImg" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!doctorInfoObj.certImg">暂无</span>
              </p>
              <p style="display:flex">
                <span>工作证明证书：</span>
                <img v-if="doctorInfoObj.workImg" :src="doctorInfoObj.workImg" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!doctorInfoObj.workImg">暂无</span>
              </p>
            </div>
            <div>
              <p style="display:flex">
                <span>其他证明证书：</span>
                <img v-if="doctorInfoObj.otherImg" :src="doctorInfoObj.otherImg" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!doctorInfoObj.otherImg">暂无</span>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 订单备注弹窗 -->
    <el-dialog title="备注" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="form1">
        <el-form-item label="备注信息">
          <el-input v-model="form1.remark" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateHospDeptRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectAllHospInfo,
  selectAllHospDept,
  appUserList,
  cancleManager,
  updatesetLinkUser
 } from "@/api/hospital/hospitalmanagement";
 import {
  gethospDeptList,
  deleteHospDeptById,
  createHospDept,
  updateHospDept,
  updateHospDeptRemark,
  selectAllDeptUserAuth,
  setLinkUser,
  deptPartAppList
 } from "@/api/hospital/departmentmanagement";
  import { getDoctorInfo } from "@/api/consultation/consultationmanagement";
export default {
  data() {
    return {
      form2:{
        account:'',
      },
      doctorInfoObj:{},// 关联管理员里面的查看医生详情
      dialogVisible3:false,

      rules: {
        hospId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      currentPage: 1,
      pagesize: 10,
      total: 1,
      selectAllHospInfoArr:[], //医院列表
      selectAllHospDeptArr:[], //科室列表
      ruleForm: {
        hospName: "",
        deptName: ""
      },
      departdetail:{},
      title:'新增科室',
      id:'',
      tableData1: [],
      loading1: false,

      dialogVisible2: false,
      loading2: false,
      currentPage2: 1,
      pagesize2: 10,
      total2: 1,
      tableData2: [],
      hospInfoList:{},
      linkId:'',

      tableData: [],
      dialogVisible: false,
      loading: false,
      dialogFormVisible: false,
      dialogAddFormVisible: false,

      form1: {
        remark: ""
      },
      form: {
        hospId:'',
        remark:'',
        deptName:'',
        deptInfo:'',
        clinicInfo:'',
        roomInfo:'',
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
    this.gethospDeptList()
    this.selectAllHospInfo()//医院下拉列表
  },
  methods: {
    // 关联管理员 根据用户账号弹窗搜索
    searchform2(){

    },
     // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 关联管理员列表
    administrator(row){
      this.linkId = row.id
      this.hospInfoList = row
      this.dialogVisible2 = true
      this.loading2 = true
      deptPartAppList({
        pageNum: this.currentPage2,
        pageSize: this.pagesize2,
        linkId:row.id
      }).then(response => {
        this.loading2 = false
        this.tableData2 = response.rows;
        this.total2 = response.total;
      });
    },
    // 关联管理员里面的查看
    seedetailtdxq(row){
      this.dialogVisible3 = true
      getDoctorInfo({
        uid:row.uid
        // uid:2
      }).then(res => {
        this.doctorInfoObj = res.data
      })
    },
    // 取消管理员
    cancelAdministrator(val){
      console.log(val)
      console.log(this.linkId)
      this.$confirm("确定要取消管理员吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cancleManager({
            uid:val.uid,
            linkId:this.linkId,
            linkType:0
          }).then(response => {
            this.administrator(this.hospInfoList)
            this.$message({
              type: "success",
              message: "取消成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消设置"
          });
        });
    },
    // 设为管理员
    setAdministrator(val){
      this.$confirm("确定要设为管理员吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updatesetLinkUser({
            uid:val.uid,
            linkId:this.linkId,
            userType:0
          }).then(response => {
            this.administrator(this.hospInfoList)
            this.$message({
              type: "success",
              message: "设置成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消设置"
          });
        });

    },
    // 管理员列表分页
    handleSizeChange2(val) {
      this.pagesize2 = val
      this.administrator(this.hospInfoList)
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val
      this.administrator(this.hospInfoList)
    },
    // 搜索
    searchAllHospInfol() {
      this.currentPage = 1
      this.gethospDeptList()
    },
    // 列表
    gethospDeptList() {
      this.loading = true
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        hospName: this.ruleForm.hospName,
        deptName: this.ruleForm.deptName,
      };
      gethospDeptList(params).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // 点击订单备注
    departRemark(val) {
      this.dialogFormVisible = true;
      this.id = val.id;
      this.form1.remark = val.remark
    },
    // 提交更新备注信息
    updateHospDeptRemark() {
      updateHospDeptRemark({
        id: this.id,
        remark: this.form1.remark
      }).then(response => {
        this.dialogFormVisible = false;
        this.gethospDeptList()
        this.$message({
          type: "success",
          message: "备注成功!"
        });
      });
    },
    // 订单详情
    departDetail(row) {
      this.departdetail = row
      this.dialogVisible = true;
      this.selectAllDeptUserAuth(row.id)
    },
    // 医护列表查询
    selectAllDeptUserAuth(val){
      selectAllDeptUserAuth({
        deptId:val
      }).then(response => {
        this.tableData1 = response.data
        // this.selectAllHospDept()
      });
    },
    // 设置为可登录pc端
    setLoginPC(val){
      this.$confirm("确定要设为PC管理端可登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          setLinkUser({
            uid:val.uid,
            linkId:this.linkId,
            userType:2
          }).then(response => {
            this.selectAllDeptUserAuth(this.departdetail.id)
            this.$message({
              type: "success",
              message: "设置成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消设置"
          });
        });

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
      this.gethospDeptList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.gethospDeptList()
    },
    // edit 编辑
    edit(row) {
      this.dialogAddFormVisible = true;
      this.title = '编辑科室'
      this.form = {
        hospId:row.hospId,
        id:row.id,
        remark:row.remark,
        deptName:row.deptName,
        deptInfo:row.deptInfo,
        // hospCode:row.hospCode,
        clinicInfo:row.clinicInfo,
        roomInfo:row.roomInfo,
        // memSize:row.memSize,
        // memUsed:row.memUsed
      }
    },
    // 提交编辑
    submitedit(){
      if(this.title === '新增科室'){
        createHospDept(this.form).then(response => {
          this.dialogAddFormVisible = false;
          this.gethospDeptList()
          this.$message({
            type: "success",
            message: "新增成功!"
          });
        });
      }else if(this.title === '编辑科室'){
        updateHospDept(this.form).then(response => {
          this.dialogAddFormVisible = false;
          this.gethospDeptList()
          this.$message({
            type: "success",
            message: "编辑成功!"
          });
        });
      }

    },
    add(){
      this.dialogAddFormVisible = true;
      this.title = '新增科室'
      this.form = {
        hospId:'',
        remark:'',
        deptName:'',
        deptInfo:'',
        // hospCode:'',
        clinicInfo:'',
        roomInfo:'',
        // memSize:'',
        // memUsed:'',
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    // 单条删除
    deletedepartlist(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteHospDeptById({
            id:val
          }).then(response => {
            this.gethospDeptList()
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
