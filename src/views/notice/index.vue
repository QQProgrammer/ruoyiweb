<template>
  <!-- 公告（完成）
 -->
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             :inline="true"
             label-width="68px">
      <el-form-item label="公告标题"
                    prop="title">
        <el-input v-model="queryParams.title"
                  placeholder="请输入公告标题"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="操作人员"
                    prop="createBy">
        <el-input v-model="queryParams.createBy"
                  placeholder="请输入操作人员"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="类型"
                    prop="noticeType">
        <el-select v-model="queryParams.noticeType"
                   placeholder="公告类型"
                   clearable
                   size="small">
          <el-option v-for="dict in typeOptions"
                     :key="dict.dictValue"
                     :label="dict.dictLabel"
                     :value="dict.dictValue" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-search"
                   size="mini"
                   @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh"
                   size="mini"
                   @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10"
            class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['system:notice:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="success"
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['system:notice:edit']">修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['system:notice:remove']">删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading"
              :data="noticeList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="55"
                       align="center" />
      <el-table-column label="ID"
                       align="center"
                       prop="id" />
      <el-table-column label="公告标题"
                       align="center"
                       prop="title" />
      <el-table-column label="类型"
                       align="center"
                       prop="userType">
        <template slot-scope="scope">
          {{scope.row.userType=='0'?'普通用户':scope.row.userType=='2'?'推广员账户':scope.row.userType=='1'?'医生账户':"其他"}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间"
                       align="center"
                       prop="addTime" />
      <el-table-column label="发送时间"
                       align="center"
                       prop="send_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.send_time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       align="center"
                       class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     @click="handleInfo(scope.row)"
                     icon="el-icon-view">详细</el-button>
          <!-- <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:notice:edit']">修改</el-button> -->
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['system:notice:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="780px"
               append-to-body>
      <el-form ref="form"
               :model="form"
               :rules="rules"
               label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题"
                          prop="title">
              <el-input v-model="form.title"
                        placeholder="请输入公告标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型"
                          prop="userType">
              <el-select v-model="form.userType"
                         placeholder="请选择">
                <el-option v-for="dict in userTypeOptions"
                           :key="dict.dictValue"
                           :label="dict.dictLabel"
                           :value="dict.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="公告类型"
                          prop="noticeType">
              <el-select v-model="form.noticeType"
                         placeholder="请选择">
                <el-option v-for="dict in typeOptions"
                           :key="dict.dictValue"
                           :label="dict.dictLabel"
                           :value="dict.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusOptions"
                          :key="dict.dictValue"
                          :label="dict.dictValue">{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="内容"
                          prop="content">
              <Editor v-model="form.content" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer"
           class="dialog-footer"
           style="padding-top:20px">
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详情公告对话框 -->
    <el-dialog title="详情"
               :visible.sync="openInfo"
               width="780px"
               append-to-body>
      <el-card shadow="always">
        <el-form ref="form"
                 :model="formInfo"
                 label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="公告标题:">
                <span>{{formInfo.title}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型:">
                <span> {{formInfo.userType=='0'?'普通用户':formInfo.userType=='2'?'推广员账户':formInfo.userType=='1'?'医生账户':"其他"}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间:">
                <span>{{formInfo.addTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发送时间:">
                <span><span>{{ parseTime(formInfo.send_time, '{y}-{m}-{d}') }}</span></span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="内容:"
                            prop="content">
                <span>{{formInfo.content}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer"
           class="dialog-footer"
           style="padding-top:20px">
        <el-button @click="openInfo=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listNotice, getNotice, delNotice, addNotice, updateNotice, exportNotice } from "@/api/notice/notice";
import Editor from '@/components/Editor';

export default {
  name: "Notice",
  components: {
    Editor
  },
  data () {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 公告表格数据
      noticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openInfo: false,
      // 类型数据字典
      // statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      userTypeOptions: [
        {          'dictValue': 0,
          'dictLabel': '普通用户'        },
        {          'dictValue': 1,
          'dictLabel': '医生账户'        },
        {          'dictValue': 2,
          'dictLabel': '推广员账户'        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        // createBy: undefined,
        // status: undefined
      },
      // 表单参数
      form: {
        "isSys": 1,
        "type": 0
      },
      formInfo: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.getList();
    // this.getDicts("sys_notice_status").then(response => {
    //   this.statusOptions = response.data;
    // });
    // this.getDicts("sys_notice_type").then(response => {
    //   this.typeOptions = response.data;
    // });
  },
  methods: {
    /** 查询公告列表 */
    getList () {
      this.loading = true;
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // // 公告状态字典翻译
    // statusFormat (row, column) {
    //   return this.selectDictLabel(this.statusOptions, row.status);
    // },
    // // 公告状态字典翻译
    // typeFormat (row, column) {
    //   return this.selectDictLabel(this.typeOptions, row.noticeType);
    // },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        noticeId: undefined,
        title: undefined,
        noticeType: undefined,
        content: undefined,
        userType: undefined,
        // status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加公告";
    },
    /** 查看按钮操作 */
    handleInfo (row) {
      this.openInfo = true;
      this.formInfo = row
    },

    /** 修改按钮操作 */
    // handleUpdate (row) {
    //   this.reset();
    //   const noticeId = row.id || this.ids
    //   getNotice(noticeId).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.title = "修改公告";
    //   });
    // },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateNotice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            this.form.isSys = 1
            this.form.type = 0
            this.form.sendTime = 12345
            addNotice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const noticeIds = row.id || this.ids
      this.$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delNotice(noticeIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    }
  }
};
</script>