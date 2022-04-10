//项目发布阶段需要用到的babel插件 
const productionTip = []
if (process.env.NODE_ENV === 'production') {
    productionTip.push('transform-remove-console')
}

module.exports = {
    "presets": [
        "@vue/cli-plugin-babel/preset"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        ...productionTip
    ],
}