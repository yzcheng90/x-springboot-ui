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
        <el-table-column prop="tenancyName" label="租户" width="150"/>
        <el-table-column prop="templateType" label="模板类型" width="200"/>
        <el-table-column prop="templateContent" label="模板内容"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="isEnable" label="是否启用" width="120">
          <template #default="scope">
            <el-switch
                v-model="scope.row.isEnable"
                @change="updateInfo(scope.row)"
                :active-value="1"
                :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
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
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="模板类型">
                <el-input v-model="state.ruleForm.templateType" placeholder="模板类型（预留，比如1验证码，2：营销）"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="模板内容">
                <el-input v-model="state.ruleForm.templateContent" placeholder="模板内容"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="备注">
                <el-input v-model="state.ruleForm.remark" placeholder="备注"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="是否启用">
                <el-switch
                    v-model="state.ruleForm.isEnable"
                    :active-value="1"
                    :inactive-value="0">
                </el-switch>
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
import {useMsgTemplateApi} from '@/api/msg/template';
import {Message, MessageBox} from 'element-ui';
import {useTenancyApi} from "@/api/tenancy";

export default {
  name: "msg",
  data() {
    return {
      state: {
        selectTenancy: [],
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
          isEnable: '', // 是否启用，1启动，0禁用
          remark: '', // 备注
          templateContent: '', // 模板内容
          templateType: '', // 模板类型（预留，比如1验证码，2：营销）
          tenancyId: '', // 租户ID
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
    fetchData() {
      this.state.ruleForm = {}
      this.state.tableData.loading = true
      useMsgTemplateApi().list(this.state.tableData.param).then(response => {
        this.state.tableData.data = response.data.records
        this.state.tableData.total = response.data.total
        this.state.tableData.loading = false
      })
    },
    updateInfo(row) {
      useMsgTemplateApi().update(row).then(response => {
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
        this.state.dialog.title = '修改短信模板';
        this.state.dialog.submitTxt = '修 改';
      } else {
        this.state.submitBtn.type = 'add';
        this.state.ruleForm = {
          isEnable: '', // 是否启用，1启动，0禁用
          remark: '', // 备注
          templateContent: '', // 模板内容
          templateType: '', // 模板类型（预留，比如1验证码，2：营销）
          tenancyId: '', // 租户ID
        };
        this.state.dialog.title = '新增短信模板';
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
        useMsgTemplateApi().update(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      } else {
        useMsgTemplateApi().add(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      }
    },
    deleteInfo(row) {
      useMsgTemplateApi().delete(row).then(response => {
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