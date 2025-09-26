import { ElMessage } from 'element-plus';

const showMessage = (msg, callback, type) => {
    ElMessage({
        type: type,
        message: msg,
        duration: 2000,
        onClick: () => {  // 修正：onClicks 应该是 onClick
            if (callback) {
                callback();
            }
        }
    });  // 添加缺少的括号和分号
};

const message = {
    error: (msg, callback) => {
        showMessage(msg, callback, "error");
    },
    success: (msg, callback) => {
        showMessage(msg, callback, "success");
    },
    warning: (msg, callback) => {
        showMessage(msg, callback, "warning");
    },
};

export default message;