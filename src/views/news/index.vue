<template>
    <div class="news">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:sysnews:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="customerlist">
          <el-table-column label="新闻标题" width="140" prop="title" align="center" show-overflow-tooltip/>
          <el-table-column label="新闻内容" prop="content" align="center" show-overflow-tooltip/>
          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="0"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="160" align="center" prop="create_time">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.create_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:sysnews:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-permisaction="['system:sysnews:delete']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="auto"
        />
        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="新闻标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入新闻标题" maxlength="11" />
            </el-form-item>
            <el-form-item label="新闻内容" prop="content">
              <el-input type="textarea" :rows="6" v-model="form.content" placeholder="请输入新闻内容" />
            </el-form-item>
            <el-form-item label="状态">  
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { addNews,deleteNews,getAllNews,updateNews,updateNewsStatus } from '@/api/news/news'
export default {
    name:'News',
    props: {},
    data() {
        return {
          // 遮罩层
            loading: false,
            open:false,
            title:'',
            form:{},
            customerlist:[],
            queryParams: {
              pageIndex: 1,
              pageSize: 10,
            },
            statusOptions:[
                {dictValue:'1',dictLabel:'显示'},
                {dictValue:'0',dictLabel:'隐藏'},
            ],
            total: 0,
            // 表单校验
            rules: {
              title: [
                { required: true, message: '新闻标题不能为空', trigger: 'blur' }
              ],
              content: [
                { required: true, message: '新闻内容不能为空', trigger: 'blur' }
              ],
            },
        };
    },
    computed: {},
    created() {
        this.auto()
    },
    mounted() {},
    watch: {},
    methods: {
        auto() {
          this.loading=true
          getAllNews(this.queryParams).then(res=> {
            this.customerlist=res.list
            this.total = res.total
                this.loading=false
          })
        },
        reset() {
            this.form={
              title:undefined,
              content:undefined,
              status:'1'
            }
            this.resetForm('form')
        },
        handleAdd() {
            this.reset()
            this.open=true
            this.title = '添加新闻'
        },
        handleUpdate(row) {
            this.auto()
            this.form=row
            this.open = true
            this.title = '修改新闻'
        },
        handleDelete(row) {
            deleteNews({id:row.id}).then(res=> {
                this.msgSuccess('删除成功')
                this.auto()
            })
        },
        submitForm() {
          this.$refs['form'].validate(valid => {
            if (valid) {
                if(this.form.id!== undefined) {
                  updateNews(this.form).then(res=> {
                    this.msgSuccess('修改成功');
                    this.open = false
                    this.auto()
                  })
                }else {
                  addNews(this.form).then(res=> {
                    this.msgSuccess('新增成功')
                    this.open = false
                    this.auto()
                  })
                }
            }
          })
        },
        cancel() {
          this.open = false
          this.reset()
        },
        handleStatusChange(row) {
          var params={
            id:row.id,
            status: row.status
          }
          const text = row.status === '0' ? '隐藏' : '显示'
          this.$confirm('确认要 "' + text + '"  "' + row.title + '"新闻吗?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function() {
            return updateNewsStatus(params)
          }).then(() => {
            this.msgSuccess(text + '成功')
            this.auto()
          }).catch(function() {
            row.status = row.status === '0' ? '1' : '0'
          })
        },
    },
    components: {},
};
</script>

<style scoped>
.news {
    padding: 20px;
}
</style>
