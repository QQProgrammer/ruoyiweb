<template>
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
          <el-form-item label label="科室筛选" prop="deptId">
            <el-select v-model="ruleForm.deptId" size="mini" clearable placeholder="请选择">
            <el-option
              v-for="item in selectAllHospDeptArr"
              :key="item.id"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchcloudlist">搜索</el-button>
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
        <!-- <el-table-column type="selection" width="28" align="center"></el-table-column> -->
        <!-- <el-table-column label="科室编码" min-width="50" align="center">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column> -->
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
        <el-table-column prop="memUsed" label="云盘空间" min-width="52" align="center"></el-table-column>
        <el-table-column prop="memSize" label="已使用云盘空间" min-width="70" align="center"></el-table-column>
        <!-- <el-table-column prop="address" label="状态" min-width="52" align="center"></el-table-column> -->
        <el-table-column prop="addTime" label="创建时间" min-width="52" align="center"></el-table-column>

        <el-table-column prop="" label="操作" min-width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-notebook-2" @click="upgraderecord(scope.row)" size="mini">云盘升级记录</el-button>
            <el-button type="text" icon="el-icon-view" @click="seedetail(scope.row)" size="mini">查看</el-button>
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
    <el-dialog title="云盘升级记录" :visible.sync="dialogVisible" width="70%">
      <div class="tablemain">
        <el-table
          class="tablecss"
          ref="multipleTable"
          v-loading="loading1"
          :data="tableData1"
        >
        <el-table-column prop="orderId" label="订单编号" width="74" align="center"></el-table-column>
          <el-table-column prop="deptName" label="科室名称" width="74" align="center"></el-table-column>
          <el-table-column prop="realName" label="购买用户" width="74" align="center"></el-table-column>
          <el-table-column prop="paidMemSize" label="购买的内存空间大小" min-width="76" align="center"></el-table-column>
          <el-table-column prop="addTime" label="购买时间" min-width="65" align="center"></el-table-column>
          <el-table-column prop="hospName" label="医院名称" min-width="65" align="center"></el-table-column>
          <el-table-column prop="payPrice" label="支付金额" width="76" align="center"></el-table-column>
          <el-table-column prop="balanceMemSize" label="总共内存空间大小 " min-width="80" align="center"></el-table-column>
          <el-table-column prop="cash" label="使用的金钱" min-width="54" align="center"></el-table-column>
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
    </el-dialog>
     <!-- 查看弹窗 -->
    <el-dialog title="详情" :visible.sync="dialogVisible2" width="70%">
      <div class="tablemain">
        <el-table
          class="tablecss"
          ref="multipleTable"
          v-loading="loading2"
          :data="tableData2"
        >
        <el-table-column prop="folderDesc" label="文件夹描述"  align="center"></el-table-column>
          <el-table-column prop="filesType" label="附件类型" min-width="60" align="center"></el-table-column>
          <el-table-column prop="title" label="文件夹名称"  align="center"></el-table-column>
          <el-table-column prop="addTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="" label="操作" width="90" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="twoseedetail(scope.row)" icon="el-icon-view" size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 查看中的查看弹窗 -->
    <el-dialog title="详情" :visible.sync="dialogVisible3" width="70%">
      <div class="tablemain">
        <el-table
          class="tablecss"
          ref="multipleTable"
          v-loading="loading3"
          :data="tableData3"
        >
        <el-table-column prop="fileName" label="文件名字" align="center"></el-table-column>
          <el-table-column prop="filesType" label="文件类型" align="center"></el-table-column>
          <el-table-column prop="title" label="名称" align="center"></el-table-column>
          <el-table-column prop="originalUrl" label="附件地址" align="center"></el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column prop="fileDesc" label="文件描述"  align="center"></el-table-column>
          <el-table-column prop="filesSize" label="文件大小" align="center"></el-table-column>
          <el-table-column prop="addTime" label="创建时间" align="center"></el-table-column>
          <!-- <el-table-column prop="" label="操作" width="90" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="twoseedetail(scope.row)" icon="el-icon-view" size="mini">查看</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {selectAllHospInfo,selectAllHospDept} from "@/api/hospital/hospitalmanagement";
import {getcloudStorageList,DeptCloudStorageList,listFolder,listFolderFile} from "@/api/hospital/cloudmanagement";
export default {
  data() {
    return {
      currentPage: 1,
      pagesize: 10,
      total: 1,
      selectAllHospInfoArr:[], //医院列表
      selectAllHospDeptArr:[], //科室列表
      ruleForm: {
        hospId: "",
        deptId: ""
      },
      tableData: [],
      tableData1: [],
      loading: false,
      dialogVisible: false,
      total1: 1,
      currentPage1: 1,
      pagesize1: 10,
      loading1: false,

      // 查看
      loading2:false,
      tableData2: [],
      dialogVisible2: false,
      // 查看中的查看
      loading3:false,
      tableData3: [],
      dialogVisible3: false,




    };
  },
  created() {
    this.getcloudStorageList()
    this.selectAllHospInfo()//医院下拉列表
  },
  methods: {
    // 查看列表
    seedetail(row){
      this.loading2 = true
      this.dialogVisible2 = true
      listFolder({
        deptId:row.id,
        pageNum: 10000,
        pageSize: 1,
      }).then(response => {
        this.loading2 = false
        this.tableData2 = response.rows;
      });
    },
    // 查看中的查看列表
    twoseedetail(row){
      this.loading3 = true
      this.dialogVisible3 = true
      listFolderFile({
        folderId:row.id,
        pageNum: 10000,
        pageSize: 1,
      }).then(response => {
        this.loading3 = false
        this.tableData3 = response.rows;
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 云盘升级记录
    upgraderecord(row){
      this.loading1 = true
      this.dialogVisible = true
      DeptCloudStorageList({
        hospId:row.hospId,
        deptId:row.deptId,
        pageNum: this.currentPage1,
        pageSize: this.pagesize1,
      }).then(response => {
        this.loading1 = false
        this.tableData1 = response.rows;
        this.total1 = response.total;
      });

    },
    // 搜索
    searchcloudlist(){
      this.currentPage = 1
      this.getcloudStorageList()
    },
    // 表格列表
    getcloudStorageList(){
      this.loading = true
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        hospId: this.ruleForm.hospId,
        deptId: this.ruleForm.deptId,
      };
      getcloudStorageList(params).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });

    },
    // 医院列表
    selectAllHospInfo(){
      selectAllHospInfo().then(response => {
        this.selectAllHospInfoArr = response.data
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
      this.getcloudStorageList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getcloudStorageList()
    },
    // 切换分页
    handleSizeChange1(val){
      this.pagesize1 = val
      this.upgraderecord()
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val
      this.upgraderecord()
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
</style>
