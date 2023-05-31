<template>
    <div class="reportsalesman">
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
        <el-table :data="list" :row-class-name="tableRowClassName" show-summary :summary-method="getSummaries">
          <el-table-column label="姓名" prop="nick_name" align="center" />
          <el-table-column label="订单号" prop="investmentid" align="center"  :show-overflow-tooltip="true"/>
          <el-table-column label="客户姓名" prop="customername" align="center" />
          <el-table-column label="业绩" prop="amount" align="center">
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润" prop="profits" align="center">
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.profits) }}</span>
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
<style>
  .el-table .warning-row {
    background: #eeeeee;
  }
</style>
<script>
import { statementSalesman,statementSalesmanExport } from '@/api/report/report'
export default {
    naem:'Reportsalesman',
    props: {},
    data() {
        return {
          list:[],
          total: 0,
          summation:{},
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
            statementSalesman(this.queryParams).then(res=> {
              this.list=res.list
              this.total = res.total
              this.summation=res.summation
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
            statementSalesmanExport({start,end}).then(res=> {
              location.href=process.env.VUE_APP_BASE_API+'/'+res.data
            })
          })
        },
        tableRowClassName({row, rowIndex}) {
          if (row.nick_name =='合计' ) {
            return 'warning-row';
          } 
          return '';
        },
        getSummaries(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '总合计';
              return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = this.moneyFormat(this.summation[column.property]);
            } else {
              sums[index] = '';
            }
          });
          return sums;
        }
    },
    components: {},
};
</script>

<style scoped>
.reportsalesman {
    padding: 20px;
}
</style>
