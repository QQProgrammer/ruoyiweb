<template>
  <!-- 文章管理 （完成）
-->
  <div class="article">

    <!-- 列表表格 -->
    <el-table class="tablecss"
              v-loading="loading"
              :data="tableData"
              style="width: 100%">
      <el-table-column type="index"
                       width="50"
                       align="center" />
      <el-table-column prop="title"
                       label="文章标题"
                       align="center" />
      <el-table-column prop="columnName"
                       label="所属栏目"
                       align="center" />
      <el-table-column prop="readCount"
                       label="阅读量"
                       align="center" />
      <el-table-column prop="price"
                       label="价格（元）"
                       align="center" />
      <el-table-column prop="uid"
                       label="添加人"
                       align="center" />
      <el-table-column prop="addTime"
                       label="创建时间"
                       align="center" />
      <el-table-column prop="status"
                       label="状态"
                       align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status"
                     active-color="#13ce66"
                     inactive-color="#cccccc"
                     :active-value="1"
                     :inactive-value="0"
                     @change='changeStatus($event,scope.row)'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name"
                       label="操作"
                       align="center"
                       width="230">
        <template slot-scope="scope">
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
                @pagination="getArticleList" />
    <!-- 详情弹窗 -->
    <el-dialog title="患者详情"
               :visible.sync="dialogVisibleInfo"
               width="600px"
               class="dialog-info"
               :close-on-click-modal="false">
      <el-card class="box-card column"
               shadow="always">
        <el-form label-width="100px"
                 label-position="left"
                 :model="articleDetailData">
          <el-row :gutter="100">
            <!-- <el-col :span="12">
              <el-form-item label="栏目id:">
                <span>{{articleDetailData.column_id||'无'}}</span>
              </el-form-item>
          </el-col> -->
            <!-- <el-col :span="12">
              <el-form-item label="用户id:">
                <span>{{articleDetailData.uid||'无'}}</span>
              </el-form-item>
          </el-col> -->
            <el-col :span="24">
              <el-form-item label="文章标题:">
                <span>{{articleDetailData.title||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属栏目:">
                <span>{{articleDetailData.columnName||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="添加时间:">
                <span>{{articleDetailData.addTime||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="文章价格:">
                <span>{{articleDetailData.price||'无'}}元</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="关键字 :">
                <span>{{articleDetailData.keyword||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="阅读量:">
                <span>{{articleDetailData.readCount||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="状态:">
                <span>{{articleDetailData.status=1?'有效':articleDetailData.status=2?'无效':'未知'||'无'}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="图片:">
                <el-image style="width: 100px; height: 100px"
                          :src="articleDetailData.imgUrl">
                </el-image>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <span slot="footer"
            class="dialog-footer">
        <el-button plain
                   @click="dialogVisibleInfo = false"
                   size="mini">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CountTo from "vue-count-to";

import { getArticleList, setEffect, getArticleDetail } from "@/api/healthy/newsInfo.js";
//
export default {
  components: {
    CountTo
  },
  data () {
    return {
      tableData: [],
      articleDetailData: {},
      total: 0,
      dialogVisibleInfo: false,
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      form: {
        columnId: "",
        title: "",
        newsInfo: "",
        price: "",
        imgUrl: "",
        id: undefined
      }
    };
  },
  created () {
    //查询文章列表
    this.getArticleList();
  },
  methods: {

    /** 获取列表 */
    getArticleList () {
      this.loading = true
      getArticleList(this.queryParams).then(response => {
        this.loading = false
        this.tableData = response.rows;
        this.total = response.total;
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

    /** 详情按钮操作 */
    clickInfo (row) {
      console.log(row)
      this.dialogVisibleInfo = true;
      getArticleDetail(row.column_id).then(response => {
        this.articleDetailData = response.data
        this.dialogVisibleInfo = true;
      });
    },

  }
};
</script>
<style lang="scss">
.article {
  .box-card {
    margin-bottom: 20px;
  }
  padding: 15px;
  label {
    font-weight: inherit;
  }
  .dialog-info {
    .column {
      .el-card__header {
        background: #e3e3e3;
      }
      .el-form-item {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.article {
  padding: 30px;
  .pagination-container {
    background: none !important;
  }
}
</style>
