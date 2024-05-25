<template>
  <div class="home">
    <!-- 导航栏 -->
    <el-header class="header">
      <div class="logo">
        <img src="https://funai-hpl.oss-cn-guangzhou.aliyuncs.com/homePage/logo.png"/>
      </div>
    </el-header>

    <!-- 轮播图 -->
    <div class="carousel-container">
      <div class="options" >
        <el-button  type="info" @click="currentOption = 'chat'" :plain="currentOption !== 'chat'" class="chat-bt">ChatGPT聊天</el-button>
        <el-button  type="info" @click="currentOption = 'text2Img'" :plain="currentOption !== 'text2Img'" class="pdf-bt">创意文生图</el-button>
        <el-button  type="info" @click="currentOption = 'pdf'" :plain="currentOption !== 'pdf'" class="pdf-bt">PDF智能阅读</el-button>
        <el-button  type="info" @click="currentOption = 'game'" :plain="currentOption !== 'game'" class="game-bt">超级冒险游戏</el-button>
        <el-button  type="info" @click="currentOption = 'trans'" :plain="currentOption !== 'trans'" class="trans-bt">智能语言学家</el-button>
        <el-button  type="info" @click="currentOption = 'expert'" :plain="currentOption !== 'expert'" class="expert-bt">懂你专家系统</el-button>
        <el-button  type="info" @click="currentOption = 'contact'" :plain="currentOption !== 'contact'" class="contact-bt">交流联系</el-button>
        <el-button  type="info" @click="currentOption = 'cooperate'" :plain="currentOption !== 'cooperate'" class="cooperate-bt">联系合作</el-button>
      </div>
      <div class="carousel">
        <el-carousel :interval="5000">
          <el-carousel-item 
            v-for="index in (currentOption === 'game' || currentOption === 'text2Img' || currentOption === 'pdf' || currentOption === 'contact'? 3 : 2)"
            :key="`${currentOption}-${index}`">
            <img :src="getImagePath(currentOption, index)" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="footer">
        <span v-if="currentOption === 'chat'">ChatGPT聊天，与AI聊天尽情畅谈</span>
        <span v-if="currentOption === 'text2Img'">创意文生图，天马行空，艺术畅想</span>
        <span v-if="currentOption === 'pdf'">PDF智能阅读，快速阅读，提高效率</span>
        <span v-if="currentOption === 'game'">冒险游戏，寻找未知的冒险之旅</span>
        <span v-if="currentOption === 'trans'">智能语言学家，更像人类的翻译官</span>
        <span v-if="currentOption === 'expert'">懂你专家系统，多领域、多语言，做更懂你的AI</span>
        <span v-if="currentOption === 'contact'">联系我们，一起交流更多有意思的应用</span>
        <span v-if="currentOption === 'cooperate'">联系合作，定制化更多专属您的应用</span>
      
      <div>
        <el-button type="info" class="follow" style="font-weight: bold" @click="goToGithub" round>开源地址</el-button>
        <el-button style="font-weight: bold" @click="goToFunAi" round>现在开始</el-button>
      </div>
      
          <!-- 版权信息 -->
      <div class="copyright">
        版权信息 © 2023 FunAi. All rights reserved.
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      currentOption: 'chat',
    }
  },
  mounted(){
    
  },
  methods: {
    goToGithub() {
      window.location.href = 'https://github.com/huangPengL/ChatGPT-Java-FunAi';
    },
    // 当点击`现在开始`时，直接跳转到登录页面
    goToFunAi(){
      this.$router.push("/UserLogin").catch(err => { console.log(err) });
    },
    getImagePath(currentOption, index){
        return "https://funai-hpl.oss-cn-guangzhou.aliyuncs.com/homePage/" + currentOption + '-' + index +'.png';
    }
  },
};
</script>

<style scoped>
.home {
  background-color: rgb(3, 3, 3);
  color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 20px;
  margin-top: 10px;
}

.logo img {
  height: 130px;
  margin-top: 10px;
}

.carousel-container {
  display: flex;
  justify-content: center;
  text-align: center;
  /* margin-top: 20px; */
}

.options {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  margin: 5px;
  gap: 5px;
}

.chat-bt {
  margin-left: 10px;
}


.carousel {
  width: 60%;
  height: 100%;
  border-radius: 10px;
  border: 2px solid #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  justify-content: center;
  margin-right: 150px;
}


.carousel >>> .el-carousel__container {
    position: relative;
    height: 500px;
}

.carousel img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}


.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.footer a {
  color: #fff;
}

.footer button {
  font-size: 12px;
  padding: 10px;
  margin: 8px;
}

.footer span {
  display: flex;
  margin-top: 12px;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 25px;
}

.copyright {
  position: absolute;
  bottom: 10px;
  text-align: center;
  color: gray; 
  font-size: 12px; 
  /* margin-right: 18%; */

}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 0px;
  }

  .logo img {
    display: flex;
    justify-content: center;
  }


  .carousel-container {
    flex-direction: column;
    margin-right: 0%;
  }


  .carousel {
    width: 98%;
    height: 100%;
    border-radius: 10px;
    border: 2px solid #ffffff;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    margin: 0 auto;
  }


  .carousel >>> .el-carousel__container {
      position: relative;
      height: 280px;
  }

  .options {
    padding-left: 0;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 5%;
    gap: 1px;
  }

  .chat-bt,
  .pdf-bt,
  .game-bt,
  .trans-bt,
  .expert-bt,
  .contact-bt,
  .cooperate-bt {
    margin-left: 0;
    margin-top: 10px;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-left: 0;
  }

  .footer button {
    margin: 15px;
  }
  .footer span {
    display: flex;
    margin: 10px;
    margin-top: 50px;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: 25px;
  }
  .copyright {
    position: absolute;
    bottom: 20px;
    text-align: center;
  }
}
</style>
