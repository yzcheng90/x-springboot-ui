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
        <el-table-column prop="appName" label="应用名称" />
        <el-table-column prop="appKey" label="AppKey" />
        <el-table-column prop="appSecret" label="AppSecret"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="isEnable" label="是否可用" v-show="150">
          <template #default="scope">
            <el-switch
                v-model="scope.row.isEnable"
                @change="updateInfo(scope.row)"
                :active-value="1"
                :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="tenancyId" label="租户ID"/>
        <el-table-column label="操作" width="180">
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
    <el-dialog :title="state.dialog.title" :visible.sync="state.dialog.isShowDialog" width="769px">
      <div>
        <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="应用名称">
                <el-input v-model="state.ruleForm.appName" placeholder="应用名称"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="AppKey">
                <el-input v-model="state.ruleForm.appKey" placeholder="AppKey" clearable>
                  <el-button slot="append" icon="el-icon-orange" @click="generateKey('appKey')"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="AppSecret">
                <el-input v-model="state.ruleForm.appSecret" placeholder="AppSecret" clearable>
                  <el-button slot="append" icon="el-icon-orange" @click="generateKey('appSecret')"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="是否可用">
                <el-switch
                    v-model="state.ruleForm.isEnable"
                    :active-value="1"
                    :inactive-value="0">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="租户">
                <el-select v-model="state.ruleForm.tenancyId" placeholder="请选择" style="width: 100%">
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
import {useApplicationApi} from '@/api/application';
import {Message, MessageBox} from 'element-ui';
import {useTenancyApi} from "@/api/tenancy";

export default {
  name: "application",
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
        ruleForm: {
          appKey: '', // AppKey
          appName: '', // 应用名称
          appSecret: '', // AppSecret
          isEnable: '', // 是否可用（1可用，0不可用）
          tenancyId: '', // 租户ID
        },
        submitBtn: {
          loading: false,
          type: ''
        },
        selectTenancy:[],
      }
    }
  },
  methods: {
    generateKey(field){
      useApplicationApi().generateKey().then(response => {
        this.state.ruleForm[field] = response.data
      })
    },
    initSelectTenancy() {
      useTenancyApi().select().then(response => {
        this.state.selectTenancy = response.data
      })
    },
    fetchData() {
      this.state.ruleForm = {}
      this.state.tableData.loading = true
      useApplicationApi().list(this.state.tableData.param).then(response => {
        this.state.tableData.data = response.data.records
        this.state.tableData.total = response.data.total
        this.state.tableData.loading = false
      })
    },
    updateInfo(row) {
      useApplicationApi().update(row).then(response => {
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
        this.state.dialog.title = '修改应用服务';
        this.state.dialog.submitTxt = '修 改';
      } else {
        this.state.submitBtn.type = 'add';
        this.state.ruleForm = {
          appKey: '', // AppKey
          appName: '', // 应用名称
          appSecret: '', // AppSecret
          isEnable: '', // 是否可用（1可用，0不可用）
          tenancyId: '', // 租户ID
        };
        this.state.dialog.title = '新增应用服务';
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
        useApplicationApi().update(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      } else {
        useApplicationApi().add(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      }
    },
    deleteInfo(row) {
      useApplicationApi().delete(row).then(response => {
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
  }
}
</script>

<style scoped>

</style>