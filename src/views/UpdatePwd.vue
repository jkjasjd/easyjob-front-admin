<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.show = false">

      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <!-- 输入新密码 -->
        <el-form-item label="新密码" prop="password">
          <el-input show-password type="password" size="large" clearable placeholder="请输入新密码"
              v-model.trim="formData.password">
            <template #prefix>
              <i class="iconfont icon-password"></i>
            </template>
          </el-input>
        </el-form-item>

        <!-- 输入确认密码 -->
        <el-form-item label="确认密码" prop="rePassword">
          <el-input show-password type="password" size="large" clearable placeholder="请再次输入密码"
              v-model.trim="formData.rePassword">
            <template #prefix>
              <i class="iconfont icon-password"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";

// 密码校验规则
const checkRePassword = (rule, value, callback) => {
  if (value !== formData.password) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const { proxy } = getCurrentInstance();

// 接口地址
const api = {
  updateMyPwd: '/api/updateMyPwd',
};

// 弹窗配置
const dialogConfig = reactive({
  show: false,
  title: "修改密码",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        save();
      },
    },
  ],
});

// 表单数据
const formData = reactive({
  password: '',
  rePassword: '',
});

// 表单引用
const formDataRef = ref();

// 表单验证规则
const rules = {
  password: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: '密码只能是数字，字母，特殊字符，8-18位',
    },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: checkRePassword,
      message: '两次密码输入不一致',
    },
  ],
};

// 显示弹窗并重置表单
const show = () => {
  dialogConfig.show = true;
  nextTick(() => {
    // 重置表单数据
    formData.password = '';
    formData.rePassword = '';
    formDataRef.value.resetFields(); // 重置表单字段
  });
};

// 暴露给父组件调用
defineExpose({
  show,
});

// 保存密码
const save = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = { ...formData }; // 通过解构获取表单数据
    const result = await proxy.Request({
      url: api.updateMyPwd,
      params,
    });
    if (!result) {
      return;
    }
    proxy.Message.success('密码修改成功');
    dialogConfig.show = false;
  });
};
</script>

<style lang="scss" scoped>
/* 你可以在这里添加样式 */
</style>
