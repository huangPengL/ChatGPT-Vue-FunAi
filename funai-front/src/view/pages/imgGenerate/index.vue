
<template>
    
    <div class="first">
        <div class="top">
            <h3 class="title">FunAi - AI Image-Generator</h3>
        </div>
        <div class="inputPart">
            <div class="inputBox">
                <el-input 
                    type="textarea" 
                    :rows="3" size="medium" 
                    class= "imgPrompt" 
                    v-model="imgPrompt" 
                    placeholder="请在这里描述你想生成图片，希望你花1分钟查阅下面的 调教指南👩‍💻">
                </el-input>
            </div>
            <div>
                <el-radio-group v-model="isSimpleMode">
                    <el-radio v-model="isSimpleMode" label="1">普通描述</el-radio>
                    <el-radio v-model="isSimpleMode" disabled label="0">专业描述</el-radio>
                </el-radio-group>
                
            </div>
            <el-button  size="mini" class="startBTN" type="primary" @click="generate()" :loading="loading">点我生成图片</el-button>
        </div>
        <div class="demo-image__error">
            <div class="block">
                <el-image 
                    :src="srcList[0]" 
                    class="block-img"
                    fit="fit"
                    :preview-src-list="srcList">

                    <div slot="error">                                     
                    </div>
                </el-image>
            </div>
            <div class="block">
                <el-image 
                    :src="srcList[1]" 
                    class="block-img"
                    fit="fit"
                    :preview-src-list="srcList">

                    <div slot="error">                                     
                    </div>
                </el-image>
            </div>

        </div>

        <div class="card">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                <span>注意事项🎓</span>
                <el-button style="float: right; padding: 3px 0" type="text"></el-button>
                </div>
                <div class="text item">
                {{'1. 禁止生成色情、暴力、血腥等不良图片，以及其他可能会引起社会不良影响的内容。'}}
                </div>
                <div class="text item">
                {{'2. 使用者对使用模型的任何行为和生成的图片负全部责任。'}}
                </div>
                <div class="text item">
                {{'3. 【点击图片】可以放大和下载'}}
                <div class="text item">
                {{'4. 本功能仍然在测试，若生成【全黑图】，请重新生成或者修改图片描述。另外，本平台暂时不保存图片，在点击`生成图片`前用户需要手动保存图片。'}}
                </div>
                <div class="text item">
                {{'5. 生成人物的效果较差（特别是画手和脚，有点恐怖！）~勿喷'}}
                </div>
                </div>
            </el-card>
            
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                <span>调教指南👩‍💻</span>
                <el-button style="float: right; padding: 3px 0" type="text"></el-button>
                </div>
                <div class="text item">
                {{'🎈目前【普通描述模式】已经支持任何语言描述。当然，如果你想生成的效果更好，建议用英文'}}
                </div>
                <div class="text item">
                {{'🎈尽可能让你的描述内容更加详细'}}
                </div>
                <div class="text item">
                {{'🎈一些有意思的实例：【阳光洒在长发女生的身上，双眼深邃望着前方，画面整体暖色调】【黑色跑车行驶在街道上，天空闪过一道黄色闪电】【暗黑风格的未来街道】'}}
                </div>
            </el-card>

        </div>
    </div>
</template>
  
<script>
import Cookies from "js-cookie";
import Header from '@/components/Header.vue';
import {text2Img} from "@/api/getData";

  export default {
    components: {
        Header,
    },
    mounted() {

    },
    data() {
        return {
            userId: Cookies.get("userId"),
            isSimpleMode: "1",
            loading: false,
            imgPrompt: "",
            srcList: ["https://funai-hpl.oss-cn-guangzhou.aliyuncs.com/homePage/logo.png", "https://funai-hpl.oss-cn-guangzhou.aliyuncs.com/homePage/logo.png"]
         };
    },
    methods: {
        generate(){
            this.srcList = []
            let params = {
                prompt: this.imgPrompt,
                user_id: this.userId,
                size: 512,
                is_simple_mode: this.isSimpleMode == "1" ? true : false,
            }
            this.loading = true
            this.$message({
                message: "正在请求生成图片...👾",
                type: "success",
            });
            text2Img(params).then(resp => {
                if(resp.code == 20000){
                    this.srcList.push(resp.data.base64Img)
                    this.$message({
                        message: "生成第一张图片成功！",
                        type: "success",
                    });
                    text2Img(params).then(resp => {
                        if(resp.code == 20000){
                            this.srcList.push(resp.data.base64Img)
                            this.$message({
                                message: "生成第二张图片成功！",
                                type: "success",
                            });
                            this.loading = false
                        }
                        else{
                            this.$message({
                                message: resp.message,
                                type: "warning",
                            });
                            this.loading = false
                        }
                    })
                }
                else{
                    this.$message({
                        message: resp.message,
                        type: "warning",
                    });
                    this.loading = false
                }
                
            })
            
        }
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
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .inputBox{
            width: 80%;
            // margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .imgPrompt {
            margin-top: 10px;
        }
        .startBTN {
            margin-top: 10px;
        }
    }
    .top {
      font-weight: 600;
      font-size: 30px;
      text-align: center;

      margin: 0;
      margin-bottom: 12px;
      color: $light_gray;
    }
    .demo-image__error {
        white-space: nowrap; /* 防止图片换行 */
        text-align: center; /* 水平居中 */
    }

    .block{
        display: inline-block;
        margin-top: 20px;
        margin-bottom: 20px;
        margin-right: 10px;
    }
    .block-img{
        width: 250px;
        height: 250px;
    }
    .card {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .box-card {
        background-color: #2d3a4b;
        color: rgb(245, 243, 243);
        width: 500px;
    }

    .box-card:not(:nth-last-child(1)){
        margin-right: 20px;
    }

    .text {
        font-size: 12px;
    }

    .item {
        margin-bottom: 0px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
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
        .card {
            font-size: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .box-card {
            background-color: #2d3a4b;
            color: rgb(245, 243, 243);
            width: 300px;
            margin-top: 20px;
        }
        .box-card:not(:nth-last-child(1)){
            margin-right: 0px;
        }

        .demo-image__error {
            text-align: center; /* 水平居中 */
        }

        .block{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .block-img{
            width: 200px;
            height: 200px;
        }
    }
  }
</style>
  