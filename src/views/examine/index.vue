<template>
    <div class="examine">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="手机号"
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
          v-permisaction="['system:sysrole:add']"
          type="success"
          icon="el-icon-check"
          size="mini"
          :disabled="multiple"
          @click="batchagree"
        >批量同意</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['system:sysrole:edit']"
          type="danger"
          icon="el-icon-close"
          size="mini"
          :disabled="multiple"
          @click="batchrefuse"
        >批量驳回</el-button>
      </el-col>
    </el-row>
      <el-table v-loading="loading" :data="customerlist" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="手机号" width="110" prop="phone" align="center"  show-overflow-tooltip/>
          <el-table-column label="提币金额" prop="Amount" align="center"  show-overflow-tooltip/>
          <el-table-column label="提币地址" width="320" prop="to_addres" align="center" show-overflow-tooltip/>
          <el-table-column label="创建时间" width="160" align="center" prop="create_time">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.create_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="130" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:sysexamine:agree']"
                size="mini"
                type="text"
                icon="el-icon-check"
                @click="agree(scope.row)"
              >同意</el-button>
              <el-button
                v-permisaction="['system:sysexamine:refuse']"
                size="mini"
                type="text"
                icon="el-icon-close"
                @click="refuse(scope.row)"
              >驳回</el-button>
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
    </div>
</template>

<script>
import { auditList,audit,audits } from '@/api/customer/customer'
export default {
    name:'Examine',
    props: {},
    data() {
        return {
          // 遮罩层
            loading: false,
            total: 0,
            customerlist:[],
            ids:'',
            // 非多个禁用
            multiple: true,
            queryParams: {
              pageIndex: 1,
              pageSize: 10,
              keyword: undefined,
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
            auditList(this.queryParams).then(res=> {
                this.customerlist=res.list
                this.total = res.total
                this.loading=false
            })
        },
        agree(row) {
            var params={
              withdraw_id:row.withdraw_id,
              status: '1'
            }
            this.$confirm('确认通过 "'+row.phone+'" 的提币审核并转账吗？', '通过', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(function() {
              return audit(params)
            }).then(() => {
              this.msgSuccess('审核成功')
              this.auto()
            })
        },
        refuse(row) {
            var params={
              withdraw_id:row.withdraw_id,
              status: '2'
            }
            this.$confirm('确认驳回 "'+row.phone+'" 的提币审核吗？', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(function() {
              return audit(params)
            }).then(() => {
              this.msgSuccess('审核成功')
              this.auto()
            })
        },
        handleQuery() {
          this.queryParams.pageIndex = 1
          this.auto()
        },
        resetQuery() {
          this.resetForm('queryForm')
          this.handleQuery()
        },
        handleSelectionChange(selection) {
          this.ids = selection.map(item => item.withdraw_id)
          this.multiple = !selection.length
        },
        batchagree() {
            var params={
              ids:this.ids.toString(),
              status: '1'
            }
            this.$confirm('确认通过编号为 "'+params.ids+'" 的提币审核并转账吗？', '通过', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(function() {
              return audits(params)
            }).then(() => {
              this.msgSuccess('审核成功')
              this.auto()
            })
        },
        batchrefuse() {
            var params={
              ids:this.ids.toString(),
              status: '2'
            }
            this.$confirm('确认驳回编号为 "'+params.ids+'" 的提币审核吗？', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'error'
            }).then(function() {
              return audits(params)
            }).then(() => {
              this.msgSuccess('审核成功')
              this.auto()
            })
        }
    },
    components: {},
};
</script>

<style scoped>
.examine {
    padding: 20px;
}
</style>
