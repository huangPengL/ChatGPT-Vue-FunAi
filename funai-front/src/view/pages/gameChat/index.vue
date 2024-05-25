
<template>
    
    <div class="first">
         
        <el-button type="primary"  @click="toGameChatList" size="mini">
        历史游戏记录
        </el-button>
        <div class="top">
            <h3 class="title">FunAi - AI Game</h3>
        </div>
        <div class="inputPart">
            <div class="inputBox">
                <el-input size="medium" class= "sessionName" v-model="sessionName" placeholder="请输入当前游戏的名称"></el-input>
                <el-select  multiple clearable class="storyTypeSelector" size="medium" v-model="storyTypes" filterable placeholder="请选择游戏的类型">
                    <el-option
                        v-for="item in storyTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button class="startBTN" type="primary" @click="clickStartBTN">开始游戏👾</el-button>
        </div>
        
    </div>
</template>
  
  <script>
  import Cookies from "js-cookie";
  import Header from '@/components/Header.vue';
  import {addSession} from "@/api/getData";
  
  export default {
    components: {
        Header,
    },
    mounted() {

    },
    data() {
        return {
            userId: Cookies.get("userId"),
            sessionName: "",
            storyTypeOptions: [
                {
                    "label": "冒险",
                    "value": "冒险"
                },
                {
                    "label": "爱情",
                    "value": "爱情"
                },
                {
                    "label": "养成",
                    "value": "养成"
                },
                {
                    "label": "悬疑",
                    "value": "悬疑"
                },
                {
                    "label": "恐怖",
                    "value": "恐怖"
                },
                {
                    "label": "搞笑",
                    "value": "搞笑"
                },
                {
                    "label": "策略",
                    "value": "策略"
                }
            ],
            storyTypes: [],
        };
    },
    methods: {
        toGameChatList() {
            this.$router.push(
                { name: "ChatHome", params: { type: "GameChat" } },
                () => {}
            );
        },
        clickStartBTN(){
            if(this.sessionName != "" && this.storyTypes != ""){
                let params = {
                    user_id: this.userId,
                    session_name: this.sessionName + ":" +this.storyTypes.join(","),
                    type: 2
                }
                addSession(params).then(resp => {
                    if(resp.code == 20000){
                        this.$message.success("创建会话 [" + params.session_name + "] 成功!")
                        this.$router.push({
                            name: "ChatHome",
                            params: { 
                                type: 'GameChat',
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
                        message: '游戏名不能为空',
                        type: 'error'
                    });
                }else if(this.storyTypes == ""){
                    this.$message({
                        showClose: true,
                        message: '游戏类型不能为空',
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
    .inputPart {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .inputBox {
        width: 70%;
        margin-top: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .sessionName {
        width: 70%;
        margin-top: 20px;
    }

    .storyTypeSelector {
        width: 70%;
        margin-top: 60px;
    }
    .startBTN {
        margin-top: 80px;
    }

    .top {
      font-weight: 600;
      font-size: 30px;
      text-align: center;
      padding: 20px;
      margin-bottom: 12px;
      color: $light_gray;
    }
  }
</style>
  