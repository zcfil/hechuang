<template>
    <div class="personal">
        <div style="margin-bottom:20px">
          日期：
          <el-date-picker
            v-model="queryParams.date"
            type="month"
            :clearable="false"
            value-format="yyyy-MM"
            :picker-options="pickerOptions"
            @change="select"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <el-table :data="list">
          <el-table-column label="客户姓名" prop="customername" align="center" show-overflow-tooltip/>
          <el-table-column label="投资" prop="amount" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="业务员姓名" prop="nick_name" align="center" show-overflow-tooltip/>
          <el-table-column label="利润" prop="profits" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ moneyFormat(scope.row.profits) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="利润比例" prop="percent" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.percent*100+'%'}}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="状态" prop="status" align="center" width="110">
            <template slot-scope="scope">
                <span class="a" v-show=" scope.row.status==0 ">已通过</span>
                <span class="b" v-show=" scope.row.status==3 ">已拒绝</span>
                <span class="c" v-show=" scope.row.status==1 ">审核中</span>
                <span class="c" v-show=" scope.row.status==4 ">终止审核</span>
                <span class="b" v-show=" scope.row.status==5 ">已终止</span>
                <span class="b" v-show=" scope.row.status==6 ">已终止</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" align="center" show-overflow-tooltip/>
          <el-table-column label="时间" width="160" prop="create_time" align="center">
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
import { individualPerformance } from '@/api/customer/customer'
export default {
    name:'Personal',
    props: {},
    data() {
        return {
            total: 0,
            list:[],
            queryParams: {
              pageIndex: 1,
              pageSize: 10,
              date:''
            },
            pickerOptions: {
               disabledDate(time) {
                 return time.getTime() > Date.now() - 8.64e6
               }
            },
        };
    },
    computed: {},
    created() {
        var myDate = new Date();
        var tYear = myDate.getFullYear();
        var tMonth = myDate.getMonth();
        var m = tMonth + 1;
        if (m.toString().length == 1) {
          m = "0" + m;
        }
        this.queryParams.date=tYear +'-'+ m
        this.auto()
    },
    mounted() {},
    watch: {},
    methods: {
        auto() {
            individualPerformance(this.queryParams).then(res=> {
              this.list=res.list
              this.total = res.total
            })
        },
        select() {
            this.auto()
        },
    },
    components: {},
};
</script>

<style scoped>
.personal {
    padding: 20px;
}
.a {
  display: inline-block;
  padding: 5px 14px;
  border: 1px solid rgb(170, 255, 170);
  color: rgb(0, 255, 98);
  background-color: rgb(235, 255, 235);
}
.b {
  display: inline-block;
  padding: 5px 14px;
  border: 1px solid rgb(255, 180, 180);
  color: rgb(255, 80, 80);
  background-color: rgb(255, 221, 221);
}
.c {
  display: inline-block;
  padding: 5px 14px;
  border: 1px solid rgb(149, 195, 255);
  color: rgb(0, 110, 255);
  background-color: rgb(231, 241, 255);
}
</style>
