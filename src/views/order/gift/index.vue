<template>
<!--
  3、缺导出接口
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
            <el-radio-group @change="changezfzt" v-model="ruleForm.orderState" size="mini">
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
              placeholder="请输入订单编号"
              style="width:50%"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchGiftListOrder">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('ruleForm')" size="mini">重置</el-button>
            <el-button type="warning" icon="el-icon-download" @click="handleExport" size="mini">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 统计汇总 -->
    <el-row :gutter="10">
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单数量</span>
             <el-button style="float: right; padding: 3px 0" type="text">数</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="Number(giftTotalInfoObj.orderCount)||0" :duration="2600" class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" v-show="paymentStatusShow">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>售出礼物数量</span>
            <el-button style="float: right; padding: 3px 0" type="text">个</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="Number(giftTotalInfoObj.giftCount)||0" :duration="2600" class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单金额</span>
            <el-button style="float: right; padding: 3px 0" type="text">元</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="Number(giftTotalInfoObj.orderTotalMoney)||0" :duration="2600" class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" v-show="paymentStatusShow">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>微信支付</span>
            <el-button style="float: right; padding: 3px 0" type="text">元</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="Number(giftTotalInfoObj.weiXinMoney)||0" :duration="2600" class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" v-show="paymentStatusShow">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>支付宝支付</span>
            <el-button style="float: right; padding: 3px 0" type="text">元</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="Number(giftTotalInfoObj.zhiFuMoney)||0" :duration="2600" class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
    </el-row>
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
        <el-table-column prop="account" label="用户账号" min-width="72" align="center"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" min-width="52" align="center"></el-table-column>
        <el-table-column prop="storeName" label="礼物名称" min-width="52" align="center"></el-table-column>
        <el-table-column prop="doctorName" label="赠送医生" min-width="52" align="center"></el-table-column>
        <el-table-column prop="payPrice" label="实际支付" min-width="52" align="center"></el-table-column>
        <el-table-column prop="paid" label="支付状态" min-width="52" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.paid | capitalizepaid }}</span>
          </template>
        </el-table-column>
<!--        <el-table-column prop="orderState" label="订单状态" min-width="52" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <span>{{scope.row.orderState | capitalizeorderState }}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="addTime" label="赠送时间" min-width="80" align="center"></el-table-column>
        <el-table-column prop label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="giftDetail(scope.row.orderId)" size="mini">订单详情</el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="orderRemark(scope.row)" size="mini">订单备注</el-button>
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
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="60%">
      <div>
        <div class="twocolumn">
          <p>订单详情</p>
          <div class="twocolumnlist">
            <div>
              <p>用户姓名：{{giftDetaillist.realName}}</p>
              <p>用户账号：{{giftDetaillist.account}}</p>
            </div>
            <div>
              <p>用户昵称：{{giftDetaillist.nickName}}</p>
              <p>礼物名称：{{giftDetaillist.storeName}}</p>
            </div>
            <div>
              <p>赠送医生：{{giftDetaillist.doctorName}}</p>
              <p>赠送时间：{{giftDetaillist.addTime}}</p>
            </div>
            <div>
              <p>支付状态：{{giftDetaillist.paid | capitalizepaid}}</p>
              <p>订单号：{{giftDetaillist.orderId}}</p>
            </div>
           <div>
             <p>实际支付金额：{{giftDetaillist.payPrice}}</p>
           </div>
          </div>
        </div>
        <div class="twocolumn">
          <p>订单备注:</p>
          <p>{{giftDetaillist.remark}}</p>
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
        <el-button type="primary" @click="updategiftRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import {
  getgiftList,
  getgiftOrderDetail,
  updategiftRemark,
  delgiftOrderId,
  getGiftOrderTotalInfo,
  getPayType
} from "@/api/order/gift";

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
      paymentStatusShow:true, //根据支付状态判断显示隐藏

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
      giftDetaillist: {}, //订单详情
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
      giftTotalInfoObj:{}, //统计
      multipleSelection: []
      // createListData: [{}]
    };
  },
  created() {
    this.getgiftList(); //订单列表
    this.getPayType();
    this.getGiftOrderTotalInfo() //统计
  },
  methods: {
    // 导出
    handleExport(){

    },
    //张敏敏点击 搜索按钮
    searchGiftListOrder() {
      this.currentPage = 1;
      this.getgiftList();
      this.getGiftOrderTotalInfo() //统计
    },
    // 统计
    getGiftOrderTotalInfo(){
      var params1 = {
        orderId: this.ruleForm.orderId,
        payType: this.ruleForm.payType,
        orderState: this.ruleForm.orderState,
        timeFlag: this.ruleForm.timeFlag
      };
      if (this.ruleForm.timeFlag == 7) {
        params1.beginDate = this.datatime[0];
        params1.endDate = this.datatime[1];
      }
      getGiftOrderTotalInfo(params1).then(response => {
        this.giftTotalInfoObj = response.data
      });
    },
    // 列表
    getgiftList() {
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
      getgiftList(params).then(response => {
        this.loading = false;
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // 查询支付方式
    getPayType() {
      getPayType().then(response => {
        this.PayTypeOptions = response.data;
      });
    },
    // 创建时间改变
    changecjsj(val) {
      val == 7 ? (this.datatimeShow = true) : (this.datatimeShow = false);
    },
    // 点击订单备注
    orderRemark(val) {
      this.dialogFormVisible = true;
      this.orderId = val.orderId;
      this.form.remark = val.remark
    },
    // 提交更新备注信息
    updategiftRemark() {
      updategiftRemark({
        orderId: this.orderId,
        remark: this.form.remark
      }).then(response => {
        this.dialogFormVisible = false;
        this.getgiftList();
        this.$message({
          type: "success",
          message: "备注成功!"
        });
      });
    },
    // 支付状态改变
    changezfzt(val) {
      if(val == 0 || val ==2 || val ==3){
        this.paymentStatusShow = true
      } else if(val == 1){
        this.paymentStatusShow = false
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.orderId);
    },
    // 订单详情
    giftDetail(val) {
      this.dialogVisible = true;
      getgiftOrderDetail({
        orderId: val
      }).then(response => {
        this.giftDetaillist = response.data;
      });
    },
    // 单条删除
    deleteservelist(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delgiftOrderId(val).then(response => {
            this.getgiftList();
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
            delgiftOrderId(this.ids.join(",")).then(response => {
              this.getgiftList();
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
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getgiftList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getgiftList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
