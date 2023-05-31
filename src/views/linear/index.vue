<template>
    <div class="linear">
        <div style="margin-bottom:20px">
          日期：
          <el-date-picker
            v-model="value1"
            type="daterange"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="select">
          </el-date-picker>
        </div>
        <el-table v-loading="loading" :data="list">
          <el-table-column label="手机号" prop="phone" align="center" />
          <el-table-column label="订单金额" prop="amount" align="center" />
          <el-table-column label="分润金额" prop="profits" align="center"/>
          <el-table-column label=" 算力（T）" prop="hashrate" align="center" />
          <el-table-column label="订单号" prop="order_id" align="center"/>
          <el-table-column label="订单时间" width="160" align="center" prop="create_time">
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
import { statementOrderProfit } from '@/api/finance/finance'
export default {
    name:'Linear',
    props: {},
    data() {
        return {
          // 遮罩层
            loading: false,
            list:[],
            total: 0,
            queryParams: {
              pageIndex: 1,
              pageSize: 10,
              start:'',
              end:''
            },
            value1:'',
            pickerOptions: {
               disabledDate(time) {
                 return time.getTime() > Date.now() - 8.64e6
               }
            },
        };
    },
    computed: {},
    created() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.queryParams.start=this.parseTime(start).slice(0,10)
        this.queryParams.end=this.parseTime(end).slice(0,10)
        this.value1=[start,end]
        this.auto()
    },
    mounted() {},
    watch: {},
    methods: {
        auto() {
          this.loading=true
            statementOrderProfit(this.queryParams).then(res=> {
              this.list=res.list
              this.total = res.total
                this.loading=false
            })
        },
        select() {
          this.queryParams.start=this.parseTime(this.value1[0]).slice(0,10)
          this.queryParams.end=this.parseTime(this.value1[1]).slice(0,10)
          this.auto()
        },
    },
    components: {},
};
</script>

<style scoped>
.linear {
    padding: 20px;
}
</style>
