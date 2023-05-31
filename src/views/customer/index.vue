<template>
    <div class="customer">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="客户姓名/手机号/业务员姓名"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:syscustomer:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              v-permisaction="['system:syscustomer:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button
              v-permisaction="['system:syscustomer:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col> -->
        </el-row>
        <el-table :data="customerlist">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="客户姓名" prop="name" align="center"  show-overflow-tooltip/>
          <el-table-column label="手机号" width="130" prop="phone" align="center" />
          <el-table-column label="身份证号" width="180" prop="identity" align="center" />
          <el-table-column label="银行卡号" width="180" prop="bank" align="center"/>
          <el-table-column label="开户行" prop="banknum" align="center" show-overflow-tooltip/>
          <el-table-column label="性别" width="80" prop="sex" align="center"/>
          <el-table-column label="业务员姓名" prop="nick_name" align="center"  show-overflow-tooltip/>
          <el-table-column label="状态" width="100" prop="status" align="center">
            <template slot-scope="scope">
                <span class="a" v-show=" scope.row.status==0 ">已通过</span>
                <span class="b" v-show=" scope.row.status==3 ">已拒绝</span>
                <span class="c" v-show=" scope.row.status==1 ">审核中</span>
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
                v-permisaction="['system:syscustomer:lists']"
                size="mini"
                type="text"
                icon="el-icon-document"
                @click="inauto(scope.row)"
              >投资列表</el-button>
              <el-button
                v-permisaction="['system:syscustomer:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                :disabled='scope.row.status==1||scope.row.flag==0'
                @click="handleUpdate(scope.row)"
              >修改</el-button>
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
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" style="width:100%;" placeholder="请选择">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
            </el-form-item>
            <el-form-item label="身份证" prop="identity">
              <el-input v-model="form.identity" placeholder="请输入身份证" />
            </el-form-item>
            <el-form-item label="银行卡号" prop="bank">
              <el-input v-model="form.bank" placeholder="请输入银行卡号"  maxlength="19"/>
            </el-form-item>
            <el-form-item label="开户行" prop="banknum">
              <el-input v-model="form.banknum" placeholder="请输入开户行" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 投资列表 -->
        <el-dialog title="投资列表" :visible.sync="show" width="1000px">
          <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:syscustomer:adds']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              :disabled='flag==0'
              @click="inhandleAdd"
            >新增</el-button>
          </el-col>
        </el-row>
        <el-table :data="list">
          <el-table-column label="金额" prop="amount" align="center" />
          <el-table-column label="利润比例" prop="profit" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.profit*100+'%'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" align="center"  show-overflow-tooltip/>
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="scope">
                <span class="a" v-show=" scope.row.status==0 ">已通过</span>
                <span class="b" v-show=" scope.row.status==3 ">已拒绝</span>
                <span class="c" v-show=" scope.row.status==1 ">审核中</span>
                <span class="c" v-show=" scope.row.status==4 ">终止审核</span>
                <span class="b" v-show=" scope.row.status==5 ">已终止</span>
                <span class="b" v-show=" scope.row.status==6 ">已终止</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.update_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:syscustomer:edits']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                :disabled='flag==0||scope.row.alterbool==1||scope.row.status==1||scope.row.status==4||scope.row.status==5||scope.row.status==6'
                @click="inhandleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-permisaction="['system:syscustomer:stop']"
                size="mini"
                type="text"
                icon="el-icon-circle-close"
                :disabled='flag==0||scope.row.status==1||scope.row.status==3||scope.row.status==4||scope.row.status==5||scope.row.status==6'
                @click="inhandleStop(scope.row)"
              >终止</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totals>0"
          :total="totals"
          :page.sync="params.pageIndex"
          :limit.sync="params.pageSize"
          @pagination="inauto"
        />
        </el-dialog>
        <!-- 添加或修改角色配置对话框 -->
        <el-dialog :title="titles" :visible.sync="show1" width="500px">
          <el-form ref="forms" :model="forms" :rules="rule" label-width="80px">
            <el-form-item label="金额" prop="amount">
              <el-input v-model="forms.amount" placeholder="请输入金额" />
            </el-form-item>
            <el-form-item label="时间" prop="date">
              <el-date-picker
                v-model="forms.date"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="利润比例" prop="profit">
              <el-input v-model="forms.profit" placeholder="请输入利润比例" disabled/>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="forms.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="insubmitForm">确 定</el-button>
            <el-button @click="incancel">取 消</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { customerAdd,customerList,customerEdit,getConfigKey } from '@/api/customer/customer'
