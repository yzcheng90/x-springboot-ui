<template>
  <div class="system-user-container layout-padding">
    <div class="system-user-search mb15">
      <el-input size="default" v-model="state.tableData.param.keyword" placeholder="请输入名称"
                style="max-width: 180px"></el-input>
      &nbsp;&nbsp;
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
      <el-table-column prop="paramName" width="150" label="参数名称" show-overflow-tooltip align="center"/>
      <el-table-column prop="paramKey" width="250" label="参数KEY" align="center" show-overflow-tooltip/>
      <el-table-column prop="paramValue" width="250" label="参数VALUE" show-overflow-tooltip align="center"/>
      <el-table-column prop="paramDescribe" label="参数描述" align="center"/>
      <el-table-column prop="createTime" width="180" label="创建时间" show-overflow-tooltip align="center"/>
      <el-table-column prop="updateTime" width="160" label="更新时间" show-overflow-tooltip align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" text type="text" @click="onOpenAddOrEdit('edit', scope.row)">修改
          </el-button>
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
    <el-dialog :title="state.dialog.title" :visible.sync="state.dialog.isShowDialog" width="769px">
      <div>
        <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="参数名称">
                <el-input v-model="state.ruleForm.paramName" placeholder="参数名称" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="参数KEY">
                <el-input v-model="state.ruleForm.paramKey" placeholder="参数KEY" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="参数VALUE">
                <el-input v-model="state.ruleForm.paramValue" placeholder="参数VALUE"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="参数描述">
                <el-input v-model="state.ruleForm.paramDescribe" placeholder="参数描述" type="textarea"
                          :rows="4"
                          clearable></el-input>
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
import {useParamApi} from '@/api/param';
import {Message, MessageBox} from 'element-ui';
import {useTenancyApi} from "@/api/tenancy";

export default {
  name: "param",
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
            tenancyId: '',
            paramType: '',
            keyword: '',
          }
        },
        dialog: {
          isShowDialog: false,
          isShowParamDialog: false,
          type: '',
          title: '',
          submitTxt: '',
        },
        selectTenancy: [],
        ruleForm: {
          paramId: '',
          paramName: '', // 参数名称
          paramType: '', // 参数类型
          tenancyId: '', // 租户ID
          paramDescribe: '', // 参数描述
          paramKey: '', // 参数KEY
          paramValue: '', // 参数VALUE
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
        if (this.state.selectTenancy) {
          this.state.tableData.param.tenancyId = this.state.selectTenancy[0].tenancyId
        }
        this.handleChange();
      })
    },
    fetchData() {
      this.state.ruleForm = {}
      this.state.tableData.loading = true
      useParamApi().list(this.state.tableData.param).then(response => {
        this.state.tableData.data = response.data.records
        this.state.tableData.total = response.data.total
        this.state.tableData.loading = false
      })
    },
    onOpenAddOrEdit(type, row) {
      if (type === 'edit') {
        this.state.submitBtn.type = 'edit';
        this.state.ruleForm = row;
        this.state.dialog.title = '修改参数';
        this.state.dialog.submitTxt = '修 改';
      } else {
        this.state.submitBtn.type = 'add';
        this.state.ruleForm = {
          paramName: '', // 参数名称
          paramType: '', // 参数类型
          tenancyId: '', // 租户ID
          paramDescribe: '', // 参数描述
          paramKey: '', // 参数KEY
          paramValue: '', // 参数VALUE
        };
        this.state.dialog.title = '新增参数';
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
        useParamApi().update(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      } else {
        useParamApi().add(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      }
    },
    deleteInfo(row) {
      useParamApi().delete(row).then(response => {
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
    this.initSelectTenancy()
    this.fetchData()
  }
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  font-size: 12px;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
