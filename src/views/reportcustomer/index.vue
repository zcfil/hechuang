<template>
    <div class="reportcustomer">
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
        <el-table :data="list" show-summary :summary-method="getSummaries">
          <el-table-column label="姓名" prop="name" align="center" show-overflow-tooltip/>
          <el-table-column label="手机号" width="120" prop="phone" align="center" />
          <el-table-column label="银行卡号" width="190" prop="bank" align="center"/>
          <el-table-column label="开户行" prop="banknum" align="center" show-overflow-tooltip/>
          <el-table-column label="性别" width="60" prop="sex" align="center"/>
          <el-table-column label="分润比例" prop="profit" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.profit*100+'%'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="业绩" prop="amount" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润" prop="profits" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.profits) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="业务员" prop="nick_name" align="center" show-overflow-tooltip/>
          <el-table-column label="结算时间" width="155" align="center" prop="update_time">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.update_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合同到期时间" width="155" align="center" prop="expiration_date">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.expiration_date) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:sysreportcustomer:set']"
                size="mini"
                type="text"
                icon="el-icon-document"
                @click="settlement(scope.row)"
              >结算</el-button>
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
import { statementCustomer,statementCustomerExport,statementCustomerSettle } from '@/api/report/report'
export default {
    name:'Reportcustomer',
    props: {},
    data() {
        return {
            list:[],
            total: 0,
            summation:{},
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
            statementCustomer(this.queryParams).then(res=> {
              this.list=res.list
              this.total = res.total
              this.summation=res.summation
            })
        },
        select() {
            this.auto()
        },
        settlement(row) {
            statementCustomerSettle({investment_id:row.investment_id}).then(res=> {
              this.msgSuccess('结算成功')
              this.auto()
            })
        },
        handleExport() {
          const queryParams = this.queryParams.date
          this.$confirm('是否确认导出所有数据?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function() {
            statementCustomerExport({date:queryParams}).then(res=> {
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
.reportcustomer {
    padding: 20px;
}
</style>
