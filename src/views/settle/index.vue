<template>
    <div class="settle">
        <el-table v-loading="loading" :data="customerlist">
          <el-table-column label="手机号" width="110" prop="phone" align="center"  show-overflow-tooltip/>
          <el-table-column label="公司收益" prop="company_income" align="center"  show-overflow-tooltip/>
          <el-table-column label="分公司收益" prop="filiale_income" align="center"  show-overflow-tooltip/>
          <el-table-column label="客户收益" prop="customer_income" align="center"  show-overflow-tooltip/>
          <el-table-column label="客户锁仓释放" prop="customer_lock_release" align="center"  show-overflow-tooltip/>
          <el-table-column label="总收益" prop="total_income" align="center"  show-overflow-tooltip/>
          <el-table-column label="直接释放" prop="to_customer_balance" align="center"  show-overflow-tooltip/>
          <el-table-column label="锁仓收益" prop="to_customer_lock" align="center"  show-overflow-tooltip/>
          <el-table-column label="结算时间" width="160" align="center" prop="time">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.time) }}</span>
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
import { settlementList } from '@/api/money/money'
export default {
    name:'Settle',
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
            settlementList(this.queryParams).then(res=> {
                this.customerlist=res.list
                this.total = res.total
                this.loading=false
            })
        },
    },
    components: {},
};
</script>

<style scoped>
.settle {
    padding: 20px;
}
</style>
