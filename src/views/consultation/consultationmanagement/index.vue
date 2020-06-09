<template>
<!-- 
  1、团队评分字段 (暂时注释)
 -->
  <div class="everypage">
    <!-- 筛选 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>搜索条件</span>
      </div>
      <div>
        <el-form ref="ruleForm" :model="ruleForm" label-width="75px">
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
          <el-form-item label="主导医生:" prop="realName">
            <el-input v-model="ruleForm.realName" size="mini" placeholder="请输入" style="width:50%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" icon="el-icon-search"  @click="searchConsultation">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetForm('ruleForm')" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 列表表格 -->
    <div class="tablemain">
      <!-- <el-button class="tabledeletebtn" type="primary" size="mini">批量删除订单</el-button> -->
      <el-table
        class="tablecss"
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column label="编号" min-width="40" align="center">
          <template slot-scope="scope">{{ scope.row.uid }}</template>
        </el-table-column>
        <el-table-column prop="realName" label="主导医生" min-width="52" align="center"></el-table-column>
        <el-table-column prop="teamSkill" label="主治疾病" min-width="52" align="center"></el-table-column>
        <el-table-column prop="teamInfo" label="团队特色" min-width="52" align="center"></el-table-column>
        <!-- <el-table-column prop="teamInfo" label="团队评分" min-width="52" align="center"></el-table-column> -->
        <el-table-column prop="type" label="团队类型" min-width="52" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.type | capitalizetype}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="创建时间" min-width="80" align="center"></el-table-column>
        <el-table-column prop="address" label="操作" min-width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text"  icon="el-icon-view" @click="consultationDetail(scope.row)" size="mini">团队详情</el-button>
            <el-button type="text" icon="el-icon-bank-card" @click="storeConsultDetail(scope.row.id)" size="mini">会诊订单</el-button>
            <el-button type="text" icon="el-icon-edit-outline" @click="consultationRemark(scope.row)" size="mini">团队备注</el-button>
            <!-- <el-button type="primary" @click="consultationRemark(scope.row)" size="mini">查看医生信息</el-button> -->
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
    <el-dialog title="团队详情" :visible.sync="dialogVisible" width="70%">
      <div class="twocolumn">
        <p>会诊团队信息</p>
        <div class="twocolumnlist">
          <div>
            <p>主导医生：{{consultatDetail.realName}}</p>
            <p>主治疾病：{{consultatDetail.teamSkill}}</p>
          </div>
          <div>
            <p>团队特色：{{consultatDetail.teamInfo}}</p>
            <p>团队类型：{{consultatDetail.type | capitalizetype}}</p>
          </div>
          <div>
            <p>擅长疾病：</p>
          </div>
        </div>
      </div>
      <div class="twocolumn">
        <p>参与医生信息</p>
        <div class="">
          <el-table
            class="tablecss"
            ref="multipleTable"
            v-loading="loading1"
            :data="tableDatauserConsult"
          >
            <el-table-column prop="realName" label="医生姓名"  align="center"></el-table-column>
            <el-table-column prop="isMaster" label="是否主导" width="80" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.isMaster | capitalizeisMaster}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="authStatus" label="状态" width="80" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.authStatus | capitalizeauthStatus}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="addTime" label="申请时间" min-width="130" align="center"></el-table-column>
            <el-table-column prop="authTime" label="加入时间" min-width="130" align="center"></el-table-column>
            <el-table-column prop="address" label="操作" min-width="100" align="center">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-view" @click="seedetailtdxq(scope.row)" size="mini">查看</el-button>
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
            style="margin-bottom:10px"
          ></el-pagination>
        </div>
      </div>
      <div class="twocolumn">
        <p>团队备注</p>
        <div class="twocolumnlist">
          <div>
              <p>团队备注：{{consultatDetail.mark}}</p>
            </div>
        </div>
      </div>
    </el-dialog>
    <!-- 团队详情弹窗列表里面的查看弹窗详情弹窗 -->
    <el-dialog title="医生详情" :visible.sync="dialogVisible1" width="60%">
      <div>
        <div class="twocolumn">
          <p>医生详情</p>
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
              <p>医生类型：{{doctorInfoObj.doctType}}</p>
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
    <!-- 订单会诊详情弹窗 -->
    <el-dialog title="会诊订单" :visible.sync="dialogVisible2" width="76%">
      <div class="twocolumn">
        <p>会诊订单</p>
        <div class="">
          <el-table
          class="tablecss"
          ref="multipleTable"
          v-loading="loading2"
          :data="tableDatastoreConsult"
          border
          style="width: 100%"
        >
          <!-- <el-table-column type="selection" width="40"></el-table-column> -->
          <el-table-column label="订单号" prop="orderId" min-width="80" align="center"></el-table-column>
          <el-table-column label="患者姓名" prop="realName" min-width="74" align="center"></el-table-column>
          <el-table-column label="用户姓名" prop="userName" min-width="74" align="center"></el-table-column>
          <el-table-column label="用户账号" prop="account" min-width="74" align="center"></el-table-column>
          <el-table-column label="支付金额" prop="payPrice" min-width="74" align="center"></el-table-column>
          <el-table-column prop="paid" label="支付状态" min-width="74" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.paid | capitalizeispaid}}</span>
            </template>
          </el-table-column>
          <el-table-column label="主治医生" prop="doctorName" min-width="74" align="center"></el-table-column>
          <el-table-column prop="isMaster" label="是否主导" min-width="74" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.isMaster | capitalizeisMaster}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="订单状态" min-width="74" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.status | capitalizeauthStatus2}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="下单时间" min-width="100" align="center"></el-table-column>
          <el-table-column prop="address" label="操作" min-width="110" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="seedetailhz(scope.row.orderId)" size="mini">查看</el-button>
              <el-button type="primary" @click="deletehz(scope.row.orderId)" size="mini">删除</el-button>
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
          style="margin-bottom:10px"
        ></el-pagination>
        </div>
      </div>
    </el-dialog>
    <!-- 会诊订单里面的详情弹窗查看 -->
    <el-dialog title="订单详情" :visible.sync="dialogVisible4" width="60%">
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
              <p>支付状态：{{orderDetail.paid | capitalizeispaid}}</p>
              <p>订单状态：{{orderDetail.orderState | capitalizeauthStatus2}}</p>
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
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" style="width:80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="updateRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getuserConsultList,getuserConsultDetail,getstoreConsultDetail,updateuserConsultRemark,getDoctorInfo } from "@/api/consultation/consultationmanagement";
import {
  getServiceOrderDetail,
  deleteOrder
   } from "@/api/order/service";
