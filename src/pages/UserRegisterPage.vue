<template>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field
                    v-model="userName"
                    name="userName"
                    label="昵称"
                    placeholder="请输入昵称"
                    :rules="[{ required: true, message: '请输入昵称' }]"
            />
            <van-field
                    v-model="userMail"
                    name="userMail"
                    label="邮箱"
                    placeholder="请输入邮箱"
                    :rules="[{ required: true, message: '请输入邮箱' }]"
            />
            <van-field
                    v-model="userPassword"
                    type="password"
                    name="userPassword"
                    label="密码"
                    placeholder="请输入密码"
                    :rules="[{ required: true, message: '请输入密码' }]"
            />
            <van-field
                    v-model="checkPassword"
                    type="password"
                    name="userConfirmPassword"
                    label="确认密码"
                    placeholder="请再次输入密码"
                    :rules="[{ required: true, message: '请再次输入密码' }]"
                    @change="confirmPwd"
            />
            <van-field
                    v-model="checkCode"
                    name="checkCode"
                    label="验证码"
                    placeholder="请输入验证码"
                    :rules="[{ required: true, message: '请填写验证码' }]"
            />
        </van-cell-group>
        <van-button plain round :disabled=isShowCheckCode type="primary" @click="click_checkCode"
                    style="margin-left: 20px">
            {{ textReg }}
            <van-count-down style="display: inline; color: #1989fa" v-if="isShowCheckCode" @finish="timeFinish"
                            millisecond :time="time" format="ss"/>
        </van-button>

        <div style="margin: 16px;">
            <van-button plain hairline round block type="primary" to="/user/login">
                已有账号？立即登录
            </van-button>
        </div>

        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
                注册并登录
            </van-button>
        </div>
    </van-form>
</template>


<script setup lang="ts">
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {useRoute, useRouter} from "vue-router";
import correctImg from "../assets/correct.png"

const router = useRouter();
const route = useRoute();
let userName = ref("")
let userMail = ref("")
const userPassword = ref('');
const checkPassword = ref('');
const checkCode = ref('');

const time = ref(60000)
let isShowCheckCode = ref(false)
let textReg = ref("获取验证码")

const click_checkCode = async () => {
    const re = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$");
    console.log("校验邮箱是否合法：", re.test(userMail.value))
    if(re.test(userMail.value)){
        isShowCheckCode.value = true
        textReg.value = "重新获取"

        // opt为1是告诉后端，此次获取验证码是用于注册
        const res = await myAxios.get('/user/sentcheckcode', {
            params: {
                mail: userMail.value,
                opt: 1,
            },
        })
        if(res.description === "该邮箱已注册！"){
            Toast.fail(res.description)
            isShowCheckCode.value = false
            textReg.value = "获取验证码"
        }

    }else{
        Toast.fail('请输入正确的邮箱！')
    }
}
const timeFinish = () => {
    isShowCheckCode.value = false
}

const confirmPwd = ()=>{
    // 两次输入的密码是否一致后端已有校验
    // if(userPassword.value !== checkPassword.value){
    //     Toast.fail("两次输入的密码不一致")
    // }
}

const onSubmit = async () => {
    const res = await myAxios.post('/user/register', {
        userName: userName.value,
        email: userMail.value,
        userPassword: userPassword.value,
        checkPassword: checkPassword.value,
        checkCode: checkCode.value,
    })
    console.log("注册响应", res.data);
    if (res.code === 0) {
        Toast.success('注册并登录成功！');

        const res2 = await myAxios.post('/user/login', {
            userEmail: userMail.value,
            userPassword: userPassword.value,
            checkCode: res.data,
        })

        // 跳转到之前的页面
        const redirectUrl = route.query?.redirect as string ?? '/';
        window.location.href = redirectUrl;

    } else {
        Toast.fail('注册失败！' + res.description);
    }
};
</script>

<style scoped>

</style>