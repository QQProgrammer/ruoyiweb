<template>
<!--
  请求接口地址
    搜索条件  storeName 类型 1服务项目；2平台礼物
    /system/product/list?pageNum=1&pageSize=10&storeName=&storeType=

  返回值 （详情 直接从列表带入，新增和编辑 字段相同）
  新增  /system/product/addProduct
  post请求（storeName，keyword，storeInfo，image，useIntegral，storeType，maxIntegral，gainInteral，price，vipPrice）
  新增  /system/product/updateStoreProduct  post请求


  {
  //礼物图片
	"image": "http://kaifa.crmeb.net/uploads/attach/2020/03/20200319/2905acfd6dc8a708629e9e7462294cf6.png",
	 添加时间
	"addTime": "2020-03-19 16:12:50",
	"useIntegral": 1,  是否可以积分购买 0 不可以 ；1可以
	"storeType": 0, 1服务项目；2平台礼物
	"maxIntegral": 0,  应用积分的最大值 0标识不限制
	"gainInteral": 0, 消费获取的积分
	"price": 0.00, 价格
	"vipPrice": 0.00, 会员价格
	"storeName": "会诊", 礼物名称
	"id": 1, 主键
	"storeInfo": "专家会诊服务",  简介
	"keyword": "专家会诊服务" 关键字
}],
	"code": 200,
	"msg": 0
}


 -->
  <div class="everypage column">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :inline="true" label-width="75px">
          <el-form-item label="产品名称:" prop="storeName">
            <el-input v-model="ruleForm.storeName" size="mini" clearable placeholder="请输入" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item label="产品类型" prop="storeType">
            <el-select v-model="ruleForm.storeType" size="mini" clearable placeholder="请选择">
              <el-option label="服务项目" value="1"></el-option>
              <el-option label="平台礼物" value="2"></el-option>
            </el-select>
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
      <el-button type="primary" icon="el-icon-plus" class="tabledeletebtn" @click="add" size="mini">新增产品</el-button>
      <el-table
        class="tablecss"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="storeName" label="产品名称" min-width="52" align="center"></el-table-column>
        <el-table-column prop="store_type" label="产品类型" min-width="52" align="center">
           <template slot-scope="scope">
            <span>{{scope.row.store_type | capitalizestoreType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" min-width="52" align="center"></el-table-column>
        <el-table-column prop="useIntegral" label="是否可以积分兑换" min-width="52" align="center">
           <template slot-scope="scope">
            <span>{{scope.row.useIntegral | capitalizeuseIntegral }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="useIntegral" label="是否可以积分兑换" min-width="52" align="center"></el-table-column>
          <template slot-scope="scope">
            <span>{{scope.row.useIntegral | capitalizeuseIntegral }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="maxIntegral" label="兑换应用最大积分" min-width="52" align="center">
           <template slot-scope="scope">
            <span>{{scope.row.maxIntegral==0?'不限制': scope.row.maxIntegral}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="keyword" label="关键词" min-width="52" align="center"></el-table-column>
        
        <el-table-column prop="addTime" label="创建时间" min-width="52" align="center"></el-table-column>
        <el-table-column prop="" label="操作" min-width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="hospitalDetail(scope.row)" size="mini">查看详情</el-button>
            <el-button type="text" icon="el-icon-edit" @click="edit(scope.row)" size="mini">编辑</el-button>
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

      <el-form :model="form"  :rules="rules" ref="form"label-width="140px">
        <el-form-item label="产品名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="form.keyword" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="storeInfo">
          <el-input v-model="form.storeInfo" type="textarea" :rows="2" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="是否可以积分兑换" prop="useIntegral">
          <el-select v-model="form.useIntegral" size="mini" clearable placeholder="请选择">
            <el-option label="不可以" :value="0"></el-option>
            <el-option label="可以" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型" prop="storeType">
          <el-select v-model="form.storeType" size="mini" clearable placeholder="请选择">
            <el-option label="服务项目" :value="1"></el-option>
            <el-option label="平台礼物" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兑换应用最大积分" prop="maxIntegral">
          <el-input v-model="form.maxIntegral" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="消费获取的积分" prop="gainInteral">
          <el-input v-model="form.gainInteral" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="会员价格" prop="vipPrice">
          <el-input v-model="form.vipPrice" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="礼物图片" prop="image">
          <el-upload class="avatar-uploader" action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :http-request="requestUpload">
            <img v-if="form.image" :src="form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitedit('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情弹窗 -->
    <el-dialog title="礼物详情" :visible.sync="dialogVisible" width="60%">
      <div>
        <div class="twocolumn">
          <p>礼物详情</p>
          <div class="twocolumnlist">
            <div>
              <p>是否可以积分购买：{{hospitaldetail.useIntegral | capitalizeuseIntegral}}</p>
              <p>礼物类型：{{hospitaldetail.store_type | capitalizestoreType}}</p>
            </div>
            <div>
              <p>应用积分的最大值：{{hospitaldetail.maxIntegral==0?'不限制':hospitaldetail.maxIntegral}}</p>
              <p>消费获取的积分：{{hospitaldetail.gainInteral}}</p>
            </div>
            <div>
              <p>价格：{{hospitaldetail.price }}</p>
              <p>会员价格：{{hospitaldetail.vipPrice }}</p>
            </div>
            <div>
              <p>礼物名称：{{hospitaldetail.storeName}}</p>
              <p>简介：{{hospitaldetail.storeInfo }}</p>
            </div>
            <div>
              <p>创建时间：{{hospitaldetail.addTime}}</p>
              <p>关键字：{{hospitaldetail.keyword}}</p>
            </div>

            
            <div>
              <p style="display:flex">
                <span>礼物图片：</span>
                <img v-if="hospitaldetail.image" :src="hospitaldetail.image" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!hospitaldetail.image" >暂无</span>
              </p>
            </div>
          </div>
        </div>
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
  getproductList,
  deldeleteHospInfoById,
  updateStoreProduct,
  addProduct,
  uploadImg
 } from "@/api/order/giftmanagement";
 import { getDoctorInfo } from "@/api/consultation/consultationmanagement";
export default {
  data() {
    return {
      dialogVisible2:false,
      doctorInfoObj:{},// 团队详情里面的列表查看数据
      rules: {
        storeName: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        storeInfo:[
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        keyword:[
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        useIntegral: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        storeType: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        maxIntegral:[
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        gainInteral:[
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        price:[
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        vipPrice:[
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        image: [
          { required: true, message: "礼物图片不能为空", trigger: "blur" }
        ],
        
      },

      ruleForm: {
        storeName:"",
        storeType: "1",

      },
      // 新增编辑字段
      form: {
        storeName:'',
        keyword:'',
        storeInfo:'',
        image:'',
        useIntegral:'',
        storeType:'',
        maxIntegral:'',
        gainInteral:'',
        price:'',
        vipPrice:''
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
      title:'新增礼物',
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
      
      form1: {
        remark: ""
      },
      
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
    capitalizeuseIntegral:function(value){
       if (value == 0) {
        return "不可以"
      } else if (value == 1) {
        return "可以"
      }
    },
    capitalizestoreType:function(value){
      if (value == 1) {
        return "服务项目";
      } else if (value == 2) {
        return "平台礼物";
      }
    },
  },
  created() {
    this.getproductList()
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
          this.form.image = response.imgUrl;
        } else {
          this.msgError(response.msg);
        }
      });
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
    // 关联管理员 根据用户账号弹窗搜索
    searchform2(){
      this.sousuo = 1
      this.administrator(this.hospInfoList)
    },
    // 导出
    handleExport(){

    },
     // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchhospital() {
      this.currentPage = 1
      this.getproductList()
    },
    // 列表
    getproductList() {
       this.loading = true
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        storeName: this.ruleForm.storeName,
        storeType: this.ruleForm.storeType,
      };
      getproductList(params).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // 订单详情
    hospitalDetail(row) {
      this.hospitaldetail = row
      this.dialogVisible = true;
    },
    // 列表切换分页
    handleSizeChange(val) {
      this.pagesize = val
      this.getproductList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getproductList()
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
    // 选中表格复选框
    handleSelectionChange(val) {
      this.ids = val.map(item => item.orderId)
    },
    // edit 编辑
    edit(row) {
      this.dialogAddFormVisible = true;
      this.title = '编辑礼物'
      this.form = {
        storeName:row.storeName,
        keyword:row.keyword,
        storeInfo:row.storeInfo,
        image:row.image,
        useIntegral:row.useIntegral,
        storeType:row.store_type,
        maxIntegral:row.maxIntegral,
        gainInteral:row.gainInteral,
        price:row.price,
        vipPrice:row.vipPrice
      }
    },
    // 提交编辑
    submitedit(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          if(this.title === '新增礼物'){
            addProduct(this.form).then(response => {
              this.dialogAddFormVisible = false;
              this.getproductList()
              this.$message({
                type: "success",
                message: "新增成功!"
              });
            });
          }else if(this.title === '编辑礼物'){
            updateStoreProduct(this.form).then(response => {
              this.dialogAddFormVisible = false;
              this.getproductList()
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
      this.title = '新增礼物'
      // this.$refs['form'].resetFields();
      this.form = {
        storeName:'',
        keyword:'',
        storeInfo:'',
        image:'',
        useIntegral:'',
        storeType:'',
        maxIntegral:'',
        gainInteral:'',
        price:'',
        vipPrice:''
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
            this.getproductList()
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
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
