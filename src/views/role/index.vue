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
        <el-button size="default" type="success" class="ml10" @click="onOpenAddOrEdit('add')">
          <el-icon>
            <ele-FolderAdd/>
          </el-icon>
          新增
        </el-button>
      </div>
      <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center"/>
        <el-table-column prop="roleId" label="角色ID" show-overflow-tooltip align="center"/>
        <el-table-column prop="roleName" label="角色名称" show-overflow-tooltip align="center"/>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip align="center"/>
        <el-table-column prop="createUserName" label="创建者" show-overflow-tooltip align="center"/>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center"/>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button :disabled="scope.row.username === 'admin'" size="small" text type="primary"
                       @click="onOpenAddOrEdit('edit', scope.row)">
              修改
            </el-button>
            <el-button :disabled="scope.row.username === 'admin'" size="small" text type="primary"
                       @click="onRowDel(scope.row)">
              删除
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
    <el-dialog :title="state.dialog.title" :visible.sync="state.dialog.isShowDialog" width="769px" :fullscreen="true">
      <div class="dialog-container">
        <div class="dialog-content">
          <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
            <el-row :gutter="35">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                <el-form-item label="角色名称">
                  <el-input v-model="state.ruleForm.roleName" placeholder="角色名称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                <el-form-item label="备注">
                  <el-input v-model="state.ruleForm.remark" placeholder="备注" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="35">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="选择菜单">
                  <el-table :data="state.menuList" border style="width: 100%">
                    <el-table-column prop="label" label="菜单" width="300">
                      <template #default="scope">
                        <template v-if="scope.row.children && scope.row.children.length">
                          <el-checkbox
                              :indeterminate="isIndeterminate(scope.row)"
                              :checked="isChecked(scope.row)"
                              @change="handleCheckAllChange(scope.row, $event)">
                            {{ scope.row.title }}
                          </el-checkbox>
                        </template>
                        <template v-else>
                          <el-checkbox
                              :key="scope.row.menuId"
                              :label="scope.row.menuId"
                              v-model="state.ruleForm.menuIdList">
                            {{ scope.row.title }}
                          </el-checkbox>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column label="子菜单">
                      <template #default="scope">
                        <template v-if="scope.row.children && scope.row.children.length">
                          <el-checkbox-group v-model="state.ruleForm.menuIdList">
                            <el-checkbox
                                v-for="item in scope.row.children"
                                :key="item.menuId"
                                :label="item.menuId">
                              {{ item.title }}
                            </el-checkbox>
                          </el-checkbox-group>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="35">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                <el-form-item label="选择权限">
                  <div style="margin-bottom: 16px">
                    <el-checkbox
                        v-if="allAppPermissionIds.length > 0"
                        :indeterminate="isSomeAppSelectedButNotAll"
                        v-model="isAllAppSelected"
                        @change="toggleAllAppPermissions">
                      <span style="color:#f55151;">一键选中所有【APP】权限</span>
                    </el-checkbox>
                  </div>
                  <el-table :data="state.permissionList" border style="width: 100%">
                    <el-table-column prop="label" label="权限名称" width="300">
                      <template #default="scope">
                        <template v-if="scope.row.children && scope.row.children.length">
                          <el-checkbox
                              :indeterminate="isPerIndeterminate(scope.row)"
                              :checked="isPerChecked(scope.row)"
                              @change="handleCheckAllPerChange(scope.row, $event)">
                            {{ scope.row.label }}
                          </el-checkbox>
                        </template>
                        <template v-else>
                          <el-checkbox
                              :key="scope.row.permissionId"
                              :label="scope.row.permissionId"
                              v-model="state.ruleForm.permissionList">
                            {{ scope.row.label }}
                          </el-checkbox>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column label="子权限" v-if="hasChildren">
                      <template #default="scope">
                        <template v-if="scope.row.children && scope.row.children.length">
                          <el-checkbox-group v-model="state.ruleForm.permissionList">
                            <el-checkbox
                                v-for="item in scope.row.children"
                                :key="item.permissionId"
                                :label="item.permissionId">
                              {{ item.label }}
                            </el-checkbox>
                          </el-checkbox-group>
                        </template>
                        <template v-else>
                          暂无
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="dialog-footer" style="padding: 16px; background: #fff; border-top: 1px solid #ebeef5;">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.submitBtn.loading" size="default">
            {{ state.dialog.submitTxt }}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {roleListApi} from '@/api/role';
