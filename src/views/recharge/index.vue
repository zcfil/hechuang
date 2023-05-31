<template>
    <div class="recharge">
        <el-table v-loading="loading" :data="customerlist">
          <el-table-column label="金额" width="80" prop="amount" align="center"  show-overflow-tooltip/>
          <el-table-column label="转账地址" width="330" prop="from_address" align="center"  show-overflow-tooltip/>
          <el-table-column label="收帐地址" width="330" prop="to_address" align="center"  show-overflow-tooltip/>
          <el-table-column label="消息hash" prop="cid" align="center" show-overflow-tooltip/>
          <el-table-column label="到账时间" width="160" align="center" prop="create_time">
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
import { rechargeList } from '@/api/money/money'
export default {
    name:'Recharge',
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
            rechargeList(this.queryParams).then(res=> {
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
.recharge {
    padding: 20px;
}
</style>
