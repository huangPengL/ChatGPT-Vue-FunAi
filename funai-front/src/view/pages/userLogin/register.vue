<template>
  <div class="login-container">
    <div class="top">
      <p class="title" style="margin-top: 20px">FunAi</p>
      <p class="title">
         【有意思的AI体验馆】
      </p>
    </div>

    <div class="mid">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules"  label-position="left">
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            name="userName"
            suffix-icon="el-icon-user"
            type="text"
            placeholder="用户名" 
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :type="pwdType"
            v-model="loginForm.password"
            suffix-icon="el-icon-lock"
            name="password"
            auto-complete="on"
            placeholder="密码"/>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" name="phone" type="text" suffix-icon="el-icon-mobile-phone"  placeholder="手机号" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" name="code" placeholder="请输入手机验证码"></el-input>
          <!-- <el-button type="success" @click="sendCode" :disabled="disabled">{{buttonText}}</el-button> -->
          <button class="smsButton" @click="sendCode" :disabled="disabled">{{buttonText}}</button>
        </el-form-item>
        <div style="display: flex; justify-content: space-between;">
          <span>
            <input type='checkbox'  label="" v-model="isAgree" style="border-radius: 4px;"/>
            <span style="font-size:5px !important;color:#454545">已阅读并同意<i style="color: #FFFFFF;cursor: pointer" @click="showAgreement" >《用户协议》</i></span>
          </span>
          <router-link to="/UserLogin" style="text-decoration: none;"> 
                <span class="go-to-login">
                  登录页    
                </span>
          </router-link>
        </div>
        <el-form-item>
          <el-button :loading="loading" type="primary" icon="el-icon-s-check" style="width:100%;"  @click="userRegister" :disabled="!isAgree">
            注册
          </el-button>
        </el-form-item>
        <!-- <el-form-item>
          <router-link to="/UserLogin">
            <el-button type="primary" style="width:100%;">
              登录页
            </el-button>
          </router-link>
        </el-form-item> -->
        <el-form-item>
          <router-link to="/HomePage">
            <el-button :loading="loading" icon="el-icon-back" style="width:100%;">
              返回主页
          </el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>
    <div class="xieyi">
      <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="70%"
        :modal-append-to-body="false"
        :center="isCenter"
        top="5vh"
        >
        <div>
          <h1 style="text-align:center">FunAi平台用户服务协议</h1>
          <h2>一、特别提示</h2>
          <p>请合法提问，如相关问答与现行法律法规、国家政策等不符的，以现行法律法规、国家政策等规定为准，本单位不为该等问答承担任何责任和义务。</p>
          <p>在此特别提醒您（用户）在注册成为FunAi平台用户之前，请认真阅读本《FunAi平台用户服务协议》（以下简称“本协议”），确保您充分理解本协议中各条款。本协议约定FunAi平台根据本协议为用户提供产品或服务等，FunAi平台为广大追梦团队运营的平台，用户指FunAi平台的使用人。本协议的条款FunAi平台有权随时更新，一旦发生变动，将在网页上公布最新修改内容。更新后的协议条款一经公布即代替原来的协议条款，恕不再另行通知。</p>
          <p>请您审慎阅读并选择接受或不接受本协议。您同意并确认本协议条款且完成用户信息授权后，才能成为FunAi平台的正式注册用户，并享受FunAi平台的各类服务。您登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。若您不同意本协议，或对本协议中的条款存在任何疑问，请您立即停止使用FunAi平台程序，并可以选择不使用本平台服务。</p>
          <p>若用户未满18周岁则属于未成年人用户，未成年人用户请在监护人监护、指导下，阅读了解本协议。</p>
          <h2>二、账号登录与注册</h2>
          <p>1、用户在使用本服务前需要提前获得一个FunAi平台账号。</p>
          <p>2、在用户注册及使用本平台服务时, FunAi平台需要搜集能识别用户身份的个人信息以便可以在必要时联系用户,或为用户提供更好的使用体验。搜集的信息包括但不限于用户的姓名、联系方式等，但FunAi平台将对用户个人隐私信息进行保护和约束。</p>
          <h2>三、账户安全</h2>
          <p>1、FunAi平台的用户,拥有一个用户名和密码进行登录,并有权利使用自己的用户名及密码随时进行登录。</p>
          <p>2、用户对用户名和密码的安全负全部责任,同时对以其用户名进行的所有活动和事件负全责。</p>
          <p>3、用户不得以任何形式擅自转让或授权他人使用自己的FunAi平台账号。</p>
          <p>4、用户对密码加以妥善保管,切勿将密码告知他人,因密码保管不善而造成的所有损失由用户自行承担。</p>
          <p>5、如果用户泄漏了密码,有可能导致不利的法律后果,因此不管任何原因导致用户的密码安全受到威胁,应该立即和FunAi平台管理人员取得联系,否则后果自负。</p>
          <h2>四、用户声明与保证</h2>
          <p>1、用户承诺其为具有完全民事行为能力的民事主体,且具有达成交易履行其义务的能力。</p>
          <p>2、用户有义务在必要时提供自己的真实资料,并保证诸如手机号码、姓名等内容的有效性及安全性,保证FunAi平台工作人员可以通过上述联系方式与用户取得联系。同时,用户也有义务在相关资料实际变更时及时更新有关个人资料。</p>
          <p>3、用户通过使用FunAi平台的过程中所制作、上载、复制、发布、传播的任何內容,包括但不限于账号头像、名称、用户说明等个人信息及认证资料,或文字、语音、图片、视频、图文等发送、回复和相关链接页面,以及其他使用账号或本服务所产生的内容,不得违反国家相关法律制度,不得包含如下内容（包含但不限于）:</p>
          <ol>
            <li>违反宪法所确定的基本原则的；</li>
            <li>危害国家安全,泄露国家秘密,颠覆国家政权,破坏国家统一的；</li>
            <li>损害国家荣誉和利益的；</li>
            <li>煽动民族仇恨、民族歧视,破坏民族团结的；</li>
            <li>破坏国家宗教政策,宣扬邪教和封建迷信的；</li>
            <li>散布谣言,扰乱社公秩序,破坏社会稳定的；</li>
            <li>散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</li>
            <li>侮辱或者诽谤他人,侵害他人合法权益的；</li>
            <li>含有法律、行政法规禁止的其他内容的。</li>
          </ol>
          <p>4、用户不得干扰FunAi平台的正常运营，不得利用FunAi平台账号或本服务制作、上载、复制、发布、传播以下侵犯其他用户或或第三方合法权益的内容：</p>
          <ol>
            <li>含有任何性或性暗示的；</li>
            <li>含有辱骂、恐吓、威胁内容的；</li>
            <li>含有骚扰、垃圾广告、恶意信息、诱骗信息的；</li>
            <li>涉及他人隐私、个人信息或资料的；</li>
            <li>侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；</li>
            <li>含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息。</li>
          </ol>
          <p>5、用户应保证按照相关法律法规合理使用FunAi平台及各类服务应用，不得从事任何侵犯FunAi平台及其他第三方合法权益的行为，包括但不限于：</p>
          <ol>
            <li>对FunAi平台、各类服务应用产品及其技术接口、数据等进行全部或部分翻译、分解、反向翻译、反汇编、反向工程或其他试图从产品中导出程序源代码的行为；</li>
            <li>对FunAi平台、各类服务应用产品及其技术接口、数据等进行内容、功能、逻辑及界面等任何方面的修改、以及在前述产品基础上书写或开发衍生软件、衍生产品或其他软件的行为。</li>
            <li>限制、破坏或绕过FunAi平台、各类服务应用产品附带的加密附件或其他确保产品正确使用的限制性措施的行为。</li>
          </ol>
          <p>6、在任何时候，用户均可以向FunAi平台管理员或平台微信群投诉、举报各类违法违规行为、违法传播活动、违法有害信息等内容、FunAi平台管理员将及时受理和处理用户投诉举报，以共同营造文明、有序的网络环境。</p>
          <h2>五、服务内容</h2>
          <p>1、服务用户的具体内容，由FunAi平台根据实际情况决定提供或不提供，例如：在平台产品中提供的信息资讯、服务模块等。您理解并同意，FunAi平台均按照现有技术和条件所能达到的现状为用户提供服务，并且将会确保服务的连贯性和安全性，但仍旧不能随时预见和防范法律、技术以及其他风险。对于任何用户信息或个人设定引起的时效、删除、传递错误、未存储或其他任何问题，FunAi平台均不承担任何责任，并保留有权不经事先通知为升级、维护或其他目的的暂停全部或部分服务。</p>
          <p>2、FunAi平台依法为用户提供服务，但是用户应在使用产品过程中自行承担责任及风险，在任何情况下，FunAi平台不就因使用或不能使用产品提供的服务所发生的特殊的、意外的、直接或间接的损失承担赔偿服务。</p>
          <p>3、除您与FunAi平台另行书面约定外，FunAi平台保留随时停滞、修改或中断服务而无需通知您的权利。FunAi平台无需因此对用户或第三方负责。</p>
          <h2>六、用户隐私保护</h2>
          <p>1、 FunAi平台非常重视对用户个人信息的保护。将按照本协议的规定收集、使用、存储和分享您的个人信息。</p>
          <p>2、 保护用户隐私是FunAi平台的一项基本政策，FunAi平台不对外公开或向第三方提供用户的注册资料及用户在使用服务时存储在FunAi平台的非公开内容，但下列情况除外：</p>
          <ol>
            <li>事先获得用户的明确授权；</li>
            <li>用户自行在网络上公开、分享的信息或其他已合法的个人信息；</li>
            <li>以维护公共利益或学术研究的目的；</li>
            <li>以合法渠道获取的个人信息；</li>
            <li>用户侵害FunAi平台及其关联公司的合法权益，为维护前述合法权益且在必要范围内；</li>
            <li>符合本协议相关条款的规定；</li>
            <li>根据有关法律法规的要求或按照司法，行政等国家机关，政府部门的要求；</li>
            <li>为向用户提供服务，FunAi平台认为有必要的其他情况。</li>
          </ol>
          <p>3、 在以下（包括但不限于）几种情况下，FunAi平台有权使用用户的个人信息：</p>
          <ol>
            <li>某些情况下为进行相关商业合作需要调取用户的个人信息，此类情形包括但不限于在进行第三方提供产品促销或抽奖时，FunAi平台可能会与第三方共享用户的个人信息，在这种情况下FunAi平台可能会在发送用户信息之前进行提示，您可以通过不参与来终止传送过程；</li>
            <li>FunAi平台可能会将用户信息与第三方数据匹配；</li>
            <li>FunAi平台会披露用户统计数据，向未来的合作伙伴、广告商及其他第三方以及为了其他合法目的而描述公司的服务。在对用户隐私资料进行去身份化处理的前提下，FunAi平台有权对整个用户数据库进行分析并对用户进行商业上的利用。</li>
          </ol>
          <p>4、 如果您认为个人信息被FunAi平台不合理目的使用、或被其他用户侵权，请立即与FunAi平台取得联系，并按照要求提供相应的证明资料，将及时调查核实处理。</p>
          <p>5、 在使用FunAi平台服务的过程中，用户有可能了解、接收或接触到包括但不限于其他用户在内的个人信息，用户了解并承诺对上述信息予以充分尊重，不会以任何形式搜集、复制、存储、传播或以任何其他方式使用其他用户的个人信息，否则，由此产生的一切后果由用户自行承担。</p>
          <h2>七、免责声明</h2>
          <p>1、FunAi平台部分信息来自于企业/机构官方或用户提供，且任何信息都存在滞后或被更新的可能，因此FunAi平台不能保证在任何时候任何信息都准确无误。您应自行谨慎判断确定相关服务或信息的真实性、合法性和有效性，并自行承担因此产生的责任与损失。</p>
          <p>2、FunAi平台有权利但无义务，改善或更正任何部分的疏漏、错误。</p>
          <p>3、FunAi平台不保证，包括但不限于：本产品适合用户的使用要求；本产品不受干扰，及时、安全、可靠或不出现错误。</p>
          <p>4、您理解并同意，除法律法规另有规定外，FunAi平台对以下情形导致的后果不承担责任：</p>
          <ol>
            <li>受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏而引起的损失或风险；</li>
            <li>用户或FunAi平台的软件、系统、硬件和通信线路出现故障；</li>
            <li>用户操作不当或通过非FunAi平台授权的方式使用服务；</li>
            <li>用户上传、发布的内容被他人转发、分享，因此等传播可能带来的风险或责任；</li>
            <li>其他FunAi平台无法控制或合理预见的情形。</li>
          </ol>
          
          <p>5、FunAi平台有权根据法律法规的规定、本协议的约定等对违法违规的内容进行处理，但该权利不构成FunAi平台的义务或承诺，不保证能及时发现违法违规行为或进行有效处理。</p>
          <h2>八、关于第三方提供的服务</h2>
          <p>1、FunAi平台可能会提供与其他网站或资源进行链接。</p>
          <p>2、您在FunAi平台上使用第三方提供的产品或服务时，除遵循本协议约定外，还应遵循第三方的服务或用户协议。FunAi平台和第三方对可能出现的纠纷在法律规定和约定的范围内各自承担责任。</p>
          <h2>九、终止服务</h2>
          <p>您同意FunAi平台基于其自行之考虑，因任何理由终止服务，具体原因包括但不限于缺乏使用，或FunAi平台认为您已经违反本协议的文字及精神等方面。</p>
          <h2>十、法律的适用和管辖</h2>
          <p>1、本协议的成立、生效、履行、解释及纠纷解决，均受到中华人民共和国大陆地区法律（不包括冲突法）管辖。您与FunAi平台就本协议或其他有关事项发生的争议，应首先友好协商解决，协议不成时，应将纠纷或争议提请FunAi所在地有管辖权的法院管辖。</p>
          <p>2、FunAi平台未行使或执行本协议任何权利或权益，不构成对前述权利或权益的放弃。</p>
          <p>3、倘本协议之任何规定因与中华人民共和国大陆地区法律抵触而无效，您依然同意遵守本协议的其他规定，并依照诚实信用的原则，积极理解并落实该等规定的内容。</p>
          <h2>十一、其他</h2>
          <p>1、您使用本服务即视为您已阅读并同意接受本协议的约束。FunAi平台有权在必要时修改本协议条款，并且会将修改后的协议予以发布，您应及时查阅最新版本的条款。如您同意接受修改的协议，您将可以继续使用FunAi平台的相关服务；如您不接受，应立即停止使用相关服务。</p>
          <p>2、本协议所有条款的标题仅为阅读方便，本身并无实际含义，不能作为本协议含义解释的依据。</p>
          <p>3、如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。</p>

        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="buttom">
      <!-- 二维码 -->
        <!-- <div v-for="item in buttomQRCodeDetail" :key="item" class="image-wrapper">
          <el-image
            style="width: 150px; height: 150px"
            :src="item.url"
            :fit="item.fit"></el-image>
          <span class="image-label">{{ item.desc }}</span>
        </div>  -->

      <!-- copyright -->
      <div class="copyright">
        <p>&copy; 2023 FunAi. All Rights Reserved.</p>
      </div>
    </div>

  </div>
