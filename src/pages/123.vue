<template>
    <div class="upload-container">
        <van-uploader
            v-model="fileList"
            :max-count="1"
            :after-read="afterRead"
        />
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

<script>
import axios from "axios";

export default {
    data() {
        return {
            fileList: [],
            imgUrl: "",
            errorMsg: "",
        };
    },
    methods: {
        afterRead(file) {
            // 创建表单数据对象
            let formData = new FormData();
            // 添加图片文件
            formData.append("smfile", file.file);
            // 添加其他参数，如 token
            // formData.append("token", "g2mGk3t0SYEoU1DYbf6DFqt45MXHZT1C");
            // formData.append("Access-Control-Allow-Origin", "*");
            // 发送 POST 请求到 sm.ms 的 API 地址
            axios.post("/useSMMS/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": "g2mGk3t0SYEoU1DYbf6DFqt45MXHZT1C",
                    },
                })
                .then((res) => {
                    // 处理响应数据
                    if (res.data.success) {
                        // 如果成功，显示图片链接
                        this.imgUrl = res.data.data.url;
                        this.errorMsg = "";
                    } else {
                        // 如果失败，显示错误信息
                        this.imgUrl = "";
                        this.errorMsg = res.data.message;
                    }
                })
                .catch((err) => {
                    // 处理异常情况
                    this.imgUrl = "";
                    this.errorMsg = err.message;
                });
        },
    },
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