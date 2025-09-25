<template>
    <div class="login-body">
        <div class="login-panel">
            <el-form class="login-form" :model="formData" :rules="rules" ref="formDataRef" @submit.prevent>
                <div class="login-title">刷题软件管理后台</div>
                <!--input输入-->
                <el-form-item prop="phone">
                    <el-input size="large" clearable placeholder="请输入手机号" v-model.trim="formData.phone">
                        <template #prefix>
                            <i class="iconfont icon-phone"></i>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input size="large" clearable placeholder="请输入密码" v-model.trim="formData.password">
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
                    </div>
                    <img src="" alt="">
                </el-form-item>
                <el-form-item>
                    <div class="remember-me-panel">
                        <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button class="op-btn" size="large" @click="handleSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const formData = ref({});
const formDataRef = ref();
const rules = {
    phone: [{ required: true, message: "请输入手机号" }],
    password: [{ required: true, message: "请输入密码" }],
};
</script>

<style lang="scss" scoped>
.login-body {
    height: calc(100vh);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background: url("../assets/login_bg.jpg");
    display: flex;
    align-items: center;


    .login-panel {
        width: 280px;
        margin-left: 7%;
        padding: 40px 30px;
        border-radius: 10px;
        backdrop-filter: blur(10px); /* Glassmorphism 背景模糊效果 */
        background-color: rgba(255, 255, 255, 0.2); /* 半透明背景 */
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); /* 阴影效果 */
        display: flex;
        flex-direction: column;
        align-items: center;

        .login-form {
            width: 100%;
            padding: 20px 0;
            .login-title {
                text-align: center;
                font-size: 22px;
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 30px;
            }

            .el-form-item {
                width: 100%;
                margin-bottom: 20px;
            }

            .el-input {
                background-color: rgba(255, 255, 255, 0.2)!important; /* 半透明背景 */
                color: #ffffff;
                border-radius: 5px;
            }

            .el-input__inner {
                font-size: 14px;
                color: #ffffff;
                background-color: rgba(255, 255, 255, 0.1)!important;
                border-radius: 5px;
            }

            .el-input__prefix {
                color: #ffffff;
            }

            .el-button {
                background-color: #ffffff; /* 按钮绿色 */
                color: #080710;
                width: 100%;
                border-radius: 5px;
                font-size: 18px;
                font-weight: bold;
                padding: 15px;
                transition: background-color 0.3s ease;
            }

        }
    }

    /* 验证码输入框 */
    .check-code-panel {
        display: flex;
        align-items: center;
        width: 100%;
        margin-top: 10px;

        img {
            height: 40px;
            margin-left: 10px;
            cursor: pointer;
        }
    }

    /* 记住我复选框 */
    .remember-me-panel {
        display: flex;
        justify-content: flex-start;
        width: 100%;
        margin-top: 10px;
        color: #ffffff;
    }

    .remember-me-panel .el-checkbox {
        color: #ffffff;
    }
}
</style>
