<template>
<!--
  1、设为管理员，取消管理员接口 (已出)
  2、添加管理员弹窗的查看医生详情接口（已出）
  3、添加管理员弹窗列表里面的是否为管理员的标识未给（已出）
 -->
  <div class="everypage column">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :inline="true" label-width="75px">
          <el-form-item label="医院名称:" prop="hospName">
            <el-input v-model="ruleForm.hospName" size="mini" clearable placeholder="请输入" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchhospital">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('ruleForm')" size="mini">重置</el-button>
            <el-button type="warning" icon="el-icon-download" @click="handleExport" size="mini">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 列表表格 -->
    <div class="tablemain">
      <!-- <el-button type="primary" class="tabledeletebtn" size="mini">批量删除订单</el-button> -->
      <el-button type="primary" icon="el-icon-plus" class="tabledeletebtn" @click="add" size="mini">新增医院</el-button>
      <el-table
        class="tablecss"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column label="医院编码" min-width="50" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="hospName" label="医院名称" min-width="52" align="center"></el-table-column>
        <el-table-column prop="hospAlias" label="医院别称" min-width="52" align="center"></el-table-column>
        <el-table-column prop="cityName" label="所在城市" min-width="52" align="center"></el-table-column>
        <el-table-column prop="hospType" label="医院类型" min-width="52" align="center">
           <!-- <template slot-scope="scope">
            <span>{{scope.row.hospType | capitalizehospType }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="hospGrade" label="医院等级" min-width="52" align="center">
           <!-- <template slot-scope="scope">
            <span>{{scope.row.hospGrade | capitalizehospGrade }}</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="hospInfoAdminUserID" label="管理员" min-width="60" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.hospInfoAdminUserID}}
              <span v-if="scope.row.hospInfoAdminUserID&&scope.row.hospInfoAdminUserRealName">/</span>
              {{scope.row.hospInfoAdminUserRealName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="创建时间" min-width="52" align="center"></el-table-column>
        <el-table-column prop="" label="操作" min-width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="hospitalDetail(scope.row)" size="mini">医院详情</el-button>
            <el-button type="text" icon="el-icon-edit" @click="edit(scope.row)" size="mini">编辑</el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="hospitalRemark(scope.row)" size="mini">医院备注</el-button>
            <el-button type="text" icon="el-icon-circle-plus-outline" @click="administrator(scope.row)" size="mini">添加管理员</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deletehospitallist(scope.row.id)" size="mini">删除</el-button>
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
    <!-- 新增用户 -->
    <el-dialog :title="title" class="ruleselform" :visible.sync="dialogAddFormVisible">
      <el-form :model="form"  :rules="rules" ref="form"label-width="85px">
        <el-form-item label="医院名称" prop="hospName">
          <el-input v-model="form.hospName"  placeholder="请输入"></el-input>
          <!-- <el-select v-model="form.hospName" @change='changeHospInfo' clearable placeholder="请选择">
            <el-option
              v-for="item in selectAllHospInfoArr"
              :key="item.id"
              :label="item.hospName"
              :value="item.hospName">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="特色科室" prop="depts">
          <el-input v-model="form.depts"  placeholder="多个科室用','隔开"></el-input>
          <!-- <el-select v-model="form.depts" clearable placeholder="请选择">
            <el-option
              v-for="item in selectAllHospDeptArr"
              :key="item.id"
              :label="item.deptName"
              :value="item.deptName">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="医院别称" prop="hospAlias">
          <el-input v-model="form.hospAlias" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院类型" prop="hospType">
          <!-- <el-input v-model="form.hospType" ></el-input> -->
           <el-select v-model="form.hospType" placeholder="请选择">
              <el-option
              :label="item.dictName"
              :value="item.dictValue"
              v-for="item in hospTypeArr"
              :key="item.dictValue"/>
            </el-select>
        </el-form-item>
        <el-form-item label="医院等级" prop="hospGrade">
          <!-- <el-input v-model="form.hospGrade" ></el-input> -->
          <el-select v-model="form.hospGrade" placeholder="请选择">
              <el-option
              :label="item.dictName"
              :value="item.dictValue"
              v-for="item in hospGradeArr"
              :key="item.dictValue"/>
            </el-select>
          </el-select>
        </el-form-item>
        <el-form-item label="省份" prop="provinceId">
           <el-select v-model="form.provinceId" @change="changeprovince" placeholder="请选择">
              <el-option
              :label="item.name"
              :value="item.cityId"
              v-for="item in provinceArr"
              :key="item.cityId"/>
            </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="cityId">
          <el-select v-model="form.cityId" placeholder="请选择">
              <el-option
              :label="item.name"
              :value="item.cityId"
              v-for="item in cityArr"
              :key="item.cityId"/>
            </el-select>
          </el-select>
        </el-form-item>
        <el-form-item label="医院简介" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" :rows="2"  placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="乘车路线" prop="route">
          <el-input v-model="form.route" type="textarea" :rows="2" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" type="textarea" :rows="2" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院图片" prop="hospImg">
          <el-upload class="avatar-uploader" action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="requestUpload">
            <img v-if="hospImgArr" v-for="(item,index) in hospImgArr" :src="item" :key="index" class="avatar">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="上传图片">
          <el-upload
            action="http://122.51.173.208:9999/system/user/profile/avatar"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            name='avatarfile'
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
      </el-form-item> -->
      </el-form>
      
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitedit('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情弹窗 -->
    <el-dialog title="医院详情" :visible.sync="dialogVisible" width="60%">
      <div>
        <div class="twocolumn">
          <p>医院详情</p>
          <div class="twocolumnlist">
            <div>
              <p>医院编码：{{hospitaldetail.id}}</p>
              <p>医院名称：{{hospitaldetail.hospName}}</p>
            </div>
            <div>
              <p>医院别称：{{hospitaldetail.hospAlias}}</p>
              <p>所在城市：{{hospitaldetail.cityName}}</p>
            </div>
            <div>
              <p>医院类型：{{hospitaldetail.hospType }}</p>
              <p>医院等级：{{hospitaldetail.hospGrade }}</p>
            </div>
            <div>
              <p>账户管理员：{{hospitaldetail.hospInfoAdminUserRealName}}</p>
              <p>状态：{{hospitaldetail.isDel | capitalizeisDel}}</p>
            </div>
            <div>
              <p>创建时间：{{hospitaldetail.addTime}}</p>
              <p>最后一次更新时间：{{hospitaldetail.updTime}}</p>
            </div>

            <div>
              <p>创建人：{{hospitaldetail.addUser}}</p>
              <p>最后修改人：{{hospitaldetail.updUser}}</p>
            </div>
            <div>
              <p>乘车路线：{{hospitaldetail.route}}</p>
              <p>医院网站地址：{{hospitaldetail.hospUrl}}</p>
            </div>
            <div>
              <p>医院简介：{{hospitaldetail.introduction}}</p>
            </div>
            <div>
              <p>医院地址：{{hospitaldetail.address}}</p>
            </div>
            <div>
              <p v-if="hospitaldetail.hospImg" style="display:flex">
                <span>医院图片：</span>
                <img :src="item" v-for="(item,index) in hospitaldetail.hospImg.split(',')" :key="index" style="width:200px;height:200px;object-fit: scale-down;">
              </p>
            </div>
          </div>
        </div>
        <div class="twocolumn">
          <p>医院备注</p>
          <div class="twocolumnlist">
            <div>
              <p>医院备注：{{hospitaldetail.remark}}</p>
            </div>
          </div>
        </div>
        <div class="twocolumn">
          <p>科室列表</p>
          <p>科室：{{keshiArr.join(',')}}</p>
        </div>
      </div>
    </el-dialog>
    <!-- 关联管理员列表 -->
    <el-dialog title="医护列表" :visible.sync="dialogVisible1" width="75%">
      <div>
        <div class="twocolumn">
          <p>医护列表</p>
          <el-form ref="form2" :model="form2" label-width="75px" :inline="true">
            <el-form-item label="用户账号:" prop="account">
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
              v-loading="loading1"
              :data="tableData1">
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
              @size-change="handleSizeChange1"
              @current-change="handleCurrentChange1"
              :current-page="currentPage1"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pagesize1"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total1"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
     <!-- 关联管理弹窗列表里面的查看弹窗 -->
    <el-dialog title="医生详情" :visible.sync="dialogVisible2" width="60%">
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
              <p>认证状态：{{doctorInfoObj.authStatus | capitalizeauthStatus1}}</p>
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
        <el-button type="primary" @click="updateHospInfoRemark">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 图片点击放大 -->
    <el-dialog :visible.sync="dialogVisible3">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import {
  gethospInfoList,
  deldeleteHospInfoById,
  updateHospInfo,
  createHospInfo,
  updateHospInfoRemark,
  updatesetLinkUser,
  selectAllHospInfo,
  selectAllHospDept,
  appUserList,
  cancleManager,
  getHosType,
  getHosGreate,
  getListCity,
  getListProvince
 } from "@/api/hospital/hospitalmanagement";
 import { getDoctorInfo } from "@/api/consultation/consultationmanagement";
 import { uploadImg } from "@/api/order/giftmanagement";
export default {
  data() {
    return {
      form2:{
        account:'', //关联管理员搜索
      },
      dialogVisible2:false,
      doctorInfoObj:{},// 团队详情里面的列表查看数据
      rules: {
        hospName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        depts: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
         hospType: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        hospGrade: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
         provinceId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        cityId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        hospImg: [
          { required: true, message: "医院图片不能为空", trigger: "blur" }
        ],
        
      },
      // 上传图片
      avatarfile:[],
      dialogVisible3:false,
      dialogImageUrl: '',



      currentPage: 1,
      pagesize: 10,
      total: 1,
      tableData: [],
      hospitaldetail:{},
      selectAllHospInfoArr:[], //医院列表
      selectAllHospDeptArr:[], //科室列表
      title:'新增医院',
      ids:[],
      id:'',

      dialogVisible1: false,
      loading1: false,
      currentPage1: 1,
      pagesize1: 10,
      total1: 1,
      tableData1: [],
      hospInfoList:{},
      linkId:'',


      dialogVisible: false,
      loading: false,
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      ruleForm: {
        hospName: "",

      },
      form1: {
        remark: ""
      },
      // 新增编辑字段
      form: {
        hospName:'',
        depts:'',
        hospAlias:'',
        hospType:'',
        hospGrade:'',
        introduction:'',
        route:'',
        address:'',
        provinceId:'',
        cityId:'',
        hospImg:''
      },
      hospImgArr:[],


      hospGradeArr:[], //医院等级下拉
      hospTypeArr:[], //医院类型下拉
      keshiArr:[], //科室
      cityArr:[],//城市下拉
      provinceArr:[],//省份下拉


      sousuo:0,//关联管理员搜索

      multipleSelection: []
      // createListData: [{}]
    };
  },
  filters: {
    capitalizeisDel: function(value) {
      if (value == 0) {
        return "删除";
      } else if (value == 1) {
        return "有效";
      }
    },
    capitalizeauthStatus1:function(value){
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
    capitalizehospType:function(value){
       if (value == 1) {
        return "骨科医院";
      } else if (value == 2) {
        return "妇产科医院";
      } else if (value == 3) {
        return "老年人医院";
      }
    },
    capitalizehospGrade:function(value){
      if (value == 1) {
        return "二级甲等";
      } else if (value == 2) {
        return "三级甲等";
      }
    },
  },
  created() {
    this.gethospInfoList()
    // this.selectAllHospInfo()//医院下拉列表
    this.getHosGreate()
    this.getHosType()
    this.getListProvince()
  },
  methods: {
    //上传图片
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 覆盖默认的上传行为
    requestUpload (file) {
      let formData = new FormData();
      formData.append("avatarfile", file.file);
      uploadImg(formData).then(response => {
        if (response.code === 200) {
          this.hospImgArr.push(response.imgUrl)
          this.form.hospImg = this.hospImgArr.join(',')
          console.log(this.hospImgArr)
        } else {
          this.msgError(response.msg);
        }
      });
    },
    // 查询省下拉
    getListProvince(){
      getListProvince().then(res => {
        this.provinceArr = res.data
      })
    },
    // 省份改变
    changeprovince(id){
      this.getListCity(id)
    },
    // 查询城市下拉
    getListCity(id){
      getListCity({
        cityId:id
      }).then(res => {
        this.cityArr = res.data
        
      })
    },
    // 图片上传相关
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 点击放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible3 = true;
    },
    // 关联管理员里面的查看
    seedetailtdxq(row){
      this.dialogVisible2 = true
      getDoctorInfo({
        uid:row.uid
        // uid:2
      }).then(res => {
        this.doctorInfoObj = res.data
      })
    },
    // 关联管理员 根据用户账号弹窗搜索
    searchform2(){
      this.sousuo = 1
      this.administrator(this.hospInfoList)
    },
    // 导出
    handleExport(){

    },
    // 医院类型接口下拉列表
    getHosType(){
      getHosType().then(response => {
        this.hospTypeArr = response.data
      });
    },
    // 医院等级接口下拉列表
    getHosGreate(){
      getHosGreate().then(response => {
        this.hospGradeArr = response.data
      });
    },
     // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 关联管理员列表
    administrator(row){
      this.linkId = row.id
      this.hospInfoList = row
      this.dialogVisible1 = true
      this.loading1 = true
      var params1 = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        linkId:row.id
      };
      if(this.sousuo === 1){
        params1.account = this.form2.account
      }
      appUserList(params1).then(response => {
        this.loading1 = false
        this.tableData1 = response.rows;
        this.total1 = response.total;
      });
    },
    // 取消管理员
    cancelAdministrator(val){
      this.$confirm("确定要取消管理员吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cancleManager({
            uid:val.uid,
            linkId:this.linkId,
            linkType:1
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
            linkType:1
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
    searchhospital() {
      this.currentPage = 1
      this.gethospInfoList()
    },
    // 列表
    gethospInfoList() {
       this.loading = true
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        hospName: this.ruleForm.hospName,
      };
      gethospInfoList(params).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // // 医院列表
    // selectAllHospInfo(){
    //   selectAllHospInfo().then(response => {
    //     this.selectAllHospInfoArr = response.data
    //     // this.selectAllHospDept()
    //   });
    // },
    // // 医院下拉改变
    // changeHospInfo(val){
    //   this.selectAllHospDept(val)
    // },
    // 科室下拉
    selectAllHospDept(val){
      selectAllHospDept({
        hospId:val
      }).then(response => {
        this.selectAllHospDeptArr = response.data
        this.keshiArr = []
        response.data.forEach(element => {
          this.keshiArr.push(element.deptName)
        });
      });
    },
    // 订单详情
    hospitalDetail(row) {
      this.hospitaldetail = row
      this.dialogVisible = true;
      this.selectAllHospDept(row.id)
    },
    // 列表切换分页
    handleSizeChange(val) {
      this.pagesize = val
      this.gethospInfoList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.gethospInfoList()
    },
    // 管理员列表分页
    handleSizeChange1(val) {
      this.pagesize1 = val
      this.administrator(this.hospInfoList)
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val
      this.administrator(this.hospInfoList)
    },
     // 点击订单备注
    hospitalRemark(val) {
      this.dialogFormVisible = true;
      this.id = val.id;
      this.form1.remark = val.remark
    },
    // 提交更新备注信息
    updateHospInfoRemark() {
      updateHospInfoRemark({
        id: this.id,
        remark: this.form1.remark
      }).then(response => {
        this.dialogFormVisible = false;
        this.gethospInfoList()
        this.$message({
          type: "success",
          message: "备注成功!"
        });
      });
    },
    // 选中表格复选框
    handleSelectionChange(val) {
      this.ids = val.map(item => item.orderId)
    },
    // edit 编辑
    edit(row) {
      this.dialogAddFormVisible = true;
      this.title = '编辑医院'
      this.getListCity(row.provinceId)
      this.hospImgArr = row.hospImg.split(',')
      // hospImg:this.hospImgArr.join(',')
      this.form = {
        id:row.id,
        hospName:row.hospName,
        depts:row.depts,
        hospAlias:row.hospAlias,
        hospType:row.hospType.toString(),
        hospGrade:row.hospGrade.toString(),
        introduction:row.introduction,
        route:row.route,
        address:row.address,
        provinceId:row.provinceId,
        cityId:row.cityId,
        hospImg:row.hospImg
      }
    },
    // 提交编辑
    submitedit(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          if(this.title === '新增医院'){
            createHospInfo(this.form).then(response => {
              this.dialogAddFormVisible = false;
              this.gethospInfoList()
              this.$message({
                type: "success",
                message: "新增成功!"
              });
            });
          }else if(this.title === '编辑医院'){
            updateHospInfo(this.form).then(response => {
              this.dialogAddFormVisible = false;
              this.gethospInfoList()
              this.$message({
                type: "success",
                message: "编辑成功!"
              });
            });
          }
        }
      });
      

    },
    add(){
      this.dialogAddFormVisible = true;
      this.title = '新增医院'
      // this.$refs['form'].resetFields();
      this.form = {
        hospName:'',
        depts:'',
        hospAlias:'',
        hospType:'',
        hospGrade:'',
        introduction:'',
        route:'',
        address:'',
        provinceId:'',
        cityId:'',
        hospImg:this.hospImgArr.join(',')
      }

    },
    // 单条删除
    deletehospitallist(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deldeleteHospInfoById({
            id:val
          }).then(response => {
            this.gethospInfoList()
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
.ruleselform{
  .el-form-item{
    margin-bottom: 22px;
  }
}
</style>
<style lang="scss">
.column {
  label {
    font-weight: inherit;
  }
  .avatar-uploader .el-upload {
    // border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-align: left;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    margin: 10px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    margin: 10px;
    float: left;
    // // display: block;
  }
}
</style>