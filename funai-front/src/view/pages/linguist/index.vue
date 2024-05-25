<template>
    <div class="linguist-system">
        <div class="linguist-content">
            <div class="linguist-grammarly">
                <div class="titleBar">
                    <span class="title">【FunAi-语言润色/语法修改】</span>
                    <el-button 
                        class="translateBtn" 
                        icon="el-icon-document" 
                        type="success"
                        size="mini" @click="clickGrammarEdit()" 
                        v-loading="grammarlyLoading"
                        element-loading-text="正在处理中，请稍等">开始润色/修改</el-button>
                    <el-button 
                        class="translateBtn" 
                        type="info"
                        size="mini" @click="clearGrammarEdit()" 
                        >清空内容</el-button>
                </div>

                <div class="translationalBox">
                    <el-input
                        class="grammarlyInput"
                        type="textarea"
                        :rows="8"
                        placeholder="1.在这里输入需要进行语言润色/语法修改的内容（目前仅支持英语） 2.点击`开始润色/修改`"
                        v-model="grammarlyInput">
                    </el-input>
                    <el-input
                        class="grammarlyOutput"
                        type="textarea"
                        :rows="8"
                        placeholder="这里是修改后的内容以及修改意见（功能仍然在测试中，可能有误，请斟酌修改意见！）"
                        v-model="grammarlyOutput">
                    </el-input>
                </div>
            </div>

            <div class="linguist-translator">
                <div class="titleBar">
                    <span class="title">【FunAi-智能翻译】</span>
                    <el-select class="leftLanguageSelector" size="mini" v-model="leftLanguageValue" filterable placeholder="请选择翻译目标语言">
                        <el-option
                            v-for="item in LanguageOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select class="rightLanguageSelector" size="mini" v-model="rightLanguageValue" filterable placeholder="请选择翻译目标语言">
                        <el-option
                            v-for="item in LanguageOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button 
                        class="translateBtn" 
                        icon="el-icon-document" 
                        type="success"
                        size="mini" @click="clickTranslation()" 
                        v-loading="translatorLoading"
                        element-loading-text="正在处理中，请稍等">翻译
                    </el-button>
                    <el-button 
                        class="translateBtn" 
                        type="info"
                        size="mini" @click="clearTranslation()" 
                        >清空内容
                    </el-button>
                </div>
                <!-- 翻译界面 -->
                <div class="translationalBox">
                    <el-input
                        class="translateInput"
                        type="textarea"
                        :rows="6"
                        :placeholder=this.leftBoxPlaceHolder
                        v-model="translateInput">
                    </el-input>
                    <el-tooltip content="改变翻译方向" placement="top">
                        <!-- <el-button v-if="this.leftToRightDiration" class="arrowBTN iconfont icon-jiantou_xiangyou" @click="chargeArrowDirection"></el-button>
                        <el-button v-else class="arrowBTN iconfont icon-jiantou_xiangzuo" @click="chargeArrowDirection"></el-button> -->
                        <el-button class="arrowBTN iconfont icon-shuangxiangshujuhuchuan_transfer-data" @click="chargeArrowDirection"></el-button>
                    </el-tooltip>  
                    <el-input
                        class="translateOutput"
                        type="textarea"
                        :rows="6"
                        :placeholder=this.rightBoxPlaceHolder
                        v-model="translateOutput">
                    </el-input>
                </div>
            </div>
        </div>
    </div>
