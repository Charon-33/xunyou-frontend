<template>
    <van-search
            v-model="searchText"
            show-action
            placeholder="请输入要搜索的内容"
            @cancel="onCancel"
            @change="change"
    />
    <van-tabs v-model:active="active" @click-tab="change">
        <van-tab title="用户名" name="username" >
            <user-card-list :user-list="userNameList" :loading="loading"/>
            <van-loading v-if=showLoading size="48px" vertical style="margin-top: 80px">搜索中...</van-loading>
            <van-empty v-if="!userNameList || userNameList.length < 1 && !showLoading" description="找不到这个用户" />
        </van-tab>
        <van-tab title="标签" name="tag" >
            <user-card-list :user-list="userTagsList" :loading="loading"/>
            <van-loading v-if=showLoading size="48px" vertical style="margin-top: 80px">搜索中...</van-loading>
            <van-empty v-if="!userTagsList || userTagsList.length < 1 && !showLoading" description="找不到含这个标签的用户" />
        </van-tab>
        <van-tab title="队伍名" name="teamname" >
            <team-card-list :teamList="teamList" />
            <van-loading v-if=showLoading size="48px" vertical style="margin-top: 80px">搜索中...</van-loading>
            <van-empty v-if="!teamList || teamList.length < 1 && !showLoading" description="找不到这个队伍" />
        </van-tab>
    </van-tabs>
</template>

<script setup lang="ts">

import {ref} from 'vue';
import {useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";
import TeamCardList from "../components/TeamCardList.vue";

const router = useRouter()
let searchText = ref("");
const userNameList = ref([]);
const userTagsList = ref([]);
const teamList = ref([]);
let active = ref("user");
let loading = ref(true);
let showLoading = ref(true)

const change = async ()=>{
    console.log("搜索的内容：",searchText.value)
    // 当搜索内容不为空时
    if (searchText.value !== ""){
        loading.value = true;
        showLoading.value = true;
        if(active.value === "username"){
            // 当搜索的是用户名时
            userNameList.value = []
            const res = await myAxios.get('/user/search/username' ,{
                params: {
                    username: searchText.value
                },
            })
            if (res) {
                res.data.forEach((user: UserType) => {
                    if (user.tags) {
                        user.tags = JSON.parse(user.tags);
                    }
                })
                userNameList.value = res.data
                console.log("用户名查找结果：", res.data)
            }else{
                console.log("查找失败")
            }
        }else if(active.value === "tag"){
            // 当搜索的是标签时
            userTagsList.value = []
            const searchTag = searchText.value.toLowerCase()
            const res = await myAxios.get('/user/search/tags' ,{
                params: {
                    tagNameList: searchTag
                },
            })
            if (res) {
                res.data.forEach((user: UserType) => {
                    if (user.tags) {
                        user.tags = JSON.parse(user.tags);
                    }
                })
                userTagsList.value = res.data
                console.log("标签查找结果：", res.data)
            }else{
                console.log("查找失败")
            }
        }else{
            // 当搜索的内容是队伍时
            teamList.value = []
            const res = await myAxios.get("/team/list", {
                params: {
                    searchText: searchText.value,
                },
            });
            if (res) {
                teamList.value = res.data
                console.log("队伍查找结果：", res.data)
            }else{
                console.log("查找失败")
            }
        }
        loading.value = false;
        showLoading.value = false;
    }
}
const onCancel = () => {
    router.back();
};

</script>

<style scoped>

</style>