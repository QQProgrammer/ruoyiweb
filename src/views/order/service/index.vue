<template>
<!--
  2、缺统计接口（已出）(前端已调试),带参数查询统计接口报错
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
          <el-form-item label="订单状态:" prop="orderState">
            <el-radio-group @change="changeddzt" v-model="ruleForm.orderState" size="mini">
              <el-radio-button :label="0">
                <span>全部</span>
              </el-radio-button>
              <el-radio-button :label="1">
                <span>未支付</span>
                <!-- <span class="radio-number">245</span> -->
              </el-radio-button>
              <el-radio-button :label="2">
                <span>待接诊</span>
              </el-radio-button>
              <el-radio-button :label="3">
                <span>接诊中</span>
              </el-radio-button>
              <el-radio-button :label="4">
                <span>已完成</span>
              </el-radio-button>
              <el-radio-button :label="5">
                <span>已退款</span>
              </el-radio-button>
              <el-radio-button :label="6">
                <span>已删除</span>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="订单类型:" prop="productId">
            <el-radio-group @change="changeddlx" v-model="ruleForm.productId" size="mini">
              <el-radio-button
                :label="type.productId"
                :key="type.productId"
                v-for="type in typeOptions"
              >
                <span>{{type.storeName}}</span>
                <!-- <span class="radio-number">245</span> -->
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="支付方式:" prop="payType">
            <el-radio-group @change="" v-model="ruleForm.payType" size="mini">

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
            <el-radio-group @change="changecjsj" v-model="ruleForm.timeFlag" size="mini" style="position: relative;">
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
              placeholder="请输入订单编号..."
              style="width:50%"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="searchSearchListOrder">搜索</el-button>
            <el-button @click="resetForm('ruleForm')" icon="el-icon-refresh" size="mini">重置</el-button>
            <el-button type="warning"  @click="handleExport" icon="el-icon-download" size="mini">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 统计汇总 -->
    <el-row :gutter="10">
      <el-col :span="5">
        <el-card class="box-card" v-show="quantityAmountShow">
          <div slot="header" class="clearfix">
            <span>订单数量</span>
             <el-button style="float: right; padding: 3px 0" type="text">个</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="Number(orderTotalInfoObj.orderCount)||0" :duration="2600" class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" v-show="quantityAmountShow">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单金额</span>
            <el-button style="float: right; padding: 3px 0" type="text">元</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="Number(orderTotalInfoObj.orderTotalMoney)||0" :duration="2600" class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" v-show="refundamountShow">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>退款金额</span>
            <el-button style="float: right; padding: 3px 0" type="text">元</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="Number(orderTotalInfoObj.foundMoney)||0" :duration="2600" class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" v-show="weChatAlipayShow">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>微信支付</span>
            <el-button style="float: right; padding: 3px 0" type="text">元</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="Number(orderTotalInfoObj.weiXinMoney)||0" :duration="2600" class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" v-show="weChatAlipayShow">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>支付宝支付</span>
            <el-button style="float: right; padding: 3px 0" type="text">元</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0" :end-val="Number(orderTotalInfoObj.zhiFuMoney)||0" :duration="2600" class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 列表表格 -->
    <div class="tablemain">
      <el-button class="tabledeletebtn" icon="el-icon-delete" type="primary" @click="deleteallserve" size="mini">批量删除订单</el-button>
      <el-table
        class="tablecss"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" align="center"></el-table-column>
        <el-table-column prop="orderId" label="订单编号" min-width="52" align="center"></el-table-column>
        <el-table-column prop="account" label="用户账号" min-width="65" align="center"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" min-width="52" align="center"></el-table-column>
        <el-table-column prop="storeName" label="服务名称" min-width="52" align="center"></el-table-column>
        <el-table-column prop="doctorName" label="医生姓名" min-width="52" align="center"></el-table-column>
        <el-table-column prop="payPrice" label="实际支付" min-width="52" align="center"></el-table-column>
        <el-table-column prop="paid" label="支付状态" min-width="52" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.paid | capitalizepaid }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderState" label="订单状态" min-width="52" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.orderState | capitalizeorderState }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="addTime" label="下单时间" min-width="90" align="center"></el-table-column>
        <el-table-column prop label="操作" min-width="110" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="serviceDetail(scope.row.orderId)" size="mini">订单详情</el-button>
            <el-button type="text" icon="el-icon-refresh" v-if="scope.row.orderState == -1" @click="chargeback(scope.row.orderId)" size="mini">退单</el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="OrderRemark(scope.row)" size="mini">订单备注</el-button>
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
    <!-- 退单弹窗 -->
    <el-dialog title="退单" :visible.sync="dialogFormChargebackVisible">
      <el-form :model="formChargeback">
      <el-form-item label="是否退单：">
        <el-radio-group v-model="formChargeback.refundStatus" @change="changerefundStatus">
          <el-radio :label="4">
            <span>同意退单</span>
          </el-radio>
          <el-radio :label="3">
            <span>拒绝</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="退单原因：" v-if="reasonshow">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="退单原因"
          style="width:80%"
          v-model="formChargeback.refundReason">
        </el-input>
      </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormChargebackVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChargeback">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情弹窗 -->
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="60%">
      <div>
        <div class="twocolumn">
          <p>服务请求信息</p>
          <div class="twocolumnlist">
            <div>
              <p>患者真实姓名：{{appointDetail.realName}}</p>
              <p>性别：{{appointDetail.sex | sexcapitalize}}</p>
            </div>
            <div>
             <p>治疗时间：{{appointDetail.stickTame}}</p>
              <p>请求时间：{{appointDetail.addTime}}</p>
            </div>
            <div>
              <p>患者手机号：{{appointDetail.mobile}}</p>
              <p>患者身份证号：{{appointDetail.cardId}}</p>
            </div>
            <div>

              <p>疾病名称或症状：{{appointDetail.symptom}}</p>
              <p>是否正在用药：{{appointDetail.isDrug | isDrugcapitalize}}</p>
            </div>
            <div>
              <p>既往病史：{{appointDetail.previousInfo}}</p>
              <p>希望获得的医生帮助信息：{{appointDetail.hopeInfo}}</p>
            </div>
            <div>
              <p>个人病史：{{appointDetail.personInfo}}</p>
            </div>
            <div>
              <p>具体疾病描述：{{appointDetail.stickInfo}}</p>
            </div>
            <div>
              <p>最终诊断建议：{{appointDetail.advise}}</p>
            </div>
            <div>
              <p v-if="appointDetail.sickImgSize == 1" style="display:flex">
                <span>检查或患处照片资料：</span>
                <img :src="item" v-for="(item,index) in appointDetail.sickImg" :key="index" style="width:200px;height:200px;object-fit: scale-down;">
              </p>
            </div>
          </div>
        </div>
        <div class="twocolumn">
          <p>订单详情</p>
          <div class="twocolumnlist">

            <div>
              <p>用户姓名：{{orderDetail.realName}}</p>
              <p>用户账号：{{orderDetail.account}}</p>
            </div>
            <div>
              <p>用户昵称：{{orderDetail.nickName}}</p>
            </div>
            <div>
              <p>下单时间：{{orderDetail.addTime}}</p>
              <p>订单号：{{orderDetail.orderId}}</p>
            </div>
            <div>
              <p>支付状态：{{orderDetail.paid | capitalizepaid}}</p>
              <p>订单状态：{{orderDetail.orderState | capitalizeorderState}}</p>
            </div>
            <div>
              <p>实际支付金额：{{orderDetail.payPrice}}</p>
              <p>支付现金金额：{{orderDetail.cash}}</p>
            </div>
            <div>
              <p>服务类别：{{orderDetail.storeName}}</p>
              <p>服务医生：{{orderDetail.doctorName}}</p>
            </div>
          </div>
        </div>
        <div class="twocolumn">
          <p>订单备注</p>
          <p>{{remark}}</p>
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
        <el-button type="primary" @click="updateOrderRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import {
  getServiceType,
  getServiceListOrder,
  getPayType,
  getServiceOrderDetail,
  updateOrderRemark,
  returnOrder,
  deleteOrder,
  exportConfig,
  getServiceOrderTotalInfo
   } from "@/api/order/service";
