<template>
  <van-skeleton title avatar :row="3" :loading="props.loading" v-for="user in props.userList">
    <van-card
        :desc="user.profile"
        :title="`${user.username}`"
        :thumb="user.avatarUrl"
        is-link to="/user/recInfo"
        @click="toInfo(user.id)"
    >
      <template #tags>
        <van-tag plain type="danger" v-for="tag in user.tags" style="margin-right: 8px; margin-top: 8px">
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
<!--        <van-button size="mini">联系我</van-button>-->
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import {useRouter} from "vue-router";
import internal from "stream";
const router = useRouter();
interface UserCardListProps {
  loading: boolean;
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,
  // @ts-ignore
  userList: [] as UserType[],
});

const toInfo = (userid: string) => {
  router.push({
    path: '/user/recInfo',
    query: {
      userid,
    }
  })
}

</script>

<style scoped>

</style>
