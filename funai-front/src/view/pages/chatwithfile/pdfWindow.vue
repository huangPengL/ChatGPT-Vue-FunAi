<template>
  <div class="chat-window">
    <div class="top">
        
            <div class="pagenum">
                <span v-if="showAllPages"> {{ pageCount }} page(s) </span>

                <span v-else>
                <button :disabled="page <= 1" @click="page--">❮</button>

                {{ page }} / {{ pageCount }}

                <button :disabled="page >= pageCount" @click="page++">❯</button>
                </span>
            </div>

            <div class="btn">
                <el-tooltip effect="dark" content="放大" placement="top-start">
                    <el-button class="enlarge" size="mini" type="success" icon="el-icon-plus" circle @click="zoomA"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="缩小" placement="top-start">
                    <el-button class="zoomout" size="mini" type="warning" icon="el-icon-minus" circle @click="zoomB"></el-button>
                </el-tooltip>
            </div>

            <div class="showPage">
                <label class="right">
                <input v-model="showAllPages" type="checkbox" />

                Show all pages
                </label>
            </div>
        
    </div>
    <div class="bottom">
      
        <vue-pdf-embed 
            :source="source1"
            ref="pdfRef"
            :page="page"
            @rendered="handleDocumentRender"
            :style="scaleFun"
            class="vue-pdf-embed"
             />

    </div>
  </div>
</template>

<script>

import Cookies from 'js-cookie'
import VuePdfEmbed from 'vue-pdf-embed/dist/vue2-pdf-embed'
import { getFileChatBySessionId } from "@/api/getData";


export default {
  components: {
    VuePdfEmbed,
  },
  
  props: {
    sessionInfo: Object,
    default() {
      return {};
    },
  },
  data() {
    return {
      chatList: [],
      inputMsg: "",
      showEmoji: false,
      srcImgList: [],
      isSend: false,
      isMobile: false,
      username: Cookies.get("username"),
      stream: "流式输出",    // 是否支持流式输出
      forceRefreshKey: 0,         // 手动刷新组件
      source1: 'https://funai.oss-cn-beijing.aliyuncs.com/file/welcome-funai-chatgpt.pdf',
      page: null,
      pageCount: 1,
      showAllPages: true,
      scale: 1,  // 缩放比例
    };
  },
  computed: {
    scaleFun(index) { // 缩放
     var scale = this.scale;
      return `transform:scale(${scale}); transform-origin: left top;`;
    },
  },
  watch: {
    showAllPages() {
      this.page = this.showAllPages ? null : 1
    },
    sessionInfo() {
      this.getPdfFile();
    }
  },
  mounted() {
    this.getPdfFile();
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfMobile);
  },
  methods: {

    checkIfMobile() {
      const isMobile = window.innerWidth <= 1024;
      this.isMobile = isMobile;
    },

    handleDocumentRender(args) {
      this.pageCount = this.$refs.pdfRef.pageCount
    },
    zoomA() {
      this.scale += 0.1;
    },
    zoomB() {
      this.scale -= 0.1;
    },

    getPdfFile(){
      getFileChatBySessionId(this.sessionInfo.session_id).then((res) => {
        if(res.code == 20000) {
            if(res.data.fileChat != null){
              this.source1 = res.data.fileChat.fileUrl;
            }else{
              this.source1 = 'https://funai.oss-cn-beijing.aliyuncs.com/file/welcome-funai-chatgpt.pdf';
            }
          } else {
            this.$message({
              message: res.message,
              type: "warning",
            });
          }

      });
    },

  }
};

</script>

<style>

.vue-pdf-embed > div {
    position: relative;
    display: flex;
    justify-content: center;
    margin-bottom: 8px;
    box-shadow: 10px 2px 8px 4px rgba(0, 0, 0, 0.1);
}


</style>

<style lang="scss" scoped>


.chat-window {
  width: 100%;
  height: 100%;
  position: relative;

  .top {
    display: flex;
    justify-content: space-between;

    &::after {
      content: "";
      display: block;
      clear: both;
    }
    .right {
        float: right;
    }
  }
  // 聊天窗口控制
  .bottom {
    width: 100%;
    height: 85vh;
    background-color: #ccc;
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 8px;
        /* Safari,Chrome 隐藏滚动条 */
        height: 8px;
        /* Safari,Chrome 隐藏滚动条 */
        // display: none;
        /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
      }
      &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-track {
        background-color: #f2f2f2;
        border-radius: 5px;
      }
  }



  .pagenum {
    margin-left: 20px;
    text-align: left;
    z-index: 1000;
  }

  .showPage {
    margin-left: auto;
  }

  .btn {
    display: flex;
    padding-left: 45%;
    position: absolute;
    z-index: 999;
  }

//   .enlarge {
//     width: 50px;
//     height: 50px;
//   }

  .zoomout {
    margin-left: 10px;
  }

}
</style>
