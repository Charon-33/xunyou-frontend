<template>
    <van-field
            v-model="resetPwdEmail"
            name="resetPwdEmail"
            placeholder="请输入邮箱"
            @change="conEmail"
            :rules="[{ required: true, message: '请填写邮箱' }]"
    >
        <template #button>
            <span style="display: inline" class="iconify" data-icon="material-symbols:mail-outline"></span>
        </template>
    </van-field>
    <van-field
            v-model="checkCode"
            name="checkCode"
            placeholder="请输入验证码"
            @change="fun_isCorrectCode"
            :rules="[{ required: true, message: '请填写验证码' }]"
    >
        <template #button>
            <div style="position: relative">
                <van-icon style="position: absolute; bottom: 7px; right: 110px" v-if="isCorrectCode === 'true'"
                          size="2rem" :name="correctImg"/>
                <van-button :disabled=isNotShowCheckCode type="primary" @click="click_checkCode"
                            style="margin-left: 10px">
                    {{ textReg }}
                    <van-count-down style="display: inline; color: #ffffff" v-if="isShowTime" @finish="timeFinish"
                                    millisecond :time="time" format="ss"/>
                </van-button>
            </div>
        </template>
    </van-field>

    <van-field v-model="newPwd" type="password" placeholder="请输入新密码">
        <template #button>
            <span class="iconify" data-icon="mdi:password-outline"></span>
        </template>
    </van-field>
    <van-field v-model="conNewPwd" type="password" placeholder="请再次输入新密码"
               @change="fun_conNewPwd"
    >
        <template #button>
            <span class="iconify" data-icon="mdi:password-check-outline"></span>
        </template>
    </van-field>
    <div style="margin: 16px;">
        <van-button round block type="primary" @click="submit" style="">
            提交
        </van-button>
    </div>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";
import {Toast} from "vant";
import myAxios from "../plugins/myAxios";
import {useRouter} from "vue-router";
import correctImg from "../assets/correct.png";

const router = useRouter();
let resetPwdEmail = ref("")
let checkCode = ref("")
let textReg = ref("获取验证码")
let isNotShowCheckCode = ref(true)
let isShowTime = ref(false)
const time = ref(60000)
let isCorrectCode = ref('false');

let newPwd = ref("")
let conNewPwd = ref("")
let noConfirm = ref(false)

const click_checkCode = async () => {
    // opt为0是告诉后端，此次获取验证码是找回密码
    const res = await myAxios.get('/user/code/send', {
        params: {
            mail: resetPwdEmail.value,
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
const conEmail = () => {
    const re = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$");
    if (re.test(resetPwdEmail.value)) {
        isNotShowCheckCode.value = false
    } else {
        isNotShowCheckCode.value = true
        Toast.fail("请输入正确的邮箱！")
    }
}
const fun_conNewPwd = () => {
    if (newPwd.value !== conNewPwd.value) {
        Toast.fail('两次新密码输入不一致！');
        noConfirm.value = true
    }
}

const fun_isCorrectCode = async () => {
    // 校对验证码
    const res = await myAxios.get('/user/code/check?codeCheck=' + checkCode.value
        + "&email=" + resetPwdEmail.value)
    if (res.description === "验证码错误或已过期") {
        Toast.fail("验证码错误或已过期")
        isCorrectCode.value = "false";
    } else {
        isCorrectCode.value = "true";
    }
}

const submit = async () => {
    if (isCorrectCode.value === "true") {
        // 验证码正确时运行
        const res2 = await myAxios.post('/user/update?opt=1', {
            email: resetPwdEmail.value,
            userPassword: conNewPwd.value,
        })
        if (res2.code === 0 && res2.data > 0) {
            Toast.success('修改成功');
            router.back()
        } else {
            Toast.fail('修改失败');
        }
    }else{
        Toast.fail("请输入正确的验证码")
    }
}

</script>

<style scoped>

</style>