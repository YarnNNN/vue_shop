<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            <!-- 表格 -->
            <el-table
            class="treeTable"
                :data="cateList"
                row-key="cat_id"
                border
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <!-- <el-table-column
                    type="index"
                    :index="indexMethod">
                </el-table-column> -->
                <el-table-column
                    prop="cat_name"
                    label="分类名称"
                    width="180">
                </el-table-column>
                <el-table-column label="是否有效">
                    <template slot-scope="scope">
                        <i class="el-icon-success" 
                        v-if="scope.row.cat_deleted === false"
                        style="color:lightgreen"></i>
                        <i class="el-icon-error" 
                        v-else
                        style="color:red"
                        ></i>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cat_level"
                    label="排序">
                    <template slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                        <el-tag size="mini" type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
                        <el-tag size="mini" type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template>
                        <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
                        <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3,5,10,15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
           
        </el-card>
        <!-- 添加分类的对话框 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed">
            <div>
                <el-form  
                :model="addCateForm" 
                :rules="addCateRules" 
                ref="addCateFormRef" 
                label-width="100px">
                    <el-form-item label="分类名称：" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类：">
                        <el-cascader
                            expand-trigger="hover"
                            :options="parentCateList"
                            :props="cascaderProps"
                            v-model="selectedKeys"
                            @change="parentCateChange"
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-form>
                
            </div>
            <div slot="footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </div>
        </el-dialog>
    </div>    

</template>
<script>
export default {
    data() {
        return {
            //查询条件
            queryInfo:{
                type:3,
                pagenum	:1,
                pagesize:5
            },
            //商品分类的数据列表，默认为空
            cateList:[],
            total:0,
            addCateDialogVisible:false,
            addCateForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0,
            },
            addCateRules:{
                cat_name:[{required: true, message:'请输入分类名称', trigger: 'blur'}]
            },
            parentCateList:[],
            cascaderProps:{
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly:true
            },
            // 选中父级分类的id数组
            selectedKeys:[]
            
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList(){
            const {data:res} = await this.$http.get('categories',{params: this.queryInfo})
            if(res.meta.status !== 200){
                return this.$message.error('获取商品分类失败')
            }
            this.cateList = res.data.result
            this.total = res.data.total
            console.log(res.data)
        },
        // 索引更新
        indexMethod(index){
            return index+1
        },
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        showAddCateDialog(){
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        //获取父级分类数据列表
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !== 200){
                return this.$message.error('获取父级分类数据失败')
            }
                this.parentCateList = res.data
                console.log(res.data)
        },
        // 选择项发生变化触发
        parentCateChange(){
            console.log(this.selectedKeys)
            if(this.selectedKeys.length > 0){
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            }else{
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        //点击按钮添加新的分类
        addCate(){
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return
                const {data:res} = await this.$http.post('categories',this.addCateForm)

                if(res.meta.status !== 201){
                    return this.$message.error('添加分类失败失败')
                }

                this.$message.success('添加分类成功!')

                this.getCateList()
                this.addCateDialogVisible = false
            })
            console.log(this.addCateForm)
        },
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        }
    },
}
</script>
<style lang="less" scoped>
.treeTable{
    margin-top: 15px;
}
</style>