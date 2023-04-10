<template>
    <van-image
            width="100%"
            height="10rem"
            fit="cover"
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    />
    <div v-if="user" style="transform: translateY( -60px)">
        <div style="text-align: center; margin: 5px">
            <van-image
                    round
                    width="7rem"
                    height="7rem"
                    fit="cover"
                    :src="user.avatarUrl"
            />
        </div>
        <van-cell title="当前用户" :value="user?.username"/>
        <van-cell title="修改信息" is-link to="/user/update"/>
        <!--    <van-cell title="我创建的队伍" is-link to="/user/team/create" />-->
        <!--    <van-cell title="我加入的队伍" is-link to="/user/team/join" />-->
    </div>

    <div style="margin: 16px;">
        <van-button round block type="primary" @click="logout">
            退出登录
        </van-button>
    </div>

</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

const user = ref();
const router = useRouter();

onMounted(async () => {
    user.value = await getCurrentUser();
})

const logout = async () => {
    await myAxios.post('/user/logout')
    window.location.href = '/user/login';
    Toast.success('您已退出登录');
}

const toEdit = (editKey: string, editName: string, currentValue: string) => {
    router.push({
        path: '/user/edit',
        query: {
            editKey,
            editName,
            currentValue,
        }
    })
}
</script>

<style scoped>

</style>
