<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <div class="system-user-search mb15">
        <el-input size="default" v-model="state.tableData.param.keyword" placeholder="请输入名称"
                  style="max-width: 180px"></el-input>
        <el-button size="default" type="primary" class="ml10" @click="fetchData()">
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="syncData"
                   v-loading.fullscreen.lock="state.syncLoading">
          同步
        </el-button>
      </div>
      <el-table
          :data="state.tableData.data"
          border
          row-key="permissionId"
          default-expand-all
          :tree-props="{children: 'children'}"
          v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="moduleName" label="模块名称" width="200" sortable></el-table-column>
        <el-table-column prop="name" label="权限名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="menuName" label="菜单" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="englishName" label="英文名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="url" label="URL" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" v-show="scope.row.moduleName" text type="primary" @click="buildMenu(scope.row)">
              绑定菜单
            </el-button>
            <el-button size="small" v-show="scope.row.moduleName" text type="warning" @click="unBuildMenu(scope.row)">
              解绑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="state.dialog.title" :visible.sync="state.dialog.isShowDialog" width="400px">
        <div>
          <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
            <el-row :gutter="35">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="模块名称">
                  <el-input v-model="state.ruleForm.moduleName" placeholder="模块名称" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="35">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="绑定菜单">
                  <el-cascader
                      style="width:100%;"
                      v-model="state.menuSelectData"
                      :options="state.menuData"
                      :props="{ checkStrictly: true,label: 'title', value: 'menuId', children: 'children', emitPath: false }"
                      @change="selectMenuChange"></el-cascader>
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
    </el-card>
  </div>
</template>

<script>
import {usePermissionApi} from '@/api/permission';
import {useMenuApi} from '@/api/menu';
import {Message, MessageBox} from 'element-ui';

export default {
  name: "sys",
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
          deleteStatus: '', // 删除状态
          englishname: '', // 英文名称
          modulename: '', // 模块名称
          name: '', // 权限名称
          menuId: '', // 菜单ID
          url: '', // URL
        },
        menuData: [],
        menuSelectData: '',
        syncLoading: false,
        submitBtn: {
          loading: false,
          type: ''
        }
      }
    }
  },
  methods: {
    initMenuList() {
      useMenuApi().list(this.state.tableData.param).then(response => {
        this.state.menuData = this.getTreeData(response.data)
      })
    },
    fetchData() {
      this.state.ruleForm = {}
      this.state.tableData.loading = true
      usePermissionApi().list(this.state.tableData.param).then(response => {
        this.state.tableData.data = response.data
        this.state.tableData.loading = false
      })
    },
    selectMenuChange(value) {
      this.state.ruleForm.menuId = value;
    },
    getTreeData(data) {
      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].children && data[i].children.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].children);
          }
        }
        return data;
      }
    },
    syncData() {
      this.state.syncLoading = true;
      usePermissionApi().syncData().then(response => {
        this.state.syncLoading = false;
        this.fetchData()
      }).catch(() => {
        this.state.syncLoading = false
      })
    },
    buildMenu(row) {
      this.state.ruleForm = row;
      this.state.dialog.title = '绑定菜单';
      this.state.dialog.submitTxt = '绑 定';
      this.state.dialog.isShowDialog = true;
    },
    unBuildMenu(row) {
      this.state.ruleForm = row;
      MessageBox.confirm(`确认解除菜单绑定?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let param = {
          moduleName: this.state.ruleForm.moduleName,
        }
        this.state.submitBtn.loading = true;
        usePermissionApi().unBuildMenu(param).then(response => {
          this.state.submitBtn.loading = false;
          this.state.dialog.isShowDialog = false;
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false;
          this.state.dialog.isShowDialog = false;
        })
      }).catch(() => {
      });
    },
    onSubmit() {
      if (!this.state.ruleForm.menuId) {
        Message.error('请选择菜单');
        return;
      }

      let param = {
        moduleName: this.state.ruleForm.moduleName,
        menuId: this.state.ruleForm.menuId
      }

      this.state.submitBtn.loading = true;
      usePermissionApi().buildMenu(param).then(response => {
        this.state.submitBtn.loading = false;
        this.state.dialog.isShowDialog = false;
        this.fetchData()
      }).catch(() => {
        this.state.submitBtn.loading = false;
        this.state.dialog.isShowDialog = false;
      })
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
    deleteInfo(row) {
      usePermissionApi().delete(row).then(response => {
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
    this.initMenuList()
  }
}
</script>

<style scoped>

</style>