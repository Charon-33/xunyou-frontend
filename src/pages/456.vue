<template>
    <div class="upload-container">
        <van-uploader
                v-model="fileList"
                :max-count="1"
                :after-read="afterRead"
        />
        <img src="../assets/correct.png"/>
        <div v-if="imgUrl" class="result">
            <p>上传成功，图片链接为：</p>
            <a :href="imgUrl" target="_blank">{{ imgUrl }}</a>
        </div>
        <div v-if="errorMsg" class="error">
            <p>上传失败，错误信息为：</p>
            <p>{{ errorMsg }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import myAxios from "../plugins/myAxios";
import {ref} from "vue";
import axios from "axios";

let imgUrl = ref("")
let fileList = ref([{
    url: "/assets/userBg.jpg"
}])
let errorMsg = ref("")

const afterRead = (file: any) => {
    console.log("文件的属性", file);
    let formData = new FormData();
    formData.append("file", file.file);
    myAxios.post("/file/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
        .then((res) => {
            console.log("文件上传的返回结果：", res)
            fileList.value = [{
                url: URL.createObjectURL(res)
            }]
            // 处理响应数据
            // if (res.data.success) {
            //     // 如果成功，显示图片链接
            //     console.log()
            //     this.imgUrl = res.data.data.url;
            //     this.errorMsg = "";
            // } else {
            //     // 如果失败，显示错误信息
            //     this.imgUrl = "";
            //     this.errorMsg = res.data.message;
            // }
        })
        .catch((err) => {
            // 处理异常情况
            console.log("上传失败")
            // this.imgUrl = "";
            // this.errorMsg = err.message;
        });
};
</script>

<style scoped>
.upload-container {
    margin: 20px;
}

.result {
    color: green;
}

.error {
    color: red;
}
</style>