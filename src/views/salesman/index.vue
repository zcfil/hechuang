<template>
    <div class="salesman">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:syssalesman:default']"
              type="primary"
              size="mini"
              @click="defaults"
            >默认配置</el-button>
          </el-col>
        </el-row>
        <el-table :data="list">
          <el-table-column label="姓名" prop="nick_name" align="center" />
          <el-table-column label="用户名" prop="username" align="center" />
          <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:syssalesman:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
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
        <!-- 默认分配 -->
        <el-dialog :title="title" :visible.sync="open" width="1000px">
        <el-table :data="defaultlist">
          <el-table-column label="等级" prop="grade" align="center">
            <template slot-scope="scope">
              <span style="color:red;">{{ scope.row.grade }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额（万）" prop="profitlevel" align="center">
            <template slot-scope="scope">
                <el-input v-if=" isEdit == scope.$index " v-model="scope.row.profitlevel" :disabled='scope.$index==0' placeholder="请输入金额"></el-input>
                <span v-if=" isEdit != scope.$index ">> {{ scope.row.profitlevel }}</span>
            </template>
          </el-table-column>
          <el-table-column label="百分比" prop="percent" align="center">
            <template slot-scope="scope">
                <el-input v-if=" isEdit == scope.$index " v-model="scope.row.percent" placeholder="请输入百分比"></el-input>
                <span v-if=" isEdit != scope.$index "><span v-show="scope.row.grade!='V1'">+</span> {{ scope.row.percent }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                v-if=" isEdit == scope.$index "
                v-permisaction="['system:syssalesman:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row, 1)"
              >确定</el-button>
              <el-button
                v-if=" isEdit != scope.$index "
                v-permisaction="['system:syssalesman:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row, 0)"
              >编辑</el-button>
              <el-button
                v-if=" scope.$index!=0 "
                v-permisaction="['system:syssalesman:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index,scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-button
          slot="append"
          style="width: 100%;border-radius: 0;border-top: 0;border-left: 0;border-right: 0;"
          @click="appendNew">点击增加一行</el-button>
        </el-table>
        <div style="text-align:center;margin-top:20px;">
            <el-button size="mini" type="primary" @click="submits">提交</el-button>
            <el-button size="mini" @click="cancels">取消</el-button>
        </div>
        </el-dialog>


        <el-dialog :title="titles" :visible.sync="show" width="500px">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="当前等级" prop="levelid">
              <el-select v-model="form.levelid" style="width:100%"  placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.id"
                  :label="dict.vipLevel+' (>'+dict.levelValue+')'"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <div style="text-align:center;margin-top:20px;">
              <el-button size="mini" type="primary" @click="insubmits">提交</el-button>
              <el-button size="mini" @click="incancels">取消</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import { profitconfigOnce,profitconfigList,profitconfigEdit,userList,getUserVipLevel,editUserVipLevel } from '@/api/profitconfig/profitconfig'
export default {
    name:'Salesman',
    props: {},
    data() {
        return {
            total:0,
            queryParams: {
              pageIndex: 1,
              pageSize: 10,
            },
            open:false,
            form:{
              levelid:''
            },
            list:[],
            defaultlist:[],
            isEdit: -99,
            ids:'',
            userid:'',
            title:'',
            titles:'',
            show:false,
            sexOptions:[]
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
            userList(this.queryParams).then(res=> {
               this.list=res.list
               this.total = res.total
            })
        },
        handleUpdate(row) {
            this.show=true
            this.userid=row.userid
            this.titles=row.nick_name
            getUserVipLevel({userid:row.userid}).then(res=> {
              this.sexOptions=res.data.vipList
              this.form.levelid=res.data.curLevelID
            })
        },
        defaults() {
            this.open=true
            this.title='默认分配'
            this.isEdit=-99
            var params={
              profittype:'2'
            }
            profitconfigList(params).then(res=> {
                this.defaultlist=res.data
                this.ids=this.defaultlist.map(item => item.id).join(",")
                for (var i=0;i<this.defaultlist.length;i++) {
                  this.defaultlist[i].grade='V'+(i+1)
                  this.defaultlist[i].percent=this.defaultlist[i].percent*100+'%'
                  this.defaultlist[i].profitlevel=this.defaultlist[i].profitlevel/10000
                }
            })
        },
        handleEdit(index, row, status) {
          switch (status) {
            case 0:
              this.isEdit = index;
              break;
            case 1:
              this.isEdit = -99;
              break;
          }
        },
        handleDelete(index,row) {
            this.isEdit=-99
            this.defaultlist.splice(index, 1)　
        },
        appendNew() {
          this.defaultlist.push({
            grade:'V'+(this.defaultlist.length+1),
            percent: '',
            profitlevel: '',
            userid: "0",
            profittype: 2
          });
          this.isEdit = this.defaultlist.length - 1
        },
        submits() {
            this.isEdit=-99
            for (var i=0;i<this.defaultlist.length;i++) {
                this.defaultlist[i].percent=this.defaultlist[i].percent.replace("%","")*0.01
                this.defaultlist[i].profitlevel=this.defaultlist[i].profitlevel*10000
                if(this.title!='默认分配') {
                  this.defaultlist[i].userid=this.userid
                  this.defaultlist[i].profittype=1
                }
            }
            profitconfigEdit({"ids":this.ids,"profit":this.defaultlist}).then(res=> {
                this.open=false
                this.msgSuccess('操作成功');
                // if (this.title=='默认分配') {
                //   this.defaults()
                // }else {
                //   this.isEdit=-99
                //   var params={
                //     profittype:'1',
                //     userid:this.userid
                //   }
                //   profitconfigList(params).then(res=> {
                //       this.defaultlist=res.data
                //       this.ids=this.defaultlist.map(item => item.id).join(",")
                //       for (var i=0;i<this.defaultlist.length;i++) {
                //         this.defaultlist[i].percent=this.defaultlist[i].percent*100+'%'
                //       }
                //   })
                // }
            })
        },
        cancels() {
           this.open=false
        },
        insubmits() {
          this.form.userid=this.userid
          editUserVipLevel(this.form).then(res=> {
            this.msgSuccess('修改成功');
            this.show=false
          })
        },
        incancels() {
          this.show=false
        }
    },
    components: {},
};
</script>

<style scoped>
.salesman {
    padding: 20px;
}
</style>