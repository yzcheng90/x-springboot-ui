<template>
    <div class="system-user-container layout-padding">
        <el-card shadow="hover" class="layout-padding-auto">
            <div class="system-user-search mb15">
                <el-input size="default" v-model="state.tableData.param.keyword" placeholder="请输入用户名称"
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
                    新增用户
                </el-button>
            </div>
            <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
                <el-table-column type="index" label="序号" width="60"/>
                <el-table-column prop="userId" label="用户ID" show-overflow-tooltip></el-table-column>
                <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
                <el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="用户状态" show-overflow-tooltip>
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.status == 1">启用</el-tag>
                        <el-tag type="info" v-else>禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button :disabled="scope.row.username === 'admin'" size="small" text type="primary"
                                   @click="onOpenAddOrEdit('edit', scope.row)"
                        >修改
                        </el-button
                        >
                        <el-button :disabled="scope.row.username === 'admin'" size="small" text type="primary"
                                   @click="onRowDel(scope.row)">删除
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
                            <el-form-item label="账户名称">
                                <el-input v-model="state.ruleForm.username" placeholder="请输入账户名称" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="账户密码">
                                <el-input v-model="state.ruleForm.password" placeholder="请输入" type="password"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="手机号">
                                <el-input v-model="state.ruleForm.mobile" placeholder="请输入手机号" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="邮箱">
                                <el-input v-model="state.ruleForm.email" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="用户状态">
                                <el-radio-group v-model="state.ruleForm.status">
                                    <el-radio-button :label="0">禁用</el-radio-button>
                                    <el-radio-button :label="1">正常</el-radio-button>
                                </el-radio-group>

                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="选择角色">
                                <el-select v-model="state.ruleForm.roleIdList" multiple placeholder="请选择">
                                    <el-option
                                            v-for="item in state.roleListData"
                                            :key="item.roleId"
                                            :label="item.roleName"
                                            :value="item.roleId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <template>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" :loading="state.submitBtn.loading" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
                </template>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {useListApi} from '@/api/user';
    import {roleListApi} from '@/api/role';
    import {Message, MessageBox} from 'element-ui';

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
                        userId: '', // 账户名称
                        username: '', // 账户名称
                        mobile: '', // 手机号
                        email: '', // 邮箱
                        password: '', // 账户密码
                        status: 1, // 用户状态
                        roleIdList: [] // 角色
                    },
                    submitBtn: {
                        loading: false,
                        type: ''
                    }
                }
            }
        },
        methods: {
            initRoleData() {
                roleListApi().select().then(response => {
                    this.state.roleListData = response.data
                })
            },
            fetchData() {
                this.state.tableData.loading = true
                useListApi().list(this.state.tableData.param).then(response => {
                    this.state.tableData.data = response.data.records
                    this.state.tableData.total = response.data.total
                    this.state.tableData.loading = false
                })
            },
            onOpenAddOrEdit(type, row) {
                if (type === 'edit') {
                    this.state.submitBtn.type = 'edit';
                    this.state.ruleForm = row;
                    this.state.dialog.title = '修改用户';
                    this.state.dialog.submitTxt = '修 改';
                } else {
                    this.state.ruleForm = {
                        userId: '', // 账户名称
                        username: '', // 账户名称
                        mobile: '', // 手机号
                        email: '', // 邮箱
                        password: '', // 账户密码
                        status: 1, // 用户状态
                    };
                    this.state.submitBtn.type = 'add';
                    this.state.dialog.title = '新增用户';
                    this.state.dialog.submitTxt = '新 增';
                }
                this.state.dialog.isShowDialog = true;
            },
            onRowDel(row) {
                MessageBox.confirm(`此操作将永久删除账户名称：“${row.username}”，是否继续?`, '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.deleteInfo(row)
                }).catch(() => {
                });
            },
            deleteInfo(row) {
                useListApi().delete(row).then(response => {
                    Message.success('删除成功');
                    this.fetchData()
                }).catch(() => {
                    this.fetchData()
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
            onSubmit() {
                this.state.submitBtn.loading = true;
                if (this.state.submitBtn.type === 'edit') {
                    useListApi().update(this.state.ruleForm).then(response => {
                        this.state.submitBtn.loading = false;
                        this.closeDialog();
                        this.fetchData()
                    }).catch(() => {
                        this.state.submitBtn.loading = false
                    })
                } else {
                    useListApi().add(this.state.ruleForm).then(response => {
                        this.state.submitBtn.loading = false;
                        this.closeDialog();
                        this.fetchData()
                    }).catch(() => {
                        this.state.submitBtn.loading = false
                    })
                }
            }
        },
        computed: {},
        created() {

        },
        mounted() {
            this.fetchData()
            this.initRoleData()
        }
    }
</script>

<style scoped>

</style>
