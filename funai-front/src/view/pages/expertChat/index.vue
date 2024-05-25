
<template>
    
    <div class="first">
         
        <el-button type="primary"  @click="toExpertChatList" size="mini">
        历史聊天会话列表
        </el-button>
        <div class="top">
            <h3 class="title">FunAi - AI Expert</h3>
        </div>
        <div class="inputPart">
            <div class="inputBox">
                <el-input size="small" class= "sessionName" v-model="sessionName" placeholder="请输入当前会话的名称"></el-input>
                <el-select clearable class="domainTypeSelector" size="small" v-model="expertTypes" filterable placeholder="请选择专家的领域">
                    <el-option
                        v-for="item in expertTypeOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <el-select clearable class="languageTypeSelector" size="small" v-model="languageTypes" filterable placeholder="请选择专对话语言">
                    <el-option
                        v-for="item in languageTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                
            </div>
            <el-button class="startBTN" type="primary" @click="clickStartBTN">开始会话</el-button>
        </div>
        
    </div>
</template>
  
  <script>
  import Cookies from "js-cookie";
  import { listAllUserPrompt} from "@/api/getData";
  import Header from '@/components/Header.vue';
  import {addSession} from "@/api/getData";
  
  export default {
    components: {
        Header,
    },
    mounted() {
        listAllUserPrompt().then(res => {
            this.expertTypeOptions = res.data.topic_list;
        })
    },
    data() {
        return {
            userId: Cookies.get("userId"),
            sessionName: "",
            expertTypeOptions: null,
            languageTypeOptions: [
                {
                    "label": "英语",
                    "value": "英文"
                },
                {
                    "label": "中文",
                    "value": "中文"
                },
                {
                    "label": "韩语",
                    "value": "韩语"
                },
                {
                    "label": "日语",
                    "value": "日语"
                },
                {
                    "label": "法语",
                    "value": "法语"
                },
            ],
            expertTypes: "",
            languageTypes: "",
        };
    },
    methods: {
        toExpertChatList() {
            this.$router.push(
                { name: "ChatHome", params: { type: "ExpertChat" } },
                () => {}
            );
        },
        clickStartBTN(){
            if(this.sessionName != "" && this.expertTypes != "" && this.languageTypes != ""){
                let params = {
                    user_id: this.userId,
                    session_name: this.sessionName+":"+this.expertTypes+":"+this.languageTypes,
                    type: 3
                }
                addSession(params).then(resp => {
                    if(resp.code == 20000){
                        this.$message.success("创建会话 [" + params.session_name + "] 成功!")
                        this.$router.push({
                            name: "ChatHome",
                            params: { 
                                type: 'ExpertChat',
                            }
                        },  () => {});
                    }else{
                        this.$message.error(resp.message)
                    }
                })
            } else {
                if(this.sessionName == ""){
                    this.$message({
                        showClose: true,
                        message: '会话名不能为空',
                        type: 'error'
                    });
                }else if(this.expertTypes == ""){
                    this.$message({
                        showClose: true,
                        message: '会话领域不能为空',
                        type: 'error'
                    });
                }else if(this.languageTypes == ""){
                    this.$message({
                        showClose: true,
                        message: '会话语言不能为空',
                        type: 'error'
                    });
                }
                
            }
        },
    },
  };
  </script>
  
  <style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;
  
  /* reset element-ui css */
  .el-upload {
    height: 100%;
  }
  </style>
  
  <style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .first {
    height:calc(100% - 50px);
    width: 100%;
        .inputPart{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            .inputBox{
                width: 70%;
                margin-top: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
            .sessionName {
                width: 70%;
                margin-top: 20px;
            }
            .domainTypeSelector{
                width: 70%;
                margin-top: 40px;
            }
            .languageTypeSelector{
                width: 70%;
                margin-top: 40px;
            }

            .startBTN {
                margin-top: 60px;
            }
        
    }
    .top {
      font-weight: 600;
      font-size: 30px;
      text-align: center;
      padding: 20px;
      margin: 0;
      margin-bottom: 12px;
      color: $light_gray;
    }
  }

  @media (max-width: 768px) {
        .top {
            font-weight: 600;
            font-size: 25px;
            text-align: center;
            padding: 20px;
            margin: 0;
            margin-bottom: 12px;
            color: $light_gray;
            }
  } 
</style>
  