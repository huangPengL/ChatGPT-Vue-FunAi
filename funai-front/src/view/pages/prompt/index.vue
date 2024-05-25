<template>
    <div class="app-container">
         
        <el-form :inline="true" class="demo-form-inline">

            <el-form-item>
                <el-select
                    v-model="searchObj.type"
                    placeholder="请选择类型"
                        @change="promptChanged"
                        size="mini">
                    <el-option
                        v-for="item in promptTypeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            size="mini"/>
                </el-select>
            </el-form-item>

             <el-form-item>
                <el-select
                    v-model="searchObj.target"
                    placeholder="请选择权限级别"
                        @change="promptChanged"
                        size="mini">
                    <el-option
                        v-for="item in promptTargetList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"/>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-input v-model="searchObj.content" placeholder="搜索" size="mini" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getPromptList()" size="mini">查询</el-button>
                <el-button type="info" @click="resetData()" size="mini">清空</el-button>
            </el-form-item>
            <el-form-item>
            <router-link :to="'/Prompt/Info/add'">
                <el-button type="success" icon="el-icon-plus" size="mini">新增Prompt</el-button>
            </router-link>
            </el-form-item>
        
        </el-form>

    <!-- banner列表 -->
    <el-table v-loading="listLoading" 
        :data="list" border fit highlight-current-row 
        :header-cell-style="{'text-align':'center'}"
        >

        <el-table-column
            label="序号"
            width="50"
            align="center">
            <template slot-scope="scope">
                {{ (page - 1) * limit + scope.$index + 1 }}
            </template>
        </el-table-column>

        <el-table-column prop="topic" label="主题"/>
        <el-table-column prop="content" label="prompt内容" width="750"/>
        <el-table-column prop="type" label="类型"  width="100">
            <template slot-scope="scope">
                {{ promptTypeList[scope.row.type].name }}
            </template>
        </el-table-column>
        <el-table-column prop="target" label="权限">
            <template slot-scope="scope">
                {{ promptTargetList[scope.row.target].name }}
            </template>
        </el-table-column>
        <el-table-column prop="description" label="简要描述"/>
        

        <el-table-column prop="create_time" width="100" label="创建时间"/>
        <el-table-column prop="update_time" width="100" label="修改时间"/>

        <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <el-button type="primary" icon="el-icon-edit" circle size="" @click="editPrompt(scope.row)" style="margin: 2px;"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="" @click="open(scope.row.id)" style="margin: 2px;"></el-button>
                    </div>
            </template>
        </el-table-column>

    </el-table>
        <!-- 分页组件 -->
        <el-pagination
            :current-page=page
            :total=total
            :page-size=limit
            :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
            style="padding: 30px 0; text-align: center;"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            @size-change="changeSize"
            @current-change="handleCurrentChange"
        />
    </div>
</template>

<script>
import { getPromptList, deletePrompt } from "@/api/prompt";
import Header from '@/components/Header.vue';
import md5 from 'blueimp-md5';

export default {
    components: {
      Header,
    },
    data() {
        return {
            listLoading: true, // 数据是否正在加载
            list: null, // banner列表
            total: 0, // 数据库中的总记录数
            page: 1, // 默认页码
            limit: 5, // 每页记录数
            searchObj: {}, // 查询表单对象
            promptTypeList: [
                {id: 0, name: 'chatgpt'},
                {id: 1, name: 'midjourney'},
            ],
            promptTargetList: [
                {id: 0, name: '管理员'},
                {id: 1, name: '用户'},
            ],
            adminSecretKey: '8fbb5c586788007b2bb2429d4b63b306'
        }
    },

    // 生命周期函数：内存准备完毕，页面尚未渲染
    created() {
        this.getPromptList()
    },

    methods:{
            open(id) {
            this.$prompt('', '请输入管理员操作密钥', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            }).then(({ value }) => {
            let encrypted = md5(value);
            if(encrypted == this.adminSecretKey) {
                this.deletePrompt(id);
            } else {
                this.$message({
                    type: 'error',
                    message: "管理员密钥错误！"
                });
            }
            }).catch(() => {
                
            });
        },
        // 选择prompt类型时，联动查询
        promptChanged(){
            getPromptList(this.page, this.limit, this.searchObj)
                .then(resp => {
                    if(resp.code != 20000){
                        this.$message({
                            message: resp.message,
                            type: "warning",
                        });
                        return;
                    }
                    this.list = resp.data.records
                    this.total = resp.data.total
                    this.listLoading = false
                })
                .catch(error => {
                    console.log(error)
                })
        },

        // 清空查询字段
        resetData(){
            this.searchObj = {}
            this.getPromptList()
        },

        // 查询
        getPromptList(page=1){
            this.page = page
            getPromptList(this.page, this.limit, this.searchObj)
                .then(resp => {
                    if(resp.code != 20000){
                        this.$message({
                            message: resp.message,
                            type: "warning",
                        });
                        return;
                    }
                    this.list = resp.data.records
                    this.total = resp.data.total
                    this.listLoading = false
                })
                .catch(error => {
                    console.log(error)
                })
        },

        changeSize(size) {
            this.limit = size
            this.getPromptList()
        },
        handleCurrentChange(page){
            this.getPromptList(page)
        },
        editPrompt(info){
            console.log(info)
            this.$router.push({
                path: '/Prompt/Info/edit',
                query: {
                    params: info
                }
            })
        },
        deletePrompt(promptId){

            this.$confirm('是否删除?', '确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success',
                center: true
                }).then(() => {
                    deletePrompt(promptId).then(res => {
                        if(res.code == 20000){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getPromptList()
                        }
                        else{
                            this.$message({
                                type: 'error',
                                message: '删除失败!'
                            });
                        }
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            
        }
    }

}
</script>