</template>
  
  <script>
  import PersonCard from "@/components/PersonCard.vue";
  import { linguistOperate } from "@/api/getData";
  import Cookies from 'js-cookie';
  import Header from '@/components/Header.vue';
  
  export default {
    name: "App",
    components: {
      PersonCard,
      Header
    },
    data() {
      return {
        userId: Cookies.get('userId'),
        username: Cookies.get("username"),
        grammarlyInput: '',
        grammarlyOutput: '',
        translateInput: '',
        translateOutput: '',
        LanguageOptions: [
            {
                "label": "汉语",
                "value": "Chinese"
            },
            {
                "label": "英语",
                "value": "English"
            },
            {
                "label": "西班牙语",
                "value": "Spanish"
            },
            {
                "label": "阿拉伯语",
                "value": "Arabic"
            },
            {
                "label": "印地语",
                "value": "Hindi"
            },
            {
                "label": "葡萄牙语",
                "value": "Portuguese"
            },
            {
                "label": "孟加拉语",
                "value": "Bengali"
            },
            {
                "label": "俄语",
                "value": "Russian"
            },
            {
                "label": "法语",
                "value": "French"
            },
            {
                "label": "德语",
                "value": "German"
            },
            {
                "label": "日语",
                "value": "Japanese"
            },
            {
                "label": "韩语",
                "value": "Korean"
            },
            {
                "label": "土耳其语",
                "value": "Turkish"
            },
            {
                "label": "马拉雅拉姆语",
                "value": "Malayalam"
            },
            {
                "label": "波兰语",
                "value": "Polish"
            },
            {
                "label": "乌尔都语",
                "value": "Urdu"
            },
            {
                "label": "乌克兰语",
                "value": "Ukrainian"
            },
            {
                "label": "意大利语",
                "value": "Italian"
            },
            {
                "label": "泰语",
                "value": "Thai"
            },
            {
                "label": "荷兰语",
                "value": "Dutch"
            },
            {
                "label": "希腊语",
                "value": "Greek"
            },
            {
                "label": "尼泊尔语",
                "value": "Nepali"
            },
            {
                "label": "波斯语",
                "value": "Persian"
            },
            {
                "label": "罗马尼亚语",
                "value": "Romanian"
            },
            {
                "label": "捷克语",
                "value": "Czech"
            },
            {
                "label": "越南语",
                "value": "Vietnamese"
            },
            {
                "label": "斯洛伐克语",
                "value": "Slovak"
            },
            {
                "label": "瑞典语",
                "value": "Swedish"
            },
            {
                "label": "塞尔维亚语",
                "value": "Serbian"
            },
        ],
        leftLanguageValue: 'Chinese',
        rightLanguageValue: 'English',
        grammarlyLoading: false,
        translatorLoading: false,
        leftToRightDiration: true,
        leftBoxPlaceHolder: "1.左输入框输入原始需要翻译的内容（可以是任何语言） 2.选择原语言（左选项框）和目标语言（右选项框）  3.点击`翻译`。注意：左边是输入框，右边是输出框，改变翻译方向，只会把输入内容和输出内容替换，需要再点击翻译，才会在右输入框生成新的翻译内容!",
        rightBoxPlaceHolder: "这里是翻译后的内容"
      };
    },
    mounted() {
      
    },
    methods: {
        chargeArrowDirection(){
            this.leftToRightDiration = !this.leftToRightDiration
            // 转换语言
            let message = this.translateInput
            this.translateInput = this.translateOutput
            this.translateOutput = message
            // 转换语言
            let language = this.leftLanguageValue
            this.leftLanguageValue = this.rightLanguageValue
            this.rightLanguageValue = language
        },
      clickTranslation(){
        let params = {
            user_id: this.userId,
            message: this.translateInput,
            language: this.rightLanguageValue,
            type: 0     // 0翻译 1语法检测/润色
        }
        this.translatorLoading = true
        linguistOperate(params).then(resp => {
            if(resp.code == 20000){
                this.$message({
                    showClose: true,
                    message: '翻译成功',
                    type: 'success'
                });
                this.translatorLoading = false
                this.translateOutput = resp.data.linguistResult
            }
            else{
                this.$message({
                    message: resp.message,
                    type: "warning",
                });
                this.translatorLoading = false
            }
        })
      },
      clickGrammarEdit(){
        let params = {
            user_id: this.userId,
            message: this.grammarlyInput,
            type: 1     // 0翻译 1语法检测/润色
        }
        this.grammarlyLoading = true
        linguistOperate(params).then(resp => {
            if(resp.code == 20000){
                this.$message({
                    showClose: true,
                    message: '语法检测/润色成功',
                    type: 'success'
                });
                this.grammarlyLoading = false
                this.grammarlyOutput = resp.data.linguistResult
            }
            else{
                this.$message({
                    message: resp.message,
                    type: "warning",
                });
                this.grammarlyLoading = false
            }
        })
      },
      clearGrammarEdit(){
        this.grammarlyOutput = "";
        this.grammarlyInput = "";
      },

      clearTranslation(){
        this.translateInput = "";
        this.translateOutput = "";
      }
    },
  };

</script>
  
<style lang="scss" scoped>
.titleBar{
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 10px;
    .title{
        // padding-left: 3%;
        padding-right: 2%;
        color: white;
        font-size: 20px;
    }
    .leftLanguageSelector{
        padding-right: 4.5%;
    }
    .rightLanguageSelector{
        padding-right: 3%;
        padding-left: 4.5%;
    }
}
.linguist-system{
    width: 100%;
    height:calc(100% - 50px);
    .translationalBox{
        width: 100%;
        height: 50%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        .arrowBTN{
            margin-top: 50px;
            height: 40px;
        }
        .grammarlyInput{
            width: 45%;
            height: 30%;
            font-size: 16px;
            margin-right: 5%;
        }
        .translateInput{
            width: 45%;
            height: 30%;
            font-size: 16px;
        }
        
        .grammarlyOutput{
            width: 45%;
            height: 30%;
            font-size: 16px;
        }
        .translateOutput{
            width: 45%;
            height: 30%;
            font-size: 16px;
        }
    }

}
.linguist-content{
    display: flex;
    // align-items: center;
    // justify-content: center;
    flex-direction: column;
}   
.linguist-grammarly{
    margin-bottom: 50px;
}
</style>