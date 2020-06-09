<template>
<!--
  1、搜索条件已变更，根据评论类型，名称出现不同的提示
  2、搜索条件变更需要重新调试列表接口 **
  3、评论类型接口500

   查询回复列表
	"list": [{
		"id": 6,
		"remark": "vdfvfdsvdv",  //回复内容
		"mongoId": "0c02fa31a80f4b7f8ee3530c8ccae03b"
		"replyTime":   //回复时间
	}]
}

删除 回复内容
sss/order/aftersale/deleteReply?mongoId=0c02fa31a80f4b7f8ee3530c8ccae03b

 -->
  <div class="everypage">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" :inline="true" label-width="75px">
          <el-form-item label="评论类型" prop="dictValue">
            <el-select v-model="ruleForm.dictValue" @change="changepllx" placeholder="请选择" size="mini">
              <el-option
                :label="type.dictName"
                :key="type.typeOptions"
                v-for="type in typeOptions"
                :value="type.dictValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='名称' prop="paramName">
            <el-input v-model="ruleForm.paramName" size="mini" clearable :placeholder="pllxplaceholder" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="searchaftersaleListOrder">搜索</el-button>
            <el-button @click="resetForm('ruleForm')" icon="el-icon-refresh" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 列表表格 -->
    <!-- <table-service :loading="loading" :table-data="createListData" /> -->
    <div class="tablemain">
      <el-button type="primary" icon="el-icon-delete" class="tabledeletebtn" @click="deleteallserve" size="mini">批量删除订单</el-button>
      <el-table
        class="tablecss"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="45"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" min-width="52" align="center"></el-table-column>

        <el-table-column prop="nickname" label="昵称" min-width="52" align="center"></el-table-column>
        <el-table-column prop="account" label="用户账号" min-width="70" align="center"></el-table-column>
        <el-table-column prop="serviceScore" label="评价分数" width="160" align="center">
          <template slot-scope="scope">
            <el-rate
              v-model="scope.row.serviceScore"
              disabled
              text-color="#ff9900"
              >
            </el-rate>
          </template>

        </el-table-column>
        <el-table-column prop="serviceName" label="评论对象" min-width="52" align="center"></el-table-column>
        <el-table-column prop="addTime" label="评价时间" min-width="100" align="center"></el-table-column>
        <el-table-column prop="state" label="状态" min-width="52" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.state | capitalizestate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" min-width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="seedetail(scope.row)"  size="mini">查看</el-button>
            <el-button type="text" icon="el-icon-chat-line-round" @click="OrderRemark(scope.row)" size="mini">回复</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteservelist(scope.row.orderId)" size="mini">删除</el-button>
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
    <el-dialog title="评论详情" :visible.sync="dialogVisible" width="60%">
      <div>
        <div class="twocolumn">
          <p>评论详情</p>
          <div class="twocolumnlist">
            <div>
              <p>用户姓名：{{typeObj.realName}}</p>
              <p>昵称：{{typeObj.nickname}}</p>
            </div>
            <div>
              <p>评价分数：{{typeObj.serviceScore}}</p>
              <p>印象：{{typeObj.commentTag}}</p>
            </div>
            <div>
              <p>评论对象：{{typeObj.serviceName}}</p>
              <p>状态：{{typeObj.state | capitalizestate}}</p>
            </div>
            <div>
              <p>评价时间：{{typeObj.addTime}}</p>
              <p>评价内容：{{typeObj.comment}}</p>
            </div>
            <div>
              <p style="display:flex">
                <span>评价图片：</span>
                <img v-if="typeObj.pics" :src="typeObj.pics" style="width:200px;height:200px;object-fit: scale-down;">
                <span v-if="!typeObj.pics">暂无</span>
              </p>
            </div>
          </div>
        </div>
        <div class="twocolumn">
          <p>回复列表</p>
          <div class="">
            <el-table
              class="tablecss"
              ref="multipleTable"
              v-loading="loading1"
              :data="tableData1">
              <el-table-column prop="remark" label="回复内容" min-width="52" align="center"></el-table-column>
              <el-table-column prop="replyTime" label="回复时间" min-width="52" align="center"></el-table-column>
              <el-table-column prop="" label="操作" width="90" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="deletereply(scope.row)" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 订单备注弹窗 -->
    <el-dialog title="回复" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="回复信息">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入回复信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrderRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getaftersaleList,
  updateAftersaleRemark,
  delaftersaleOrderId,
  getListType,
  getSaleInfoDetail,
  deleteReply
} from "@/api/order/aftersale";
export default {
  data() {
    return {
      dialogVisible:false,
      typeOptions:[], //评价类型
      typeObj:{},//查看详情数据
      pllxplaceholder:'医生名称', //评论类型改变
      total: 1,
      currentPage: 1,
      pagesize: 10,
      ids: [],
      tableData: [],
      loading: false,
      dialogFormVisible: false,
      ruleForm: {
        dictValue: '0',
        paramName: ""
      },
      dictValue:'0',//点击查看缓存的值
      form: {
        remark: ""
      },
      id:'',// 回复的时候暂存的id

      tableData1:[{}],// 详情里面的回复列表
      loading1:false,
      detailobj:{} // 详情数据
    };
  },
  filters: {
    capitalizestate: function(value) {
      if (value == 0) {
        return "未回复";
      } else if (value == 1) {
        return "已回复";
      }
    }
  },
  created() {

    this.getListType() //服务类型
  },
  methods: {
    // 删除回复列表
    deletereply(row){
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteReply({
            mongoId:row.mongoId
          }).then(response => {
            this.seedetail(this.detailobj);
            this.$message({
              type: "success",
              message: "删除成功!"
            })
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      
    },
    //服务类型
    getListType(){
      getListType().then(response => {
        this.typeOptions = response.data.list
        this.getaftersaleList(); //列表
      });
    },
    // 查看弹窗接口
    seedetail(row){
      this.detailobj = row
      this.dialogVisible = true
       getSaleInfoDetail({
         id:row.id,
         dictValue:this.dictValue
       }).then(response => {
        this.typeObj = response.data
        this.tableData1 = response.data.list
      });
    },
    changepllx(val){
      switch(val){
        case '0':
            this.pllxplaceholder = '医生名称';
            break;//结束整个switch语句
        case '1':
            this.pllxplaceholder = '文章标题';
            break;
        case '2':
            this.pllxplaceholder = '科室名称';
            break;
        case '3':
            this.pllxplaceholder = '医院名称';
            break;
        case '4':
            this.pllxplaceholder = '主导医生名称';
            break;
        default:
            this.pllxplaceholder = '医生名称';
            break;
    }
    },
    //搜索按钮
    searchaftersaleListOrder() {
      this.currentPage = 1;
      this.getaftersaleList();
      this.dictValue = this.ruleForm.dictValue
    },
    // 列表
    getaftersaleList() {
      this.loading = true;
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        dictValue: this.ruleForm.dictValue,
        paramName: this.ruleForm.paramName
      };
      getaftersaleList(params).then(response => {
        this.loading = false;
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // 点击订单备注
    OrderRemark(val) {
      this.dialogFormVisible = true;
      this.id = val.id;
      this.form.remark = ''
    },
    // 提交更新备注信息
    updateOrderRemark() {
      updateAftersaleRemark({
        id: this.id,
        remark: this.form.remark
      }).then(response => {
        this.dialogFormVisible = false;
        this.getaftersaleList();
        this.$message({
          type: "success",
          message: "回复成功!"
        });
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pllxplaceholder = '医生名称';
    },
    // 第几页改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.getaftersaleList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getaftersaleList();
    },
    // 全选
    handleSelectionChange(val) {
      this.ids = val.map(item => item.orderId);
    },
    // 单条删除
    deleteservelist(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delaftersaleOrderId(val).then(response => {
            this.getaftersaleList();
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
    },
    // 批量删除
    deleteallserve() {
      this.$confirm("此操作将永久删除这些文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.ids && this.ids.length) {
            delaftersaleOrderId(this.ids.join(",")).then(response => {
              this.getaftersaleList();
              this.$message({
                type: "success",
                message: "批量删除成功!"
              });
            });
          } else {
            this.$message({
              message: "请先选中要删除的列表数据",
              type: "warning"
            });
          }
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
