import base from './index'
let axios = base.axios
let baseUrl = base.baseUrl

// 获取聊天列表
export const getSessionList = (user_id, type) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/chat/getSessionList/${user_id}/${type}`,
  }).then(res => res.data)
}

// 获取聊天信息
export const getChatMsg = params => {
  return axios({
    method: 'get',
    url: `${baseUrl}/chat/getSessionChatRecord/${params.sessionId}`,
    data: params
  }).then(res => res.data)
}

// 单轮聊天
export const oneShotChat = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/chat/oneShot`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 单轮聊天(流式)
export const streamOneShotChat = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/chat/streamOneShotChat`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 多轮聊天
export const sessionChat = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/chat/session`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 多轮聊天(流式)
export const streamSessionChat = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/chat/streamSessionChat`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 发送验证码
export const sendCode = phone => {
  return axios({
    method: 'post',
    url: `${baseUrl}/user/sendCode`,
    data: phone,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 用户注册
export const register = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/user/register`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 用户登录
export const login = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/user/login`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 重置用户密码
export const reset = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/user/resetPwd`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 新增会话
export const addSession = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/chat/addSession`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 翻译
export const linguistOperate = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/linguist/linguistOperate`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 文件下载
export const downloadSession = params => {
  return axios({
    method: 'get',
    url: `${baseUrl}/chat/getSessionChatRecordByCsv/${params.sessionId}`,
    data: params,
    responseType: 'blob'
  }).then(res => res.data)
}

// 清空聊天记录
export const clearSessionRecord = sessionId => {
  return axios({
    method: 'put',
    url: `${baseUrl}/chat/truncateSessionChatRecord/${sessionId}`,
  }).then(res => res.data)
}

// 删除会话
export const deleteSession = sessionId => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/chat/deleteSession/${sessionId}`,
  }).then(res => res.data)
}

// 用户退出
export const logout = user_id => {
  return axios({
    method: 'get',
    url: `${baseUrl}/user/logout/${user_id}`,
  }).then(res => res.data)
}

// 发送语音
export const sendAudio = (cuid,token,params) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/chat/getTextByAudio?cuid=${cuid}&token=${token}`,
    data: params,
    headers: {
      'Content-Type': 'audio/wav;rate=16000',
    }
  }).then(res => res.data)
}

export const getAudioToken = () => {
  return axios({
    method: 'post',
    url: `${baseUrl}/chat/getAudioToken`
  }).then(res => res.data)
}

// 开始游戏
export const startGameSession = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/chat/game/startGameSession`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}


// 上传PDF
export const chatPdfUpload = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/file/chatPdfUpload`,
    data: params,
  }).then(res => res.data)
}

// 多文件上传
export const muliChatPdfUpload = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/file/muliChatPdfUpload`,
    data: params,
  }).then(res => res.data)
}

// 与PDF聊天
export const chatWithFile = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/file/chatWithFile`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 删除索引库连接
export const dropCollection = params => {
  return axios({
    method: 'delete',
    url: `${baseUrl}/file/dropCollection`,
    params: params
  }).then(res => res.data)
}

// 文件对话,流式
export const streamChatWithFile = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/file/streamChatWithFile`,
    data: params,
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data)
}

// 获得专家领域的提示
export const listAllUserPrompt = () => {
  return axios({
    method: 'get',
    url: `${baseUrl}/prompt/listAllUserPrompt`,
  }).then(res => res.data)
}

// 获取用户的apikey
export const getUserApiKey = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/user/apiKey/get`,
    data: params,
  }).then(res => res.data)
}


// 获取用户的apikey
export const insertOrUpdateApiKey = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/user/apiKey/insertOrUpdate`,
    data: params,
  }).then(res => res.data)
}

// 获取用户列表
export const getUserList = (limit,page,params) => {
  return axios({
    method: 'post',
    url: `${baseUrl}/user/admin/getUserListByCondition/${limit}/${page}`,
    data: params,
  }).then(res => res.data)
}

// 获取用户列表
export const lockUser = params => {
  return axios({
    method: 'post',
    url: `${baseUrl}/user/admin/lockUser`,
    data: params,
  }).then(res => res.data)
}

// 更改用户等级
export const changeLevel = params=> {
  return axios({
    method: 'post',
    url: `${baseUrl}/user/admin/changeLevel`,
    data: params,
  }).then(res => res.data)
}

// 添加意见
export const addAdvice = params=> {
  return axios({
    method: 'post',
    url: `${baseUrl}/user/advice/addAdvice`,
    data: params,
  }).then(res => res.data)
}

export const getWxCode = () => {
  return axios({
    method: 'get',
    url: `${baseUrl}/user/getWxCode`
  }).then(res => res.data)
}

export const getWbCode = () => {
  return axios({
    method: 'get',
    url: `${baseUrl}/user/getWbCode`
  }).then(res => res.data)
}

export const getUserLevel = () => {
  return axios({
    method: 'get',
    url: `${baseUrl}/user/getUserLevel`
  }).then(res => res.data)
}

// 文生图
export const text2Img = params=> {
  return axios({
    method: 'post',
    url: `${baseUrl}/img/text2Img`,
    data: params,
  }).then(res => res.data)
}

// 获取聊天的文件
export const getFileChatBySessionId = sessionId => {
  return axios({
    method: 'get',
    url: `${baseUrl}/file/getFileChatBySessionId/${sessionId}`,
  }).then(res => res.data)
}
