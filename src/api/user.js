import request from "@/utils/request";

export const loginAPI = (params) => {
    return request({
        url: '/api/login',       // 设置请求路径
        params: params,      // 传入的参数  // 如果是JSON数据格式，可以指定，或者根据实际需求
        showLoading: true,   // 显示加载动画
        showError: true,     // 显示错误信息
    });
}