//
export default {
  components: {
    CountTo
  },
  data() {
    return {
      orderTotalInfoObj:{}, //统计
      dialogFormChargebackVisible:false, //退单弹窗
      formChargeback:{
        refundStatus:'',
        refundReason:''
      },
      reasonshow:false,//退单原因是否显示
      chargebackid:'',


      quantityAmountShow:true, // 数量和金额
      weChatAlipayShow:true, // 微信和支付宝
      refundamountShow:true, //退款金额


      typeOptions: [], // 订单类型列表
      PayTypeOptions:[], //支付方式列表
      appointDetail:{}, //弹窗服务请求信息详情
      orderDetail:{}, //弹窗订单信息详情
      remark:'', //订单备注
      orderId:'', //订单编号
      tableData: [], //服务列表
      ids:[], //选中的列表数组

      dialogVisible: false, //订单弹窗
      loading: false,
      dialogFormVisible: false, //备注弹窗
      datatimeShow: false,
      currentPage: 1,
      pagesize: 10,
      total: 1,
      ruleForm: {
        orderState: "0",
        productId: "0",
        payType: 0,
        timeFlag: "0",
        orderId: "",
        datatime: ""
      },
      datatime:'',
      form: {
        remark: ""
      },
      multipleSelection: []
      // createListData: [{}]
    };
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
      }else if (value == 0) {
        return "待服务";
      }else if (value == 1) {
        return "已接单服务中";
      }else if (value == 2) {
        return "已完成";
      }else if (value == 3) {
        return "已评论";
      }
    },
    sexcapitalize: function(value) {
      if (value == 0) {
        return "男";
      } else if (value == 1) {
        return "女";
      }
    },
    isDrugcapitalize: function(value) {
      if (value == 0) {
        return "未用药";
      } else if (value == 1) {
        return "用药中";
      }
    },
  },
  created() {
    this.getServiceType();
    this.getServiceListOrder(); //列表
    this.getPayType() //支付类型
    this.getServiceOrderTotalInfo() //查询统计接口
  },
  methods: {
    // 导出
    handleExport() {

      var queryParams = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        orderId: this.ruleForm.orderId,
        payType:this.ruleForm.payType,
        productId: this.ruleForm.productId,
        orderState: this.ruleForm.orderState,
        timeFlag: this.ruleForm.timeFlag,
      };


      this.$confirm('是否确认导出数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportConfig(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    },
    // 统计
    getServiceOrderTotalInfo(){
      var params1 = {
        orderId: this.ruleForm.orderId,
        payType:this.ruleForm.payType,
        productId: this.ruleForm.productId,
        orderState: this.ruleForm.orderState,
        timeFlag: this.ruleForm.timeFlag,
      };
      if(this.ruleForm.timeFlag==7){
        params1.beginDate = this.datatime[0]
        params1.endDate =this.datatime[1]
      }
      getServiceOrderTotalInfo(params1).then(response => {
        this.orderTotalInfoObj = response.data;
      });
    },
    // 张敏敏 点击搜索按钮 避免获取当前页数 比如查询 待支付时 应该页数从1开始，如果获取当前页 则会传入pageNum=2
    searchSearchListOrder() {
      this.currentPage = 1
      this.getServiceListOrder()
      this.getServiceOrderTotalInfo()
    },
    // 获取订单类型
    getServiceType() {
      getServiceType().then(response => {
        this.typeOptions = response.data;
      });
    },
    // 查询支付方式
    getPayType(){
      getPayType().then(response => {
        this.PayTypeOptions = response.data;
      });
    },
    // 获取订单列表
    getServiceListOrder() {
      this.loading = true
      console.log(this.datatime)
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        orderId: this.ruleForm.orderId,
        payType:this.ruleForm.payType,
        productId: this.ruleForm.productId,
        orderState: this.ruleForm.orderState,
        timeFlag: this.ruleForm.timeFlag,
        payFlag:1
      };
      if(this.ruleForm.timeFlag==7){
        params.beginDate = this.datatime[0]
        params.endDate =this.datatime[1]
      }
      getServiceListOrder(params).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // 点击订单备注
    OrderRemark(val){
      this.dialogFormVisible = true
      this.orderId = val.orderId
      this.form.remark = val.remark
    },
    // 提交更新备注信息
    updateOrderRemark(){
      updateOrderRemark({
        orderId:this.orderId,
        remark:this.form.remark
      }).then(response => {
        this.dialogFormVisible = false;
        this.getServiceListOrder()
        this.$message({
          type: "success",
          message: "备注成功!"
        });
      });
    },
    // 订单类型改变
    changeddlx(val) {
      console.log(val);
    },
    // 订单状态改变
    changeddzt(val) {
      console.log(val)
      if(val == 0 || val == 5 || val == 6){
        this.quantityAmountShow = true // 数量和金额
        this.weChatAlipayShow = true // 微信和支付宝
        this.refundamountShow = true //退款金额
      }else if(val == 1){
        this.quantityAmountShow = true // 数量和金额
        this.weChatAlipayShow = false // 微信和支付宝
        this.refundamountShow = false //退款金额
      }else if(val == 2 || val == 3 || val == 4){
        this.quantityAmountShow = true // 数量和金额
        this.weChatAlipayShow = true // 微信和支付宝
        this.refundamountShow = false //退款金额
      }
    },
    // 创建时间改变
    changecjsj(val) {
      val == 7 ? (this.datatimeShow = true) : (this.datatimeShow = false);
    },
    // onSubmit() {},
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 全选
    handleSelectionChange(val) {
      this.ids = val.map(item => item.orderId)
    },
    // 查看订单详情
    serviceDetail(val) {
      this.dialogVisible = true;
      getServiceOrderDetail({
        orderId:val
      }).then(response => {
        this.appointDetail = response.data.appointDetail;
        this.orderDetail = response.data.orderDetail;
        this.remark = response.data.remark;
      });
    },
    // 退单弹窗选择退单和拒绝
    changerefundStatus(val){
      val===3?this.reasonshow = true:this.reasonshow = false
    },
    //退单
    chargeback(val) {
      this.dialogFormChargebackVisible = true
      this.chargebackid = val
      this.formChargeback.refundStatus = ''
      this.formChargeback.refundReason = ''
    },
    // 退单提交
    submitChargeback(){
      if(this.formChargeback.refundStatus === 4){
        this.formChargeback.refundReason = undefined
      }
      returnOrder({
        orderId:this.chargebackid,
        refundStatus:this.formChargeback.refundStatus,
        refundReason:this.formChargeback.refundReason
      }).then(response => {
         this.dialogFormChargebackVisible = false
        this.getServiceListOrder()
        this.$message({
          type: "success",
          message: "成功!"
        });
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
          deleteOrder(val).then(response => {
            this.getServiceListOrder()
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
    deleteallserve(){
      this.$confirm("此操作将永久删除这些文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if(this.ids&&this.ids.length){
            deleteOrder(this.ids.join(',')).then(response => {
              this.getServiceListOrder()
              this.$message({
                type: "success",
                message: "批量删除成功!"
              });
            });
          }else{
            this.$message({
              message: '请先选中要删除的列表数据',
              type: 'warning'
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
      this.pagesize = val
      this.getServiceListOrder()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getServiceListOrder()
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
