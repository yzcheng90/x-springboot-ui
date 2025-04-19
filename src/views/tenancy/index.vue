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
        <el-table-column type="index" label="序号" width="60" align="center"/>
        <el-table-column prop="tenancyName" label="渠道名称" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="tenancyParentName" label="所属父级租户" align="center"></el-table-column>
        <el-table-column prop="tenancyRemark" label="渠道备注" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="discount" label="折扣" show-overflow-tooltip align="center"></el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenAddOrEdit('edit', scope.row)">修改</el-button>
            <el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
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
        <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="100px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="父级租户">
                <el-select v-model="state.ruleForm.tenancyPid" placeholder="请选择" style="width: 100%">
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
              <el-form-item label="渠道名称">
                <el-input v-model="state.ruleForm.tenancyName" placeholder="渠道名称" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="渠道备注">
                <el-input v-model="state.ruleForm.tenancyRemark" placeholder="渠道备注" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="折扣">
                <el-input v-model="state.ruleForm.discount" placeholder="折扣" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template>
					<span class="dialog-footer">
						<el-button type="primary" @click="onSubmit" :loading="state.submitBtn.loading">保存</el-button>
					</span>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {useTenancyApi} from '@/api/tenancy';
import {Message, MessageBox} from 'element-ui';

export default {
  name: "tenancy",
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
        ruleForm: {
          tenancyPid: '', // 父级租户ID
          tenancyRemark: '', // 备注
          tenancyName: '', // 租户名称
          discount: ''
        },
        dialog: {
          isShowDialog: false,
          btnLoading: false,
          type: '',
          title: '',
          submitTxt: '',
        },
        submitBtn: {
          loading: false,
          type: ''
        }
      }
    }
  },
  methods: {
    fetchData() {
      this.state.tableData.loading = true
      useTenancyApi().list(this.state.tableData.param).then(response => {
        this.state.tableData.data = response.data.records
        this.state.tableData.total = response.data.total
        this.state.tableData.loading = false
      })
      this.initSelectTenancy();
    },
    initSelectTenancy() {
      useTenancyApi().select().then(response => {
        this.state.selectTenancy = response.data
      })
    },
    onOpenAddOrEdit(type, row) {
      if (type === 'edit') {
        this.state.submitBtn.type = 'edit';
        this.state.ruleForm = row;
        this.state.dialog.title = '修改租户';
        this.state.dialog.submitTxt = '修 改';
      } else {
        this.state.submitBtn.type = 'add';
        this.state.ruleForm = {
          tenancyPid: '', // 父级租户ID
          tenancyRemark: '', // 备注
          tenancyName: '', // 租户名称
          discount: ''
        };
        this.state.dialog.title = '新增租户';
        this.state.dialog.submitTxt = '新 增';
      }
      this.state.dialog.isShowDialog = true;
    },
    onSubmit() {
      this.state.submitBtn.loading = true;
      if (this.state.submitBtn.type === 'edit') {
        useTenancyApi().update(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      } else {
        useTenancyApi().add(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      }
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
    deleteInfo(row) {
      useTenancyApi().delete(row).then(response => {
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
