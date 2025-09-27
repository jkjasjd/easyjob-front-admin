<template>
    <div class="login-container">
        <div class="background">
            <div class="shape"></div>
            <div class="shape"></div>
        </div>
        <el-form class="login-form" :model="formData" :rules="rules" ref="formDataRef" @submit.prevent="">
            <h3>Login Here</h3>
            <el-form-item prop="phone">
                <el-input size="large" clearable placeholder="请输入手机号" v-model.trim="formData.phone">
                    <template #prefix>
                        <i class="iconfont icon-phone"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input show-password type="password" size="large" clearable placeholder="请输入密码"
                    v-model.trim="formData.password">
                    <template #prefix>
                        <i class="iconfont icon-password"></i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="checkCode">
                <div class="check-code-panel">
                    <el-input size="large" clearable placeholder="请输入验证码" v-model.trim="formData.checkCode">
                        <template #prefix>
                            <i class="iconfont icon-yanzhengyanzhengma"></i>
                        </template>
                    </el-input>
                    <img :src="checkCodeUrl" alt="" @click="changeCheckCode">
                </div>
            </el-form-item>
            <el-form-item>
                <div>
                    <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button size="large" @click="doSubmit">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance } from "vue";
import { loginAPI } from "@/api/user";
import md5 from "js-md5";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

//通过 getCurrentInstance 获取当前组件实例的 proxy 对象
const { proxy } = getCurrentInstance();

const router = useRouter()
//表单
const formData = ref({});
const formDataRef = ref();
const rules = {
    phone: [{ required: true, message: "请输入手机号" }],
    password: [{ required: true, message: "请输入密码" }],
    checkCode: [{ required: true, message: "请输入验证码" }],
};

//验证码
const apiUrl = 'http://localhost:9091/api/checkCode'
const checkCodeUrl = ref(null);
const changeCheckCode = () => { // 这里传入实际的查询参数
    checkCodeUrl.value = `${apiUrl}?time=${new Date().getTime()}`
}

//登录
const doSubmit = () => {
    //表单校验
    formDataRef.value.validate(async (valid) => {
        if (!valid) {
            return
        }
        const params = { ...formData.value }
        //密码加密
        let cookieLoginInfo = proxy.VueCookies.get('loginInfo')
        let cookiePassword = cookieLoginInfo == null ? null : cookieLoginInfo.password
        if (params.password !== cookiePassword) {
            params.password = md5(params.password)
        }
        const result = await loginAPI(params)
        if (!result) {
            return
        }
        //记住我
        if (params.rememberMe) {
            const loginInfo = {
                phone: params.phone,
                password: params.password,
                rememberMe: params.rememberMe
            }
            proxy.VueCookies.set('loginInfo', loginInfo, '7d')
        } else {
            proxy.VueCookies.remove('loginInfo')
        }
        ElMessage.success('登陆成功')
        sessionStorage.setItem('userInfo', JSON.stringify(result.data))
        let firstMenu = result.data.menuList[0]
        if (firstMenu.children.length > 0) {
            firstMenu = firstMenu.children[0]
        }
        router.push(firstMenu.menuUrl)
    });
};
onMounted(() => {
    changeCheckCode()
    //重置表单字段
    formDataRef.value.resetFields()
    formData.value = {}
    const cookieLoginInfo = proxy.VueCookies.get('loginInfo')
    if (cookieLoginInfo) {
        formData.value = cookieLoginInfo
    }
})
</script>

<style scoped lang="scss">
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #080710;
    position: relative;
}

.background {
    position: absolute;
    width: 430px;
    height: 520px;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
}

.shape {
    height: 200px;
    width: 200px;
    position: absolute;
    border-radius: 50%;
}

.shape:first-child {
    background: linear-gradient(#1845ad, #23a2f6);
    left: -80px;
    top: -80px;
}

.shape:last-child {
    background: linear-gradient(to right, #ff512f, #f09819);
    right: -30px;
    bottom: -80px;
}

.login-form {
    width: 300px;
    background-color: rgba(255, 255, 255, 0.13);
    border-radius: 10px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
    padding: 50px 35px;
}

h3 {
    font-size: 40px;
    font-weight: 500;
    line-height: 42px;
    text-align: center;
    color: white;
    margin-bottom: 60px;
}

.el-form-item {
    margin-bottom: 30px;
}

.el-checkbox {
    color: white;
}

.el-button {
    height: 56px;
    width: 100%;
    font-size: 24px;
}

.check-code-panel {
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 10px;

    img {
        width: 35%;
        height: 40px;
        margin-left: 10px;
        cursor: pointer;
    }
}
</style>
