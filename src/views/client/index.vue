<template>
    <div class="client">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="客户利润比例" prop="value">
          <el-input style="width:300px" v-model="form.value" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">修改</el-button>
      </div>
    </div>
</template>

<script>
import { updateConfig,getConfigKey } from '@/api/customer/customer'
export default {
    name:'Client',
    props: {},
    data() {
        return {
            form:{},
            rules: {
              value: [
                { required: true, message: '客户利润比例不能为空', trigger: 'blur' }
              ],
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
            getConfigKey({configKey:'customerratio'}).then(res=> {
              this.form=res.data
              this.form.value=parseFloat(this.form.value).toFixed(5)*100+'%'
            })
        },
        submitForm() {
          this.$refs['form'].validate(valid => {
            if (valid) {
              this.form.value=((this.form.value.replace("%",""))*0.01).toFixed(5)
              updateConfig(this.form).then(res=> {
                this.msgSuccess('修改成功');
                this.auto()
              })
            }
          })
        }
    },
    components: {},
};
</script>

<style scoped>
.client {
    padding: 20px;
}
</style>