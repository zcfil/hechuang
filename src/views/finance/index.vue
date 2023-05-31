<template>
    <div class="finance">
        <el-table v-loading="loading" :data="customerlist">
          <el-table-column label="手机号" prop="phone" align="center"  show-overflow-tooltip/>
          <el-table-column label="公司收益" prop="company_income" align="center"  show-overflow-tooltip/>
          <el-table-column label="分公司收益" prop="filiale_income" align="center"  show-overflow-tooltip/>
          <el-table-column label="客户收益" prop="customer_income" align="center"  show-overflow-tooltip/>
          <el-table-column label="所有推荐人收益" prop="referrer_profit" align="center"  show-overflow-tooltip/>
          <el-table-column label="业务部收益" prop="sales_profit" align="center"  show-overflow-tooltip/>
          <el-table-column label="已释放收益" prop="to_customer_balance" align="center"  show-overflow-tooltip/>
          <el-table-column label="锁仓收益" prop="to_customer_lock" align="center"  show-overflow-tooltip/>
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
import { statementSummary } from '@/api/finance/finance'
export default {
    name:'Finance',
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
            statementSummary(this.queryParams).then(res=> {
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
.finance {
    padding: 20px;
}
</style>
