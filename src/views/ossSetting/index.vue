<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-button size="default" type="primary" class="ml10" @click="fetchData()">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddOrEdit('add')">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center"/>
        <el-table-column prop="url" label="接口地址" align="center" width="200"></el-table-column>
        <el-table-column prop="type" label="类型" width="100" align="center"></el-table-column>
        <el-table-column prop="accessKey" label="访问密钥" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="secretKey" label="密钥" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bucketName" label="桶名称" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="view" label="预览域名" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="region" label="所属区域" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="prefix" label="前缀" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="status" label="默认使用" width="120">
          <template #default="scope">
            <el-switch
                v-model="scope.row.status"
                @change="setDefaultOss(scope.row)"
                :active-value="1"
                :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" text type="text" @click="onOpenAddOrEdit('edit', scope.row)">修改</el-button>
            <el-button size="small" text type="text" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          :current-page="state.tableData.param.current"
          background
          :page-size="state.tableData.param.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.tableData.total"
      >
      </el-pagination>
    </el-card>
    <el-dialog :title="state.dialog.title" :visible.sync="state.dialog.isShowDialog" width="769px">
      <div>
        <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
          <el-row :gutter="35">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="接口地址">
                <el-input v-model="state.ruleForm.url" placeholder="URL地址"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="预览域名">
                <el-input v-model="state.ruleForm.view" placeholder="预览域名"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="桶名称">
                <el-input v-model="state.ruleForm.bucketName" placeholder="桶名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="类型">
                <el-select v-model="state.ruleForm.type" placeholder="请选择类型" style="width: 100%">
                  <el-option
                      v-for="item in state.ossType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="访问密钥">
                <el-input v-model="state.ruleForm.accessKey" placeholder="访问密钥"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="密钥">
                <el-input v-model="state.ruleForm.secretKey" placeholder="密钥"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="所属区域">
                <el-input v-model="state.ruleForm.region" placeholder="所属区域"
                          clearable></el-input>
              </el-form-item>
            </el-col>
<!--            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">-->
<!--              <el-form-item label="前缀">-->
<!--                <el-input v-model="state.ruleForm.prefix" placeholder="前缀"-->
<!--                          clearable></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
          </el-row>
        </el-form>
        <template>
					<span class="dialog-footer">
						<el-button @click="onCancel" size="default">取 消</el-button>
						<el-button type="primary" @click="onSubmit" :loading="state.submitBtn.loading"
                       size="default">{{ state.dialog.submitTxt }}</el-button>
					</span>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {Message, MessageBox} from 'element-ui';
import {useOssSettingApi} from "@/api/ossSetting";

export default {
  name: "ossSetting",
  data() {
    return {
      state: {
        tableData: {
          data: [],
          total: 0,
          loading: false,
          param: {
            current: 1,
            limit: 10,
            keyword: '',
          }
        },
        dialog: {
          isShowDialog: false,
          type: '',
          title: '',
          submitTxt: '',
        },
        ossType: [{
          label: 'Minio',
          value: 'minio'
        }, {
          label: '七牛',
          value: 'qiniu'
        }, {
          label: '腾讯云',
          value: 'qcloud'
        }],
        ruleForm: {
          url: '', // URL地址
          type: '', // 类型
          accessKey: '', // 访问密钥
          secretKey: '', // 密钥
          bucketName: '', // 桶名称
          view: '', //
          prefix: '', // 前缀
          createDate: '', // 创建时间
          status: 0, // 1:默认 0可选
          region: '', // 所属区域
        },
        submitBtn: {
          loading: false,
          type: ''
        }
      }
    }
  },
  methods: {
    setDefaultOss(row) {
      if (!row.status) {
        Message.error('最少保留一个默认配置');
        this.fetchData()
        return
      }
      useOssSettingApi().setDefault(row).then(response => {
        Message.success('设置成功');
        this.fetchData()
      }).catch(() => {
        this.fetchData()
      })
    },
    fetchData() {
      this.state.ruleForm = {}
      this.state.tableData.loading = true
      useOssSettingApi().list(this.state.tableData.param).then(response => {
        this.state.tableData.data = response.data.records
        this.state.tableData.total = response.data.total
        this.state.tableData.loading = false
      })
    },
    onOpenAddOrEdit(type, row) {
      if (type === 'edit') {
        this.state.submitBtn.type = 'edit';
        this.state.ruleForm = row;
        this.state.dialog.title = '修改存储配置';
        this.state.dialog.submitTxt = '修 改';
      } else {
        this.state.submitBtn.type = 'add';
        this.state.ruleForm = {
          url: '', // URL地址
          type: '', // 类型
          accessKey: '', // 访问密钥
          secretKey: '', // 密钥
          bucketName: '', // 桶名称
          view: '', //
          prefix: '', // 前缀
          createDate: '', // 创建时间
          status: 0, // 1:默认 0可选
          region: '', // 所属区域
        };
        this.state.dialog.title = '新增存储配置';
        this.state.dialog.submitTxt = '新 增';
      }
      this.state.dialog.isShowDialog = true;
    },
    onRowDel(row) {
      MessageBox.confirm(`此操作将永久删除，是否继续?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.deleteInfo(row)
      }).catch(() => {
      });
    },
    handleSizeChange(pageSize) {
      this.state.tableData.data = []
      this.state.tableData.param.limit = pageSize
      this.fetchData()
    },
    handleCurrentChange(current) {
      this.state.tableData.data = []
      this.state.tableData.param.current = current
      this.fetchData()
    },
    closeDialog() {
      this.state.dialog.isShowDialog = false;
    },
    onCancel() {
      this.closeDialog();
    },
    onSubmit() {
      this.state.submitBtn.loading = true;
      if (this.state.submitBtn.type === 'edit') {
        useOssSettingApi().update(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      } else {
        useOssSettingApi().add(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      }
    },
    deleteInfo(row) {
      useOssSettingApi().delete(row).then(response => {
        Message.success('删除成功');
        this.fetchData()
      }).catch(() => {
        this.fetchData()
      })
    }
  },
  computed: {},
  created() {

  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>

</style>
