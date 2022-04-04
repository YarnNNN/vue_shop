<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <body>
                <!-- 2、为 ECharts 准备一个定义了宽高的 DOM -->
                <div id="main" style="width: 800px;height:400px;"></div>
            </body>
        </el-card>
    </div>
</template>

<script>
//1、导入echarts
import * as echarts from 'echarts'
// import _ from 'lodash'

export default {
    data() {
        return {
            //需要合并的数据
            options: {
                title: {
                text: '用户来源'
                },
                tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#E9EEF3'
                    }
                }
                },
                grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
                },
                xAxis: [
                {
                    boundaryGap: false
                }
                ],
                yAxis: [
                {
                    type: 'value'
                }
                ]
            }
        }
    },
    created() {
        
    },
    async mounted() {
        //3、此时页面上的dom已经渲染完毕，基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const {data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200){
            return this.$message.error('获取折线图失败')
        }
        // 4、指定图表的配置项和数据 在data中制定了
        // var option = {
        // };

        // 5、使用刚指定的配置项和数据显示图表。
        // const obj = Object.assign({},this.options,res.data)
        const obj = {...this.options,...res.data}

        myChart.setOption(obj);
    },
    methods: {
        
    },
}
</script>
<style lang="less" scoped>

</style>