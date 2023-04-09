<template>
    <van-search
            v-model="searchText"
            show-action
            placeholder="请输入要搜索的内容"
            @cancel="onCancel"
    />
    <van-tabs v-model:active="active">
        <van-tab title="用户" name="user" @click="change">内容 1</van-tab>
        <van-tab title="标签" name="tag">内容 2</van-tab>
        <van-tab title="队伍" name="team">内容 3</van-tab>
    </van-tabs>
</template>

<script setup lang="ts">

import {ref} from 'vue';
import {useRouter} from "vue-router";

const router = useRouter()
let searchText = ref("");

const active = ref("");
const change = ()=>{
    if(active.value === "user"){

    }else if(active.value === "tag"){

    }else{

    }
}
const onCancel = () => {
    router.back();
};


</script>

<style scoped>

</style>