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
        <van-cell title="昵称" :value="user.username"/>
        <van-cell title="账号" :value="user.userAccount"/>
        <van-cell title="性别" :value="user.gender"/>
        <van-cell title="电话" :value="user.phone"/>
        <van-cell title="邮箱" :value="user.email"/>
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
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import myAxios from "../plugins/myAxios";
import moment from "moment/moment";

const route = useRoute();

let user = ref();
onMounted(async () => {
    const userid = route.query.userid;
    const res = await myAxios.get('/user/search/userid?userid=' + userid);
    if (res.code === 0) {
        console.log("查看详情用户：", res.data)
        if (res.data[0].gender == 0) {
            res.data[0].gender = '女'
        } else {
            res.data[0].gender = '男'
        }
        res.data[0].createTime = moment(res.data[0].createTime).format('yyyy-MM-DD')
        user.value = res.data[0];
    }
})

</script>

<style scoped>

</style>