</template>

<script>
import { sendCode, register } from "@/api/getData";
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('用户名/手机号不能为空'))
      } else if( value.length < 2 || value.length >15){
        callback(new Error('用户名/手机号在2-15位之间'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 2 || value.length > 18) {
        callback(new Error('密码在2-18位之间噢！'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      let reg = /^1[3-9]\d{9}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不正确'))
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length == 0 || value.length > 4) {
        callback(new Error('请输入4位数字验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: '',
        password: '',
        phone: '',
        code:'',
        email:''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{required: true, trigger: 'blur', validator: validateCode}]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      buttonText: '发送',
      disabled: false,
      countDown: 120,
      isAgree: false,
      dialogVisible: false,
      isCenter: true
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showAgreement() {
      this.dialogVisible = true
    },
    sendCode() {
        // 验证字段
        let reg = /^1[3-9]\d{9}$/;
        let phone = this.loginForm.phone;
        if (reg.test(phone)) {
          // 禁用按钮并启动计时器
          this.disabled = true

          this.$message.success("正在发送验证码！")
          // 发送验证码
          phone = {phone}
          sendCode(phone).then(res => {
              if(res.code == 20000){
                this.$message.success("验证码已发送到手机！")
                const timer = setInterval(() => {
                    if (this.countDown > 0) {
                      this.countDown--
                      this.buttonText = `${this.countDown}`
                    } else {
                      clearInterval(timer)
                      this.disabled = false
                      this.countDown = 120
                      this.buttonText = '发送'
                    }
                }, 1000)
              }
              else if(res.code == 20001){
                this.$message.error(res.message)
                this.disabled = false
              }
          })
        } else {
          this.$message.error("手机号格式不正确")
        }
    },
    userRegister() {
      this.$refs.loginForm.validate(valid => {
        if(valid) {
          this.loading = true
          register(this.loginForm).then(res => {
            if(res.code == 20000) {
              Cookies.set('token', res.data.token)
              Cookies.set('userId', res.data.userId)
              Cookies.set('username', res.data.username)
              this.$message.success("登录成功！")
              this.$router.push({name: "ChatHome", params: { type: 'NormalChat' }});
            }else {
                this.loading = false;
                this.$message.error("注册失败! " + res.message);
            }
          })
        } else {
            this.loading = false;
            this.$message.error("请正确填写注册信息");
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-image: linear-gradient(to right,rgb(36, 99, 163),rgb(220, 222, 225));
    backdrop-filter: blur(1px); /*  元素后面区域添加模糊效果 */
    border-radius: 30px;
    animation: blink 2s infinite; /* 新增动画属性 */

    @keyframes blink {
      0% {
        box-shadow: -1px 1px 0px rgba(46, 103, 161, 0.4);
      }
      50% {
        box-shadow: -1px 1px 10px rgba(46, 103, 161, 1);
      }
      100% {
        box-shadow: -1px 1px 0px rgba(46, 103, 161, 0.4);
      }
    }
    .title {
      font-size: 22px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 0px auto;
      text-align: center;
      font-weight: bold;
    }
    .top{
      width: 100%;
      margin: 0px auto;
    }
    .mid{
      width: 60%;
      margin: 0px auto;
      margin-top: 20px;
    }
    .buttom{
      width: 80%;
      display: flex;
      // justify-content: space-between;
      justify-content: center;
      align-items: center;
      margin: 0px auto;
      .image-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 20px;
        margin-bottom: 10px; /* 可根据实际情况进行调整，控制图片与span之间的间距 */
      }

      .image-label {
        margin-top: 10px; /* 可根据实际情况进行调整，控制span距离图片的间距 */
        text-align: center;
        color: #FFFFFF
      }
      .copyright {
        color: #121010; /* 根据需要设置文字颜色 */
        font-size: 12px; /* 根据需要设置文字大小 */
        position: absolute;
        bottom: 20px;
      }

      .copyright p {
        margin: 0;
      }
    }
    .el-input {
      display: inline-block;
      height: 35px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        color: $light_gray;
        height: 35px;
      }
    }

    .smsButton {
      display: inline-block;
      width: 15%;
      height: 35px;
      color: white;
      background-color: rgb(49, 174, 40);
      border: 0px;
      border-radius: 10px;
      cursor: pointer;
    }
  
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    .xieyi p {
        text-indent: 2em;
      }

    .xieyi  ol{
        padding-left: 80px;
      }

    .go-to-login {
      font-size:12px; 
      color: rgb(77,100,174);
      font-weight: bold;
      &:hover {
        color: blue;
      }
    }
}
</style>