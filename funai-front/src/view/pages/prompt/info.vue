<template>
   <div class="form-container">
      <el-form :model="promptObj" ref="promptObj" label-width="100px" label-position="top" size="medium" class="form-inner">

         <el-form-item
            prop="topic"
            label="主题"
            :rules="[
               { required: true, message: '必填', trigger: 'blur' },
            ]"
         >
            <el-input v-model="promptObj.topic"></el-input>
         </el-form-item>

         <el-row>
            <el-col :span="12">
               <el-form-item label="prompt类型" prop="type" :rules="[ { required: true, message: '必填', trigger: 'blur' }, ]"> 
                  <el-select v-model="promptObj.type" placeholder="请选择prompt类型" > 
                  <el-option v-for="item in promptTypeList" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select> 
               </el-form-item> 
            </el-col>
            <el-col :span="12">
               <el-form-item label="权限" prop="target" :rules="[ { required: true, message: '必填', trigger: 'blur' }, ]"> 
                  <el-select v-model="promptObj.target" placeholder="请选择prompt目标用户" > 
                  <el-option v-for="item in promptTargetList" :key="item.id" :label="item.name" :value="item.id"/> 
                  </el-select> 
               </el-form-item> 
            </el-col>
         </el-row>

         <el-form-item
            prop="description"
            label="简要描述"
            :rules="[
               { required: true, message: '必填', trigger: 'blur' },
            ]"
         >
            <el-input type="textarea" v-model="promptObj.description"></el-input>
         </el-form-item>

         <el-form-item
            prop="content"
            label="prompt内容"
            :rules="[
               { required: true, message: '必填', trigger: 'blur' },
            ]"
         >
            <el-input type="textarea" v-model="promptObj.content" class="input-height"></el-input>
         </el-form-item>   

         <el-form-item>
            <div class="button-container">
               <el-button v-if="isEdit" type="primary" @click="open('编辑')">确认编辑</el-button>
               <el-button v-else type="primary" @click="open('新增')">确认新增</el-button>
               <el-button type="info" @click="returnForm()">返回上级</el-button>
            </div>
         </el-form-item>
      </el-form>
   </div>
</template>

<script>
import { addPrompt, editPrompt } from "@/api/prompt";
import md5 from 'blueimp-md5';
export default {
   data() {
      return {
         promptTypeList: [
            {id: 0, name: 'chatgpt'},
            {id: 1, name: 'midjourney'},
         ],
         promptTargetList: [
            {id: 0, name: '管理员'},
            {id: 1, name: '用户'},
         ]
         ,
         promptObj:{

         },
         isEdit: null,
         adminSecretKey: '8fbb5c586788007b2bb2429d4b63b306'
      }
   },
   created() {
        // 判断是否为编辑操作
        if(this.$route.query.params) {
            this.promptObj = this.$route.query.params
            this.isEdit = true;
        }
   },
   methods:{
      open(OpType) {
        this.$prompt('', '请输入管理员操作密钥', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let encrypted = md5(value);
          if(encrypted == this.adminSecretKey) {
            if(OpType == '编辑') {
               this.editForm('promptObj');
            }else {
               this.addForm('promptObj')
            }
          } else {
            this.$message({
                  type: 'error',
                  message: "管理员密钥错误！"
               });
          }
        }).catch(() => {
              
        });
      },

      editForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          } else {
            console.log('error submit!!');
            return false;
          }
        });

        this.promptObj.create_time = null
        this.promptObj.update_time = null
        editPrompt(this.promptObj).then(resp => {
            if(resp.code == 20000){
               this.$message({
                  type: 'success',
                  message: '编辑成功!'
               });
               this.$router.go(-1)  
            }
            else if(resp.code == 40001){
               this.$message({
                     message: resp.message,
                     type: "warning",
               });
               return;
            }
            else{
               this.$message({
                  type: 'error',
                  message: "编辑失败，请保证`主题`不要重复！若仍然失败请联系管理员"
               });
            }
        })
      },


      addForm(formName){
         this.$refs[formName].validate((valid) => {
          if (valid) {
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        addPrompt(this.promptObj).then(resp => {
            if(resp.code == 20000){
               this.$message({
                  type: 'success',
                  message: '新增成功!'
               });
               this.$router.go(-1) 
            }
            else if(resp.code == 40001){
               this.$message({
                     message: resp.message,
                     type: "warning",
               });
               return;
            }
            else{
               this.$message({
                  type: 'error',
                  message: "新增失败，请保证`主题`不要重复！若仍然失败请联系管理员"
               });
            }
        })
      },

      returnForm(){
         this.$router.go(-1) 
      }
   }
}
</script>

<style>
   .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .form-inner{
   width:80%
  }
  .input-height .el-textarea__inner {
    height: 280px; /* 设置高度 */
  }
  .button-container {
    display: flex;
    justify-content: center;
  }

</style>