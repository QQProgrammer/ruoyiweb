<template>
<!--
  1、缺导出接口
 -->
  <div class="everypage">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" label-width="75px">
          <el-form-item label="支付状态:" prop="orderState">
            <el-radio-group @change="changeddzt" v-model="ruleForm.orderState" size="mini">
              <el-radio-button label="0">
                <span>全部</span>
              </el-radio-button>
              <el-radio-button label="1">
                <span>未支付</span>
              </el-radio-button>
              <el-radio-button label="2">
                <span>已支付</span>
              </el-radio-button>
              <el-radio-button label="3">
                <span>已删除</span>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="支付方式:" prop="payType">
            <el-radio-group v-model="ruleForm.payType" size="mini">
              <el-radio-button
                :label="type.pid"
                :key="type.pid"
                v-for="type in PayTypeOptions"
              >
                <span>{{type.title}}</span>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="创建时间:" prop="timeFlag">
            <el-radio-group
              @change="changecjsj"
              v-model="ruleForm.timeFlag"
              size="mini"
              style="position: relative;"
            >
              <el-radio-button label="0">
                <span>全部</span>
                <!-- <span class="radio-number">245</span> -->
              </el-radio-button>
              <el-radio-button label="1">
                <span>今天</span>
              </el-radio-button>
              <el-radio-button label="2">
                <span>昨天</span>
              </el-radio-button>
              <el-radio-button label="3">
                <span>最近7天</span>
              </el-radio-button>
              <el-radio-button label="4">
                <span>最近30天</span>
              </el-radio-button>
              <el-radio-button label="5">
                <span>本月</span>
              </el-radio-button>
              <el-radio-button label="6">
                <span>本年</span>
              </el-radio-button>
              <el-radio-button label="7">
                <span>自定义</span>
              </el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-if="datatimeShow"
              v-model="datatime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              size="mini"
              style="position: absolute;top:7px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="订单号:" prop="orderId">
            <el-input
              v-model="ruleForm.orderId"
              size="mini"
              placeholder="请输入姓名、电话、订单编号"
              style="width:50%"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchpaymentListOrder">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('ruleForm')" size="mini">重置</el-button>
            <el-button type="warning" icon="el-icon-download" @click="handleExport" size="mini">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 列表表格 -->
    <!-- <table-service :loading="loading" :table-data="createListData" /> -->
    <div class="tablemain">
      <el-button class="tabledeletebtn" icon="el-icon-delete" @click="deleteallserve" type="primary" size="mini">批量删除订单</el-button>
      <el-table
        class="tablecss"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column label="订单号" min-width="40" align="center">
          <template slot-scope="scope">{{ scope.row.orderId }}</template>
        </el-table-column>
        <el-table-column prop="account" label="用户账号" min-width="52" align="center"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" min-width="52" align="center"></el-table-column>
        <el-table-column prop="columnName" label="所属栏目" width="110" align="center">
          <template slot-scope="scope" >
            <el-popover
              v-if="scope.row.columnName.length>3"
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.columnName">
              <span slot="reference" class="morehide">{{scope.row.columnName}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="文章标题" width="110" align="center">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="scope.row.title">
              <span slot="reference" class="morehide">{{scope.row.title}}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="doctorName" label="医生姓名" min-width="52" align="center"></el-table-column>
        <el-table-column prop="payPrice" label="实际支付" min-width="52" align="center"></el-table-column>
        <el-table-column prop="paid" label="支付状态" min-width="52" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.paid }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="下单时间" min-width="80" align="center"></el-table-column>
        <el-table-column prop label="操作" min-width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="paymentDetail(scope.row.orderId)" size="mini">订单详情</el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="paymentRemark(scope.row)" size="mini">订单备注</el-button>
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
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="60%" >
      <div>
        <div class="twocolumn">
          <p>订单详情</p>
          <div class="twocolumnlist">

            <div>
              <p>购买人姓名：{{articlDetaillist.realName}}</p>
              <p>购买人账号：{{articlDetaillist.account}}</p>
            </div>
            <div>
              <p>购买人昵称：{{articlDetaillist.nickName}}</p>
              <p>购买时间：{{articlDetaillist.addTime}}</p>
            </div>
            <div>
              <p>订单号：{{articlDetaillist.orderId}}</p>
              <p>支付状态：{{articlDetaillist.paid}}</p>
            </div>
            <div>
              <p>实际支付金额：{{articlDetaillist.payPrice}}</p>
              <p>文章发表医生：{{articlDetaillist.doctorName}}</p>
            </div>
            <div>
              <p>所属栏目：{{articlDetaillist.columnName}}</p>
              <p>文章标题：{{articlDetaillist.title}}</p>
            </div>
          </div>
        </div>
        <div class="twocolumn">
          <p>订单备注</p>
          <p>{{articlDetaillist.remark}}</p>
        </div>
      </div>
    </el-dialog>
    <!-- 订单备注弹窗 -->
    <el-dialog title="备注" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="备注信息">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateArticleRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
