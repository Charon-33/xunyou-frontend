<template>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field
                    v-model="userEmail"
                    name="userEmail"
                    placeholder="请输入邮箱"
                    :rules="[{ required: true, message: '请输入邮箱' }]"
            >
                <template #button>
                    <span style="display: inline" class="iconify" data-icon="material-symbols:mail-outline"></span>
                </template>
            </van-field>

            <van-field
                    v-model="userPassword"
                    type="password"
                    name="userPassword"
                    placeholder="请输入密码"
                    :rules="[{ required: true, message: '请输入密码' }]"
            >
                <template #button>
                    <span class="iconify" data-icon="mdi:password-outline"></span>
                </template>
            </van-field>
            <van-field
                    v-model="checkCode"
                    name="checkCode"
                    placeholder="请输入验证码"
                    :rules="[{ required: true, message: '请输入验证码' }]"
                    @change="confirmCheckCode()">
                <template #button>
                    <img id="checkCodeImg" @click="changeCode()" :src="getVerifyCode"
                         style="width: 100px; margin-right: 10px" alt="点击刷新验证码">
                    <van-icon v-if="isCorrectCode === 'true'" size="2rem" :name="correctImg"/>
                </template>
            </van-field>
            <div style="margin-left: 15px; margin-top: 5px">

                <van-button plain hairline round type="primary" style="float:right;" to="/user/forgetPwd">
                    忘记密码？
                </van-button>
            </div>

        </van-cell-group>
        <div style="margin: 16px;">
            <van-button plain hairline round block type="primary" to="/user/register">
                没有账号？立即注册
            </van-button>
        </div>
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
                登录
            </van-button>
        </div>
    </van-form>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import correctImg from "../assets/correct.png"
import axios from "axios";

// 用于页面跳转
const router = useRouter();
// 用于获取页面信息
const route = useRoute();

const userEmail = ref('');
const userPassword = ref('');
const checkCode = ref('');
let isCorrectCode = ref('false');
// onMounted(async () => {
//     await axios.get('http://localhost:8080/api/user/current').then(result => {
//     //TODO 看一下result有什么信息，然后根据信息，决定是否跳转
//     console.log("mounted", result)
//     if () {
//       // 跳转到之前的页面
//       const redirectUrl = route.query?.redirect as string ?? '/';
//       window.location.href = "/";
//       Toast.success('您已登录！');
//     }
//   })
// })
let getVerifyCode = ref('')
onMounted(() => {
    getVerifyCode.value = 'http://localhost:8080/api/user/checkcode?t=' + new Date().getTime()
    // const res = await myAxios.post('/user/check?codeClient=' + checkCode.value)
})
const changeCode = () => {
    getVerifyCode.value = 'http://localhost:8080/api/user/checkcode?t=' + new Date().getTime()
    console.log("更换了验证码")
}
const confirmCheckCode = async () => {
    // v-show 不支持在 <template> 元素上使用，也不能和 v-else 搭配使用。
    isCorrectCode.value = "false";
    console.log("隐藏校对结果图片", isCorrectCode.value)
    const res = await myAxios.post('/user/check?codeClient=' + checkCode.value)
    console.log("校对验证码结果：", res)
    if (res) {
        isCorrectCode.value = "true";
    }
    console.log("显示校对结果图片", isCorrectCode.value)
}

const onSubmit = async () => {
    const res = await myAxios.post('/user/login', {
        userEmail: userEmail.value,
        userPassword: userPassword.value,
        checkCode: checkCode.value,
    })
    console.log('用户登录', res);
    if (res.code === 0 && res.data) {
        Toast.success('登录成功');

        // 跳转到之前的页面
        const redirectUrl = route.query?.redirect as string ?? '/';
        // 跳转到user.html 页面并清除当前页面的history记录
        window.history.replaceState(null, "");
        window.location.href = redirectUrl;
    } else {
        // @ts-ignore
        Toast.fail('登录失败！' + res.message);
    }
};

</script>

<style scoped>

</style>
