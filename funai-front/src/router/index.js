import VueRouter from 'vue-router'
 
const ChatHome = () => import('@/view/pages/chatHome/index.vue');
const LoginPage = () => import('@/view/pages/userLogin/index.vue');
const RegisterPage = () => import('@/view/pages/userLogin/register.vue');
const Translation = () => import('@/view/pages/linguist/index.vue');
const ResetPage = () => import('@/view/pages/userLogin/Reset.vue');
const ChatWithFile = () => import('@/view/pages/chatwithfile/index.vue');
const Prompt = () => import('@/view/pages/prompt/index.vue');
const PromptInfoOp = () => import('@/view/pages/prompt/info.vue');
const ExpertChat = () => import('@/view/pages/expertChat/index.vue');
const GameChat = () => import('@/view/pages/gameChat/index.vue');
const HomePage = () => import('@/view/pages/homePage/index.vue');
const UserList = () => import('@/view/pages/userInfo/userList.vue');
const ImgGenerate = () => import('@/view/pages/imgGenerate/index.vue');
const FileChatIndex = () => import('@/view/pages/chatwithfile/fileChatIndex.vue')



export default new VueRouter({
    routes: [
        {
            path: "/",
            redirect: "/HomePage",
            name:'/',
            meta: {
                title: 'FunAi-首页'
            }
          },
        {
            path: "/ChatHome/:type",
            name: "ChatHome",
            component: ChatHome,
            meta: {
                title: 'FunAi-畅聊AI'
            }
        },    
        {
            path: "/UserLogin",
            name: "UserLogin",
            component: LoginPage,
            meta: {
                title: 'FunAi-登录'
            }
        }, 
        {
            path: "/UserReset",
            name: "UserReset",
            component: ResetPage,
            meta: {
                title: 'FunAi-重置密码'
            }
        }, 
        {
            path: "/UserRegister",
            name: "UserRegister",
            component: RegisterPage,
            meta: {
                title: 'FunAi-注册'
            }
        }, 
        {
            path: "/Translation",
            name: "Translation",
            component: Translation,
            meta: {
                title: 'FunAi-语言学家'
            }
        },   
        {
            path: "/ChatWithFile",
            name: "ChatWithFile",
            component: ChatWithFile,
            meta: {
                title: 'FunAi-PDF智能阅读'
            }
        },
        {
            path: "/Prompt",
            name: "Prompt",
            component: Prompt,
            meta: {
                title: 'FunAi-提示库'
            }
        },
        {
            path: "/Prompt/Info/:op",
            name: "PromptInfoOp",
            component: PromptInfoOp,
            meta: {
                title: 'FunAi-提示库操作'
            }
        },
        {
            path: "/ExpertChat",
            name: "ExpertChat",
            component: ExpertChat,
            meta: {
                title: 'FunAi-专家系统'
            }
        },
        {
            path: "/GameChat",
            name: "GameChat",
            component: GameChat,
            meta: {
                title: 'FunAi-冒险游戏'
            }
        },
        {
            path: "/HomePage",
            name: "HomePage",
            component: HomePage,
            meta: {
                title: 'FunAi-首页'
            }
        },
        {
            path: "/userList",
            name: "UserList",
            component: UserList,
            meta: {
                title: 'FunAi-用户管理'
            }
        },
        {
            path: "/ImgGenerate",
            name: "ImgGenerate",
            component: ImgGenerate,
            meta: {
                title: 'FunAi-智能画图'
            }
        },
        {
            path: "/FileChatIndex",
            name: "FileChatIndex",
            component: FileChatIndex,
            meta: {
                title: "文件聊天框主页"
            }
        }
    ]
})

