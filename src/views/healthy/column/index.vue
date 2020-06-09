<template>
  <!-- 栏目管理 （完成）-->
  <div class="column">
    <div>
      <!-- 新增 -->
      <el-button type="primary"
                 @click="clickAdd"
                 size="mini"
                 class='button-create'
                 icon="el-icon-plus">新增栏目</el-button>

      <!-- 列表表格 -->
      <el-table v-loading="loading"
                :data="tableData"
                style="width: 100%"
                row-key="id"
                lazy
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column type="index"
                         width="50"
                         align="center" />
        <el-table-column prop="addTime"
                         label="添加时间"
                         align="center" />
        <el-table-column prop="columnName"
                         label="栏目名称"
                         align="center" />
        <el-table-column prop="parentName"
                         label="上级栏目"
                         align="center" />
        <el-table-column prop="sort"
                         label="排序"
                         align="center" />
        <el-table-column prop="status"
                         label="状态"
                         align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
                       active-color="#13ce66"
                       inactive-color="#cccccc"
                       :active-value="1"
                       :inactive-value='0'
                       @change='changeStatus($event,scope.row)'>
            </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="name" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="clickInfo(scope.row)" size="mini">查看</el-button>
            <el-button type="primary" @click="clickEdit(scope.row)" size="mini">编辑</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="queryParams.pageNum"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getAppColumnList" />
    </div>

    <!-- 新增弹窗 -->
    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               width="580px"
               :close-on-click-modal="false">
      <el-card shadow="always">
        <el-form ref="form"
                 :rules="rules"
                 :model="form"
                 label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="栏目名称"
                            prop="columnName">
                <el-input v-model="form.columnName"
                          clearable
                          size="small"
                          placeholder="请输入栏目名称" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="栏目图片"
                            prop="columnImg">
                <el-upload class="avatar-uploader"
                           action="#"
                           :show-file-list="false"
                           :before-upload="beforeAvatarUpload"
                           :http-request="requestUpload">
                  <img v-if="form.columnImg"
                       :src="form.columnImg"
                       class="avatar">
                  <i v-else
                     class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="上级栏目"
                            prop="parentId">
                <el-select v-model="form.parentId"
                           placeholder="请选择"
                           size="small"
                           style="width:100%"
                           @focus="getAppColumnFlagList">
                  <el-option v-for="item in options"
                             :key="item.id"
                             :label="item.columnName"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="排序"
                            prop="sort">
                <el-input-number v-model="form.sort"
                                 controls-position="right"
                                 size="small"
                                 :min="0"
                                 placeholder="请输入排序"
                                 style="width:100%" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="状态"
                            prop="status">
                <el-select v-model="form.status"
                           placeholder="请选择状态"
                           clearable
                           size="small"
                           style="width:100%">
                  <el-option label="有效"
                             value="1"></el-option>
                  <el-option label="无效"
                             value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <span slot="footer">
        <el-button @click="cancel"
                   size="mini">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm"
                   size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title="详情"
               :visible.sync="dialogVisibleInfo"
               width="800px"
               class="dialog-info"
               :close-on-click-modal="false">
      <el-card class="box-card column"
               shadow="always">
        <el-form label-width="80px"
                 label-position="left"
                 :model="columnDetailData">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="父级:">
                <el-input v-model="columnDetailData.parentName"
                          :disabled="true"
                          size="mini"
                          placeholder="暂无数据" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="添加时间:">
                <el-input v-model="columnDetailData.addTime"
                          :disabled="true"
                          size="mini"
                          placeholder="暂无数据" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="栏目名称:">
                <el-input v-model="columnDetailData.column"
                          :disabled="true"
                          size="mini"
                          placeholder="暂无数据" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序:">
                <el-input v-model="columnDetailData.sort"
                          :disabled="true"
                          size="mini"
                          placeholder="暂无数据" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态:">
                <el-input v-model="columnDetailData.status=1?'可用':'不可用'"
                          :disabled="true"
                          size="mini"
                          placeholder="暂无数据" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="dialogVisibleInfo = false"
                   size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import { getColumnList, getColumnDetail, addColumn, updateColumn, setEffect, uploadImg } from "@/api/healthy/column.js";

export default {
  components: {
    CountTo
  },
  data () {
    return {
      tableData: [],
      columnDetailData: {},
      fileList: [],
      loading: false,
      title: '',
      user: '',
      total: 0,
      dialogVisible: false,
      dialogVisibleInfo: false,
      dialogVisibleImg: false,
      options: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        flag: '',
      },
      // 表单校验
      rules: {
        columnName: [
          { required: true, message: "栏目名称不能为空", trigger: "blur" }
        ],
        columnImg: [
          { required: true, message: "栏目图片不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "顺序不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "上级不能为空", trigger: "change" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" }
        ]
      },
      form: {
        column: undefined,
        columnImg: '',
        sort: "",
        parentId: "",
        status: "",
        id: undefined
      }
    };
  },
  created () {
    //查询列表
    this.getAppColumnList();
  },
  methods: {
    /** 获取列表 */
    getAppColumnList () {
      this.loading = true
      this.queryParams.flag = '';
      getColumnList(this.queryParams).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
      });
    },

    /** 获取一级栏目 */
    getAppColumnFlagList () {
      this.queryParams.flag = 'parent';
      getColumnList(this.queryParams).then(response => {
        this.options = response.rows;
      });
    },

    /** 新增按钮操作 */
    clickAdd () {
      this.reset();
      this.dialogVisible = true;
      this.title = "新增栏目"
    },

    /** 编辑按钮操作 */
    // clickEdit(row) {
    //   this.reset();
    //   const id = row.id;
    //   getColumnDetail(id).then(response => {
    //     this.form = response.data;
    //     this.dialogVisible = true;
    //     this.title="编辑栏目";
    //   });
    // },

    /** 详情按钮操作 */
    // clickInfo(row) {
    //   this.dialogVisibleInfo = true;
    //     getColumnDetail(row.id).then(response => {
    //       this.columnDetailData= response.data;
    //       this.dialogVisibleInfo = true;
    //   });
    // },

    /** 取消按钮操作 */
    cancel () {
      this.dialogVisible = false;
      this.reset();
    },

    /** 表单重置 */// 
    reset () {
      this.form = {
        column: "",
        columnImg: "",
        sort: "",
        parentId: "",
        status: ""
      };
      this.resetForm("form");
    },

    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // this.form.columnImg=this.fileList[0].url||''
          if (this.form.id != undefined) {
            updateColumn(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.dialogVisible = false;
                this.getAppColumnList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addColumn(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.dialogVisible = false;
                this.getAppColumnList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },

    /** 设置有效无效 */
    changeStatus: function ($event, row) {
      const id = row.id
      if ($event === 1) {
        setEffect(id, 1).then(response => {
          this.$message({
            type: 'success',
            message: '设置成功!'
          });
        });
      } else {
        setEffect(id, 0).then(response => {
          this.$message({
            type: 'success',
            message: '设置成功!'
          });
        });
      }
    },
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
          this.form.columnImg = response.imgUrl;
        } else {
          this.msgError(response.msg);
        }
      });
    }
  }
};
</script>

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
<style lang="scss" scoped>
.column {
  padding: 30px;
  .button-create {
    //新增按钮
    margin-bottom: 20px;
  }
  .pagination-container {
    background: none !important;
  }
}
</style>
