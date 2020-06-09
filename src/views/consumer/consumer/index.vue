<template>
<!-- 用户管理 (完成)-->
  <div class="consumer">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="queryParams" :model="queryParams" :inline="true" label-width="75px">
          <el-form-item  prop="account">
            <el-input v-model="queryParams.account" size="mini" placeholder="请输入用户账号" style="width:100%" clearable />
          </el-form-item>
          <el-form-item  prop="realName">
            <el-input v-model="queryParams.realName" size="mini" placeholder="请输入用户姓名" style="width:100%" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search"  @click="handleQuery">搜索</el-button>
<!--            <el-button type="primary" @click="clickAdd" size="mini" icon="el-icon-plus">新增</el-button>-->
            <el-button icon="el-icon-refresh" size="mini" @click="resetForm('queryParams')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 列表表格 -->
    <div>
      <el-table  v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index" width="50" label="序号" align="center"/>
        <el-table-column prop="account" label="用户账号" align="center" />
        <el-table-column prop="realName" label="用户姓名" align="center"/>
        <!-- <el-table-column prop="nickname" label="用户昵称" align="center"/> -->
        <el-table-column prop="userType" label="用户类型" align="center">
            <template slot-scope="scope">
              {{scope.row.userType=='0'?'普通用户':scope.row.userType=='1'?'医生账户':scope.row.userType=='1'?'推广员账户':'其他'}}
            </template>
        </el-table-column>
        <el-table-column prop="addTime" label="注册时间" width="220" align="center"/>
        <el-table-column prop="spreadName" label="推广员" align="center"/>
        <el-table-column prop="spreadNum" label="推广码" align="center"/>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#cccccc"
                :active-value="0"
                :inactive-value="1"
                @change='changeStatus($event,scope.row)'>
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" align="center" width="320">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="clickInfo(scope.row)" size="mini">详细</el-button>
<!--            <el-button type="text" icon="el-icon-edit" @click="clickEdit(scope.row)" size="mini">编辑</el-button>-->
            <el-button type="text" icon="el-icon-delete" @click="clickDelete(scope.row)" size="mini">删除</el-button>
            <el-dropdown>
              <el-button type="text" size="mini">
                <i class="el-icon-arrow-down el-icon--right"></i> 记录
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="getExtractLists(scope.row)">提现记录</el-dropdown-item>
                <el-dropdown-item  @click.native="getRechargeLists(scope.row)">充值记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown>
              <el-button type="text" size="mini">
                <i class="el-icon-arrow-down el-icon--right"></i> 密码
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  @click.native="clickUpdateLoginPwd(scope.row)">登录密码</el-dropdown-item>
                <el-dropdown-item  @click.native="clickUpdatePayPwd(scope.row)">支付密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getAppUserList"
        />
    </div>

    <!-- 新增+编辑用户 -->
    <!-- <el-dialog :title="title" :visible.sync="dialogVisible" width="580px" append-to-body>
      <el-card shadow="always">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px"  >
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户账号" prop="account">
              <el-input v-model="form.account"  clearable size="small" placeholder="请输入用户账号" maxLength = '20'/>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="!this.form.uid">
            <el-form-item label="密码" prop="pwd">
            <el-input v-model="form.pwd" clearable size="small" placeholder="请输入密码" maxLength = '18' minLength = '6'/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="form.realName" clearable size="small" placeholder="请输入姓名" maxLength = '20'/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="身份证号" prop="cardId">
            <el-input v-model="form.cardId" clearable size="small" placeholder="请输入身份证号" maxLength = '18'/>
          </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" clearable size="small" placeholder="请输入昵称" maxLength = '20'/>
          </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户类型" prop="userType">
              <el-select v-model="form.userType" placeholder="请选择" clearable style="width:100%">
              <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="cancel" size="mini">取 消</el-button>
        <el-button type="primary"  @click="submitForm" size="mini">确 定</el-button>
      </div>
    </el-dialog> -->

