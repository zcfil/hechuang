<template>
    <div class="history">
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出</el-button>
          </el-col>
        </el-row>
        <el-table :data="profit" show-summary :summary-method="getSummaries">
          <el-table-column label="客户姓名" prop="customername" align="center" show-overflow-tooltip/>
          <el-table-column label="业务员姓名" prop="nick_name" align="center" show-overflow-tooltip/>
          <el-table-column label="投资" prop="amount" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-for="(item,index) in keyslist" :key="index" :label="item" :prop="wordslist[index]" align="center" show-overflow-tooltip/>
          <el-table-column label="业务部门" prop="company" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.company) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="业务员" prop="salesman" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.salesman) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="客户" prop="customerprofit" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.customerprofit) }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip/>
          <el-table-column label="投资时间" width="160" align="center" prop="create_time">
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
import { statementSummary,statementSummaryExport } from '@/api/report/report'
export default {
    name:'History',
    props: {},
    data() {
        return {
            total: 0,
            summation:{},
            profit:[],
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
            statementSummary(this.queryParams).then(res=> {
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
        handleExport() {
          const start = this.queryParams.start
          const end = this.queryParams.end
            this.$confirm('是否确认导出所有数据?', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(function() {
              statementSummaryExport({start,end}).then(res=> {
                location.href=process.env.VUE_APP_BASE_API+'/'+res.data
              })
            })
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
.history {
    padding: 20px;
}
</style>
