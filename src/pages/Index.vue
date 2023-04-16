<template>
  <!--    <van-swipe class="my-swipe" :autoplay="3000" lazy-render>-->
  <!--        <van-swipe-item v-for="image in images" :key="image">-->
  <!--            <div >-->
  <!--                <img :src="image" style="width: 100%;"/>-->
  <!--            </div>-->
  <!--        </van-swipe-item>-->
  <!--    </van-swipe>-->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>理性交友</van-swipe-item>
        <van-swipe-item>广告位招租</van-swipe-item>
        <van-swipe-item>广告位招租</van-swipe-item>
    </van-swipe>

    <van-cell center title="根据您设置的标签，以下是与您相匹配的10位伙伴哦！" >
<!--        <template #right-icon>-->
<!--            <van-switch v-model="isMatchMode" size="24"/>-->
<!--        </template>-->
<!--        <van-button plain type="primary">刷新</van-button>-->
    </van-cell>
    <user-card-list :user-list="userList" :loading="loading" v-if="user.tags !== '[]'"/>

  <!--  &lt;!&ndash; 可以使用 CellGroup 作为容器 &ndash;&gt;-->
  <!--  <div v-show="isShow.pageIsShow">-->
  <!--    <van-cell-group inset>-->
  <!--      <van-field v-model="page.pageSize" label="每页条数"/>-->
  <!--      <van-field v-model="page.pageNum" label="页数"/>-->
  <!--&lt;!&ndash;      <van-field label="总页数" :model-value = "yeShu.pageYeShu" disabled />&ndash;&gt;-->
  <!--      <van-button size="small" type="primary" @click="loadData">确认</van-button>-->
  <!--    </van-cell-group>-->
  <!--  </div>-->

      <van-empty v-if="user.tags === '[]'" description="您还没有设置标签哦！赶快设置标签来匹配伙伴吧！"/>

</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watchEffect} from 'vue';
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";
import {getCurrentUser} from "../services/user";

// const isMatchMode = ref<boolean>(true);

const userList = ref([]);
const loading = ref(true);
const images = [
    'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
];

let totalItems = 0;
let page = reactive({pageSize: 10, pageNum: 1})
let yeShu = reactive({pageYeShu: 0});
let isShow = reactive({pageIsShow: true});
const user = ref([]);
/**
 * 加载数据
 */
const loadData = async () => {
    let userListData;
    loading.value = true;
    // 根据标签匹配用户
    // if (isMatchMode.value) {
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
    // } else {
    //     console.log("关闭匹配模式")
    //     userList.value = []
        // 普通模式，直接分页查询用户
        // 查总共多少条数据
        // const num = await myAxios.get('/user/totalItems')
        // totalItems = num.data;
        // console.log("总数：",totalItems)
        // yeShu.pageYeShu = totalItems/page.pageSize;
        // console.log("页数：",yeShu)
        //
        // isShow.pageIsShow = true;
        // const pageSize = page.pageSize
        // const pageNum = page.pageNum
        // userListData = await myAxios.get('/user/recommend', {
        //   params: {
        //     pageSize,
        //     pageNum,
        //   },
        // })
        //     .then(function (response) {
        //       console.log('/user/recommend succeed', response);
        //       return response?.data?.records;
        //     })
        //     .catch(function (error) {
        //       console.error('/user/recommend error', error);
        //       Toast.fail('请求失败');
        //     })
    // }
    if (userListData) {
        userListData.forEach((user: UserType) => {
            if (user.tags) {
                user.tags = JSON.parse(user.tags);
            }
        })
        userList.value = userListData;
        // console.log("首页查找结果：", userList.value )
    }
    loading.value = false;
}

watchEffect(() => {
    loadData();
})

onMounted(async () => {
    user.value = await getCurrentUser();

    // console.log("当前的用户信息：",user.value)
})

</script>

<style scoped>
.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
}
</style>
