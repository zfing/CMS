# 项目地址

-git clone http://xgit.italki.com/internalsystem/ifms_frontend.git

# 项目安装

yarn or npm i

# 项目启动

yarn start or npm run start  
http://localhost:9000/

# 项目打包

参考 package.json
"build:dev": "env-cmd -e development node scripts/build.js",
"build-com:moon": "env-cmd -e moon node scripts/build.js",
"build-com:mars": "env-cmd -e mars node scripts/build.js",
"build-com:product": "env-cmd -e production node scripts/build.js",

# TAG 发布

tag 号规则:[MOON|QA|PP(环境)].FE.R[20200908(日期)].[01(当天序号)]  
 eg:MOON.FE.R200908.03  
 1 git tag MOON.FE.R200908.03  
 2.git tag push origin MOON.FE.R200908.03

# 目录结构

<div>---public                                                                公共文件</div>
<div>---src                                                                      源码</div>
<div>----------assets                                                        静态文件</div>
<div>----------component                                                     公共及配置 </div>
<div>---------------------------CommonComponent                          公共组件  </div>
<div>-----------------------------------------PermissionControl.js           权限控制函数</div>
<div>-----------------------------------------其它公共组件</div>
<div>---------------------------Api.js                                   封装axios</div>
<div>---------------------------BreadCrumbMenu.js                   面包屑配置文件</div>
<div>---------------------------CommonConst.js                        常量配置文件</div>
<div>---------------------------Filter.js                                过滤函数</div>
<div>---------------------------Layout.js                               布局文件</div>
<div >----------pages     需要开发的文件夹及文件  </div>
<div >----------images     静态图片  </div>
<div>----------Router     路由配置文件 </div> 
<div >----------Untils     工具类  </div>
<div>----------App.js     主文件  </div>
<div >----------index.js   入口文件   </div>  
<div>---env-cmdrc    环境变量  </div>
<div>---README.md  </div>

# 页面开发(依赖 react 和 antd design)

1.在/src/pages 目录下新建页面目录及文件  
 2.在/src/Router/Router.js 导入页面组件，配置对应路由  
 3.在/src/components/BreadCrumbMenu.js 配置对应路由的面包屑  
 4.在/src/components/Layout.js 配置 url 对应的菜单  
 eg:{ title: "Credit Budgeting", url: "/budget/credit-budgeting", id: 1005100 }

#其它注意事项
1，面包屑首字母大写
2，表头全是大写
3，操作框首字母大写
4，表格每行展开框 lable 全是大写
5，注意时间：UTC 和本地时间。
6，关于货币：注意 ITC USD 的转化（eg：输入美元，传值美分）
7，提交表单注意必填而未填项提示
8，常用功能下组件直接使用 antd，或者自定义需求组件
9，选择框支持搜索功能
10，几乎所有的操作都会唤起 log 提示框，个别可以不用，看具体需求
11,具体逻辑等细节在 FMS 技术文档（https://italki.atlassian.net/wiki/spaces/SYS/pages/4203479150/2022+FMS）
