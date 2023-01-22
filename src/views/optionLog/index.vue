<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input size="default" v-model="state.tableData.param.keyword" placeholder="请输入名称"
                  style="max-width: 180px"></el-input>
        <el-button size="default" type="primary" class="ml10" @click="fetchData()">
          <el-icon>
            <ele-Search/>
          </el-icon>
          查询
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operation" label="用户操作" show-overflow-tooltip></el-table-column>
        <el-table-column prop="method" label="请求方法" show-overflow-tooltip></el-table-column>
        <el-table-column prop="params" label="请求参数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="time" label="执行时长(毫秒)" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ip" label="IP地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="操作时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenAddOrEdit('edit', scope.row)">
              查看
            </el-button>
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
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="用户名">
                <el-input v-model="state.ruleForm.username" placeholder="请输入账户名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="用户操作">
                <el-input v-model="state.ruleForm.operation" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="请求方法">
                <el-input v-model="state.ruleForm.method" placeholder="" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="请求参数">
                <el-input v-model="state.ruleForm.params" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="执行时长(毫秒)">
                <el-input v-model="state.ruleForm.time" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="ip地址">
                <el-input v-model="state.ruleForm.ip" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="操作时间">
                <el-input v-model="state.ruleForm.createDate" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {useOptionLogApi} from '@/api/optionLog';

export default {
  name: "user",
  data() {
    return {
      state: {
        roleListData: [],
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
          username: '',
          operation: '',
          method: '',
          params: '',
          time: '',
          ip: '',
          createDate: ''
        }
      }
    }
  },
  methods: {
    fetchData() {
      this.state.tableData.loading = true
      useOptionLogApi().list(this.state.tableData.param).then(response => {
        this.state.tableData.data = response.data.records
        this.state.tableData.total = response.data.total
        this.state.tableData.loading = false
      })
    },
    onOpenAddOrEdit(type, row) {
      this.state.ruleForm = row;
      this.state.dialog.title = '查看日志';
      this.state.dialog.submitTxt = '查 看';
      this.state.dialog.isShowDialog = true;
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