<template>
  <div>
     
    <el-form  :inline="true" class="demo-form-inline">
          <el-form-item>
              <el-input  placeholder="用户名/手机号"  v-model="searchObj.key" size="small" />
          </el-form-item>
          <el-form-item label="用户等级">
            <el-select v-model="searchObj.level" placeholder="请选择用户等级">
              <el-option label="游客" value="3"></el-option>
              <el-option label="普通用户" value="1"></el-option>
              <el-option label="vip用户" value="2"></el-option>
              <el-option label="管理员" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态">
            <el-select v-model="searchObj.status" placeholder="请选择用户状态">
              <el-option label="正常" value="0"></el-option>
              <el-option label="锁定" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="开始时间" v-model="searchObj.startTime" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
          <el-col :span="11">
            <el-date-picker placeholder="终止时间" v-model="searchObj.endTime" style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-col>
        </el-form-item>
          <el-form-item>
              <el-button type="primary"  icon="el-icon-search" @click="getUserList()" size="small">查询</el-button>
              <el-button type="info" size="small" @click="resetData()">清空</el-button>
          </el-form-item>
          <el-form-item>
          </el-form-item>
      
      </el-form>
      <el-table
        :data="userList"
        style="width: 100%;"
        max-height="50%"
        border fit highlight-current-row 
        :header-cell-style="{'text-align':'center'}"
        v-loading="listLoading">
        <el-table-column
            label="序号"
            width="100"
            align="center">
            <template slot-scope="scope">
                {{ (page - 1) * limit + scope.$index + 1 }}
            </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="level"
          label="等级"
          width="200"
          align="center">
            <template slot-scope="scope">
                {{ levelMap[scope.row.level]}}
            </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="200"
          align="center">
            <template slot-scope="scope">
                {{ scope.row.status == 0 ? '正常':'锁定'}}
            </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="250"
          style="text-align: center;"
          align="center"
          >
          <template slot-scope="scope">
            <div style="text-align: center;">
                  <el-button
                        size="medium"
                        :type="scope.row.status == 0 ? 'danger' : 'success'" round
                        @click="open(scope.row.id, null,scope.row.status)">{{scope.row.status == 0 ? '锁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定' : '解&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;锁'}}</el-button>
                  <el-button type="primary" round size="medium" @click="open(scope.row.id, scope.row.level,null)">更改等级</el-button>
            </div>
            
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="更改等级" :visible.sync="dialogFormVisible" :modal-append-to-body="false"  width=30%>
        <el-form :model="levelChangeform">
          <el-form-item label="用户等级" :label-width="formLabelWidth">
            <el-select v-model="levelChangeform.level" placeholder="请选择用户等级">
              <el-option label="vip用户" value=2></el-option>
              <el-option label="普通用户" value=1></el-option>
              <el-option label="管理员" value=0></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="changeUserLevel">确定</el-button>
        </span>
      </el-dialog>
      <div class="block">
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
  </div>
</template>

<script>

import { getUserList,lockUser,changeLevel} from "@/api/getData";
import Header from '@/components/Header.vue';
import md5 from 'blueimp-md5';
export default {
//import 引入的组件需要注入到对象中才能使用
components: {
  Header
},
props: {},
data() {
//这里存放数据
    return {
      levelMap: {
        0: "👽管理员",
        1: "普通用户",
        2: "vip用户",
        3: "游客"
      },
      userList: [],
      formLabelWidth: '120px',

      levelChangeform: {
        userId: null,
        originalLevel: null,
        level: null
      },

      dialogFormVisible: false,
      listLoading: false, // 数据是否正在加载
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      adminSecretKey: '8fbb5c586788007b2bb2429d4b63b306',

      searchObj: {
        key:'',
        startTime: null,
        endTime: null,
        level: '',
        status: ''
      }
    }
},
//计算属性 类似于 data 概念
computed: {},
//监控 data 中的数据变化
watch: {},
//方法集合
methods: {
      open(id,level,status) {
            this.$prompt('', '请输入管理员操作密钥', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            }).then(({ value }) => {
            let encrypted = md5(value);
            if(encrypted == this.adminSecretKey) {
                if(level == null || level == undefined) {
                  this.lock(id,status);
                } else {
                  this.openLevelWindow(id,level);
                }
            } else {
                this.$message({
                    type: 'error',
                    message: "管理员密钥错误！"
                });
            }
            }).catch(() => {
                
            });
      },
      openLevelWindow(userId, originalLevel) {
        this.dialogFormVisible = true;
        this.levelChangeform.userId = userId;
        this.levelChangeform.originalLevel = originalLevel;
      },
      changeSize(size) {
          this.limit = size
          this.getUserList()
      },
      handleCurrentChange(page){
          this.getUserList(page)
      },
      changeUserLevel() {
          this.listLoading = true
          this.dialogFormVisible = false;
          changeLevel(this.levelChangeform).then(resp => {
            if(resp.code == 20000) {
              this.listLoading = false
              this.$message.success("修改成功！")
              this.getUserList(this.page)
            }else {
              this.listLoading = false
              this.$message.error(resp.message)
            }
          })
      },
      // 查询
      getUserList(page=1){
          this.page = page
          this.listLoading = true
          getUserList(this.limit,this.page,this.searchObj)
              .then(resp => {
                  if(resp.code != 20000){
                      this.listLoading = false
                      this.$message({
                          message: resp.message,
                          type: "warning",
                      });
                      return;
                  }
                  this.userList = resp.data.records
                  this.total = resp.data.total
                  this.listLoading = false
              })
              .catch(error => {
                  console.log(error)
                  this.listLoading = false
              })
      },

      // 清空查询字段
      resetData(){
          this.searchObj = {}
          this.getUserList()
      },
      // 用户锁定/解锁
      lock(userId,status) {
        this.listLoading = true
        status = status == 0 ? 1 : 0;
        let lockReq = {userId,status} 
        lockUser(lockReq).then(resp => {
            if(resp.code == 20000) {
              this.$message.success("修改成功！")
              this.listLoading = false
              this.getUserList(this.page)
            } else {
              this.listLoading = false
              this.$message({
                  message: resp.message,
                  type: "warning",
              })
            }
        })
      }
},
//生命周期 - 创建完成（可以访问当前 this 实例）
created() {
  this.getUserList()
},
//生命周期 - 挂载完成（可以访问 DOM 元素）
mounted() {

},
beforeCreate() {}, //生命周期 - 创建之前
beforeMount() {}, //生命周期 - 挂载之前
beforeUpdate() {}, //生命周期 - 更新之前
updated() {}, //生命周期 - 更新之后
beforeDestroy() {}, //生命周期 - 销毁之前
destroyed() {}, //生命周期 - 销毁完成
activated() {}, //如果页面有 keep-alive 缓存功能，这个函数会触发
}
</script>
<style scoped>

</style>