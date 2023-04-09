<template>
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>验证码</title>
    <script type="text/javascript" src="../js/jquery-3.3.1.js"></script>
  </head>
  <body>
  <div align="center" style="margin-top: 100px;">
    <!--输入框-->
    <input type="text" name="checkcode" id="checkcodeInput" size="4"/>
    <!--验证码-->
    <a href="javascript:loadCheckcode();"><img src="checkcode" id="checkcodeImg"></a>
    <br/>
    <span id="spanId" style="color: red"></span>
  </div>
  </body>
  </html>

</template>

<script>
export default {
  name: "checkcode"
}

  function loadCheckcode(){
  //加随机时间或者随机数是为了区分相同链接的不同请求
  //强制刷新：除了禁止缓存外，还需要给服务端传递一个唯一的参数（随机数或者时间）
  $("#checkcodeImg").attr("src","checkcode?t="+(new Date().getTime()));
}

  $(document).ready(function() {
  //触发输入框change事件检查验证码是否正确
  $("#checkcodeInput").change(function () {
    $.ajax({
      url: "check",
      type: "POST",
      data: {
        codeClient: $("#checkcodeInput").val()
      },
      success: function (result) {
        alert(result);
        document.getElementById("spanId").innerText = "";
        document.getElementById("spanId").innerText = result;
      }
    });
  });
});
</script>

<style scoped>

</style>