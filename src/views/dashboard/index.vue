<template>
  <div style="padding:20px;">
    <!-- <component :is="currentRole" /> -->
    <!-- <div class="data">
      <el-row>
        <el-col :span="24">
          <div class="a">用户姓名：{{data.nick_name}}</div>
        </el-col>
        <el-col :span="12">
          <div class="a">vip等级: {{data.vip_level}}</div>
        </el-col>
        <el-col :span="12">
          <div class="a">当日业绩: {{data.today_performance}}</div>
        </el-col>
        <el-col :span="12">
          <div class="a">vip称号: {{data.vip_title}}</div>
        </el-col>
        <el-col :span="12">
          <div class="a">总业绩: {{data.total_performance}}</div>
        </el-col>
      </el-row>
    </div>
    <div style="margin:20px 0 10px">下级业务员</div>
    <el-table :data="list">
      <el-table-column label="姓名" prop="nick_name" align="center" />
      <el-table-column label="用户名" prop="username" align="center" />
      <el-table-column label="手机号" prop="phone" align="center" />
    </el-table> -->
    <div style="font-size:50px;color:red;">欢迎来到合创算力后台管理系统！</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'
import { getUserPerformance,getUserReferrals } from '@/api/user'

export default {
  name: 'Dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      // currentRole: 'adminDashboard'
      data:{},
      list:[],
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
    this.auto()
  },
  methods: {
    auto() {
      // getUserPerformance().then(res=> {
      //   this.data=res.data
      // })
      // getUserReferrals().then(res=> {
      //   this.list=res.list
      // })
    }
  }
}
</script>
<style scoped>
.data {
  padding: 20px;
  border: 1px solid #dddddd;
  background-color: #f9f9f9;
  color: #333;
}
.data .a {
  margin-bottom: 10px;
}
</style>