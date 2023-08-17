<template>
    <div class="system-menu-container layout-pd">
        <el-card shadow="hover">
            <div class="system-menu-search mb15">
                <el-input size="default" placeholder="请输入菜单名称" style="max-width: 180px"></el-input>
                <el-button size="default" type="primary" class="ml10" @click="fetchData">
                    <el-icon>
                        <ele-Search/>
                    </el-icon>
                    查询
                </el-button>
                <el-button size="default" type="success" class="ml10" @click="onOpenAddOrEdit()">
                    <el-icon>
                        <ele-FolderAdd/>
                    </el-icon>
                    新增菜单
                </el-button>
            </div>
            <el-table
                    :data="state.tableData.data"
                    v-loading="state.tableData.loading"
                    style="width: 100%"
                    row-key="path"
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            >
                <el-table-column label="菜单名称" show-overflow-tooltip>
                    <template #default="scope">
                        <span class="ml10">{{ $t(scope.row.meta.title) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
                <el-table-column label="组件路径" show-overflow-tooltip>
                    <template #default="scope">
                        <span>{{ scope.row.component }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="排序" show-overflow-tooltip width="80">
                    <template #default="scope">
                        {{ scope.row.orderSort }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip width="240">
                    <template #default="scope">
                        <el-button size="small" text type="primary" @click="onOpenAddOrEdit('add')">新增</el-button>
                        <el-button size="small" text type="primary" @click="onOpenAddOrEdit('edit', scope.row)">修改
                        </el-button>
                        <el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog :title="state.dialog.title" :visible.sync="state.dialog.isShowDialog" width="769px">
            <el-form ref="menuDialogFormRef" :model="state.ruleForm" size="default" label-width="80px">
                <el-row :gutter="35">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                        <el-form-item label="上级菜单">
                            <el-cascader
                                    :options="state.menuData"
                                    :props="{ value: 'menuId', label: 'title' }"
                                    placeholder="请选择上级菜单"
                                    clearable
                                    class="w100"
                                    v-model="state.menuSelectData"
                                    @change="selectMenuChange"
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="菜单名称">
                            <el-input v-model="state.ruleForm.meta.title" placeholder="格式：message.router.xxx"
                                      clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <template>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="路由名称">
                                <el-input v-model="state.ruleForm.name" placeholder="路由中的 name 值"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="路由路径">
                                <el-input v-model="state.ruleForm.path" placeholder="路由中的 path 值"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="重定向">
                                <el-input v-model="state.ruleForm.redirect" placeholder="请输入路由重定向"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label='菜单图标'>
                                <el-popover
                                        placement="bottom"
                                        width="450"
                                        trigger="click"
                                        @show="popoverShow">
                                      <span slot="reference">
                                        <el-input suffix-icon='data-icon' v-model="state.ruleForm.meta.icon" placeholder='请输入菜单图标'>
                                           <template slot="append">
                                             <i :class="state.ruleForm.meta.icon"/>
                                           </template>
                                        </el-input>
                                      </span>
                                    <div class="iconList">
                                        <el-tabs v-model="activeName">
                                            <el-tab-pane
                                                    v-for="(item, index) in iconList"
                                                    :key="item.label"
                                                    :name="'name'+ index"
                                                    :label="item.label">
                                                <i v-for="item in item.list" :key="item" :class="item"
                                                   @click="setIcon(item)" style="font-size:20px"></i>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </div>
                                </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="组件路径">
                                <el-input v-model="state.ruleForm.component" placeholder="组件路径"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                            <el-form-item label="链接地址">
                                <el-input
                                        v-model="state.ruleForm.meta.isLink"
                                        placeholder="外链/内嵌时链接地址（http:xxx.com）"
                                        clearable
                                        :disabled="!state.ruleForm.isLink"
                                >
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="菜单排序">
                            <el-input-number v-model="state.ruleForm.orderSort" controls-position="right"
                                             placeholder="请输入排序" class="w100"/>
                        </el-form-item>
                    </el-col>
                    <template>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="是否隐藏">
                                <el-radio-group v-model="state.ruleForm.meta.isHide">
                                    <el-radio :label="true">隐藏</el-radio>
                                    <el-radio :label="false">不隐藏</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="页面缓存">
                                <el-radio-group v-model="state.ruleForm.meta.isKeepAlive">
                                    <el-radio :label="true">缓存</el-radio>
                                    <el-radio :label="false">不缓存</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="是否固定">
                                <el-radio-group v-model="state.ruleForm.meta.isAffix">
                                    <el-radio :label="true">固定</el-radio>
                                    <el-radio :label="false">不固定</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="是否外链">
                                <el-radio-group v-model="state.ruleForm.isLink"
                                                :disabled="state.ruleForm.meta.isIframe">
                                    <el-radio :label="true">是</el-radio>
                                    <el-radio :label="false">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                            <el-form-item label="是否内嵌">
                                <el-radio-group v-model="state.ruleForm.meta.isIframe" @change="onSelectIframeChange">
                                    <el-radio :label="true">是</el-radio>
                                    <el-radio :label="false">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </template>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="onCancel" size="default">取 消</el-button>
                  <el-button type="primary" @click="onSubmit" :loading="state.submitBtn.loading" size="default">{{ state.dialog.submitTxt }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {useMenuApi} from '@/api/menu';
import {Message, MessageBox} from 'element-ui';

export default {
    name: "menuList",
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
                    parentId: '', // 上级菜单
                    menuType: 'menu', // 菜单类型
                    name: '', // 路由名称
                    component: '', // 组件路径
                    isLink: false, // 是否外链
                    orderSort: 0, // 菜单排序
                    path: '', // 路由路径
                    redirect: '', // 路由重定向，有子集 children 时
                    meta: {
                        title: '', // 菜单名称
                        icon: '', // 菜单图标
                        isHide: false, // 是否隐藏
                        isKeepAlive: true, // 是否缓存
                        isAffix: false, // 是否固定
                        isLink: '', // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink: 链接地址不为空`
                        isIframe: false, // 是否内嵌，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
                        roles: '', // 权限标识，取角色管理
                    }
                },
                menuData: [],
                menuSelectData: [],
                submitBtn: {
                    loading: false,
                    type: ''
                }
            },
            activeName: '0',
            iconList: [
                {
                    label: '通用图标',
                    id: 'first',
                    list: [
                        'iconfont iconicon_roundadd',
                        'iconfont iconicon_compile',
                        'iconfont iconicon_glass',
                        'iconfont iconicon_roundclose',
                        'iconfont iconicon_roundreduce',
                        'iconfont iconicon_delete',
                        'iconfont iconicon_shakehands',
                        'iconfont iconicon_task_done',
                        'iconfont iconicon_voipphone',
                        'iconfont iconicon_safety',
                        'iconfont iconicon_work',
                        'iconfont iconicon_study',
                        'iconfont iconicon_task',
                        'iconfont iconicon_subordinate',
                        'iconfont iconicon_star',
                        'iconfont iconicon_setting',
                        'iconfont iconicon_sms',
                        'iconfont iconicon_share',
                        'iconfont iconicon_secret',
                        'iconfont iconicon_scan_namecard',
                        'iconfont iconicon_principal',
                        'iconfont iconicon_group',
                        'iconfont iconicon_send',
                        'iconfont iconicon_scan',
                        'iconfont iconicon_search',
                        'iconfont iconicon_refresh',
                        'iconfont iconicon_savememo',
                        'iconfont iconicon_QRcode',
                        'iconfont iconicon_im_keyboard',
                        'iconfont iconicon_redpacket',
                        'iconfont iconicon_photo',
                        'iconfont iconicon_qq',
                        'iconfont iconicon_wechat',
                        'iconfont iconicon_phone',
                        'iconfont iconicon_namecard',
                        'iconfont iconicon_notice',
                        'iconfont iconicon_next_arrow',
                        'iconfont iconicon_left',
                        'iconfont iconicon_more',
                        'iconfont iconicon_details',
                        'iconfont iconicon_message',
                        'iconfont iconicon_mobilephone',
                        'iconfont iconicon_im_voice',
                        'iconfont iconicon_GPS',
                        'iconfont iconicon_ding',
                        'iconfont iconicon_exchange',
                        'iconfont iconicon_cspace',
                        'iconfont iconicon_doc',
                        'iconfont iconicon_dispose',
                        'iconfont iconicon_discovery',
                        'iconfont iconicon_community_line',
                        'iconfont iconicon_cloud_history',
                        'iconfont iconicon_coinpurse_line',
                        'iconfont iconicon_airplay',
                        'iconfont iconicon_at',
                        'iconfont iconicon_addressbook',
                        'iconfont iconicon_boss',
                        'iconfont iconicon_addperson',
                        'iconfont iconicon_affiliations_li',
                        'iconfont iconicon_addmessage',
                        'iconfont iconicon_addresslist',
                        'iconfont iconicon_add'
                    ]
                },
                {
                    label: '系统图标',
                    id: 'second',
                    list: [
                        'iconfont icon-zhongyingwen',
                        'iconfont icon-caidan',
                        'iconfont icon-rizhi1',
                        'iconfont icon-zhuti',
                        'iconfont icon-suoping',
                        'iconfont icon-bug',
                        'iconfont icon-qq1',
                        'iconfont icon-weixin1',
                        'iconfont icon-shouji',
                        'iconfont icon-mima',
                        'iconfont icon-yonghu',
                        'iconfont icon-yanzhengma',
                        'iconfont icon-canshu',
                        'iconfont icon-dongtai',
                        'iconfont icon-iconset0265',
                        'iconfont icon-shujuzhanshi2',
                        'iconfont icon-tuichuquanping',
                        'iconfont icon-rizhi',
                        'iconfont icon-cuowutishitubiao',
                        'iconfont icon-debug',
                        'iconfont icon-iconset0216',
                        'iconfont icon-quanxian',
                        'iconfont icon-shuaxin',
                        'iconfont icon-bofangqi-suoping',
                        'iconfont icon-quanping',
                        'iconfont icon-navicon',
                        'iconfont icon-biaodan',
                        'iconfont icon-liuliangyunpingtaitubiao08',
                        'iconfont icon-caidanguanli',
                        'iconfont icon-cuowu',
                        'iconfont icon-wxbgongju',
                        'iconfont icon-tuichu',
                        'iconfont icon-daohanglanmoshi02',
                        'iconfont icon-changyonglogo27',
                        'iconfont icon-biaoge',
                        'iconfont icon-baidu1',
                        'iconfont icon-tubiao',
                        'iconfont icon-souhu',
                        'iconfont icon-msnui-360',
                        'iconfont icon-iframe',
                        'iconfont icon-huanyingye'
                    ]
                }
            ]
        }
    },
    methods: {
        selectMenuChange(value) {
            console.log(value)
            this.menuSelectData = value
            this.state.ruleForm.parentId = value[value.length - 1];
        },
        popoverShow() {
            this.$nextTick(() => {
                this.activeName = '0'
            })
        },
        setIcon(icon) {
            this.state.ruleForm.meta.icon = icon;
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
        fetchData() {
            this.state.tableData.loading = true
            useMenuApi().list(this.state.tableData.param).then(response => {
                this.state.tableData.data = response.data
                this.state.menuData = this.getTreeData(response.data)
                this.state.tableData.loading = false
            })
        },
        onOpenAddOrEdit(type, row) {
            if (type === 'edit') {
                this.state.ruleForm = row;
                this.state.dialog.title = '修改菜单';
                this.state.dialog.submitTxt = '修 改';
                // 回显父级菜单
                this.state.menuSelectData = [];
                this.state.menuSelectData = this.findMenuIds(row.menuId, this.state.menuData);
                // console.log("3:", menuIds);
            } else {
                this.state.ruleForm = {
                    parentId: '', // 上级菜单
                    menuType: 'menu', // 菜单类型
                    name: '', // 路由名称
                    component: '', // 组件路径
                    isLink: false, // 是否外链
                    orderSort: 0, // 菜单排序
                    path: '', // 路由路径
                    redirect: '', // 路由重定向，有子集 children 时
                    meta: {
                        title: '', // 菜单名称
                        icon: '', // 菜单图标
                        isHide: false, // 是否隐藏
                        isKeepAlive: true, // 是否缓存
                        isAffix: false, // 是否固定
                        isLink: '', // 外链/内嵌时链接地址（http:xxx.com），开启外链条件，`1、isLink: 链接地址不为空`
                        isIframe: false, // 是否内嵌，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
                        roles: '', // 权限标识，取角色管理
                    }
                };
                this.state.dialog.title = '新增菜单';
                this.state.dialog.submitTxt = '新 增';
            }
            this.state.submitBtn.type = type;
            this.state.dialog.isShowDialog = true;
        },
        findMenuIds(menuId, arrData) {
            let arr = [];
            let returnArr = []; // 存放结果的数组
            let depth = 0; // 定义全局层级
            // 定义递归函数
            function childrenEach(childrenData, depthN) {
                for (let j = 0; j < childrenData.length; j++) {
                    depth = depthN; // 将执行的层级赋值 到 全局层级
                    arr[depthN] = childrenData[j].menuId;
                    if (childrenData[j].menuId === menuId) {
                        returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
                        break;
                    } else {
                        if (childrenData[j].children) {
                            depth++;
                            childrenEach(childrenData[j].children, depth);
                        }
                    }
                }
                return returnArr;
            }

            return childrenEach(arrData, depth);
        },
        onRowDel(row) {
            MessageBox.confirm(`此操作将永久删除名称：“${row.title}”，是否继续?`, '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.deleteInfo(row);
            }).catch(() => {
            });
        },
        onSelectIframeChange() {
            if (this.state.ruleForm.meta.isIframe) {
                this.state.state.ruleForm.isLink = true;
            } else {
                this.state.state.ruleForm.isLink = false;
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
        onSubmit() {
            this.state.submitBtn.loading = true;
            if (this.state.submitBtn.type === 'edit') {
                useMenuApi().update(this.state.ruleForm).then(response => {
                    this.state.submitBtn.loading = false;
                    this.closeDialog();
                    this.fetchData()
                }).catch(() => {
                    this.state.submitBtn.loading = false
                })
            } else {
                useMenuApi().save(this.state.ruleForm).then(response => {
                    this.state.submitBtn.loading = false;
                    this.closeDialog();
                    this.fetchData()
                }).catch(() => {
                    this.state.submitBtn.loading = false
                })
            }
        },
        deleteInfo(row) {
            let param = {
                menuId: row.menuId
            };
            useMenuApi().delete(param).then(response => {
                Message.success('删除成功');
                this.fetchData()
            }).catch(() => {
                this.fetchData()
            })
        },
    },
    computed: {},
    created() {

    },
    mounted() {
        this.fetchData()
    }
}
</script>

<style scoped lang="scss">
.icon_list {
  width: 100%;
  height: 320px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  i {
    display: inline-block;
    width: 60px;
    height: 45px;
    color: #000000;
    font-size: 20px;
    border: 1px solid #E6E6E6;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    line-height: 45px;
    margin: 5px;

    &:hover {
      color: blue;
      border-color: blue;
    }
  }

  ::v-deep .el-tabs__content {
    height: 270px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
