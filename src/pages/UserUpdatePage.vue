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
<!--            <van-uploader-->
<!--                    v-model="fileList"-->
<!--                    :max-count="1"-->
<!--                    :after-read="afterRead"-->
<!--            />-->
<!--            <div style="font-size: 13px; color: #969799 ">点击图片可更换图片</div>-->
        </div>
        <van-cell title="昵称" is-link to="/user/edit" :value="user.username"
                  @click="toEdit('username', '昵称', user.username)"/>
        <van-cell title="账号" :value="user.id"/>
        <van-cell title="头像" is-link to="/user/edit" @click="toEdit('avatarUrl', '头像', user.avatarUrl)"/>
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
import axios from "axios";
import {UserType} from "../models/user";
import {Toast} from "vant";
import myAxios from "../plugins/myAxios";

const router = useRouter();

const user = ref<UserType>();
const fileList = ref([])

onMounted(async () => {
    user.value = await getCurrentUser();
    fileList.value = [
        {
            url: user.value.avatarUrl,
        }
    ]
})

// 图床用户了，暂时不能用这个功能
// const afterRead = (file) => {
//     console.log("上传图片后", file.file)
//     // 创建表单数据对象
//     let formData = new FormData();
//     // 添加图片文件
//     formData.append("smfile", file.file);
//     // 发送 POST 请求到 sm.ms 的 API 地址
//     axios.post("/imgUp/upload", formData, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//             "Authorization": "g2mGk3t0SYEoU1DYbf6DFqt45MXHZT1C",
//         },
//     })
//         .then(async (res) => {
//             // 处理响应数据
//             if (res.data.success) {
//                 let imgUrl = res.data.data.url;
//                 console.log("上传到图床的url：", imgUrl)
//                 // 将信息传给后端执行更新
//                 const update = await myAxios.post('/user/update', {
//                     'id': user.value.id,
//                     // 动态生成
//                     avatarUrl: imgUrl,
//                 })
//                 if (update.code === 0 && update.data > 0) {
//                     Toast.success('修改成功');
//                 } else {
//                     Toast.fail('修改失败');
//                 }
//             } else {
//                 Toast.fail("图片上传失败")
//             }
//         })
//         .catch((err) => {
//             // 处理异常情况
//             Toast.fail("上传失败", err.message);
//             console.log("上传失败", err.message);
//         });
// }

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