// import { getPayType } from "@/api/order/service";
import {
  getpaymentList,
  getArticleOrderDetail,
  updateArticleRemark,
  delpaymentOrderId,
  getPayType
} from "@/api/order/payment";

export default {
  components: {
    CountTo
  },
  filters: {
    capitalizepaid: function(value) {
      if (value == 0) {
        return "未支付";
      } else if (value == 1) {
        return "已支付";
      }
    },
    capitalizeorderState: function(value) {
      if (value == -1) {
        return "申请退款";
      } else if (value == -2) {
        return "退款成功";
      } else if (value == 0) {
        return "待服务";
      } else if (value == 1) {
        return "已接单服务中";
      } else if (value == 2) {
        return "已完成";
      } else if (value == 3) {
        return "已评论";
      }
    }
  },
  data() {
    return {
      PayTypeOptions: [], //支付方式列表
      datatimeShow: false, //自定义时间组件
      ruleForm: {
        orderState: "0",
        payType: 0,
        timeFlag: "0",
        orderId: ""
      },
      orderId: "",
      datatime: "",
      total: 1,
      articlDetaillist: {}, //订单详情
      currentPage: 1,
      pagesize: 10,
      ids: [],
      tableData: [],
      dialogVisible: false,
      loading: false,
      dialogFormVisible: false,
      form: {
        remark: ""
      },
      multipleSelection: []
      // createListData: [{}]
    };
  },
  created() {
    this.getpaymentList(); //订单列表
    // this.getServiceType();
    // this.getServiceListOrder();
    this.getPayType();
  },
  methods: {
    // 导出
    handleExport(){

    },
    //搜索按钮
    searchpaymentListOrder() {
      this.currentPage = 1;
      this.getpaymentList();
    },
    // 列表
    getpaymentList() {
      this.loading = true;
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        orderId: this.ruleForm.orderId,
        payType: this.ruleForm.payType,
        orderState: this.ruleForm.orderState,
        timeFlag: this.ruleForm.timeFlag
      };
      if (this.ruleForm.timeFlag == 7) {
        params.beginDate = this.datatime[0];
        params.endDate = this.datatime[1];
      }
      getpaymentList(params).then(response => {
        this.loading = false;
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // 订单详情
    paymentDetail(val) {
      this.dialogVisible = true;
      getArticleOrderDetail({
        orderId: val
      }).then(response => {
        this.articlDetaillist = response.data;
      });
    },
    // 查询支付方式
    getPayType() {
      getPayType().then(response => {
        this.PayTypeOptions = response.data;
      });
    },
    // 点击订单备注
    paymentRemark(val) {
      this.dialogFormVisible = true;
      this.orderId = val.orderId;
      this.form.remark = val.remark
    },
    // 提交更新备注信息
    updateArticleRemark() {
      updateArticleRemark({
        orderId: this.orderId,
        remark: this.form.remark
      }).then(response => {
        this.dialogFormVisible = false;
         this.getpaymentList(); 
        this.$message({
          type: "success",
          message: "备注成功!"
        });
      });
    },
    changeddzt() {
      console.log(this.radio1);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 全选
    handleSelectionChange(val) {
      this.ids = val.map(item => item.orderId);
    },
    // 创建时间改变
    changecjsj(val) {
      val == 7 ? (this.datatimeShow = true) : (this.datatimeShow = false);
    },
    // 第几页改变
    handleSizeChange(val) {
      this.pagesize = val;
      this.getpaymentList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getpaymentList();
    },
    // 单条删除
    deleteservelist(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delpaymentOrderId(val).then(response => {
            this.getpaymentList();
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
            delpaymentOrderId(this.ids.join(",")).then(response => {
              this.getpaymentList();
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
