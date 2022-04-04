<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 添加与搜索区 -->
            <el-row :gutter="20">
                <el-col :span="8">    
                    <!-- 搜索框 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList" ></el-button>
                    </el-input>  
                </el-col>
                <el-col :span="4">
                    <!-- 添加用户按钮 -->
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区 -->
            <el-table
            :data="userList"
            style="width: 100%"
            border
            :stripe="true">
                <el-table-column type=index></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile"  label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <!-- 作用域插槽 -->
                    <template slot-scope="scope">
                        <!-- {{scope.row.mg_state}} -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false" >
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                        <!-- {{ scope.row }} -->
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户的对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
            <!-- 添加表单 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部提交/取消区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
          <!-- 修改用户的对话框 -->
        <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
            <!-- 添加表单 -->
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部提交/取消区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        //验证邮箱的规则
        var checkEmail = (rule, value, callback) => {
            const regEmail = /^([a-zA-Z0-9-_])+@([a-zA-Z0-9-_])+(\.[a-zA-Z0-9-_])+/
            if(regEmail.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法邮箱'));
        };

        //验证手机号的规则
        var checkMobile = (rule, value, callback) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if(regMobile.test(value)) {
                return callback()
            }
            callback(new Error('请输入合法手机号'));
        };
        return {
            //获取用户列表的参数对象
            queryInfo: {
                query:'',
                pagenum:1,
                pagesize:2
            },
            userList:[],
            total:0,
            // 控制显示对话框的显示与隐藏
            addDialogVisible: false,
            //添加用户的表单数据
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            
            //添加表单的验证规则对象
            addFormRules:{
                username:[
                    {required: true, message:'请输入用户邮箱', trigger: 'blur'},
                    {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    {required: true, message:'请输入密码', trigger: 'blur'},
                    {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email:[
                    {required: true, message:'请输入邮箱', trigger: 'blur'},
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile:[
                    {required: true, message:'请输入手机', trigger: 'blur'},
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            //控制修改用户对话框的显示与隐藏
            editDialogVisible: false,
            //查询到的用户信息
            editForm:{

            },
            //用了addFormRules
            editFormRules:{

            }
            
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
      //发送请求获取用户列表数据
            const { data : res } = await this.$http.get('users', {
                params: this.queryInfo
            })
            console.log(res)
            // 如果返回状态为异常状态则报错并返回
            if (res.meta.status !== 200)
                return this.$message.error('获取用户列表失败')
            //如果返回状态正常，将请求的数据保存在data中
            this.userList = res.data.users;
            this.total = res.data.total;
        },
        //监听pagesize改变
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        //监听当前页码变化
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        //监听switch状态改变
        async userStateChanged(userinfo){
            const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200){
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            //如果返回状态正常，将请求的数据保存在data中
            this.$message.success('更新用户状态成功！')
        },
        //监听添加用户对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        //点击按钮添加新用户
        addUser(){
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const {data:res} = await this.$http.post('users',this.addForm)
                if (res.meta.status !== 201){
                    return this.$message.error('添加用户失败')
                }   
                this.$message.success('添加用户成功！'),
                this.addDialogVisible = false
                this.getUserList()
            })
        },
        //展示编辑用户的对话框
        async showEditDialog(id){
            const {data:res} = await this.$http.get(`users/${id}`)
            if(res.meta.status !== 200){
                return this.$message.error('查询用户信息失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true
        },
        //取消修改用户信息
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //修改用户信息并提交
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                const {data:res} = await this.$http.put('users/'+this.editForm.id,{
                    email:this.editForm.email, 
                    mobile:this.editForm.mobile
                })
                if (res.meta.status !== 200){
                    return this.$message.error('修改用户失败')
                }   
                this.addDialogVisible = false
                this.getUserList()
                this.$message.success('修改用户成功！')
            })
        },
        //根据id删除对应信息
        async removeUserById(id){
            //确认删除 confirmResult = confirm 
            //取消删除 confirmResult = cancel
            const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);  

            if(confirmResult !== 'confirm'){
                return this.$message.info('已经取消删除')
            }

            const {data:res} = await this.$http.delete('users/'+id)
            if(res.meta.status !== 200){
                return this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            this.getUserList()


            // console.log('')
        }
    },
    
}
</script>

<style lang="less" scoped>
.el-table{
    margin-top: 15px;
}
</style>