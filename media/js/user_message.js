/*用于获取用户信息*/
var Username = $.cookie("username");
//
$(".username").html(Username);
/*attr("href","http://" + localhost + "/logout");*/
//登出
$(".logout").click(function(){
    $.ajax({
        url: "http://" + localhost + "/logout",
        type: "post",
        async: false,
        success: function (data) {
            window.location.href = local_out;
        }
    });
});
//返回主界面
$(".return_main").click(function(){
    window.location.href = local_url;
});
//版本信息
$('.version_message').click(function() {
    if ($("#version_message_modal").length < 1) {
        $.ajax({
            cache: true,
            type: "post",
            url: "http://" + localhost + "/getAllInfo",
            dataType: "json",
            async: false,
            success: function (data2) {
                if (data2.res == 0) {
                    let data = data2.info;
                    let version = data.version;

                    let version_message_modal = "<!-- 模态框（Modal） -->\n" +
                        "<div class=\"modal fade in hide\" id=\"version_message_modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"version_message_modalModalLabel\" aria-hidden=\"true\">\n" +
                        "    <div class=\"modal-dialog\">\n" +
                        "        <div class=\"modal-content\">\n" +
                        "            <div class=\"modal-header\">\n" +
                        "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>\n" +
                        "                <h4 class=\"modal-title\" id=\"version_message_modalModalLabel\">DSG虚拟化备份</h4>\n" +
                        "            </div>\n" +
                        "            <div class=\"modal-body\"><div class='container-fluid'><br><p><b>系统版本:</b>" + version + "</p><br><p><b>web版本:</b>" + web_version + "</p><br><p class='text-info'>欢迎使用!</p></div></div>\n" +
                        "            <div class=\"modal-footer\">\n" +
                        "                <button type=\"button\" class=\"btn btn-primary\" data-dismiss='modal'>确定</button>\n" +
                        "            </div>\n" +
                        "        </div><!-- /.modal-content -->\n" +
                        "    </div><!-- /.modal-dialog -->\n" +
                        "</div>\n" +
                        "<!-- /.modal -->"

                    $('body').append(version_message_modal);
                }
                else if (data2.res == -1) {
                    alert("后台报错:" + data2.err)
                }

            }
        });
    }
    $('#version_message_modal').modal('show')
});
//备份size处理方法
let backupSize = size =>{
    let GB;
    if(size==="0"){
        GB = "0"
    }
    else{
        size = Number(size);
        GB = ((size / 1024) / 1024) / 1024;
        GB > 0.1 ? GB = parseFloat(GB).toFixed(1) + "(GB)" : GB = parseFloat(GB * 1024).toFixed(1) + "(MB)";
    }
    return GB;
};
//改变checkbox
let checkboxChange = $dom =>{
    $dom.on('draw.dt',function() {
        if($dom.find('.group-checkable').parent('span').hasClass('checked')){
            $dom.find('.group-checkable').click();
        }
    });
};
