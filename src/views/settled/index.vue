<template>
    <div class="settled">
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
        <el-table :data="profit" show-summary :summary-method="getSummaries">
          <el-table-column label="客户姓名" prop="customername" align="center" />
          <el-table-column label="业务员姓名" prop="nick_name" align="center" />
          <el-table-column label="业绩" prop="amount" align="center">
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-for="(item,index) in keyslist" :key="index" :label="item" :prop="wordslist[index]" align="center"/>
          <el-table-column label="订单时间" width="160" align="center" prop="create_time">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.create_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结算时间" width="160" align="center" prop="update_time">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.update_time) }}</span>
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
import { statementIsSettlement } from '@/api/report/report'
export default {
    name:'Settled',
    props: {},
    data() {
        return {
            profit:[],
            total: 0,
            summation:{},
            keyslist:'',
            wordslist:'',
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
            statementIsSettlement(this.queryParams).then(res=> {
              if (JSON.stringify(res.list) != "{}") {
                this.profit=res.list.profit
                this.total = res.total
                this.keyslist=res.list.keys.split(',')
                this.wordslist=res.list.words.split(',')
                this.summation=res.summation
                for (var i=0;i<this.profit.length;i++) {
                  for (var x=0;x<this.wordslist.length;x++) {
                    this.profit[i][this.wordslist[x]]=this.moneyFormat(this.profit[i][this.wordslist[x]])
                  }
                }
              }else {
                this.profit=[]
                this.total=0
                this.keyslist=''
                this.wordslist=''
              }
            })
        },
        select() {
          this.queryParams.start=this.parseTime(this.value1[0]).slice(0,10)
          this.queryParams.end=this.parseTime(this.value1[1]).slice(0,10)
          this.auto()
        },
        getSummaries(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '合计';
              return;
            }
            // const values = data.map(item => Number(item[column.property]));
            // if (!values.every(value => isNaN(value))) {
              sums[index] = this.moneyFormat(this.summation[column.property]);
            // } else {
            //   sums[index] = '';
            // }
          });
          return sums;
        }
    },
    components: {},
};
</script>

<style scoped>
.settled {
    padding: 20px;
}
</style>