import { investmentAdd,investmentList,investmentEdit,investmentBreak } from '@/api/investment/investment'
export default {
    name:'Customer',
    props: {},
    data() {
        return {
          flag:'',
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            ids: [],
            open:false,
            title:'',
            form:{},
            customerlist:[],
            queryParams: {
              pageIndex: 1,
              pageSize: 10,
              keyword: undefined,
            },
            total: 0,
            // 表单校验
            rules: {
              name: [
                { required: true, message: '姓名不能为空', trigger: 'blur' }
              ],
              sex: [
                { required: true, message: '性别不能为空', trigger: 'blur' }
              ],
              identity: [
                // { required: true, message: '身份证不能为空', trigger: 'blur' },
                // {
                //   pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                //   message: '请输入正确的身份证号',
                //   trigger: 'blur'
                // }
              ],
              bank: [
                { required: true, message: '银行卡号不能为空', trigger: 'blur' },
                {
                  pattern: /^([1-9]{1})(\d{15}|\d{18})$/,
                  message: '请输入正确的银行卡号',
                  trigger: 'blur'
                }
              ],
              banknum: [
                { required: true, message: '开户行不能为空', trigger: 'blur' }
              ],
              phone: [
                { required: true, message: '手机号码不能为空', trigger: 'blur' },
                {
                  pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                  message: '请输入正确的手机号码',
                  trigger: 'blur'
                }
              ]
            },
            show:false,
            show1:false,
            titles:'',
            forms:{},
            list:[],
            params: {
              pageIndex: 1,
              pageSize: 10,
            },
            totals: 0,
            // 表单校验
            rule: {
              amount: [
                { required: true, message: '金额不能为空', trigger: 'blur' },
                {
                  pattern: /^[0-9]*[1-9][0-9]*$/,
                  message: '金额为数字且不能为小数',
                  trigger: 'blur'
                }
              ],
              date: [
                { required: true, message: '时间不能为空', trigger: 'blur' }
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
          customerList(this.queryParams).then(res=> {
            this.customerlist=res.list
            this.total = res.total
          })
        },
        reset() {
            this.form={
              name:undefined,
              sex:undefined,
              identity:undefined,
              bank:undefined,
              banknum:undefined,
              phone:undefined,
            }
            this.resetForm('form')
        },
        handleAdd() {
            this.reset()
            this.open=true
            this.title = '添加客户'
        },
        handleUpdate(row) {
            this.auto()
            this.form=row
            this.open = true
            this.title = '修改客户'
        },
        // handleSelectionChange(selection) {
        //     this.ids = selection.map(item => item.id)
        //     this.single = selection.length !== 1
        //     this.multiple = !selection.length
        //     console.log(this.ids);
        // },
        submitForm() {
          this.$refs['form'].validate(valid => {
            if (valid) {
              if(this.form.id!== undefined) {
                customerEdit(this.form).then(res=> {
                  this.msgSuccess('修改成功，待审核');
                  this.open = false
                  this.auto()
                })
              }else {
                customerAdd(this.form).then(res=> {
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
        handleQuery() {
          this.queryParams.pageIndex = 1
          this.auto()
        },
        resetQuery() {
          this.resetForm('queryForm')
          this.handleQuery()
        },
        inauto(row) {
          this.show=true
          if (row==undefined) {
            this.params.customerid=localStorage.getItem("customerid")
          }else {
            localStorage.setItem("customerid",row.id)
            localStorage.setItem("profit",row.profit)
            this.params.customerid=row.id
            this.flag=row.flag
          }
          investmentList(this.params).then(res=> {
            this.list=res.list
            this.totals = res.total
          })
        },
        inreset() {
            this.forms={
              amount:undefined,
              remark:undefined,
            }
            this.resetForm('forms')
        },
        inhandleAdd() {
            this.inreset()
            getConfigKey({configKey:'customerratio'}).then(res=> {
              this.forms.profit=parseFloat(res.data.value).toFixed(5)*100+'%'
              this.show1=true
              this.titles = '添加投资'
            })
        },
        inhandleUpdate(row) {
            this.inauto()
            this.forms=row
            this.forms.profit=this.forms.profit*100+'%'
            this.show1 = true
            this.titles = '修改投资'
        },
        inhandleStop(row) {
            var params={
              customerid:localStorage.getItem("customerid"),
              id:row.id
            }
            investmentBreak(params).then(res => {
              this.msgSuccess('操作成功')
              this.inauto()
            })
        },
        insubmitForm() {
          if (this.forms.amount>=1000000000) {
              this.msgError('金额需大于0');
              return
          }
          this.$refs['forms'].validate(valid => {
            if (valid) {
              this.forms.profit=parseFloat(this.forms.profit.replace("%","")).toFixed(3)*0.01
              this.forms.date=this.parseTime(this.forms.date)
              if(this.forms.id!== undefined) {
                investmentEdit(this.forms).then(res=> {
                  this.msgSuccess('修改成功，待审核');
                  this.show1 = false
                  this.inauto()
                })
              }else {
                this.forms.customerid=localStorage.getItem("customerid")
                investmentAdd(this.forms).then(res=> {
                  this.msgSuccess('新增成功')
                  this.show1 = false
                  this.inauto()
                })
              }
            }
          })
        },
        incancel() {
          this.show1 = false
          this.inreset()
        },
    },
    components: {},
};
</script>

<style scoped>
.customer {
    padding: 20px;
}
.a {
  display: inline-block;
  padding: 5px 14px;
  border: 1px solid rgb(170, 255, 170);
  color: rgb(0, 255, 98);
  background-color: rgb(235, 255, 235);
}
.b {
  display: inline-block;
  padding: 5px 14px;
  border: 1px solid rgb(255, 180, 180);
  color: rgb(255, 80, 80);
  background-color: rgb(255, 221, 221);
}
.c {
  display: inline-block;
  padding: 5px 14px;
  border: 1px solid rgb(149, 195, 255);
  color: rgb(0, 110, 255);
  background-color: rgb(231, 241, 255);
}
</style>