<!-- 修改支付密码 -->
    <el-dialog title="修改支付密码" :visible.sync="dialogVisibleUpdatePayPwd" width="580px" append-to-body>
      <el-card shadow="always" class="box-card column" >
        <el-form ref="payPwdForm" :model="payPwdForm" :rules="payPwdRules" label-width="80px"  >
          <el-row>
            <el-col :span="24">
              <el-form-item label="支付密码" prop="newPayPwd">
              <el-input v-model="payPwdForm.newPayPwd" clearable size="small" placeholder="不输入则不改变" maxLength = '18' minLength = '6'/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="确认密码" prop="confirmPayPwd">
              <el-input v-model="payPwdForm.confirmPayPwd" clearable size="small" placeholder="请输入密码" maxLength = '18' minLength = '6'/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogVisibleUpdatePayPwd=false" size="mini">取 消</el-button>
        <el-button type="primary"  @click="updatePayPwd" size="mini">确 定</el-button>
      </div>
    </el-dialog>

<!-- 修改登录密码 -->
    <el-dialog title="修改登录密码" :visible.sync="dialogVisibleLoginPwd" width="580px" append-to-body>
      <el-card shadow="always" class="box-card column" >
        <el-form ref="loginPwdForm" :model="loginPwdForm" :rules="loginPwdRules" label-width="80px"  >
          <el-row>
            <el-col :span="24">
              <el-form-item label="登录密码" prop="newPwd">
              <el-input v-model="loginPwdForm.newPwd" clearable size="small" placeholder="不输入则不改变" maxLength = '18' minLength = '6'/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="确认密码" prop="confirmPwd">
              <el-input v-model="loginPwdForm.confirmPwd" clearable size="small" placeholder="请输入密码" maxLength = '18' minLength = '6'/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogVisibleLoginPwd=false" size="mini">取 消</el-button>
        <el-button type="primary"  @click="updateLoginPwd" size="mini">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="用户详情" :visible.sync="dialogVisibleInfo" width="800px" class="dialog-info"  :close-on-click-modal="false">
      <el-card class="box-card column" shadow="always">
          <div slot="header" class="clearfix">
            <span>用户信息</span>
          </div>
          <div  class="text item">
            <el-form  ref="infoForm" label-width="90px" label-position="left" :model="userDetailData">
              <el-row :gutter="50">
                <el-col :span="12">
                  <el-form-item label="编码:">
                    <span>{{userDetailData.uid||'无'}}</span>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="账号:">
                    <span>{{userDetailData.account||'无'}}</span>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="姓名:">
                    <span>{{userDetailData.realName||'无'}}</span>
                  </el-form-item>
              </el-col>
                <el-col :span="12">
                  <el-form-item label="用户类型:">
                    <span>{{userDetailData.userType=='0'?'普通用户':userDetailData.userType=='1'?'医生账户':userDetailData.userType=='1'?'推广员账户':'其他'||'无'}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="昵称:">
                    <span>{{userDetailData.nickname||'无'}}</span>
                  </el-form-item>
                </el-col>
              <el-col :span="12">
                  <el-form-item label="身份证号:">
                    <span>{{userDetailData.cardId||'无'}}</span>
                  </el-form-item>
              </el-col>
                <el-col :span="12">
                  <el-form-item label="生日:">
                    <span>{{userDetailData.birthday||'无'}}</span>
                  </el-form-item>
                </el-col>
              <el-col :span="12">
                  <el-form-item label="推广员姓名:">
                    <span>{{userDetailData.spreadName||'无'}}</span>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item label="推广码:">
                    <span>{{userDetailData.spreadNum||'无'}}</span>
                  </el-form-item>
              </el-col>
                <el-col :span="12">
                  <el-form-item label="注册时间:">
                    <span>{{userDetailData.addTimeString||'无'}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="头像:">
                    <el-avatar shape="square" size="large" :src="userDetailData.avatar"></el-avatar>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
      </el-card>
      <el-card class="box-card column" shadow="always">
          <div slot="header" class="clearfix">
            <span>资金信息</span>
          </div>
          <div  class="text item">
          <el-form  ref="infoForm" label-width="120px" label-position="left" :model="moneyInfoData">
            <el-row :gutter="50">
              <el-col :span="12">
                <el-form-item label="剩余积分:">
                  <span>{{moneyInfoData.integral||'无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="代金卷金额:">
                  <span>{{moneyInfoData.nowMoney||'0'}}元</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="历史消费金额:">
                  <span>{{moneyInfoData.hisSpendMoney||'0'}}元</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="总获得佣金奖励:">
                  <span>{{moneyInfoData.hisGetMoney||'0'}}元</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态:">
                  <span>{{moneyInfoData.status=='0'?'禁止':moneyInfoData.status=='1'?'正常':'无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <el-card class="box-card column" shadow="always">
        <div slot="header" class="clearfix">
          <span>家庭账户信息</span>
        </div>
        <div  class="text item">
            <el-table
            v-loading="loading"
            :data="patInfoData"
            border
            style="width: 100%"
          >
          <el-table-column type="index" width="50" label="序号" align="center"/>
          <el-table-column prop="family_relation" label="家庭关系" align="center" >
              <template slot-scope="scope">{{scope.row.family_relation===1?'本人':scope.row.family_relation===2?'家庭成员':scope.row.family_relation===3?'亲戚':scope.row.family_relation===4?'朋友':'其他'}} </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名" align="center"/>
          <el-table-column prop="cardId" label="身份证号" align="center"/>
          <el-table-column prop="sex" label="性别" align="center">
            <template slot-scope="scope">{{scope.row.sex===1?'男':scope.row.sex===2?'女':'未知'}} </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" align="center"/>
          <el-table-column prop="pid" label="是否主账户" align="center">
            <template slot-scope="scope">{{scope.row.pid===1?'否':'是'}} </template>
          </el-table-column>
        </el-table>
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisibleInfo = false" size="mini">关闭</el-button>
      </span>
    </el-dialog>

      <!-- 提现详情弹窗 -->
    <el-dialog title="提现详情" :visible.sync="dialogVisibleTiXian" width="1000px" class="dialog-info" append-to-body>
      <el-card class="box-card column" shadow="always">
        <el-table
        v-loading="loading"
        :data="tiXianData"
        border
        style="width: 100%"
      >
            <el-table-column type="index" width="50" label="序号" align="center"/>
            <el-table-column prop="realName" label="姓名" align="center"/>
            <el-table-column prop="bankCode" label="银行账号" align="center"/>
            <el-table-column prop="extractPrice" label="提现金额（元）" align="center"/>
            <el-table-column prop="freePrice" label="手续费（元）" align="center"/>
            <el-table-column prop="actualPrice" label="到账金额（元）" align="center"/>
            <el-table-column prop="extractType" label="提现方式" align="center" >
                <template slot-scope="scope">{{scope.row.extractType==='bank'?'银行卡':scope.row.extractType==='alipay'?'支付宝':scope.row.extractType==='wx'?'微信':'其他'}} </template>
            </el-table-column>
            <el-table-column prop="authStatus" label="状态" align="center" >
                <template slot-scope="scope">{{scope.row.authStatus===-1?'未通过':scope.row.authStatus===0 ?'审核中':scope.row.authStatus===1 ?'已提现':scope.row.authStatus===2 ?'已同意':'其他'}} </template>
            </el-table-column>
          </el-table>
          <pagination
          v-show="tiXianTotal>0"
          :total="tiXianTotal"
          :page.sync="tiXianParams.pageNum"
          :limit.sync="tiXianParams.pageSize"
          @pagination="getExtractListPage"
        />
    </el-card>
    </el-dialog>

    <!-- 充值详情弹窗 -->
    <el-dialog title="充值详情" :visible.sync="dialogVisibleChongZhi" width="1000px" class="dialog-info" append-to-body>
      <el-card class="box-card column" shadow="always">
        <el-table
        v-loading="loading"
        :data="chongZhiData"
        border
        style="width: 100%"
      >
            <el-table-column type="index" width="50" label="序号" align="center"/>
            <el-table-column prop="orderId" label="订单号" align="center"/>
            <el-table-column prop="price" label="充值金额（元）" align="center"/>
            <el-table-column prop="givePrice" label="赠送金额（元）" align="center"/>
            <el-table-column prop="addTime" label="充值时间" align="center"/>
            <el-table-column prop="paid" label="状态" align="center" >
                <template slot-scope="scope">{{scope.row.paid===0 ?'未充值':scope.row.paid===1 ?'已充值':'其他'}} </template>
            </el-table-column>
            <!-- <el-table-column prop="rechargeType" label="充值类型" align="center" /> -->
          </el-table>
          <pagination
          v-show="chongZhiTotal>0"
          :total="chongZhiTotal"
          :page.sync="chongZhiParams.pageNum"
          :limit.sync="chongZhiParams.pageSize"
          @pagination="getRechargeListPage"
        />
    </el-card>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import { getUserList,getAppUserDetail,deleteUser,addAppUser,updateAppUser,getExtractList,getRechargeList,setEffect,updateLoginPwd,updatePayPwd} from "@/api/consumer/consumer.js";
export default {
  components: {
    CountTo
  },
  data() {
    return {
      user: '',
      tableData: [],
      moneyInfoData: {},
      userDetailData: {},
      patInfoData: [],
      chongZhiData: [],
      tiXianData: [],
      title:'',
      total: 0,
      tiXianTotal:0,
      chongZhiTotal:0,
      loading: false,
      dialogVisible: false,
      dialogVisibleInfo: false,
      dialogVisibleTiXian: false,
      dialogVisibleChongZhi: false,
      dialogVisibleUpdatePayPwd: false,
      dialogVisibleLoginPwd: false,
      activeName: 'first',
      queryParams: {// 查询参数
        pageNum: 1,
        pageSize: 10,
        realName: undefined,
        account: undefined
      },
      tiXianParams:{
        pageNum: 1,
        pageSize: 10,
        uid:''
      },
      chongZhiParams:{
        pageNum: 1,
        pageSize: 10,
        uid:''
      },
       // 表单校验
      // rules: {
      //   pwd: [
      //     { required: true, message: "用户密码不能为空", trigger: "blur" },
      //     {
      //       pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
      //       message: "请输入正确的密码",
      //       trigger: "blur"
      //     }
      //   ],
      //   nickname: [
      //     { required: true, message: "用户昵称不能为空", trigger: "blur" }
      //   ],
      //   account: [
      //     { required: true, message: "用户账号不能为空", trigger: "blur" }
      //     // {
      //     //   pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      //     //   message: "请输入正确的手机号码",
      //     //   trigger: "blur"
      //     // }
      //   ],
      //   realName: [
      //     { required: true, message: "姓名不能为空", trigger: "blur" }
      //   ],
      //   userType: [
      //     { required: true, message: "用户类型不能为空", trigger: "change" }
      //   ],
      //   cardId: [
      //     { required: true, message: "身份证号不能为空", trigger: "blur" },
      //     {
      //       pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      //       message: "请输入正确的身份证号",
      //       trigger: "blur"
      //     }
      //   ]
      // },
      loginPwdRules: {
        newPwd: [
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
            message: "请输入6-18位数字加字母正确的密码",
            trigger: "blur"
          }
        ],
        confirmPwd: [
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
            message: "请输入6-18位数字加字母正确的密码",
            trigger: "blur"
          }
        ]
      },
      payPwdRules: {
        newPayPwd: [
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
            message: "请输入6-18位数字加字母正确的密码",
            trigger: "blur"
          }
        ],
        confirmPayPwd: [
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
            message: "请输入6-18位数字加字母正确的密码",
            trigger: "blur"
          }
        ]
      },
      form: {},
      loginPwdForm:{
        newPwd:'',
        confirmPwd:'',
        uid:'',
      },
      payPwdForm:{ 
        newPayPwd:'',
        confirmPayPwd:'',
        uid:'',
        },
      options: [{
          value: 0,
          label: '普通用户'
        }, {
          value: 1,
          label: '医生账户'
        }, {
          value: 2,
          label: '推广员账户'
        }]
    }
  },
  created() {
    //查询用户列表
    this.getAppUserList();
  },

  methods: {
     /** 获取订单列表 */
    getAppUserList() {
      this.loading = true
      getUserList(this.queryParams).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getAppUserList();
    },


    /** 设置有效无效 */
    changeStatus: function($event,row){
        if($event===1){
          const params={
            uid:row.uid,
            status:1
          }
          setEffect(params).then(response => {
          this.$message({
          type: 'success',
          message: '设置停用成功!'
        });
      });
        }else{
          const params={
            uid:row.uid,
            status:0
          }
          setEffect(params).then(response => {
          this.$message({
          type: 'success',
          message: '设置启用成功!'
        });
      });
        }
      },
      
     /** 详情按钮操作 */
    clickInfo(row) {
      this.dialogVisibleInfo = true;
        getAppUserDetail(row.uid).then(response => {
          this.moneyInfoData= response.data.moneyInfo||{};
          this.userDetailData= response.data.userDetail||{};
          this.patInfoData= response.data.patInfo||[];
          this.dialogVisibleInfo = true;
      });
    },

     /** 删除按钮操作 */
    clickDelete(row) {
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
            deleteUser(row.uid).then(response => {
              this.$message({
              type: "success",
              message: "删除成功!"
          });
          this.getAppUserList();
        });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /** 取消按钮操作 */
    cancel() {
      this.dialogVisible = false;
    },

    /*修改支付密码*/
    clickUpdatePayPwd(row){
      this.payPwdForm.uid=row.uid
      this.dialogVisibleUpdatePayPwd = true;
    },
    
    updatePayPwd(){
    this.$refs["payPwdForm"].validate(valid => {
              if (valid) {
                  if(this.payPwdForm.newPayPwd==''){
                      this.dialogVisibleUpdatePayPwd = false;
                      return
                  }else{
                    if(this.payPwdForm.confirmPayPwd==''){
                      this.msgError('请输入确认密码');
                    }else{
                        updatePayPwd(this.payPwdForm).then(response => {
                          if (response.code === 200) {
                            this.msgSuccess("修改成功");
                            this.dialogVisibleUpdatePayPwd = false;
                            this.resetForm('payPwdForm')
                          } else {
                            this.msgError(response.msg);
                          }
                          });
                    }
                  } 
              }})
    },

  /*修改登陆密码*/
    clickUpdateLoginPwd(row){
      this.loginPwdForm.uid=row.uid
      this.dialogVisibleLoginPwd = true;
    },
    
    updateLoginPwd(){
      this.$refs["loginPwdForm"].validate(valid => {
              if (valid) {
                  if(this.loginPwdForm.newPwd==''){
                      this.dialogVisibleLoginPwd = false;
                      return
                  }else{
                    if(this.loginPwdForm.confirmPwd==''){
                      this.msgError('请输入确认密码');
                    }else{
                        updateLoginPwd(this.loginPwdForm).then(response => {
                          if (response.code === 200) {
                            this.msgSuccess("修改成功");
                            this.dialogVisibleLoginPwd = false;
                            this.resetForm('loginPwdForm')
                          } else {
                            this.msgError(response.msg);
                          }
                          });
                    }
                  } 
              }})
    },

     // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // if (this.form.uid != undefined) {
            updateAppUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.dialogVisible = false;
                this.getAppUserList();
              } else {
                this.msgError(response.msg);
              }
            });
          // } else {
            // addAppUser(this.form).then(response => {
            //   if (response.code === 200) {
            //     this.msgSuccess("新增成功");
            //     this.dialogVisible = false;
            //     this.getAppUserList();
            //   } else {
            //     this.msgError(response.msg);
            //   }
            // });
          // }
        }
      });
    },

    /** 获取提现列表 */
    getExtractLists(row) {
      this.dialogVisibleTiXian=true
      if(row){this.tiXianParams.uid=row.uid}
      getExtractList(this.tiXianParams).then(response => {
        this.loading = false
        this.tiXianData = response.rows;
        this.tiXianTotal = response.total;
      });
    },

      /** 获取充值列表 */
    getRechargeLists(row) {
      this.dialogVisibleChongZhi=true
      if(row){this.chongZhiParams.uid=row.uid}
      getRechargeList(this.chongZhiParams).then(response => {
        this.chongZhiData = response.rows;
        this.chongZhiTotal = response.total;
      });
    },

     /** 获取提现分页 */
    getExtractListPage(){
      this.getExtractLists()
    },

     /** 获取充值分页 */
    getRechargeListPage(){
      this.getRechargeLists()
    }

      /** 新增按钮操作 */
    // clickAdd() {
    //   this.dialogVisible = true;
    //   this.title="新增用户"
    // },

    /** 编辑按钮操作 */
    // clickEdit(row) {
    //   const uid = row.uid;
    //   getAppUserDetail(uid).then(response => {
    //     this.form = response.data.userDetail;
    //     this.dialogVisible = true;
    //     this.title="编辑用户";
    //   });
    // },
  }
}
</script>

<style lang="scss">
.consumer {
  .box-card {
    margin-bottom: 20px;
  }
  padding: 15px;
  label {
    font-weight: inherit;
  }
  .dialog-info{
  .column {
    .el-card__header {
      background: #e3e3e3;
      }
      .el-form-item{
        margin-bottom:10px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.consumer{ padding: 30px;
.pagination-container {
    background: none !important;
  }}
</style>
