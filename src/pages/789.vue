<template>
    <div class="mi-captchas">
        <!-- 基础效果 -->
        <mi-captcha ref="captcha" />
        <!-- 手动触发重置 -->
        <a @click="reset">重置</a>
        <!-- 自定义主题色 -->
        <mi-captcha theme-color="#2F9688" border-color="#2F9688" box-shadow-color="#2F9688" />
        <!-- 自定义初始化 / 校验等 -->
        <mi-captcha theme-color="#be6be0" init-action="v1/captcha/init" @init="initAfter" verify-action="v1/captcha/verification" :verify-params="params.verify" />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const captcha = ref(null)
const params = reactive( { verify: { key: null } })
const initAfter = (res) => {
    if (res?.ret?.code === 200) {
        localStorage.setItem('mi-captcha-key', res?.data?.key)
        params.verify.key = res?.data?.key
    }
}
const reset = () => {
    console.log('reinitialize')
    captcha.value?.reset(false)
}
</script>

<style scoped>

</style>

