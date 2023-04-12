<template>
    <van-image
            width="100%"
            height="13rem"
            fit="cover"
            :src="teamBg"
    />
    <div style="transform: translateY( -60px)">
        <div style="text-align: center; margin: 5px">
            <van-image
                    round
                    width="7rem"
                    height="7rem"
                    fit="cover"
                    :src="ikun"
            />
        </div>
        <div style="text-align: center; margin: 10px; font-size: 1.5rem">
            {{ teamDetails[0].name }}
            <van-tag plain type="danger" style=" margin-left: 8px;">
                {{ teamStatusEnum[teamDetails[0].status] }}
            </van-tag>
        </div>

        <div style="color: #969799;text-align: center; margin-bottom: 10px">
            {{ teamDetails[0].id }}
        </div>
        <div style="background-color: #f2f3f5; width: 100%; height: 10px;"></div>
        <div style="margin: 20px">
            群简介
            <span style="display: block; margin: 10px; color: #969799">{{ teamDetails[0].description }}</span>
        </div>
        <div style="margin: 20px">
            过期时间
            <span style="float: right">{{ teamDetails[0].expireTime }}</span>
        </div>
        <div style="margin: 20px">
            群成员（ {{ teamDetails[0].hasJoinNum }} / {{ teamDetails[0].maxNum }} ）
            <div style="display: inline; float: right" v-for="(item,index) in userList.slice(0,6)" :key="index">
                <van-image
                        round
                        width="1.5rem"
                        height="1.5rem"
                        fit="cover"
                        :src="item.avatarUrl"
                />
            </div>
        </div>
        <van-collapse v-model="activeNames" style="margin: 5px;">
            <van-collapse-item title="查看所有成员" name="1">
                <user-card-list :user-list="userList" :loading="loading"/>
            </van-collapse-item>
        </van-collapse>
    </div>

    <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button @confirm="doJoinTeam"
                @cancel="doJoinCancel">
        <van-field v-model="password" placeholder="请输入密码"/>
    </van-dialog>

    <div style="margin: 10px; text-align: right">
        <van-sticky :offset-bottom="55" position="bottom">
<!--            <van-button type="primary" style="margin-right: 5px">加入队伍</van-button>-->
<!--            <van-button type="primary" style="margin-right: 5px">更新队伍</van-button>-->
<!--            <van-button type="primary" style="margin-right: 5px">解散队伍</van-button>-->
<!--            <van-button type="primary">退出队伍</van-button>-->

            <van-button style="margin-right: 10px" size="normal" type="primary" v-if="teamDetails[0].userId !== currentUser?.id && !teamDetails[0].hasJoin" plain
                        @click="preJoinTeam(teamDetails[0])">
                加入队伍
            </van-button>
            <van-button style="margin-right: 10px" v-if="teamDetails[0].userId === currentUser?.id" size="normal" type="primary" plain
                        @click="doUpdateTeam(teamDetails[0].id)">更新队伍
            </van-button>
            <!-- 仅加入队伍可见 -->
            <van-button style="margin-right: 10px" v-if="teamDetails[0].userId !== currentUser?.id && teamDetails[0].hasJoin" size="normal" type="danger" plain
                        @click="doQuitTeam(teamDetails[0].id)">退出队伍
            </van-button>
            <van-button v-if="teamDetails[0].userId === currentUser?.id" size="normal" type="danger" plain
                        @click="doDeleteTeam(teamDetails[0].id)">解散队伍
            </van-button>
        </van-sticky>
    </div>

</template>

<script setup lang="ts">
import {onBeforeMount, ref} from 'vue';
import myAxios from "../plugins/myAxios";
import {useRoute, useRouter} from "vue-router";
import moment from "moment/moment";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";
import {getCurrentUser} from "../services/user";
import {TeamType} from "../models/team";
import {Toast} from "vant";
import {teamStatusEnum} from "../constants/team";
import teamBg from "../assets/teamBg.png"
import ikun from "../assets/ikun.png"

const route = useRoute();
let teamDetails = ref([])
let userList = ref([])
const activeNames = ref(['0'])
let loading = ref(true)
const currentUser = ref();
const showPasswordDialog = ref(false);
const password = ref('');
const joinTeamId = ref(0);
const router = useRouter();

onBeforeMount(async () => {
    currentUser.value = await getCurrentUser();
    //查找队伍的详细信息
    console.log("队伍的id：", route.query.teamId)
    const res = await myAxios.get("/team/list", {
        params: {
            id: route.query.teamId
        }
    })
    teamDetails.value = res.data;
    teamDetails.value[0].expireTime = moment(res.data.createTime).format('yyyy-MM-DD')
    console.log("队伍详情：", teamDetails.value)

    //查找队伍中队员的详细信息
    loading.value = true;
    const res2 = await myAxios.get("/team/list/usersInTeam", {
        params: {
            teamId: route.query.teamId
        }
    })
    res2.data.forEach((user: UserType) => {
        if (user.tags) {
            user.tags = JSON.parse(user.tags);
        }
    })
    userList.value = res2.data
    console.log("用户的数据：", userList.value)
    loading.value = false;
})

const preJoinTeam = (team: TeamType) => {
    joinTeamId.value = team.id;
    if (team.status === 0) {
        doJoinTeam()
    } else {
        showPasswordDialog.value = true;
    }
}

/**
 * 加入队伍
 */
const doJoinTeam = async () => {
    if (!joinTeamId.value) {
        return;
    }
    const res = await myAxios.post('/team/join', {
        teamId: joinTeamId.value,
        password: password.value
    });
    if (res?.code === 0) {
        Toast.success('加入成功');
        doJoinCancel();
        history.go(0)
    } else {
        Toast.fail('加入失败' + (res.description ? `，${res.description}` : ''));
    }
}

const doJoinCancel = () => {
    joinTeamId.value = 0;
    password.value = '';
}

/**
 * 跳转至更新队伍页
 * @param id
 */
const doUpdateTeam = (id: number) => {
    router.push({
        path: '/team/update',
        query: {
            id,
        }
    })
}

/**
 * 退出队伍
 * @param id
 */
const doQuitTeam = async (id: number) => {
    const res = await myAxios.post('/team/quit', {
        teamId: id
    });
    if (res?.code === 0) {
        Toast.success('操作成功');
        location.reload();
    } else {
        Toast.fail('操作失败' + (res.description ? `，${res.description}` : ''));
    }
}

/**
 * 解散队伍
 * @param id
 */
const doDeleteTeam = async (id: number) => {
    const res = await myAxios.post('/team/delete', {
        id,
    });
    if (res?.code === 0) {
        Toast.success('操作成功');
        history.go(0)
    } else {
        Toast.fail('操作失败' + (res.description ? `，${res.description}` : ''));
    }
    router.back()
}

</script>

<style scoped>

</style>