export default {
  data() {
    return {
      datatimeShow: false, //自定义时间组件
      datatime:'',
      ruleForm: {
        realName:'',
        timeFlag: "0"
      },
      total: 1,
      currentPage: 1,
      pagesize: 10,
      total1: 1,
      currentPage1: 1,
      pagesize1: 10,
      total2: 1,
      currentPage2: 1,
      pagesize2: 10,
      tableData: [],
      tableDatauserConsult: [],
      tableDatastoreConsult: [],
      dialogVisible: false,
      dialogVisible2: false,
      loading: false,
      loading1: false,
      loading2: false,
      dialogFormVisible: false,
      id:'',
      consultatDetail:{}, // 会诊团队信息
      dialogVisible1:false, // 团队详情里面的列表查看
      doctorInfoObj:{},// 团队详情里面的列表查看数据


      form: {
        remark: ""
      },
      multipleSelection: [],
      // 会诊订单里面的查看
      dialogVisible4: false,
      appointDetail:{},
      orderDetail:{},
      remark:'',
    };
  },
  filters: {
    // 0未认证；1已认证；-1认证失败；-2认证失效
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
    isDrugcapitalize: function(value) {
      if (value == 0) {
        return "未用药";
      } else if (value == 1) {
        return "用药中";
      }
    },
    sexcapitalize: function(value) {
      if (value == 0) {
        return "男";
      } else if (value == 1) {
        return "女";
      }
    },
    capitalizetype: function(value) {
      if (value == 0) {
        return "临时组队";
      } else if (value == 1) {
        return "固定团队";
      }
    },
    capitalizeisMaster: function(value) {
      if (value == 0) {
        return "否";
      } else if (value == 1) {
        return "是";
      }
    },
    capitalizeauthStatus: function(value) {
      if (value == 0) {
        return "待确定";
      } else if (value == 1) {
        return "有效";
      } else if (value == -1) {
        return "无效";
      }
    },
    capitalizeauthStatus2: function(value) {
      if (value == 0) {
        return "待服务";
      } else if (value == 1) {
        return "已接单服务中";
      } else if (value == 2) {
        return "已完成";
      }  else if (value == 3) {
        return "已评论";
      }  else if (value == -1) {
        return "申请退款";
      }  else if (value == -2) {
        return "退款成功";
      }
    },
    capitalizeispaid: function(value) {
      if (value == 0) {
        return "未支付";
      } else if (value == 1) {
        return "已支付";
      }
    }
    
  },
   created() {
    this.getuserConsultList(); //列表
  },
  methods: {
    // 会诊订单弹窗查看
    seedetailhz(val){
      this.dialogVisible4 = true;
      getServiceOrderDetail({
        orderId:val
      }).then(response => {
        this.appointDetail = response.data.appointDetail;
        this.orderDetail = response.data.orderDetail;
        this.remark = response.data.remark;
      });
    },
    // 会诊订单弹窗删除
    deletehz(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteOrder(val).then(response => {
            this.storeConsultDetail()
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
    // 团队详情里面的查看
    seedetailtdxq(row){
      this.dialogVisible1 = true
      getDoctorInfo({
        uid:row.uid
      }).then(res => {
        this.doctorInfoObj = res.data
      })
    },
    //张敏敏点击 搜索按钮
    searchConsultation() {
      this.currentPage = 1;
      this.getuserConsultList();
    },
    // 列表
    getuserConsultList() {
      this.loading = true;
      var params = {
        pageNum: this.currentPage,
        pageSize: this.pagesize,
        realName: this.ruleForm.realName,
        timeFlag: this.ruleForm.timeFlag
      };
      if (this.ruleForm.timeFlag == 7) {
        params.beginDate = this.datatime[0];
        params.endDate = this.datatime[1];
      }
      getuserConsultList(params).then(response => {
        this.loading = false;
        this.tableData = response.rows;
        this.total = response.total;
      });
    },
    // 创建时间改变
    changecjsj(val) {
      val == 7 ? (this.datatimeShow = true) : (this.datatimeShow = false);
    },
    // 列表分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.getuserConsultList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getuserConsultList();
    },
    // 详情分页
    handleSizeChange1(val) {
      this.pagesize1 = val;
      this.consultationDetail();
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this.consultationDetail();
    },
    // 会诊详情分页
    handleSizeChange2(val) {
      this.pagesize2 = val;
      this.storeConsultDetail();
    },
    handleCurrentChange2(val) {
      this.currentPage2 = val;
      this.storeConsultDetail();
    },
    // 重置
    resetForm(formName) {
      this.datatimeShow = false
      this.$refs[formName].resetFields();
    },
    // 订单详情列表
    consultationDetail(row){
      this.consultatDetail = row
      this.loading1 = true;
      this.dialogVisible = true;
      var params = {
        pageNum: this.currentPage1,
        pageSize: this.pagesize1,
        userConsultId: row.id
      };
      getuserConsultDetail(params).then(response => {
        this.loading1 = false;
        this.tableDatauserConsult = response.rows;
        this.total1 = response.total;
      });
    },
    // 订单详情列表
    storeConsultDetail(val){
      this.loading2 = true;
      this.dialogVisible2 = true;
      var params = {
        pageNum: this.currentPage2,
        pageSize: this.pagesize2,
        id: val
      };
      getstoreConsultDetail(params).then(response => {
        this.loading2 = false;
        this.tableDatastoreConsult = response.rows;
        this.total2 = response.total;
        //
      });
    },
    // 点击订单备注
    consultationRemark(val) {
      this.dialogFormVisible = true;
      this.form.remark = val.mark
      this.id = val.id;
    },
    // 提交更新备注信息
    updateRemark() {
      updateuserConsultRemark({
        id: this.id,
        mark: this.form.remark
      }).then(response => {
        this.dialogFormVisible = false;
        this.getuserConsultList();
        this.$message({
          type: "success",
          message: "备注成功!"
        });
      });
    },
  }
};
</script>
<style lang="scss">
.everypage{
  .column {
    .el-card__header {
      background: #e3e3e3;
    }
    .el-form-item{
      margin-bottom:0;
    }
    .columnList{
      >div{
        display: flex;
        border-bottom: 1px solid #ccc;
        // justify-content: space-center;
        >p{
          flex: 1;
          margin-right: 20px;
          line-height: 26px;
          margin: 5px;
        }
      }

    }
  }
}

</style>
