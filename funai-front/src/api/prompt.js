import base from './index'
let axios = base.axios
let baseUrl = base.baseUrl


// 查询prompt库
export const getPromptList = (page, limit, searchObj) => {
  return axios({
    method: 'get',
    url: `${baseUrl}/prompt/admin/list/${page}/${limit}`,
    params: searchObj
  }).then(res => res.data)
}

// 新增prompt
export const addPrompt = (info) => {
    return axios({
        method: 'post',
        url: `${baseUrl}/prompt/admin`,
        data: info
    }).then(res => res.data)
}

// 编辑prompt
export const editPrompt = (info) => {
    return axios({
        method: 'put',
        url: `${baseUrl}/prompt/admin`,
        data: info
    }).then(res => res.data)
}

// 删除prompt
export const deletePrompt = (promptId) => {
    return axios({
        method: 'delete',
        url: `${baseUrl}/prompt/admin/${promptId}`,
    }).then(res => res.data)
}