import {useMenuApi} from '@/api/menu';
import {usePermissionApi} from '@/api/permission';
import {Message, MessageBox} from 'element-ui';

export default {
  name: "role",
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
          roleId: '', // 角色ID
          roleName: '', // 角色名称
          remark: '', // 备注
          menuIdList: [],  // 菜单
          permissionList: [] //权限
        },
        menuList: [],
        permissionList: [],
        permissionClickList: [],
        submitBtn: {
          loading: false,
          type: ''
        }
      }
    }
  },
  methods: {
    initMenu() {
      useMenuApi().list({}).then(response => {
        this.state.menuList = response.data || [];
      }).catch(() => {
        this.state.menuList = [];
      });
    },
    initPermission() {
      usePermissionApi().menuPermissionTree().then(response => {
        this.state.permissionList = response.data || [];
      }).catch(() => {
        this.state.permissionList = [];
      });
    },
    fetchData() {
      this.state.tableData.loading = true;
      roleListApi().list(this.state.tableData.param).then(response => {
        this.state.tableData.data = response.data.records || [];
        this.state.tableData.total = response.data.total || 0;
      }).catch(() => {
        this.state.tableData.data = [];
        this.state.tableData.total = 0;
      }).finally(() => {
        this.state.tableData.loading = false;
      });
    },
    onOpenAddOrEdit(type, row) {
      if (type === 'edit') {
        this.state.submitBtn.type = 'edit';
        this.state.ruleForm.menuIdList = []
        this.state.ruleForm = {
          ...row,
          menuIdList: Array.isArray(row.menuIdList) ? row.menuIdList : [],
          permissionList: Array.isArray(row.permissionList) ? row.permissionList : []
        };
        this.state.dialog.title = '修改角色';
        this.state.dialog.submitTxt = '修 改';
      } else {
        this.state.submitBtn.type = 'add';
        this.state.ruleForm = {
          roleId: '', // 角色ID
          roleName: '', // 角色名称
          remark: '', // 备注
          menuIdList: [],
          permissionList:[]
        };
        this.state.dialog.title = '新增角色';
        this.state.dialog.submitTxt = '新 增';
      }
      this.state.dialog.isShowDialog = true;
    },
    onRowDel(row) {
      MessageBox.confirm(`此操作将永久删除角色：“${row.roleName}”，是否继续?`, '提示', {
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
        roleListApi().update(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      } else {
        roleListApi().add(this.state.ruleForm).then(response => {
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
        })
      }
    },

    // 权限/菜单相关方法
    toggleAllAppPermissions(checked) {
      if (checked) {
        // 添加所有APP权限（去重）
        const newPermissions = [...new Set([
          ...(this.state.ruleForm.permissionList || []),
          ...this.allAppPermissionIds
        ])];
        this.$set(this.state.ruleForm, 'permissionList', newPermissions);
      } else {
        // 移除所有APP权限
        const newPermissions = (this.state.ruleForm.permissionList || []).filter(
            id => !this.allAppPermissionIds.includes(id)
        );
        this.$set(this.state.ruleForm, 'permissionList', newPermissions);
      }
    },

    isPerChecked(group) {
      if (!group.children || !Array.isArray(group.children)) return false;
      const permissionList = this.state.ruleForm.permissionList || [];
      return group.children.every(item => permissionList.includes(item.permissionId));
    },
    isChecked(group) {
      if (!group.children || !Array.isArray(group.children)) return false;
      const menuList = this.state.ruleForm.menuIdList || [];
      return group.children.every(item => menuList.includes(item.menuId));
    },
    isPerIndeterminate(group) {
      if (!group.children || !Array.isArray(group.children)) return false;
      const permissionList = this.state.ruleForm.permissionList || [];

      const hasSome = group.children.some(item =>
          permissionList.includes(item.permissionId)
      );
      const hasAll = group.children.every(item =>
          permissionList.includes(item.permissionId)
      );

      return hasSome && !hasAll;
    },
    isIndeterminate(group) {
      if (!group.children || !Array.isArray(group.children)) return false;
      const menuList = this.state.ruleForm.menuIdList || [];

      const hasSome = group.children.some(item =>
          menuList.includes(item.menuId)
      );
      const hasAll = group.children.every(item =>
          menuList.includes(item.menuId)
      );

      return hasSome && !hasAll;
    },
    handleCheckAllPerChange(group, val) {
      if (!group.children || !Array.isArray(group.children)) return;

      const permissionList = [...(this.state.ruleForm.permissionList || [])];
      const childIds = group.children.map(item => item.permissionId);

      if (val) {
        // 添加组下所有权限（去重）
        const newPermissions = [...new Set([...permissionList, ...childIds])];
        this.$set(this.state.ruleForm, 'permissionList', newPermissions);
      } else {
        // 移除组下所有权限
        const newPermissions = permissionList.filter(
            id => !childIds.includes(id)
        );
        this.$set(this.state.ruleForm, 'permissionList', newPermissions);
      }
    },
    handleCheckAllChange(group, val) {
      if (!group.children || !Array.isArray(group.children)) return;
      const menuList = [...(this.state.ruleForm.menuIdList || [])];
      const childIds = group.children.map(item => item.menuId);
      if (val) {
        // 添加组下所有权限
        const newMenus = [...new Set([...menuList, ...childIds])];
        this.$set(this.state.ruleForm, 'menuIdList', newMenus);
      } else {
        // 移除组下所有权限
        const newMenus = menuList.filter(
            id => !childIds.includes(id)
        );
        this.$set(this.state.ruleForm, 'menuIdList', newMenus);
      }
    },
    deleteInfo(row) {
      roleListApi().delete(row).then(response => {
        Message.success('删除成功');
        this.fetchData()
      }).catch(() => {
        this.fetchData()
      })
    },
    selectedTree(node, selected) {
      // console.log(selected.checkedKeys)
      this.state.ruleForm.menuIdList = selected.checkedKeys;
      // // // 去权限里面匹配菜单
      // let permission = [];
      // for (var i = 0; i < selected.checkedKeys.length; i++) {
      //     let menu = this.state.permissionList.filter((item) => {
      //         // 权限里面的菜单ID如果等于当前选择的菜单ID，
      //         let menuIds = selected.checkedKeys.filter(menuId => item.menuId === menuId);
      //         console.log("选择的", menuIds)
      //         return menuIds > 0
      //     }).map(item => item.permissionId)
      //     if(menu){
      //         permission.push(menu[0])
      //     }
      // }
      // console.log("权限",permission)
      // this.state.ruleForm.permissionList = permission;
    },
    selectedPermissionTree(node, selected) {
      this.state.ruleForm.permissionList = selected.checkedKeys;
      // // 记录选中的
      // this.state.permissionClickList = selected.checkedKeys;
      // console.log(this.state.permissionClickList)
    }

  },
  computed: {
    hasChildren() {
      return (this.state.permissionList || []).some(item => item.children && item.children.length > 0);
    },
    allAppPermissionIds() {
      if (!Array.isArray(this.state.permissionList)) return [];

      const ids = [];
      this.state.permissionList.forEach(item => {
        if (item.label?.includes('【APP】') && item.permissionId) {
          ids.push(item.permissionId);
        }
        if (Array.isArray(item.children)) {
          item.children.forEach(child => {
            if (child.label?.includes('【APP】') && child.permissionId) {
              ids.push(child.permissionId);
            }
          });
        }
      });
      return ids;
    },
    isAllAppSelected: {
      get() {
        if (this.allAppPermissionIds.length === 0) return false;
        const permissionList = this.state.ruleForm.permissionList || [];
        return this.allAppPermissionIds.every(id => permissionList.includes(id));
      },
      set(value) {
        this.toggleAllAppPermissions(value);
      }
    },
    isSomeAppSelectedButNotAll() {
      if (this.allAppPermissionIds.length === 0) return false;
      const permissionList = this.state.ruleForm.permissionList || [];
      const selectedCount = this.allAppPermissionIds.filter(id => permissionList.includes(id)).length;
      return selectedCount > 0 && selectedCount < this.allAppPermissionIds.length;
    }
  },
  created() {

  },
  mounted() {
    this.fetchData()
    this.initMenu()
    this.initPermission()
  }
}
</script>

<style scoped>
.dialog-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
}

.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 20px 80px;
}

.dialog-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: center;
  z-index: 1000;
}
</style>

