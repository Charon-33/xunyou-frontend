<template>
    <van-image
            width="100%"
            height="10rem"
            fit="cover"
            :src="userBg"
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
        <van-cell title="昵称" is-link to="/user/edit" :value="user.username"
                  @click="toEdit('username', '昵称', user.username)"/>
        <van-cell title="账号" :value="user.id"/>
        <van-cell title="头像" is-link to="/user/edit" @click="toEdit('avatarUrl', '头像', user.avatarUrl)">

        </van-cell>
        <van-cell title="性别" is-link :value="user.gender" @click="toEdit('gender', '性别', user.gender)"/>
        <van-cell title="电话" is-link to="/user/edit" :value="user.phone"
                  @click="toEdit('phone', '电话', user.phone)"/>
        <van-cell title="邮箱" is-link to="/user/edit" :value="user.email"
                  @click="toEdit('email', '邮箱', user.email)"/>
        <van-cell title="标签" is-link to="/user/edit" @click="toEdit('tags', '标签', user.tags)">
            <van-tag plain type="danger" v-for="tag in JSON.parse(user.tags)"
                     style="margin-right: 8px; margin-top: 8px">
                {{ tag }}
            </van-tag>
        </van-cell>
        <van-cell title="注册时间" :value="user.createTime"/>
    </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";
import userBg from "../assets/userBg.jpg";

let user = ref();

onMounted(async () => {
    user.value = await getCurrentUser();
})

const router = useRouter();

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