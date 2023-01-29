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
        <el-table-column prop="tableName" label="表名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tableComment" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="engine" label="引擎" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenAddOrEdit('edit', scope.row)">
              生成
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
        <el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="130px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="表名">
                <el-input v-model="state.ruleForm.tableName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="模块名">
                <el-input  v-model="state.ruleForm.moduleName" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="RequestMapping">
                <el-input placeholder="请输入内容" v-model="state.ruleForm.requestMapping">
                  <template slot="prepend">{{state.ruleForm.moduleName}}/</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="后台包路径">
                <el-input v-model="state.ruleForm.packagePath"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="Restful接口">
                <el-switch v-model="state.ruleForm.useRestful"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="字段驼峰">
                <el-switch v-model="state.ruleForm.useHump"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="生成文件">
                <el-checkbox label="Controller" v-model="state.ruleForm.fileController"></el-checkbox>
                <el-checkbox label="Service/Impl" v-model="state.ruleForm.fileServiceImpl"></el-checkbox>
                <el-checkbox label="Mapper" v-model="state.ruleForm.fileMapper"></el-checkbox>
                <el-checkbox label="Entity" v-model="state.ruleForm.fileEntity"></el-checkbox>
                <el-checkbox label="Mapper.xml" v-model="state.ruleForm.fileMapperXml"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="后台项目根目录">
                <el-input v-model="state.ruleForm.filePath"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="是否生成UI页面">
                <el-switch v-model="state.ruleForm.genUi"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="前台项目目录">
                <el-input :disabled="!state.ruleForm.genUi" v-model="state.ruleForm.uiFilePath"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="author">
                <el-input v-model="state.ruleForm.author"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
              <el-form-item label="email">
                <el-input v-model="state.ruleForm.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <template>
            <span class="dialog-footer">
              <el-button @click="onCancel" size="default">取 消</el-button>
              <el-button type="primary" @click="onSubmit" :loading="state.submitBtn.loading" size="default">生 成</el-button>
              &nbsp;&nbsp;&nbsp;<el-tag type="warning">代码生成后，需要进行代码格式化</el-tag>
            </span>
          </template>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {useCodeGenApi} from '@/api/code';

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
            tableName: "",
            mainPath: "com.suke.czx",
            packagePath: "com.suke.czx.modules",
            filePath: "E:\\github\\X-SpringBoot",
            uiFilePath: "E:\\github\\x-springboot-ui",
            moduleName: "user",
            requestMapping: "user",
            author: "czx",
            email: "object_czx@163.com",
            useRestful: false,
            useHump: true,
            fileController: true,
            fileServiceImpl: true,
            fileMapper: true,
            fileMapperXml: false,
            fileEntity: true,
            genUi: true
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
        this.state.tableData.loading = true
        useCodeGenApi().list(this.state.tableData.param).then(response => {
          this.state.tableData.data = response.data.records
          this.state.tableData.total = response.data.total
          this.state.tableData.loading = false
        })
      },
      onOpenAddOrEdit(type, row) {
        console.log(row)
        this.state.ruleForm.tableName = row.tableName;
        this.state.dialog.title = '生成配置';
        this.state.dialog.submitTxt = '配 置';
        this.state.dialog.isShowDialog = true;
      },
      onSubmit() {
        if(!this.state.ruleForm.tableName){
          this.$message('先选择表再操作');
          return;
        }
        this.state.submitBtn.loading = true;
        useCodeGenApi().create(this.state.ruleForm).then(response => {
          this.$message('代码生成成功！');
          this.state.submitBtn.loading = false;
          this.closeDialog();
          this.fetchData()
        }).catch(() => {
          this.state.submitBtn.loading = false
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
