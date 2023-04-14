<template>
    <van-form @submit="onSubmit">
        <div v-if="editUser.editName !== '性别' && editUser.editName !== '标签' && editUser.editName !== '密码'">
            <van-field
                    v-model="editUser.currentValue"
                    :name="editUser.editKey"
                    :label="editUser.editName"
                    :placeholder="`请输入${editUser.editName}`"
            />
        </div>
        <div v-if="editUser.editName === '性别'" style="margin: 10px;">
            <van-radio-group v-model="checked">
                <van-radio name="0" style="margin: 10px;">女</van-radio>
                <van-radio name="1" style="margin: 10px;">男</van-radio>
            </van-radio-group>
        </div>

        <div v-if="editUser.editName === '标签'" style="margin: 10px;">
            <van-field v-model="newTag" label="添加标签：" placeholder="一次输入一个标签"/>
            <van-button round block plain hairline type="primary" native-type="submit">添加</van-button>
            <div style="margin: 15px">
                <span>我的标签：</span>
                <van-tag plain type="danger" v-for="tag in JSON.parse(<string>editUser.currentValue)"
                         style="margin-right: 8px; margin-top: 8px" closeable @close="close(tag)">
                    {{ tag }}
                </van-tag>
            </div>
        </div>
        <div v-if="editUser.editName === '密码'" style="margin: 10px;">
            <van-field v-model="oldPwd" label="原密码：" type="password" placeholder="请输入原密码" @change="conOldPwd"/>
            <van-field v-model="newPwd" label="新密码：" type="password" placeholder="请输入新密码"/>
            <van-field v-model="conNewPwd" label="确认新密码：" type="password" placeholder="请再次输入新密码"
                       @change="fun_conNewPwd"/>
        </div>
        <div style="margin: 16px;" v-if="editUser.editName !== '标签'">
            <div v-if="editUser.editName === '密码'">
                <van-button plain hairline round block type="primary" style="margin-bottom: 10px" to="/user/forgetPwd">
                    忘记原密码？
                </van-button>
            </div>
            <van-button round block :disabled = noConfirm type="primary" native-type="submit">
                确认
            </van-button>
        </div>
    </van-form>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onBeforeMount, onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

const route = useRoute();
const router = useRouter();

let editUser = ref({
    editKey: route.query.editKey,
    currentValue: route.query.currentValue,
    editName: route.query.editName,
})

let newTag = ref("");
let checked = ref("");

let oldPwd = ref("")
let newPwd = ref("")
let conNewPwd = ref("")
let noConfirm = ref(false)

onMounted(() => {
    if (editUser.value.editName === '性别') {
        if (editUser.value.currentValue === '女') {
            editUser.value.currentValue = '0'
        } else {
            editUser.value.currentValue = '1'
        }
        checked.value = editUser.value.currentValue;
    }
    if (editUser.value.editName === '密码') {
        noConfirm.value = true
    }
    if (editUser.value.editName === '标签' && editUser.value.currentValue === null) {
        editUser.value.currentValue = ""
    }
})

const conOldPwd = () => {
    if (oldPwd.value !== editUser.value.editName) {
        Toast.fail('原密码输入错误！');
        noConfirm.value = true
    }
}
const fun_conNewPwd = () => {
    if (newPwd.value !== conNewPwd.value) {
        Toast.fail('两次新密码输入不一致！');
        noConfirm.value = true
    }else if(oldPwd.value === editUser.value.editName){
        noConfirm.value = false
    }
}

const fileList = ref([
    // { url: editUser.value.currentValue },
    // Uploader 根据文件后缀来判断是否为图片文件
    // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
    // { url: 'https://cloud-image', isImage: true },
]);
const close = (tag: any) => {
    // console.log("要删除的标签：", tag)
    let tagsOld = JSON.parse(editUser.value.currentValue)

    console.log("旧标签：", tagsOld)
    // 从JSON中删除指定字段的方法（旧）
    // for (let i = 0; i < tagsOld.length; i++) {
    //     if(tagsOld[i] === tag){
    //         // console.log("找到了：", tagsOld[i])
    //         tagsOld.splice(i,1)
    //     }
    // }

    // 从JSON中删除指定字段的方法（新）
    tagsOld = tagsOld.filter((item: any) => {
        return item !== tag;
    })

    editUser.value.currentValue = JSON.stringify(tagsOld);
    console.log("删除后的标签：", editUser.value.currentValue)
    onSubmit();
};
const onSubmit = async () => {
    let currentUser = await getCurrentUser();
    if (!currentUser) {
        Toast.fail('用户未登录');
        return;
    }
    console.log('当前用户', currentUser)

    // 将修改后的性别代号赋值给当前的value
    if (editUser.value.editKey === 'gender') {
        editUser.value.currentValue = checked.value
    }

    // 将修改后的tag添加到当前的tags
    if (editUser.value.editKey === 'tags' && newTag.value) {
        console.log("新标签：", newTag.value)
        let tagsAdd = [];
        if (editUser.value.currentValue === null) {
            editUser.value.currentValue = ""
        } else {
            tagsAdd = JSON.parse(editUser.value.currentValue);
        }
        newTag.value = newTag.value.toLowerCase()
        tagsAdd.push(newTag.value)
        editUser.value.currentValue = JSON.stringify(tagsAdd)
        newTag.value = "";
    }

    // 将修改后的密码赋值给当前的value
    if (editUser.value.editKey === 'userPassword') {
        editUser.value.currentValue = conNewPwd.value
    }

    // 将信息传给后端执行更新
    const res = await myAxios.post('/user/update', {
        'id': currentUser.id,
        // 动态生成
        [editUser.value.editKey as string]: editUser.value.currentValue,
    })
    // console.log(res, '更新请求');
    if (res.code === 0 && res.data > 0) {
        if (editUser.value.editName !== '标签') {
            Toast.success('修改成功');
            router.back();
        }
    } else {
        Toast.fail('修改失败');
    }
};

</script>

<style scoped>

</style>
