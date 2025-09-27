<template>
    <div class="layout">
        <div class="header">
            <div class="logo">EasyJob管理后台</div>
            <div class="userinfo">
                欢迎回来，
                <el-dropdown>
                    <span class="name">{{ userInfo.userName }}</span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="updateMyPwd">修改密码</el-dropdown-item>
                            <el-dropdown-item @click="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="body">
            <div class="left-sider">
                <div class="menu-list">
                    <div :class="['menu-item', currentPmenu.menuUrl == item.menuUrl ? 'active' : '']"
                        v-for="item in userInfo.menuList" @click="pMenuClickHandler(item)">
                        <div :class="['iconfont', 'icon-' + item.icon]"></div>
                        <div class="menu-name">{{ item.menuName }}</div>
                    </div>
                </div>
                <div class="menu-sub-list">
                    <div :class="['sub-menu', currentSubMenu.menuUrl == sub.menuUrl ? 'active' : '']"
                        v-for="sub in currentPmenu.children" @click="jump(sub)">{{ sub.menuName }}</div>
                </div>
            </div>
            <div class="main-content">
                <div class="tag-content">
                    <el-tabs type="border-card" v-model="currentSubMenu.menuUrl" @tab-click="tabClick" @edit="editTab">
                        <el-tab-pane :label="item.menuName" :name="item.menuUrl" :closable="tabList.length > 1"
                            v-for="item in tabList"></el-tab-pane>
                    </el-tabs>
                </div>
                <div class="body-content">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <UpdatePwd ref="updatePwdRef"></UpdatePwd>
    </div>
</template>

<script setup>
import UpdatePwd from "./UpdatePwd.vue";
import { ref, reactive, getCurrentInstance, nextTick, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router";
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance();
//从 sessionStorage 中获取用户信息，包括菜单列表 menuList
const userInfo = ref(JSON.parse(sessionStorage.getItem('userInfo') || { menuList: [] }))
//用来存储当前选择的一级菜单和二级菜单项
const currentPmenu = ref({})
const currentSubMenu = ref({})
//点击一级菜单时更新当前菜单
const pMenuClickHandler = (data) => {
    currentPmenu.value = data
    let firstSubMenu = data.children[0]
    jump(firstSubMenu)
}
//当用户点击子菜单时，切换到该菜单，并添加到选项卡列表中
const jump = (data) => {
    if (currentSubMenu.value.menuUrl === data.menuUrl) {
        return
    }
    currentSubMenu.value = data
    addTabHander(data)
    router.push(data.menuUrl)
}
//根据当前路由选择对应的菜单项
const menuSelect = (curPath, addTab) => {
    let curMenu = menuMap.value[curPath]
    if (curMenu == null) {
        return
    }
    currentPmenu.value = menuMap.value[curMenu.parentPath]
    currentSubMenu.value = curMenu
    if (addTab) {
        addTabHander(curMenu)
    }
}
//存储所有菜单的映射，方便快速查找
const menuMap = ref({})
//初始化菜单映射，将 menuList 转换为 menuMap
const initMenuMap = () => {
    const menuList = userInfo.value.menuList
    for (let p = 0; p < menuList.length; p++) {
        const pMenu = menuList[p]
        menuMap.value[pMenu.menuUrl] = pMenu
        if (pMenu.children) {
            for (let s = 0; s < pMenu.children.length; s++) {
                const sub = pMenu.children[s]
                sub['parentPath'] = pMenu.menuUrl
                menuMap.value[sub.menuUrl] = sub
            }
        }
    }
}
//存储打开的选项卡
const tabList = ref([])
//点击选项卡时，切换到对应的路由
const tabClick = (e) => {
    const path = e.props.name
    menuSelect(path)
    router.push(path)
}
//关闭选项卡时，处理关闭操作
const editTab = (targetKey, action) => {
    if (action !== 'remove') {
        return
    }
    let curPath = currentSubMenu.value.menuUrl
    let tabs = tabList.value
    if (targetKey === curPath) {
        tabs.forEach((tab, index) => {
            if (tab.menuUrl === targetKey) {
                let nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                    curPath = nextTab.menuUrl
                }
            }
        })
    }
    tabList.value = tabs.filter(tab => tab.menuUrl !== targetKey)
    if (curPath !== currentSubMenu.value.menuUrl) {
        router.push(curPath)
        menuSelect(curPath)
    }
}
//添加新的选项卡，防止重复打开
const addTabHander = (curMenu) => {
    let currentTab = tabList.value.find(item => {
        return item.menuUrl == currentSubMenu.value.menuUrl
    })
    if (!currentTab) {
        tabList.value.push(curMenu)
    }
}
//退出登录
const logout=()=>{
    proxy.Confirm('确定要退出吗?',async()=>{
        let result=await proxy.Request({
            url:'/api/logout'
        })
        if(!result){
            return
        }
        sessionStorage.removeItem('userInfo')
        router.push('/login')
    })
}
//修改密码
const updatePwdRef=ref()
const updateMyPwd=()=>{
      updatePwdRef.value.show()
}
onMounted(() => {
    initMenuMap()
    menuSelect(route.path, true)
})
</script>

<style lang="scss" scoped>
.layout {
    .header {
        border-bottom: 1px solid #ddd;
        height: 60px;
        padding-right: 24px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .logo {
            font-weight: bold;
            margin-left: 5px;
            font-size: 25px;
            color: #05a1f5;
        }

        .userinfo {
            margin-right: 20px;
            font-size: 14px;
            display: flex;
            align-items: center;

            .name {
                font-size: 1;
                color: #409eff;
                cursor: pointer;
            }

            .user-type {
                margin-left: 5px;
            }

            .logout {
                margin-left: 15px;
            }
        }
    }

    .body {
        display: flex;

        .left-sider {
            width: 260px;
            display: flex;
            height: calc(100vh - 60px);
            border-right: 1px solid #fff2f4;
            box-shadow: 0 3px 10px 0 rgba(14, 14, 14, 0.06);

            .menu-list {
                width: 70px;
                text-align: center;
                background: #1a1a1a;

                .menu-item {
                    text-align: center;
                    padding: 15px 0px;
                    cursor: pointer;
                    color: #fff;

                    .iconfont {
                        font-size: 20px;
                    }

                    .icon-app {
                        font-size: 25px;
                    }

                    .menu-name {
                        font-weight: bold;
                    }

                    &:hover {
                        color: #05a1f5;
                    }
                }

                .active {
                    background: #06a7ff;

                    &:hover {
                        color: #fff;
                    }
                }
            }

            .menu-sub-list {
                flex: 1;
                position: relative;
                padding: 5px 5px;

                .sub-menu {
                    margin-top: 5px;
                    cursor: pointer;
                    padding: 10px 8px;
                    border-radius: 5px;

                    &:hover {
                        color: #05a1f5;
                        /* 修正了颜色值 */
                    }
                }

                .active {
                    background: #e8f4ff;
                    color: #1890ff;
                }


            }
        }

        .main-content {
            width: 100%;

            .tag-content {
                :deep .el-tabs--border-card {
                    border: none;
                }

                :deep .el-tabs__content {
                    display: none;
                }
            }

            .body-content {
                padding: 10px;
            }
        }
    }
}
</style>
