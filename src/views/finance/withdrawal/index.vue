<template>
  <!-- 提现申请（完成）
-->
  <div class="withdrawal">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="queryParams"
                 :model="queryParams"
                 label-width="75px">
          <el-form-item label="选择时间:"
                        prop="timeFlag">
            <el-radio-group v-model="queryParams.timeFlag"
                            size="mini">
              <el-radio-button label="0">全部 </el-radio-button>
              <el-radio-button label="1">今天 </el-radio-button>
              <el-radio-button label="2">本周 </el-radio-button>
              <el-radio-button label="3">本月 </el-radio-button>
              <el-radio-button label="4">本季度 </el-radio-button>
              <el-radio-button label="5">本年度 </el-radio-button>
              <el-radio-button label="6">自定义 </el-radio-button>
            </el-radio-group>
            <el-date-picker v-if="this.queryParams.timeFlag==='6'"
                            size="mini"
                            v-model="time"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-form :model="queryParams"
                 :inline="true"
                 label-width="75px">
          <el-form-item>
            <el-select v-model="queryParams.authStatus"
                       placeholder="提现状态"
                       clearable
                       size="mini">
              <el-option value="1"
                         label="已提现"></el-option>
              <el-option value="-1"
                         label="未提现"></el-option>
              <el-option value="0"
                         label="审核中"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryParams.extractType"
                       placeholder="提现方式"
                       clearable
                       size="mini">
              <el-option label="银行卡"
                         value="bank"></el-option>
              <el-option label="微信"
                         value="wx"></el-option>
              <el-option label="支付宝"
                         value="alipay "></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="realName">
            <el-input v-model="queryParams.realName"
                      size="mini"
                      clearable
                      placeholder="用户名称"
                      style="width:100%"></el-input>
          </el-form-item>
          <el-form-item prop="account">
            <el-input v-model="queryParams.account"
                      size="mini"
                      clearable
                      placeholder="用户账户"
                      style="width:100%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-search"
                       @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh"
                       size="mini"
                       @click="resetParams">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 统计汇总 -->
    <el-row :gutter="10">
      <el-col :span="8"
              v-show="authStatus==1||authStatus==100">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>已提现金额</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">元</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :decimals='2'
                      :end-val="Number(extractInfo.readMoney)||0"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8"
              v-show="authStatus==0||authStatus==100">
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>待提现金额</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">元</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :decimals='2'
                      :end-val="Number(extractInfo.getIng)||0"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8"
              v-show='authStatus==-1||authStatus==100'>
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>未提现金额</span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">元</el-button>
          </div>
          <div class="text item">
            <count-to :start-val="0"
                      :decimals='2'
                      :end-val="Number(extractInfo.rejectMoney)||0"
                      :duration="2600"
                      class="card-panel-num" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 列表表格 -->
    <div>

      <el-table v-loading="loading"
                :data="tableData"
                style="width: 100%">
        <!--        <el-table-column type="selection" width="45" align="center"></el-table-column>-->
        <el-table-column type="index"
                         width="50"
                         label="序号"
                         align="center" />
        <!--        <el-table-column prop="uid" label="用户编号" width="80" align="center" />-->
        <el-table-column prop="realName"
                         label="用户姓名"
                         align="center" />
        <el-table-column prop="account"
                         label="用户账号"
                         align="center" />
        <el-table-column prop="extractPrice"
                         label="提现金额（元）"
                         align="center" />
        <el-table-column prop="freePrice"
                         label="手续费（元）"
                         align="center" />
        <el-table-column prop="extractType"
                         label="提现方式"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.extractType==='bank'?'银行卡':scope.row.extractType==='alipay'?'支付宝':scope.row.extractType==='wx'?'微信':"其他"}}
          </template>
        </el-table-column>
        <!--        <el-table-column v-show="form.extractType=='bank'" prop="bankCode" label="银行卡" align="center"/>-->
        <!--        <el-table-column v-show="form.extractType=='bank'" prop="bankAddress" label="开户地址"  align="center" />-->
        <!--        <el-table-column v-show="form.extractType=='alipay'" prop="payCode" label="支付宝"  align="center" />-->
        <!--        <el-table-column v-show="form.extractType=='wx'" prop="wechat" label="微信号"  align="center" />-->
        <!--        <el-table-column prop="balance" label="余额"  align="center" />-->
        <!--        <el-table-column prop="actualPrice" label="到账金额"  align="center" />-->
        <!--        <el-table-column prop="freePrice" label="手续费"  align="center" />-->
        <el-table-column prop="addTime"
                         label="申请时间"
                         align="center" />
        <el-table-column prop="authTime"
                         label="审核时间"
                         align="center" />
        <!--        <el-table-column prop="account" label="用户账号" align="center" />-->
        <el-table-column prop="orderId"
                         label="订单号"
                         align="center"></el-table-column>
        <el-table-column prop="authStatus"
                         label="状态"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.authStatus===1?'已提现':scope.row.authStatus===0?'审核中':scope.row.authStatus===-1?'未通过':scope.row.authStatus===2?'已同意':"未知"}}
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         label="操作"
                         align="center"
                         width="280">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="clickRemarks(scope.row)"
                       size="mini"
                       icon="el-icon-finished">备注</el-button>
            <!--            <el-button type="text"  @click="clickEdit(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>-->
            <el-button type="text"
                       @click="changeStatus(scope.row)"
                       size="mini"
                       icon="el-icon-circle-check"
                       v-if='scope.row.authStatus===0'>审核</el-button>
            <el-button type="text"
                       icon="el-icon-view"
                       @click="clickInfo(scope.row)"
                       size="mini">详细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getExtractLists" />
    </div>

    <!-- 详情弹窗 -->
    <el-dialog title="详情"
               :visible.sync="dialogVisibleInfo"
               width="600px"
               :close-on-click-modal="false">
      <el-card shadow="always">
        <el-form :model="detailData"
                 label-width="110px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户姓名："
                            prop="realName">
                <span>{{detailData.realName||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="提现方式："
                            prop="extractType">
                <span>{{detailData.extractType=='bank'?'银行卡':detailData.extractType=='wx'?'微信':detailData.extractType=='alipay'?'支付宝':'其他'||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"
                    v-show="detailData.extractType==='bank'">
              <el-form-item label="银行卡号："
                            prop="bankCode">
                <span>{{detailData.bankCode||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"
                    v-show="detailData.extractType==='wx'">
              <el-form-item label="微信号："
                            prop="wechat">
                <span>{{detailData.wechat||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"
                    v-show="detailData.extractType==='bank'">
              <el-form-item label="银行开户地址："
                            prop="bankAddress">
                <span>{{detailData.bankAddress||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"
                    v-show="detailData.extractType==='alipay'">
              <el-form-item label="支付宝："
                            prop="payCode">
                <span>{{detailData.payCode||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="到账金额："
                            prop="actualPrice">
                <span>{{detailData.actualPrice||'0.00'}}元</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手续费："
                            prop="freePrice">
                <span>{{detailData.freePrice||'0.00'}}元</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="提现金额："
                            prop="extractPrice">
                <span>{{detailData.extractPrice||'0.00'}}元</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="当前余额："
                            prop="nowMoneyTotal">
                <span>{{detailData.nowMoneyTotal||'0.00'}}元</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="累计体现余额："
                            prop="extralTotal">
                <span>{{detailData.extralTotal||'0.00'}}元</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注："
                            prop="mark">
                <span>{{detailData.mark||'无'}}</span>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </el-card>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisibleInfo = false"
                   size="mini">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <!-- <el-dialog title="编辑" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false">
        <el-card shadow="always">
            <el-form ref="form" :model="form" :rules="rules" label-width="110px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="用户姓名"  prop="realName">
                  <el-input v-model="form.realName" clearable :disabled="true" size="small" placeholder="请输入用户姓名"/>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="提现方式" prop="extractType">
                  <el-select v-model="form.extractType" placeholder="请选择体现方式" clearable size="small" style="width:100%">
                    <el-option label="银行卡" value="bank"></el-option>
                    <el-option label="微信" value="wx"></el-option>
                    <el-option label="支付宝" value="alipay"></el-option>
                  </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="24" v-show="form.extractType==='bank'">
                  <el-form-item label="银行卡号" prop="bankCode">
                  <el-input v-model="form.bankCode" clearable size="small" placeholder="请输入银行卡号"/>
                </el-form-item>
                </el-col>
                <el-col :span="24" v-show="form.extractType==='wx'">
                  <el-form-item label="微信号"  prop="wechat">
                  <el-input v-model="form.wechat" clearable size="small" placeholder="请输入微信号"/>
                </el-form-item>
                </el-col>
                <el-col :span="24" v-show="form.extractType==='bank'">
                  <el-form-item label="银行开户地址"  prop="bankAddress">
                  <el-input v-model="form.bankAddress" clearable size="small" placeholder="请输入开户地址"/>
                </el-form-item>
                </el-col>
                <el-col :span="24" v-show="form.extractType==='alipay'">
                  <el-form-item label="支付宝"  prop="payCode">
                  <el-input v-model="form.payCode" clearable size="small" placeholder="请输入支付宝"/>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="到账金额"  prop="actualPrice">
                  <el-input v-model="form.actualPrice" clearable size="small" type="number" placeholder="请输入到账金额" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"/>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="手续费"  prop="freePrice">
                  <el-input v-model="form.freePrice" clearable size="small" type="number" placeholder="请输入手续费"/>
                </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="提现金额"  prop="extractPrice">
                  <el-input v-model="form.extractPrice" clearable size="small" type="number" placeholder="请输入提现金额"/>
                </el-form-item>
                </el-col>
              </el-row>
            </el-form>
        </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitForm" size="mini">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 备注弹窗 -->
    <el-dialog title="备注"
               :visible.sync="dialogVisibleMark"
               width="500px">
      <el-form :model="remarkData">
        <el-form-item prop="mark">
          <el-input type="textarea"
                    :rows="4"
                    v-model="remarkData.mark"
                    size="mini"
                    placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisibleMark = false"
                   size="mini">取 消</el-button>
        <el-button type="primary"
                   @click="submitMark"
                   size="mini">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog title="审核"
               :visible.sync="dialogVisibleCheck"
               width="500px">
      <el-form :model="checkData"
               ref="checkForm">
        <el-form-item prop="authStatus">
          <el-radio v-model="checkData.authStatus"
                    label="2">同意</el-radio>
          <el-radio v-model="checkData.authStatus"
                    label="-1">未通过</el-radio>
        </el-form-item>
        <el-form-item prop="authMsg"
                      v-show='this.checkData.authStatus==-1'>
          <el-input v-model="checkData.authMsg"
                    type="textarea"
                    :rows="4"
                    size="small"
                    placeholder="请输入原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisibleCheck = false"
                   size="mini">取 消</el-button>
        <el-button type="primary"
                   @click="submitCheck"
                   size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import { getExtractList, getExtractDetail, getExtractRemark, checkExtract, saveExtractMark, updateExtract, getExtractInfo } from "@/api/finance/withdraw";
//
export default {
  components: {
    CountTo
  },
  data () {
    return {
      tableData: [],
      remarkData: {},
      detailData: {},
      extractInfo: {},
      checkData: {
        authStatus: '2',
        authMsg: ''
      },
      dialogVisible: false,
      dialogVisibleMark: false,
      dialogVisibleCheck: false,
      dialogVisibleInfo: false,
      loading: false,
      total: 0,
      time: '',
      authStatus: 100,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        account: undefined,
        extractType: undefined,
        realName: undefined,
        timeFlag: 0,
      },
      form: {
      },
      // 表单校验
      // rules: {
      //   extractType: [
      //     { required: true, message: "方式不能为空", trigger: "change" }
      //   ],
      //   bankCode: [
      //     { required: true, message: "银行卡号 不能为空", trigger: "blur" }
      //   ],
      //   actualPrice: [
      //     { required: true, message: "到账金额不能为空", trigger: "blur" }
      //   ],
      //   wechat: [
      //     { required: true, message: "微信号不能为空", trigger: "blur" }
      //   ],
      //   bankAddress: [
      //     { required: true, message: "银行开户地址不能为空", trigger: "blur" }
      //   ],
      //   freePrice: [
      //     { required: true, message: "手续费不能为空", trigger: "blur" }
      //   ],
      //   payCode: [
      //     { required: true, message: "支付宝账号不能为空", trigger: "blur" }
      //   ],
      //   extractPrice: [
      //     { required: true, message: "金额不能为空", trigger: "blur" }
      //   ]
      // }
    };
  },
  created () {
    //查询列表
    this.getExtractLists();
    this.getExtractInfo();

  },
  methods: {

    /** 获取列表 */
    getExtractLists () {
      this.loading = true
      if (this.queryParams.timeFlag == 6) {
        this.queryParams.beginDate = this.time[0]
        this.queryParams.endDate = this.time[1]
      }
      getExtractList(this.queryParams).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });
    },

    /** 获取统计 */
    getExtractInfo () {
      this.queryParams.pageNum = 1
      getExtractInfo(this.queryParams).then(response => {
        this.extractInfo = response.data || {}
        const status = Number(this.queryParams.authStatus)
        switch (status) {
          case 0:
            this.authStatus = 0;
            break;
          case 1:
            this.authStatus = 1;
            break;
          case -1:
            this.authStatus = -1;
            break;
          default:
            this.authStatus = 100;
            break;
        }
      });
    },

    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getExtractLists();
      this.getExtractInfo();
    },

    /** 编辑按钮操作 */
    // clickEdit (row) {
    //   this.reset();
    //   const id = row.id;
    //   getExtractDetail(id).then(response => {
    //     this.form = response.data;
    //     this.dialogVisible = true;
    //   });
    // },

    /** 表单重置 *///
    reset () {
      this.form = {
        bankCode: '',//银行卡号
        actualPrice: '',//到账金额
        wechat: '',//微信号
        freePrice: '',//手续费
        bankAddress: '',//银行开户地址
        realName: '',//用户姓名
        payCode: '', //支付宝账号
        extractPrice: '',//体现金额
        extractType: '',// 体现方式
      };
      this.time = ''
      this.resetForm("form");
    },

    // 重置
    resetParams () {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        account: undefined,
        extractType: undefined,
        realName: undefined,
        timeFlag: 0,
      }
      this.time = ''
      this.getExtractLists();
    },

    /** 详情按钮操作 */
    clickInfo (row) {
      const id = row.id;
      const uid = row.uid;
      getExtractDetail(id, uid).then(response => {
        this.detailData = response.data || {};
        this.dialogVisibleInfo = true;
      });
    },

    /** 提交按钮 */
    // submitForm: function () {
    //   this.$refs["form"].validate(valid => {
    //     if (valid) {
    //       this.form.authTime = parseInt(this.form.authTime)
    //       this.form.addTime = parseInt(this.form.addTime)
    //       updateExtract(this.form).then(response => {
    //         if (response.code === 200) {
    //           this.msgSuccess("修改成功");
    //           this.dialogVisible = false;
    //           this.getExtractLists();
    //         } else {
    //           this.msgError(response.msg);
    //         }
    //       });
    //     }
    //   });
    // },

    /** 备注按钮 */
    clickRemarks (row) {
      getExtractRemark(row.id).then(response => {
        this.remarkData = response.data || {};
        this.dialogVisibleMark = true;
      });
    },

    /** 备注提交 */
    submitMark (row) {
      saveExtractMark(this.remarkData).then(response => {
        if (response.code === 200) {
          this.msgSuccess("修改成功");
          this.getExtractLists();
          this.dialogVisibleMark = false;
        } else {
          this.msgError(response.msg);
        }
      });
    },

    /** 审核按钮 */
    changeStatus (row) {
      this.dialogVisibleCheck = true;
      this.checkData.id = row.id;
    },

    /** 审核提交 */
    submitCheck () {
      if (this.checkData.authStatus == -1) {
        if (this.checkData.authMsg == '') {
          this.msgError('请输入理由');
          return;
        }
      }
      checkExtract(this.checkData).then(response => {
        if (response.code === 200) {
          this.msgSuccess("成功");
          this.getExtractLists();
          this.resetForm("checkForm");
          this.dialogVisibleCheck = false;
        } else {
          this.msgError(response.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.withdrawal {
  .box-card {
    margin-bottom: 20px;
  }
  padding: 15px;
  label {
    font-weight: inherit;
  }
  .el-radio-button {
    margin-right: 0px;
  }
  .el-radio-button .el-radio-button__inner {
    border-radius: 4px;
  }
  .el-radio-button__inner {
    border-left: 1px solid #dcdfe6;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    .radio-number {
      background: #0667c0;
    }
  }
  .el-radio-button--mini {
    padding: 7px 8px !important;
  }
  .el-radio-button--mini {
    padding: 7px 8px !important;
  }
  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 8px !important;
  }
}
</style>
<style lang="scss" scoped>
.withdrawal {
  padding: 30px;
  .pagination-container {
    background: none !important;
  }
}
</style>
