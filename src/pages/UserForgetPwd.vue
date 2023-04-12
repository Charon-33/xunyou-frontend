<template>
    <van-field v-model="forgetEmail" label="邮箱" placeholder="请输入邮箱"/>
    <van-field
            v-model="checkCode"
            name="checkCode"
            label="验证码"
            placeholder="请输入验证码"
            @change="fun_isCorrectCode"
            :rules="[{ required: true, message: '请填写验证码' }]"
    />
    <div style="position: relative">
        <van-button plain round :disabled=isNotShowCheckCode type="primary" @click="click_checkCode"
                    style="margin-left: 10px">
            {{ textReg }}
            <van-count-down style="display: inline; color: #1989fa" v-if="isShowTime" @finish="timeFinish"
                            millisecond :time="time" format="ss"/>
        </van-button>
        <van-icon style="position: absolute; bottom: 7px; margin-left: 5px" v-if="isCorrectCode === 'true'" size="2rem" :name="correctImg" />
    </div>

    <van-field v-model="newPwd" label="新密码：" type="password" placeholder="请输入新密码"/>
    <van-field v-model="conNewPwd" label="确认新密码：" type="password" placeholder="请再次输入新密码"
               @change="fun_conNewPwd"/>
    <van-button round block type="primary" @click="submit">
        提交
    </van-button>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";
import {Toast} from "vant";
import myAxios from "../plugins/myAxios";
import {useRouter} from "vue-router";
import correctImg from "../assets/correct.png";

const router = useRouter();
let currentUser = ref([])
let forgetEmail = ref("")
let checkCode = ref("")
let textReg = ref("获取验证码")
let isNotShowCheckCode = ref(true)
let isShowTime = ref(false)
const time = ref(60000)
let isCorrectCode = ref('false');

let newPwd = ref("")
let conNewPwd = ref("")
let noConfirm = ref(false)

onMounted(async () => {
    currentUser.value = await getCurrentUser();
})

const click_checkCode = async () => {
    // opt为0是告诉后端，此次获取验证码是找回密码
    const res = await myAxios.get('/user/sentcheckcode', {
        params: {
            mail: forgetEmail.value,
            opt: 0,
        },
    })
    isNotShowCheckCode.value = true
    isShowTime.value = true
    textReg.value = "重新获取"
}
const timeFinish = () => {
    isNotShowCheckCode.value = false
    isShowTime.value = false
}

const fun_conNewPwd = () => {
    if (newPwd.value !== conNewPwd.value) {
        Toast.fail('两次新密码输入不一致！');
        noConfirm.value = true
    }
}

const fun_isCorrectCode = async ()=>{
    // 校对验证码
    const res = await myAxios.post('/user/resetPwtCheckCode?resetPwdCheckCode=' + checkCode.value)
    if (res.description === "验证码错误或已过期") {
        Toast.fail("验证码错误或已过期")
        isCorrectCode.value = "false";
    }else{
        isCorrectCode.value = "true";
    }
}

const submit = async () => {
    if(isCorrectCode.value === "true"){
        // 验证码正确时运行
        const res2 = await myAxios.post('/user/update', {
            'id': currentUser.value.id,
            userPassword: conNewPwd.value,
        })
        if (res2.code === 0 && res2.data > 0) {
            Toast.success('修改成功');
            router.back
        } else {
            Toast.fail('修改失败');
        }
    }else{
        Toast.fail("验证码错误或已过期")
    }
}

</script>

<style scoped>

</style>