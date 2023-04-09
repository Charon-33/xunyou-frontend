<template>
  <van-cell center title="开始匹配">
    <template #right-icon>
      <van-switch v-model="isMatchMode" size="24" />
    </template>
  </van-cell>
  <user-card-list :user-list="userList" :loading="loading"/>

<!--  &lt;!&ndash; 可以使用 CellGroup 作为容器 &ndash;&gt;-->
<!--  <div v-show="isShow.pageIsShow">-->
<!--    <van-cell-group inset>-->
<!--      <van-field v-model="page.pageSize" label="每页条数"/>-->
<!--      <van-field v-model="page.pageNum" label="页数"/>-->
<!--&lt;!&ndash;      <van-field label="总页数" :model-value = "yeShu.pageYeShu" disabled />&ndash;&gt;-->
<!--      <van-button size="small" type="primary" @click="loadData">确认</van-button>-->
<!--    </van-cell-group>-->
<!--  </div>-->

  <van-empty v-if="!userList || userList.length < 1" description="数据为空"/>

</template>

<script setup lang="ts">
import {reactive, ref, watchEffect} from 'vue';
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";

const isMatchMode = ref<boolean>(false);

const userList = ref([]);
const loading = ref(true);

let totalItems = 0;
let page = reactive({pageSize:10,pageNum:1})
let yeShu = reactive({pageYeShu:0});
let isShow = reactive({pageIsShow:true});

/**
 * 加载数据
 */
const loadData = async () => {
  let userListData;
  loading.value = true;
  // 根据标签匹配用户
  if (isMatchMode.value) {
    isShow.pageIsShow = false;
    console.log("是否显示页数：", isShow.pageIsShow)

    const num = 10;
    userListData = await myAxios.get('/user/match', {
      params: {
        num,
      },
    })
        .then(function (response) {
          console.log('/user/match succeed', response);
          return response?.data;
        })
        .catch(function (error) {
          console.error('/user/match error', error);
          Toast.fail('请求失败');
        })
  } else {
    // 普通模式，直接分页查询用户
    // 查总共多少条数据
    const num = await myAxios.get('/user/totalItems')
    totalItems = num.data;
    console.log("总数：",totalItems)
    yeShu.pageYeShu = totalItems/page.pageSize;
    console.log("页数：",yeShu)

    isShow.pageIsShow = true;
    const pageSize = page.pageSize
    const pageNum = page.pageNum
    userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize,
        pageNum,
      },
    })
        .then(function (response) {
          console.log('/user/recommend succeed', response);
          return response?.data?.records;
        })
        .catch(function (error) {
          console.error('/user/recommend error', error);
          Toast.fail('请求失败');
        })
  }
  if (userListData) {
    userListData.forEach((user: UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
  loading.value = false;
}

watchEffect(() => {
  loadData();
})

</script>

<style scoped>

</style>
