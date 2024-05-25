
<template>
    
  <div class="first">
     
    <el-button type="primary"  @click="toPDFList" size="mini">
      单文件聊天列表
    </el-button>
    <el-button type="success"  @click="toMultiPDFList" size="mini">
      多文件聊天列表
    </el-button>
    

    <div class="top">
      <p class="title">FunAi-ChatPDF</p>
      <p>上传你的PDF文件，即可开启快速阅读，提高效率</p>
    </div>
    <div class="upload">
      <el-tooltip content="源知识库为一个PDF，上传成功后您可以向ChatGPT查询并询问库内的任何知识，支持对照源PDF体验" placement="top">    
        <el-upload
          class="upload-demo"
          ref="uploadFile"
          :show-file-list="false"
          action=""
          :http-request="uploadFile"
          :before-upload="handleBeforeUpload"
          accept=".pdf"
          :auto-upload="true"
          :on-change="handleChange"
          :on-error="handleError"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">单个文件<em>点击上传</em></div>
        </el-upload>
      </el-tooltip>

      <el-tooltip placement="top">    
        <div slot="content">
          源知识库为多个PDF，上传成功后您可以向ChatGPT查询并询问库内的任何知识。
          <br/>
          注：以文件名区分多个，建议文件名不要太长，不要重复！</div>
        <el-upload
          class="multi-upload-demo"
          ref="multiUploadFile"
          :show-file-list="false"
          action=""
          :before-upload="handleBeforeUpload"
          accept=".pdf"
          :auto-upload="false"
          :on-change="multiHandleChange"
          :on-error="handleError"
          multiple
          :file-list="fileList"
          :limit="5"
          :on-exceed="handleExceed"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            多个文件<em>点击上传</em>
          </div>
        </el-upload>
      </el-tooltip>

      <div class="progress" v-show="showProcess">
        <el-progress
          id="progress"
          type="circle"
          :percentage="percent"
          :stroke-width="5"
          :width="130"
          :show-text="true"
          stroke-linecap="round"
          :format="progressFormat"
        ></el-progress>
      </div>

    </div>

  

    <div class="card">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>对于学生🎓</span>
          <el-button style="float: right; padding: 3px 0" type="text"></el-button>
        </div>
        <div class="text item">
          {{'使用 FunAi-ChatPDF 增强您的学习体验。毫不费力地理解教科书、讲义和演示文稿。不要花几个小时翻阅研究论文和学术文章。 '}}
        </div>
        <div class="text item">
          {{'支持您的学业发展，并以有效和负责任的方式在学业上取得成功。'}}
        </div>
      </el-card>
      
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>为了工作👩‍💻</span>
          <el-button style="float: right; padding: 3px 0" type="text"></el-button>
        </div>
        <div class="text item">
          {{'高效地分析您的文档。从财务和销售报告到项目和业务建议书、培训手册和法律合同，ChatPDF 可以快速为您提供所需的信息。'}}
        </div>
        <div class="text item">
          {{'您的数据在安全的云存储中保密，可以随时删除。'}}
        </div>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>对于好奇的头脑🤔</span>
          <el-button style="float: right; padding: 3px 0" type="text"></el-button>
        </div>
        <div class="text item">
          {{'使用 FunAi-ChatPDF 解锁丰富的知识。毫不费力地从历史文献、诗歌和文学中发现新的见解和答案。'}}
        </div>
        <div class="text item">
          {{'FunAi-ChatPDF 可以理解任何语言。使用可以回答任何 PDF 中的任何问题的工具来满足您的好奇心并扩展您的视野。'}}
        </div>
      </el-card>

    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { chatPdfUpload, muliChatPdfUpload } from "@/api/getData";
import Header from '@/components/Header.vue';

