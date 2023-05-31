<template>
    <div class="dispose">
      <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:sysdispose:defaults']"
              type="primary"
              size="mini"
              @click="defaults"
            >会员等级配置</el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="customerlist">
          <el-table-column label="配置项" width="150" prop="title" align="center"  show-overflow-tooltip/>
          <el-table-column label="配置值" align="center" prop="value" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.value }}</span><span v-if="scope.row.name=='from_address'||scope.row.name=='collection_address'"> (余额：{{scope.row.balance}})</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                :disabled='scope.row.can_modify==0'
                v-permisaction="['system:sysdispose:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="修改配置" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="配置项" prop="title">
              <el-input v-model="form.title" placeholder="请输入配置项" />
            </el-form-item>
            <el-form-item label="配置值" prop="value">
              <el-input v-model="form.value" type="textarea" placeholder="请输入配置值" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>


        <el-dialog title="会员等级配置" :visible.sync="show" width="1000px">
        <el-table :data="defaultlist">
          <el-table-column label="等级" prop="grade" align="center">
            <template slot-scope="scope">
              <span style="color:red;">{{ scope.row.grade }} <span v-if="scope.$index==0">（门槛值）</span></span>
            </template>
          </el-table-column>
          <el-table-column label="算力（TB）" prop="levelvalue" align="center">
            <template slot-scope="scope">
                <el-input v-if=" isEdit == scope.$index " v-model="scope.row.levelvalue" placeholder="请输入金额"></el-input>
                <span v-if=" isEdit != scope.$index ">≥ {{ scope.row.levelvalue }}</span>
            </template>
          </el-table-column>
          <el-table-column label="百分比" prop="percent" align="center">
            <template slot-scope="scope">
                <el-input v-if=" isEdit == scope.$index " v-model="scope.row.percent" placeholder="请输入百分比"></el-input>
                <span v-if=" isEdit != scope.$index "><span v-show="scope.row.grade!='V1'">+</span> {{ scope.row.percent }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-if=" isEdit == scope.$index "
                v-permisaction="['system:sysdispose:edits']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row, 1)"
              >确定</el-button>
              <el-button
                v-if=" isEdit != scope.$index "
                v-permisaction="['system:sysdispose:edits']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row, 0)"
              >编辑</el-button>
              <el-button
                v-if=" scope.$index!=0 "
                v-permisaction="['system:sysdispose:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index,scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-button
          slot="append"
          style="width: 100%;border-radius: 0;border-top: 0;border-left: 0;border-right: 0;"
          @click="appendNew">点击增加一行</el-button>
        </el-table>
        <div style="text-align:center;margin-top:20px;">
            <el-button size="mini" type="primary" @click="submits">提交</el-button>
            <el-button size="mini" @click="cancels">取消</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import { financeConfigList,updateConfigById } from '@/api/finance/finance'
import { profitconfigList,profitconfigEdit } from '@/api/profitconfig/profitconfig'
export default {
    name:'Dispose',
    props: {},
    data() {
        return {
          // 遮罩层
            loading: false,
            customerlist:[],
            open:false,
            form:{},
            show:false,
            isEdit: -99,
            defaultlist:[],
            rules: {
              title: [
                { required: true, message: '配置项不能为空', trigger: 'blur' }
              ],
              value: [
                { required: true, message: '配置值不能为空', trigger: 'blur' },
                {
                  pattern: /^[0-9]*[1-9][0-9]*$/,
                  message: '配置值为正整数',
                  trigger: 'blur'
                }
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
            financeConfigList(this.queryParams).then(res=> {
                this.customerlist=res.data
                this.loading=false
            })
        },
        handleUpdate(row) {
            this.auto()
            this.form=row
            this.open=true
        },
        submitForm() {
          this.$refs['form'].validate(valid => {
            if (valid) {
                updateConfigById(this.form).then(res=> {
                  this.msgSuccess('修改成功');
                  this.open = false
                  this.auto()
                })
            }
          })
        },
        cancel() {
          this.open = false
        },
        defaults() {
            this.show=true
            this.isEdit=-99
            profitconfigList().then(res=> {
                this.defaultlist=res.data
                this.ids=this.defaultlist.map(item => item.id).join(",")
                for (var i=0;i<this.defaultlist.length;i++) {
                  this.defaultlist[i].grade='V'+(i+1)
                  this.defaultlist[i].percent=this.defaultlist[i].percent*100+'%'
                }
            })
        },
        handleEdit(index, row, status) {
          switch (status) {
            case 0:
              this.isEdit = index;
              break;
            case 1:
              this.isEdit = -99;
              break;
          }
        },
        handleDelete(index,row) {
            this.isEdit=-99
            this.defaultlist.splice(index, 1)　
        },
        appendNew() {
          this.defaultlist.push({
            grade:'V'+(this.defaultlist.length+1),
            percent: '',
            levelvalue: '',
          });
          this.isEdit = this.defaultlist.length - 1
        },
        submits() {
            this.isEdit=-99
            for (var i=0;i<this.defaultlist.length;i++) {
                this.defaultlist[i].percent=this.defaultlist[i].percent.replace("%","")*0.01
                this.defaultlist[i].levelvalue=Number(this.defaultlist[i].levelvalue)
            }
            profitconfigEdit({"ids":this.ids,"profit":this.defaultlist}).then(res=> {
                this.show=false
                this.msgSuccess('操作成功');
            })
        },
        cancels() {
           this.show=false
        },
    },
    components: {},
};
</script>

<style scoped>
.dispose {
    padding: 20px;
}
</style>
