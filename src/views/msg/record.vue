<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input size="default" v-model="state.tableData.param.keyword" placeholder="请输入名称"
                  style="max-width: 180px"></el-input>
        &nbsp;&nbsp;
        租户：
        <el-select v-model="state.tableData.param.tenancyId" placeholder="请选择租户" clearable>
          <el-option
              v-for="item in state.selectTenancy"
              :key="item.tenancyId"
              :label="item.tenancyName"
              :value="item.tenancyId">
          </el-option>
        </el-select>
        &nbsp;&nbsp;
        <el-date-picker
            v-model="state.tableData.param.queryHistoryDate"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择日期">
        </el-date-picker>
        <el-button size="default" type="primary" class="ml10" @click="fetchData()">
          查询
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center"/>
        <el-table-column prop="tenancyName" label="租户名称" align="center" width="150"></el-table-column>
        <el-table-column width="200" prop="sendMobile" label="发送手机号" show-overflow-tooltip align="center"/>
        <el-table-column prop="sendContent" label="发送内容" show-overflow-tooltip align="center"/>
        <el-table-column width="200" prop="sendType" label="发送类型" show-overflow-tooltip align="center"/>
        <el-table-column width="150" prop="sendStatus" label="发送状态" show-overflow-tooltip align="center"/>
        <el-table-column width="200" prop="sendTime" label="发送时间" show-overflow-tooltip align="center"/>
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
  </div>
</template>

<script>
import {useMsgRecordApi} from '@/api/msg/record';
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
            queryHistoryDate: ''
          }
        },
        dialog: {
          isShowDialog: false,
          type: '',
          title: '',
          submitTxt: '',
        },
        ruleForm: {
          sendMobile: '', // 发送手机号
          sendContent: '', // 发送内容
          sendStatus: '', // 发送状态
          sendTime: '', // 发送时间
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
      useMsgRecordApi().list(this.state.tableData.param).then(response => {
        if (response.code === 0 && response.msg === '暂无数据') {
          this.state.tableData.data = []
          this.state.tableData.total = 0
          this.state.tableData.loading = false
        } else {
          this.state.tableData.data = response.data.records
          this.state.tableData.total = response.data.total
          this.state.tableData.loading = false
        }
      })
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

<style>

</style>