export default {
  components: {
      Header,
  },
  data() {
    return {
      userId: Cookies.get("userId"),
      percent: 0, // 进度条默认为0
      uploadColor: "#409EFF",
      showProcess: false,
      random: 1000,
      infoStatus: "",
      interval: null,
      fileList: [],
      maxLength: 0
    };
  },
  methods: {
    handleBeforeUpload(fileObj) {
      if (fileObj.type !== "application/pdf") {
        this.$message.warning("只能上传PDF文件");
        return false;
      }
      if (fileObj.size > 10 * 1024 * 1024) {
        this.$message.warning("文件大小不能超过10M");
        clearInterval(this.interval)
        this.interval = null
        this.showProcess = false
        return false;
      }
      return true;
    },
    handleChange(fileObj, fileList){
      if(fileObj.status === 'ready'){
        this.percent = 0
        this.showProcess = true
        this.interval = setInterval(() => {
          this.random = Math.floor(Math.random()*(1000))+2000
          if(this.percent >= 99){
            clearInterval(this.interval)
            this.interval = null
            return
          }
          this.percent += Math.floor(Math.random() * 15)
          if(this.percent > 99){
            this.percent = 99
          }
        }, this.random)
      }
      if(fileObj.status === 'success'){
        this.percent = 100
        this.showProcess = false
      }
    },
    handleError(fileObj){
      clearInterval(this.interval)
      this.interval = null
      this.$router.push({
            name: "ChatWithFile",
          }, () => {});
    },
    progressFormat(percentage){
        return percentage < 99 ? "正在处理中...("+percentage+"%)" : percentage + "%, 已处理完成! ChatGPT正在总结!"
    },
    uploadFile(fileObj) {
      const formData = new FormData();
      formData.append("file", fileObj.file);
      formData.append("userId", Cookies.get("userId"));

      chatPdfUpload(formData).then((resp) => {
        if (resp.code == 20000) {
          this.percent = 100
          this.showProcess = false
          this.$message.success("文件处理成功!");
          this.$router.push(
            { name: "FileChatIndex", params: { type: "PdfChat" } },
            () => {}
          );
        }else{
          this.$message.warning(resp.message);
          clearInterval(this.interval)
          this.interval = null
          this.showProcess = false
          this.$router.push({
            name: "ChatWithFile",
          }, () => {});
        }
      });
    },
    toPDFList() {
      this.$router.push(
        { name: "FileChatIndex", params: { type: "PdfChat" } },
        () => {}
      );
    },
    toMultiPDFList() {
      this.$router.push(
        { name: "ChatHome", params: { type: "MultiPdfChat" } },
        () => {}
      );
    },
    multiHandleChange(fileObj, fileList){

      if(fileObj.status === 'ready'){
        this.percent = 0
        this.showProcess = true
        this.interval = setInterval(() => {
          this.random = Math.floor(Math.random()*(1000))+2000
          if(this.percent >= 99){
            clearInterval(this.interval)
            this.interval = null
            return
          }
          this.percent += Math.floor(Math.random() * 15)
          if(this.percent > 99){
            this.percent = 99
          }
        }, this.random)
      }
      if(fileObj.status === 'success'){
        this.percent = 100
        this.showProcess = false
      }

      let length = fileList.length
      this.maxLength = Math.max(length, this.maxLength)
      setTimeout(() => {
        if (length === this.maxLength) {
          this.fileList = fileList
          this.multiUploadFile()
        }
      }, 0)

    },
    
    async multiUploadFile(){
      const formData = new FormData();
      this.fileList.forEach(file => {
          formData.append('files', file.raw)
      })
      formData.append("userId", Cookies.get("userId"));

      muliChatPdfUpload(formData).then((resp) => {
        if (resp.code == 20000) {
          this.percent = 100
          this.showProcess = false
          this.$message.success("文件处理成功!");
          this.$router.push(
            { name: "ChatHome", params: { type: "MultiPdfChat" } },
            () => {}
          );
        }else{
          this.$message.warning(resp.message);
          clearInterval(this.interval)
          this.interval = null
          this.showProcess = false
          this.$router.push({
            name: "ChatWithFile",
          }, () => {});
        }
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;
.el-upload__text{
  font-size: 10px;
}
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

  .top {
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    margin-bottom: 18px;
    color: $light_gray;
    .title{
      font-size: 30px;
    }
  }
  .upload {
    position: relative;
    width: 60%;
    height: 47%;
    text-align: center;
    background: rgba(0, 0, 0, 0.02);
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.3s;
    margin: 5px auto;
    display: flex;
    justify-content: center;
    .upload-demo {
      margin: 100px auto;
      background-color: rgb(97, 110, 128);
      border: 1px dashed #d9d9d9;
      width: 30%;
      height: 30%;
      border-radius: 8px;

      .el-icon-upload {
        margin: 18% auto;
        position: relative;
        text-align: center;
      }

      .el-upload__text {
        font-size: 15px;
        font-weight: bold;
      }
    }

    .multi-upload-demo {
      margin: 100px auto;
      background-color: rgb(97, 110, 128);
      border: 1px dashed #d9d9d9;
      width: 30%;
      height: 30%;
      border-radius: 8px;

      .el-icon-upload {
        margin: 18% auto;
        position: relative;
        text-align: center;
      }

      .el-upload__text {
        color: rgb(5, 4, 4);
        font-size: 15px;
        font-weight: bold;
      }
    }
    .progress {
      margin: 250px auto;
      position: absolute;
      text-align: center;
    }
  }

  .card {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .box-card {
    background-color: #2d3a4b;
    color: rgb(245, 243, 243);
    width: 350px;
  }

  .box-card:not(:nth-last-child(1)){
    margin-right: 50px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
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
      font-size: 15px;
      text-align: center;
      padding: 20px;
      margin: 0;
      margin-bottom: 12px;
      color: $light_gray;
      }
  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .box-card {
    background-color: #2d3a4b;
    color: rgb(245, 243, 243);
    width: 350px;
    margin-top: 10px;
  }
  .box-card:not(:nth-last-child(1)){
    margin-right: 0px;
  }
}
}
</style>
