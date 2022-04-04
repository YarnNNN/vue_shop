<template>
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <!-- 黑马logo -->
          <img src="../assets/heima.png" alt="">
          <!-- 顶部标题 -->
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout"> 退出 </el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px':'200px'">
          <!-- 伸缩侧边栏按钮 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
            >      <!-- router开启路由模式，跳转到index -->
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级子菜单 -->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" 
              :key="subItem.id"  @click="saveNavState('/' + subItem.path)">
                <!-- 二级菜单模板 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体结构 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: null,
      iconsObj: {
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao'
      },
      isCollapse:false,
      activePath:''
    }
  },
  created() {
    // 在created阶段请求左侧菜单数据
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      // 发送请求获取左侧菜单数据
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

      this.menuList = res.data
      // console.log(res)
    },
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态 
    saveNavState(activePath){
      window.sessionStorage.setItem("activePath",activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
.home-container{
  // height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  color: #fff;
  justify-content: space-between;
  padding-left :0px; 
  align-items: center;
  font-size: 20px;
  
  > div{
    margin-left:  0px; 
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
    
    
  }
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right:none
  }
}
.iconfont{
  margin-right: 10px;
}
</style>