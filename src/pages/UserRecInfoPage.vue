<template>
  <template v-if="user">
    <van-cell title="昵称" :value="user.username" />
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="头像">
      <img style="height: 48px" :src="user.avatarUrl"/>
    </van-cell>
    <van-cell title="性别" :value="user.gender" />
    <van-cell title="电话" :value="user.phone"/>
    <van-cell title="邮箱" :value="user.email"/>
    <van-cell title="注册时间" :value="user.createTime"/>
  </template>
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
  const res = await myAxios.get('/user/search?userid=' + userid);
  if (res.code === 0) {
    console.log("查看详情用户：",res.data)
    if(res.data[0].gender == 0){
      res.data[0].gender = '女'
    }else{
      res.data[0].gender = '男'
    }
    res.data[0].createTime = moment(res.data[0].createTime).format('yyyy-MM-DD')
    user.value = res.data[0];
  }
})

</script>

<style scoped>

</style>