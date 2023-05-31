<template>
    <div class="settlement">
        <el-table :data="list">
          <el-table-column label="姓名" prop="name" align="center" show-overflow-tooltip/>
          <el-table-column label="银行卡号" width="190" prop="bank" align="center"/>
          <el-table-column label="开户行" prop="banknum" align="center" show-overflow-tooltip/>
          <el-table-column label="业务员" prop="nickname" align="center" show-overflow-tooltip/>
          <el-table-column label="结算时间" width="155" align="center" prop="settle_time">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.settle_time) }}</span>
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
import { statementSettleHistory } from '@/api/report/report'
export default {
    name:'Settlement',
    props: {},
    data() {
        return {
            list:[],
            total: 0,
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
            statementSettleHistory(this.queryParams).then(res=> {
                this.list=res.list
                this.total=res.total
            })
        }
    },
    components: {},
};
</script>

<style scoped>
.settlement {
    padding: 20px;
}
</style>
