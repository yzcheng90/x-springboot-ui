<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input size="default" v-model="state.tableData.param.keyword" placeholder="请输入名称"
                  style="max-width: 180px"></el-input>
        <el-button size="default" type="primary" class="ml10" @click="fetchData()">
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddOrEdit('add')">
          新增
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="tenancyName" label="租户" width="100"/>
        <el-table-column prop="appId" label="应用ID" width="100" />
        <el-table-column prop="serviceName" label="服务名称" width="450">
          <template #default="scope">
            <div>服务名称：{{scope.row.serviceName}}</div>
            <div>默认模板：{{scope.row.defaultTemplate}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="serviceClass" label="服务实现类地址"  show-overflow-tooltip>
          <template #default="scope">
            <div>服务实现：{{scope.row.serviceClass}}</div>
            <div>接口地址：{{scope.row.serviceUrl}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="serviceClass" label="启用情况"  width="150">
          <template #default="scope">
            <div>
              是否使用：
              <el-switch
                  v-model="scope.row.isEnable"
                  @change="updateInfo(scope.row)"
                  :active-value="1"
                  :inactive-value="0">
              </el-switch>
            </div>
            <div>
              默认服务：
              <el-switch
                  v-model="scope.row.isDefault"
                  @change="updateInfo(scope.row)"
                  :active-value="1"
                  :inactive-value="0">
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" type="text" @click="onOpenAddOrEdit('edit', scope.row)">修改</el-button>
            <el-button size="small" type="text" @click="onRowDel(scope.row)">删除</el-button>
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
    <el-dialog :title="state.dialog.title" :visible.sync="state.dialog.isShowDialog" width="800px">
      <div>
        <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="120px">
          <el-row :gutter="35">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="绑定应用">
                <el-select v-model="state.ruleForm.appId" placeholder="请选择" style="width: 100%">
                  <el-option
                      v-for="item in state.selectApplication"
                      :key="item.appId"
                      :label="item.appName"
                      :value="item.appId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="绑定租户">
                <el-select v-model="state.ruleForm.tenancyId" placeholder="请选择" @change="initSelectTemplate" style="width: 100%">
                  <el-option
                      v-for="item in state.selectTenancy"
                      :key="item.tenancyId"
                      :label="item.tenancyName"
                      :value="item.tenancyId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="服务名称">
                <el-input v-model="state.ruleForm.serviceName" placeholder="服务名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="服务实现类">
                <el-input v-model="state.ruleForm.serviceClass" placeholder="服务实现类地址"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="接口URL">
                <el-input v-model="state.ruleForm.serviceUrl" placeholder="接口URL"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="产品ID">
                <el-input v-model="state.ruleForm.productId" placeholder="产品ID"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="AppCode">
                <el-input v-model="state.ruleForm.appCode" placeholder="AppCode"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="AppKey">
                <el-input v-model="state.ruleForm.appKey" placeholder="AppKey"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="AppSecret">
                <el-input v-model="state.ruleForm.appSecret" placeholder="AppSecret"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否使用">
                <el-switch
                    v-model="state.ruleForm.isEnable"
                    :active-value="1"
                    :inactive-value="0">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="默认服务">
                <el-switch
                    v-model="state.ruleForm.isDefault"
                    :active-value="1"
                    :inactive-value="0">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="默认模板">
                <el-input v-model="state.ruleForm.defaultTemplate" placeholder="默认模板"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="绑定模板">
                <el-select v-model="state.ruleForm.templateIds" multiple placeholder="请选择" style="width: 100%">
                  <el-option
                      v-for="item in state.selectTemplate"
                      :key="item.templateId"
                      :label="'['+item.templateType+']'+item.templateContent"
                      :value="item.templateId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
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
import {useMsgServiceApi} from '@/api/msg/service';
import {Message, MessageBox} from 'element-ui';
import {useTenancyApi} from "@/api/tenancy";
import {useApplicationApi} from "@/api/application";
import {useMsgTemplateApi} from "@/api/msg/template";

export default {
  name: "msg",
  data() {
    return {
      state: {
        selectTenancy: [],
        selectTemplate: [],
        selectApplication: [],
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
        ruleForm: {
          appCode: '', // AppCode
          appId: '', // 应用ID
          appKey: '', // AppKey
          appSecret: '', // AppSecret
          defaultTemplate: '', // 默认模板
          isEnable: '', // 是否使用（1使用，0未使用）
          productId: '', // 产品ID
          serviceClass: '', // 服务实现类地址
          serviceName: '', // 服务名称
          serviceUrl: '', // 接口URL
          tenancyId: '', // 租户ID
          templateIds: [], // 选择的模板
        },
        submitBtn: {
          loading: false,
          type: ''
        }
      }
    }
  },
  methods: {
    initSelectTenancy() {
      useTenancyApi().select().then(response => {
        this.state.selectTenancy = response.data
      })
    },
    initSelectTemplate() {
      this.state.ruleForm.templateIds = []
      let param = {
        tenancyId:this.state.ruleForm.tenancyId
      }
      useMsgTemplateApi().select(param).then(response => {
        this.state.selectTemplate = response.data
      })
    },
    initSelectApplication() {
      useApplicationApi().select().then(response => {
        this.state.selectApplication = response.data
      })
    },
    fetchData() {
      this.state.ruleForm = {}
      this.state.tableData.loading = true
      useMsgServiceApi().list(this.state.tableData.param).then(response => {
        this.state.tableData.data = response.data.records
        this.state.tableData.total = response.data.total
        this.state.tableData.loading = false
      })
    },
    updateInfo(row) {
      useMsgServiceApi().update(row).then(response => {
        this.state.submitBtn.loading = false;
        this.closeDialog();
        this.fetchData()
      }).catch(() => {
        this.state.submitBtn.loading = false
      })
    },
    onOpenAddOrEdit(type, row) {
      if (type === 'edit') {
        this.state.submitBtn.type = 'edit';
        this.state.ruleForm = row;
        this.state.dialog.title = '修改短信服务';
        this.state.dialog.submitTxt = '修 改';
      } else {
        this.state.submitBtn.type = 'add';
        this.state.ruleForm = {
          appCode: '', // AppCode
          appId: '', // 应用ID
          appKey: '', // AppKey
          appSecret: '', // AppSecret
          defaultTemplate: '', // 默认模板
          isEnable: '', // 是否使用（1使用，0未使用）
          productId: '', // 产品ID
          serviceClass: '', // 服务实现类地址
          serviceName: '', // 服务名称
          serviceUrl: '', // 接口URL
          tenancyId: '', // 租户ID
          templateIds: [], // 选择的模板
        };
        this.state.dialog.title = '新增短信服务';
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
        useMsgServiceApi().update(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      } else {
        useMsgServiceApi().add(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      }
    },
    deleteInfo(row) {
      useMsgServiceApi().delete(row).then(response => {
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
    this.initSelectTenancy()
    this.initSelectApplication()
    this.initSelectTemplate()
  }
}
</script>

<style scoped>

</style>