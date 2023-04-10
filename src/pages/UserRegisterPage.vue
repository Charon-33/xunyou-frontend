<template>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="userAccount"
            name="userAccount"
            label="账号"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入账号' }]"
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
        />
        <van-field
            v-model="checkCode"
            name="checkCode"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请填写验证码' }]"
            @change="confirmCheckCode()"
        />
      </van-cell-group>
      <div style="margin-left: 15px; margin-top: 5px">
        <img id="checkCodeImg" @click="changeCode()" :src="getVerifyCode" style="width: 100px; margin-right: 10px" alt="点击刷新验证码">
        <van-icon v-if="isCorrectCode === 'true'" size="2rem" :name="correctImg" />
      </div>

      <div style="margin: 16px;">
        <van-button plain hairline round block type="primary" to="/user/login">
          已有账号？立即登录
        </van-button>
      </div>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          注册
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
const userAccount = ref('');
const userPassword = ref('');
const checkPassword = ref('');
const checkCode = ref('');
let isCorrectCode = ref('false');
let getVerifyCode = ref('')

onMounted(()=>{
  getVerifyCode.value = 'http://localhost:8080/api/user/checkcode?t=' + new Date().getTime()
})
const changeCode = () =>{
  getVerifyCode.value = 'http://localhost:8080/api/user/checkcode?t=' + new Date().getTime()
  console.log("更换了验证码")
}
const confirmCheckCode = async ()=>{
  // v-show 不支持在 <template> 元素上使用，也不能和 v-else 搭配使用。
  isCorrectCode.value = "false";
  console.log("隐藏校对结果图片", isCorrectCode.value)
  const res = await myAxios.post('/user/check?codeClient=' + checkCode.value)
  console.log("校对验证码结果：",res)
  if(res){
    isCorrectCode.value = "true";
  }
  console.log("显示校对结果图片", isCorrectCode.value)
}

const onSubmit = async () => {
  const res = await myAxios.post('/user/register', {
        userAccount: userAccount.value,
        userPassword: userPassword.value,
        checkPassword: checkPassword.value,
        checkCode: checkCode.value,
      })
  console.log("注册响应",res);
  if (res.code === 0) {
    Toast.success('注册成功！赶快去登录吧！');
    // 跳转到之前的页面
    const redirectUrl = route.query?.redirect as string ?? '/user/login';
    window.location.href = redirectUrl;
  } else {
    Toast.fail('注册失败！' + res.description);
  }
};
</script>

<style scoped>

</style>