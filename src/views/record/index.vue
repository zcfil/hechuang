<template>
    <div class="record">
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
      <el-table v-loading="loading" :data="customerlist">
          <el-table-column label="手机号" width="110" prop="phone" align="center"  show-overflow-tooltip/>
          <el-table-column label="提币金额" prop="Amount" align="center"  show-overflow-tooltip/>
          <el-table-column label="提币地址" width="320" prop="to_addres" align="center" show-overflow-tooltip/>
          <el-table-column label="区块高度" prop="height" align="center" show-overflow-tooltip/>
          <!-- <el-table-column label="审核类型" width="110" prop="edittype" align="center">
            <template slot-scope="scope">
                <span v-show=" scope.row.edittype==0 ">新增客户审核</span>
                <span v-show=" scope.row.edittype==1 ">修改客户审核</span>
                <span v-show=" scope.row.edittype==2 ">新增投资审核</span>
                <span v-show=" scope.row.edittype==3 ">修改投资审核</span>
                <span v-show=" scope.row.edittype==4 ">终止投资审核</span>
                <span v-show=" scope.row.edittype==5 ">修改客户审核</span>
            </template>
          </el-table-column> -->
          <el-table-column label="状态" width="100" prop="status" align="center">
            <template slot-scope="scope">
                <span class="c" v-show=" scope.row.status==0 ">待审核</span>
                <span class="c" v-show=" scope.row.status==1 ">确认中</span>
                <span class="b" v-show=" scope.row.status==2 ">已拒绝</span>
                <span class="a" v-show=" scope.row.status==3 ">已到账</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="160" align="center" prop="create_time">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.create_time) }}</span>
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
import { auditLogList } from '@/api/customer/customer'
export default {
    name:'Record',
    props: {},
    data() {
        return {
          // 遮罩层
            loading: false,
            total: 0,
            customerlist:[],
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
            auditLogList(this.queryParams).then(res=> {
                this.customerlist=res.list
                this.total = res.total
                this.loading=false
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
    },
    components: {},
};
</script>

<style scoped>
.record {
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