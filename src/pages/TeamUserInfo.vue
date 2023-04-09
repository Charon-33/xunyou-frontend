<template>
<user-card-list :user-list="userList" :loading="loading"></user-card-list>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watchEffect} from 'vue';
import myAxios from "../plugins/myAxios";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";
import {useRoute} from "vue-router";
const route = useRoute();
const userList = ref([]);
const loading = ref(true);
let page = reactive({pageSize:10,pageNum:1})

/**
 * 加载数据
 */
onMounted(async () => {
  let teamUserList;
  loading.value = true;
  console.log("队伍的id：",route.query.teamId)
  // teamUserList = await myAxios.get('/team/list/userTeamInfo?teamId=' + route.query.teamId);
  // let usersId = teamUserList.data.userid
  console.log("用户们的id：",teamUserList)
  // if (userListData) {
  //   userListData.forEach((user: UserType) => {
  //     if (user.tags) {
  //       user.tags = JSON.parse(user.tags);
  //     }
  //   })
  //   userList.value = userListData;
  // }
  loading.value = false;
})
</script>

<style scoped>

</style>