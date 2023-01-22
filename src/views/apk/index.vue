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
				<el-table-column type="index" label="序号" width="60"/>
																				<el-table-column prop="updateContent" label="更新内容" show-overflow-tooltip></el-table-column>
																<el-table-column prop="versionCode" label="版本码" show-overflow-tooltip></el-table-column>
																<el-table-column prop="versionName" label="版本号" show-overflow-tooltip></el-table-column>
																<el-table-column prop="packageName" label="包名" show-overflow-tooltip></el-table-column>
																<el-table-column prop="downloadUrl" label="下载地址" show-overflow-tooltip></el-table-column>
																<el-table-column prop="appName" label="APP名" show-overflow-tooltip></el-table-column>
																<el-table-column prop="md5Value" label="MD5值" show-overflow-tooltip></el-table-column>
																<el-table-column prop="fileName" label="文件名" show-overflow-tooltip></el-table-column>
																<el-table-column prop="fileSize" label="文件大小" show-overflow-tooltip></el-table-column>
																<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
																<el-table-column prop="updateTime" label="修改时间" show-overflow-tooltip></el-table-column>
																<el-table-column prop="userId" label="上传人" show-overflow-tooltip></el-table-column>
																<el-table-column prop="isForce" label="是否强制安装" show-overflow-tooltip></el-table-column>
																<el-table-column prop="isIgnorable" label="是否可忽略该版本" show-overflow-tooltip></el-table-column>
																<el-table-column prop="isSilent" label="是否静默下载" show-overflow-tooltip></el-table-column>
												<el-table-column label="操作" width="200">
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
				<el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
																									<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="更新内容">
								<el-input v-model="state.ruleForm.updateContent" placeholder="更新内容" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="版本码">
								<el-input v-model="state.ruleForm.versionCode" placeholder="版本码" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="版本号">
								<el-input v-model="state.ruleForm.versionName" placeholder="版本号" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="包名">
								<el-input v-model="state.ruleForm.packageName" placeholder="包名" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="下载地址">
								<el-input v-model="state.ruleForm.downloadUrl" placeholder="下载地址" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="APP名">
								<el-input v-model="state.ruleForm.appName" placeholder="APP名" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="MD5值">
								<el-input v-model="state.ruleForm.md5Value" placeholder="MD5值" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="文件名">
								<el-input v-model="state.ruleForm.fileName" placeholder="文件名" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="文件大小">
								<el-input v-model="state.ruleForm.fileSize" placeholder="文件大小" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="创建时间">
								<el-input v-model="state.ruleForm.createTime" placeholder="创建时间" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="修改时间">
								<el-input v-model="state.ruleForm.updateTime" placeholder="修改时间" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="上传人">
								<el-input v-model="state.ruleForm.userId" placeholder="上传人" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否强制安装">
								<el-input v-model="state.ruleForm.isForce" placeholder="是否强制安装" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否可忽略该版本">
								<el-input v-model="state.ruleForm.isIgnorable" placeholder="是否可忽略该版本" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
																				<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="是否静默下载">
								<el-input v-model="state.ruleForm.isSilent" placeholder="是否静默下载" clearable></el-input>
							</el-form-item>
						</el-col>
					</el-row>
														</el-form>
				<template>
					<span class="dialog-footer">
						<el-button @click="onCancel" size="default">取 消</el-button>
						<el-button type="primary" @click="onSubmit" :loading="state.submitBtn.loading" size="default">{{state.dialog.submitTxt}}</el-button>
					</span>
				</template>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { useApkApi } from '@/api/apk';
	import {Message, MessageBox} from 'element-ui';

	export default {
		name: "apk",
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
																														updateContent: '', // 更新内容
																								versionCode: '', // 版本码
																								versionName: '', // 版本号
																								packageName: '', // 包名
																								downloadUrl: '', // 下载地址
																								appName: '', // APP名
																								md5Value: '', // MD5值
																								fileName: '', // 文件名
																								fileSize: '', // 文件大小
																								createTime: '', // 创建时间
																								updateTime: '', // 修改时间
																								userId: '', // 上传人
																								isForce: '', // 是否强制安装
																								isIgnorable: '', // 是否可忽略该版本
																								isSilent: '', // 是否静默下载
																	},
					submitBtn: {
						loading: false,
						type:''
					}
				}
			}
		},
		methods: {
			fetchData() {
				this.state.ruleForm = {}
				this.state.tableData.loading = true
				useApkApi().list(this.state.tableData.param).then(response => {
					this.state.tableData.data = response.data.records
					this.state.tableData.total = response.data.total
					this.state.tableData.loading = false
				})
			},
			onOpenAddOrEdit(type, row) {
				if (type === 'edit') {
					this.state.submitBtn.type = 'edit';
					this.state.ruleForm = row;
					this.state.dialog.title = '修改${column.columnComment}';
					this.state.dialog.submitTxt = '修 改';
				} else {
					this.state.submitBtn.type = 'add';
					this.state.ruleForm = {
																														updateContent: '', // 更新内容
																								versionCode: '', // 版本码
																								versionName: '', // 版本号
																								packageName: '', // 包名
																								downloadUrl: '', // 下载地址
																								appName: '', // APP名
																								md5Value: '', // MD5值
																								fileName: '', // 文件名
																								fileSize: '', // 文件大小
																								createTime: '', // 创建时间
																								updateTime: '', // 修改时间
																								userId: '', // 上传人
																								isForce: '', // 是否强制安装
																								isIgnorable: '', // 是否可忽略该版本
																								isSilent: '', // 是否静默下载
																	};
					this.state.dialog.title = '新增${column.columnComment}';
					this.state.dialog.submitTxt = '新 增';
				}
				this.state.dialog.isShowDialog = true;
			},
			onRowDel(row) {
				MessageBox.confirm(`此操作将永久删除${column.columnComment}：“${row.roleName}”，是否继续?`, '提示', {
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
				if(this.state.submitBtn.type === 'edit'){
					useApkApi().update(this.state.ruleForm).then(response => {
						this.state.submitBtn.loading = false;
						this.closeDialog();
						this.fetchData()
					}).catch(() => {
						this.state.submitBtn.loading = false
					})
				}else {
					useApkApi().add(this.state.ruleForm).then(response => {
						this.state.submitBtn.loading = false;
						this.closeDialog();
						this.fetchData()
					}).catch(() => {
						this.state.submitBtn.loading = false
					})
				}
			},
			deleteInfo(row){
				useApkApi().delete(row).then(response => {
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
		}
	}
</script>

<style scoped>

</style>