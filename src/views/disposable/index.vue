<template>
    <div class="disposable">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:sysdisposable:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
        </el-row>
        <el-table :data="list">
          <el-table-column label="姓名" prop="nick_name" align="center" />
          <el-table-column label="用户名" prop="username" align="center" />
          <el-table-column label="分润比例" prop="percent" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.percent*100+'%'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:sysdisposable:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-permisaction="['system:sysdisposable:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入姓名、用户名、手机号查找" @input="chang"/>
            </el-form-item>
            <el-form-item label="百分比" prop="percent">
              <el-input v-model="form.percent" placeholder="请输入百分比(如：5%)" />
            </el-form-item>
          </el-form>
          <div class="small" v-show="show">
            <div v-for="(item,index) in data" :key="index" @click="choice(item)">{{item.nick_name}}  ({{item.username}})</div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { profitconfigOnce,profitconfigList,profitconfigEdit,userList,updateProfitConfigOnce,delProfitconfigOnce } from '@/api/profitconfig/profitconfig'
export default {
    name:'Disposable',
    props: {},
    data() {
        return {
            open:false,
            title:'',
            form:{},
            list:[],
            data:[],
            // 表单校验
            rules: {
              username: [
                { required: true, message: '用户名不能为空', trigger: 'blur' }
              ],
              percent: [
                { required: true, message: '百分比不能为空', trigger: 'blur' }
              ],
            },
            show:false,
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
          var params={
              profittype:'0'
          }
          profitconfigList(params).then(res=> {
            this.list=res.data
            this.total = res.total
          })
        },
        chang() {
            if(this.form.username.length!='') {
                userList({keyword:this.form.username}).then(res=> {
                    this.data=res.list
                    if (this.data.length>0) {
                      this.show=true
                    }else {
                      this.show=false
                    }
                })
            }else{
              this.data=[]
              this.show=false
            }
        },
        choice(item) {
          this.form.username=item.username
          this.form.nick_name=item.nick_name
          this.form.userid=item.userid
          this.show=false
        },
        reset() {
            this.form={
              username:undefined,
              percent:undefined,
            }
            this.resetForm('form')
        },
        handleAdd() {
            this.reset()
            this.open=true
            this.show=false
            this.title = '添加用户'
        },
        handleUpdate(row) {
            this.auto()
            this.form=row
            this.form.percent=row.percent*100+'%'
            this.open = true
            this.show=false
            this.title = '修改用户'
        },
        handleDelete(row) {
            delProfitconfigOnce({id:row.id}).then(res=> {
              this.msgSuccess('删除成功');
              this.auto()
            })
        },
        submitForm() {
          this.$refs['form'].validate(valid => {
            this.form.percent=this.form.percent.replace("%","")*0.01+''
            if (valid) {
              if(this.form.id!== undefined) {
                updateProfitConfigOnce(this.form).then(res=> {
                  this.msgSuccess('修改成功');
                  this.open = false
                  this.auto()
                })
              }else {
                // this.form.percent=this.form.percent/100+''
                profitconfigOnce(this.form).then(res=> {
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
    },
    components: {},
};
</script>

<style scoped>
.disposable {
    padding: 20px;
}
.small {
  position: absolute;
  top: 130px;
  left: 100px;
  width: 380px;
  height: 258px;
  border: 1px solid rgb(0, 119, 255);
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  overflow-y: auto;
}
.small div {
  padding: 8px 20px;
}
.small div:hover {
  background-color: #eeeeee;
}
</style>
