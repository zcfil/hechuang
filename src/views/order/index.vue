<template>
    <div class="order">
        <el-table v-loading="loading" :data="customerlist">
          <el-table-column label="手机号" prop="phone" align="center" show-overflow-tooltip/>
          <el-table-column label="下单金额" prop="amount" align="center" show-overflow-tooltip/>
          <el-table-column label="算力" prop="hashrate" align="center" show-overflow-tooltip/>
          <el-table-column label="业务部分润" prop="salesdep_profit" align="center" show-overflow-tooltip/>
          <el-table-column label="订单号" prop="order_id" align="center" show-overflow-tooltip/>
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
import { getOrders } from '@/api/news/news'
export default {
    name:'Order',
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
          getOrders(this.queryParams).then(res=> {
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
.order {
    padding: 20px;
}
</style>
