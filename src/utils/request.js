import axios from 'axios'
import Message from './Message';
import { useRouter } from 'vue-router';
import { ElLoading } from 'element-plus';
const router=useRouter()
const contentTypeForm = 'application/x-www-form-urlencoded; charset=UTF-8'
const contentTypeJson = 'application/json'
// 创建axios实例
let loading = null;
const instance = axios.create({
    baseURL: '/api', // 基础URL
    timeout: 10000, // 请求超时时间
})

instance.interceptors.request.use(
    (config) => {
        if (config.showLoading) {
            loading = ElLoading.service({
                lock: true,
                text: '加载中...',
                background: 'rgba(0, 0, 0, 0.8)'
            })
        }
        return config;
    },
    (error) => {
        if (config.showLoading && loading) {
            loading.close();
        }
        Message.error('请求发送失败');
        return Promise.reject('请求发送失败');
    }
);

// 响应拦截器
instance.interceptors.response.use(
    // 成功响应处理
    (response) => {
        // 从响应配置中获取参数
        const { showLoading, errorCallback, showError = true } = response.config;

        // 如果配置了显示加载提示且存在loading实例，则关闭加载提示
        if (showLoading && loading) {
            loading.close();
        }

        // 提取响应数据
        const responseData = response.data;

        // 正常请求成功（状态码200）
        if (responseData.code == 200) {
            return responseData;
        }
        // 登录超时（状态码901）
        else if (responseData.code == 901) {
            // 2秒后跳转到登录页面
            setTimeout(() => {
                router.push("/login");
            }, 2000);

            // 返回拒绝的Promise，包含错误信息
            return Promise.reject({ showError: true, msg: "登录超时" });
        }
        // 其他错误状态码
        else {
            // 如果配置了错误回调函数，则执行
            if (errorCallback) {
                errorCallback(responseData.info);
            }

            // 返回拒绝的Promise，包含错误信息
            return Promise.reject({
                showError: showError,
                msg: responseData.info
            });
        }
    },
    // 失败响应处理（网络错误等）
    (error) => {
        // 如果配置了显示加载提示且存在loading实例，则关闭加载提示
        if (error.config.showLoading && loading) {
            loading.close();
        }

        // 返回拒绝的Promise，包含网络异常信息
        return Promise.reject({
            showError: true,
            msg: "网络异常"
        });
    }
);

const request = (config) => {
    // 解构配置参数
    const { url, params, dataType, showLoading = true } = config;

    // 默认使用表单格式
    let contentType = contentTypeForm;
    let formData = new FormData(); // 创建form对象

    // 将参数添加到formData中
    for (let key in params) {
        formData.append(key, params[key] == undefined ? "" : params[key]);
    }

    // 如果指定了JSON格式，修改contentType
    if (dataType != null && dataType == 'json') {
        contentType = contentTypeJson;
    }

    // 设置请求头
    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest',
    }

    // 发送POST请求
    return instance.post(url, formData, {
        headers: headers,
        // 这里应该是对象属性，原代码有语法错误
        showLoading: showLoading,
        errorCallback: config.errorCallback,
        showError: config.showError
    }).catch(error => {
        console.log(error);

        // 如果配置了显示错误，则显示错误消息
        if (error.showError) {
            Message.error(error.msg);
        }

        return null;
    });
};
export default request