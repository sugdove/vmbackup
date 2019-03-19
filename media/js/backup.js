/**
 * Created by suge on 2017/6/7.
 */
//显示IP方法
function GetIp(str,host){
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + host + "/virtCentGetAllByType",
        data:{str:str},
        dataType: "json",
        async: false,
        success: function (data2) {
            if(data2.res==0){
                var data = data2.info;
                var length = data.length;
                var i = 0;
                var string = "";
                for (i; i < length; i++) {
                    var vcip = data[i].vc_ip;
                    var vcid = data[i].id;
                    var vcStorepath = data[i].vc_backuppath;
                    var type = data[i].vc_type;
                    var str = "备份路径: "+vcStorepath;
                    string +="<li class='vcip_li' title='"+str+"' data-type='"+type+"' data-path='"+vcStorepath+"'><span class='vcid_li'>" + vcid + "</span><img src='media/image/vmware.png'>" + vcip + "</li>"
                }
                $("#vmware-list").html(string);
            }
            else if(data2.res==-1){
                alert("后台报错："+data2.err)
            }
        }
    });
};
var start_str_ ={vc_type:"1"};
var start_str = JSON.stringify(start_str_);
//初始获取vcip列表
GetIp(start_str,localhost);
//获取右侧具体信息
$("#vmware-list").on("click",".vcip_li",function () {
    let path = $(this).data('path');
    if($('.detailsSpan').length===0){
        let spanStr = "<span class='detailsSpan'>备份路径: <font class='detailsSpanPath detailsSpanFont'>"+path+"</font></span>";
        $('#detailsSpanH4').append(spanStr)
    }
    else{
        $('.detailsSpanPath').text(path)

    }
    arr1 = [];
    arr2 = [];
    $("#vmidset-id").val('');
    $("#vmnameset-id").val('');
    $("#sample_1").dataTable().fnDestroy();
    $(".vcip_li").removeClass("eee");
    $(this).addClass("eee");
    var vcid = $(this).find(".vcid_li").text();
    var VirCenType = $(this).data("type");
    $("#alert-info").hide();
    $("#vcid-id").val(vcid);
    var str_ = {"vcid":vcid,"VirCenType":VirCenType};
    var str = JSON.stringify(str_);
    $.ajax({
        cache: true,
        type: "post",
        url: "http://" + localhost + "/getVmlist",
        data:{str:str},
        dataType: "json",
        async: false,
        success: function (data2) {
            if(data2.res==0){
                var data = data2.info;
                var length = data.length;
                var i = 0;
                $("#table_div").show();
                $("#table_refresh").html("<tr><th style='width:8px;'><input type='checkbox' class='group-checkable' data-set='#sample_1 .checkboxes' /></th><th>编号</th><th>虚拟机名称</th><th>虚拟机编号</th><th>磁盘消耗</th><th>状态</th></tr>")
                var string = "";
                for (i; i < length; i++) {
                    var vmname = data[i].vmname;
                    var vmid = data[i].vmid;
                    var vmnum = i + 1;
                    var isbackup = data[i].isbk;
                    var vmused = backupSize(data[i]['vmused']);
                    if (isbackup == "0") {
                       string += "<tr class='odd gradeX' ><td class='sorting_1'><input type='checkbox'class='checkboxes' name='gender[]' value='" + vmname + "'></td><td>" + vmnum + "</td><td class='hide_vmname' title='"+vmname+"'>" + vmname + "</td><td>" + vmid + "</td><td>"+vmused+"</td><td><span class='label label-success'>未进行</span></td></tr>"
                    }
                    else if (isbackup == "1") {
                        string+= "<tr class='odd gradeX' style='cursor: not-allowed'><td class='sorting_1'><input type='checkbox'class='checkboxes' disabled name='gender[]' value='" + vmname + "'></td><td>" + vmnum + "</td><td class='hide_vmname' title='"+vmname+"'>" + vmname + "</td><td>" + vmid + "</td><td>"+vmused+"</td><td><span class='label label-warning'>备份计划中</span></td></tr>"
                    }
                }
                $("#v_tbody").html(string);

                if (!jQuery().uniform) {
                    return;
                }
                var test = $("input[type=checkbox]:not(.toggle), input[type=radio]:not(.toggle, .star)");
                if (test.size() > 0) {
                    test.each(function () {
                        if ($(this).parents(".checker").size() == 0) {
                            $(this).show();
                            $(this).uniform();
                        }
                    });
                }

                $('#sample_1').dataTable({
                    "aLengthMenu": [
                        [5, 10,-1],
                        [5, 10,-1] // change per page values here
                    ],
                    "aoColumnDefs": [
                        {"bSortable": false, "aTargets": [0]}// 制定列不参与排序
                    ],
                    // set the initial value
                    "iDisplayLength": 10,
                    "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                    "sPaginationType": "bootstrap",
                    language: {
                        "sProcessing": "处理中...",
                        "sLengthMenu": "显示 _MENU_ 项结果",
                        "sZeroRecords": "没有匹配结果",
                        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                        "sInfoPostFix": "",
                        "sSearch": "搜索:",
                        "sUrl": "",
                        "sEmptyTable": "表中数据为空",
                        "sLoadingRecords": "载入中...",
                        "sInfoThousands": ",",
                        "oPaginate": {
                            "sFirst": "首页",
                            "sPrevious": "上页",
                            "sNext": "下页",
                            "sLast": "末页"
                        },
                        "oAria": {
                            "sSortAscending": ": 以升序排列此列",
                            "sSortDescending": ": 以降序排列此列"
                        }
                    },
                    "aaSorting": [[4, "desc"]]//默认第几个排序
                });
                //全选方法
                jQuery('#sample_1 .group-checkable').change(function () {
                    var set = jQuery(this).attr("data-set");
                    var checked = jQuery(this).is(":checked");
                    jQuery(set).each(function () {
                        if (checked && $(this).prop("disabled") == false) {
                            $(this).attr("checked", true);
                        } else {
                            $(this).attr("checked", false);
                        }
                    });
                    jQuery.uniform.update(set);
                });
               /*$('li').each(function () {
                   if(!$(this).hasClass('disabled')){
                    $(this).children(a)
                   }
                });*/
             checkboxChange($('#sample_1'))

            }
            else if(data2.res==-1){
                alert("后台报错："+data2.err)
            }
        }
    })
});
//虚拟化类型改变出现不同的ip
$("#VirtCentType").change(function () {
  var type = $(this).val();
  var str_ = {vc_type:type};
  var str =JSON.stringify(str_);
  $("#alert-info").show();
  $("#table_div").hide();
    arr1 = [];
    arr2 = [];
  GetIp(str,localhost);
});
$('.timepicker1').timepicker({
    showMeridian: false,
});
$(function () {
    $("[data-toggle='popover']").popover();
});

function showtime() {
    var mydate = new Date();
    var t = mydate.toLocaleString();
    var time = "当前时间:" + t;
    $("#time_show").html(time);
    setTimeout(showtime, 1000)
}

showtime();
//保留相关js
$("body").on("change", "#DelType-id", function () {
    var value = $(this).val();
    //时间保留
    if (value == 1) {
        $(".keep-text").html("保留天数<span class='required' aria-required='true'>*</span>")
    }
    //个数保留
    else if (value == 2) {
        $(".keep-text").html("保留个数<span class='required' aria-required='true'>*</span>")
    }
});

/***********************************以下为第二窗口相关JS***************************************************/
function tab2() {
    //折叠面板
    $(".panel-heading").click(function () {
        if ($(this).next(".panel-body").css("display") == "none") {
            $(".panel-body").slideUp();
            $(this).next(".panel-body").slideDown();
            $(".panel-heading-a").addClass("collapsed");
            $(this).children(".panel-heading-a").removeClass("collapsed")
        }
        else {
            $(this).next(".panel-body").slideUp();
            $(this).children(".panel-heading-a").addClass("collapsed")
        }
    });
//磁盘全量备份标签页
    $("#everyday").click(function () {
        $(this).parent("li").parent("ul").find("li").attr("class", "");
        $(this).parent("li").attr("class", "active");
        $("#everyweek_show").hide();
        $("#everymonth_show").hide();
        $("#everyday_show").fadeIn();
    });
    $("#everyweek").click(function () {
        $(this).parent("li").parent("ul").find("li").attr("class", "");
        $(this).parent("li").attr("class", "active");
        $("#everyday_show").hide();
        $("#everymonth_show").hide();
        $("#everyweek_show").fadeIn();

    });
    $("#everymonth").click(function () {
        $(this).parent("li").parent("ul").find("li").attr("class", "");
        $(this).parent("li").attr("class", "active");
        $("#everyweek_show").hide();
        $("#everyday_show").hide();
        $("#everymonth_show").fadeIn();
    });
//增量备份标签页
    $("#everyday_1").click(function () {
        $(this).parent("li").parent("ul").find("li").attr("class", "");
        $(this).parent("li").attr("class", "active");
        $("#everyweek_show_1").hide();
        $("#everymonth_show_1").hide();
        $("#everyday_show_1").fadeIn();
    });
    $("#everyweek_1").click(function () {
        $(this).parent("li").parent("ul").find("li").attr("class", "");
        $(this).parent("li").attr("class", "active");
        $("#everyday_show_1").hide();
        $("#everymonth_show_1").hide();
        $("#everyweek_show_1").fadeIn();

    });
    $("#everymonth_1").click(function () {
        $(this).parent("li").parent("ul").find("li").attr("class", "");
        $(this).parent("li").attr("class", "active");
        $("#everyweek_show_1").hide();
        $("#everyday_show_1").hide();
        $("#everymonth_show_1").fadeIn();
    });
//全量备份标签页
    $("#everyday_2").click(function () {
        $(this).parent("li").parent("ul").find("li").attr("class", "");
        $(this).parent("li").attr("class", "active");
        $("#everyweek_show_2").hide();
        $("#everymonth_show_2").hide();
        $("#everyday_show_2").fadeIn();
    });
    $("#everyweek_2").click(function () {
        $(this).parent("li").parent("ul").find("li").attr("class", "");
        $(this).parent("li").attr("class", "active");
        $("#everyday_show_2").hide();
        $("#everymonth_show_2").hide();
        $("#everyweek_show_2").fadeIn();

    });
    $("#everymonth_2").click(function () {
        $(this).parent("li").parent("ul").find("li").attr("class", "");
        $(this).parent("li").attr("class", "active");
        $("#everyweek_show_2").hide();
        $("#everyday_show_2").hide();
        $("#everymonth_show_2").fadeIn();
    });
//选择一次性备份和按策略备份出现不同的区域
    $("body").on("change", "#backup_way", function () {
        //0策略1手动
        if ($("#backup_way").val() == "0") {
            $("#backup_1").show();
            $("#backup_1_").show();
            $("#backup_2").hide();
            $(".hand-hide").show();
        }
        if ($("#backup_way").val() == "1") {
            $("#backup_2").show();
            $("#backup_1").hide();
            $("#backup_1_").hide();
            $(".hand-hide").hide();
        }
    });
//通过选择的是策略备份还是手动备份在最后的确认配置页面进行不同的展示
    $(".button-next").click(function () {
        //策略备份
        if ($("#backup_way").val() == 0) {
            $("#name1").show();
            $("#name2").hide();
            $('#Isorder_').show();
            $("#backup_strategy_1").hide();
            $("#backup_strategy_2").show();
            $("#name3").show();
            $("#name4").hide();
            var a = "";
            $("#backup_1").find(".panel-heading").each(function () {
                if ($(this).find(".celue").text() != "") {
                    var backup_way = $(this).find(".panel-heading-a").text();
                    var celue1 = $(this).find(".celue").text();
                    var celue = celue1.substring(1, 3);
                    var time = $(this).find(".time").val();
                    var date = $(this).find(".date").val();
                    var all = backup_way + ":" + celue + date + "," + time;
                    a = a + all + ";"
                }
            });
            var b = a.substring(0, a.length - 1);
            $("#bktype-f23").val(b);
        }
        //手动备份
        else if ($("#backup_way").val() == 1) {
            $("#backup_strategy_1").show();
            $("#backup_strategy_2").hide();
            $('#Isorder_').hide();
            $("#name2").show();
            $("#name1").hide();
            $("#name3").hide();
            $("#name4").show();

        }

    });
//点击确定的样式
    $(".day").click(function () {
        var panel_heading = $(this).parent().parent().parent().parent().parent().parent(".panel-default").children(".panel-heading");
        var this_body = $(this).parent().parent().parent(".tab-pane ");
        var time = this_body.find(".timepicker1").val();
        panel_heading.find(".celue").html("(每天策略)");
        panel_heading.find(".time").val(time);
        panel_heading.next(".panel-body").slideUp();
        panel_heading.find(".panel-heading-a").addClass("collapsed");
    });
    $(".week").click(function () {
        var panel_heading = $(this).parent().parent().parent().parent().parent().parent(".panel-default").children(".panel-heading");
        var this_body = $(this).parent().parent().parent(".tab-pane ");
        if (this_body.find("input[type='checkbox']:checked").length == 0) {
            this_body.find(".alert-danger").remove();
            this_body.prepend("<div class='alert alert-danger' role='alert'>请选择每周的策略</div>")
        }
        else {
            var time = this_body.find(".timepicker1").val();
            var date1 = "";
            var date2 = "";
            this_body.find("input[type='checkbox']").each(function () {
                if ($(this).prop("checked") == true) {
                    var val_ = $(this).val();
                    date2 = date2 + val_ + ",";
                    if (val_ == 1) {
                        val_ = 8;
                    }
                    date1 = date1 + (val_ - 1) + ","
                }
            });
            var date = date1.substring(0, date1.length - 1);
            var date_ = date2.substring(0, date2.length - 1);
            this_body.find(".alert-danger").remove();
            panel_heading.find(".celue").html("(每周策略)");
            panel_heading.find(".time").val(time);
            panel_heading.find(".date").val(date);
            panel_heading.find(".date_").val(date_);
            panel_heading.next(".panel-body").slideUp();
            panel_heading.find(".panel-heading-a").addClass("collapsed");
        }

    });
    $(".month").click(function () {
        var panel_heading = $(this).parent().parent().parent().parent().parent().parent(".panel-default").children(".panel-heading");
        var this_body = $(this).parent().parent().parent(".tab-pane ");
        if (this_body.find("input[type='checkbox']:checked").length == 0) {
            this_body.find(".alert-danger").remove();
            this_body.prepend("<div class='alert alert-danger' role='alert'>请选择每月的策略</div>")
        }
        else {
            var time = this_body.find(".timepicker1").val();
            var date1 = "";
            this_body.find("input[type='checkbox']").each(function () {
                if ($(this).prop("checked") == true) {
                    date1 = date1 + $(this).val() + ","
                }
            });
            var date = date1.substring(0, date1.length - 1);
            this_body.find(".alert-danger").remove();
            panel_heading.find(".time").val(time);
            panel_heading.find(".celue").html("(每月策略)");
            panel_heading.find(".date_").val(date);
            panel_heading.find(".date").val(date);
            panel_heading.next(".panel-body").slideUp();
            panel_heading.find(".panel-heading-a").addClass("collapsed");
        }
    });
//增量点击确定样式
    $(".z-day").click(function () {
        var panel_heading = $(this).parent().parent().parent().parent().parent().parent(".panel-default").children(".panel-heading");
        var this_body = $(this).parent().parent().parent(".tab-pane ");
        var time = this_body.find(".timepicker1").val();
        if ($(".celue").eq(0).text() == "") {
            $.confirm({
                confirmButtonClass: 'btn btn-info',
                cancelButtonClass: 'btn-danger',
                confirmButton: '确认',
                cancelButton: '取消',
                animation: 'zoom',
                closeAnimation: 'rotateXR',
                title: '操作错误！',
                content: '选择增量备份前必须有全量备份（此确认框会在3秒后消失）',
                autoClose: '确认|3000',
                buttons: {
                    确认: function () {

                    }
                }
            });
        }
        else {
            panel_heading.find(".celue").html("(每天策略)");
            panel_heading.find(".time").val(time);
            panel_heading.next(".panel-body").slideUp();
            panel_heading.find(".panel-heading-a").addClass("collapsed");
        }
    });
    $(".z-week").click(function () {
        var panel_heading = $(this).parent().parent().parent().parent().parent().parent(".panel-default").children(".panel-heading");
        var this_body = $(this).parent().parent().parent(".tab-pane ");
        if (this_body.find("input[type='checkbox']:checked").length == 0) {
            this_body.find(".alert-danger").remove();
            this_body.prepend("<div class='alert alert-danger' role='alert'>请选择每周的策略</div>")
        }
        else {
            if ($(".celue").eq(0).text() == "") {
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton: '确认',
                    cancelButton: '取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '操作错误！',
                    content: '选择增量备份前必须有全量备份（此确认框会在3秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {

                        }
                    }
                });
            }
            else {

                var time = this_body.find(".timepicker1").val();
                var date1 = "";
                var date2 = "";
                this_body.find("input[type='checkbox']").each(function () {
                    if ($(this).prop("checked") == true) {
                        var val_ = $(this).val();
                        date2 = date2 + val_ + ",";
                        if (val_ == 1) {
                            val_ = 8;
                        }
                        date1 = date1 + (val_ - 1) + ",";
                    }
                });
                var date = date1.substring(0, date1.length - 1);
                var date_ = date2.substring(0, date2.length - 1);
                this_body.find(".alert-danger").remove();
                panel_heading.find(".celue").html("(每周策略)");
                panel_heading.find(".time").val(time);
                panel_heading.find(".date").val(date);
                panel_heading.find(".date_").val(date_);
                panel_heading.next(".panel-body").slideUp();
                panel_heading.find(".panel-heading-a").addClass("collapsed");
            }
        }
    });
    $(".z-month").click(function () {
        var panel_heading = $(this).parent().parent().parent().parent().parent().parent(".panel-default").children(".panel-heading");
        var this_body = $(this).parent().parent().parent(".tab-pane ");
        if (this_body.find("input[type='checkbox']:checked").length == 0) {
            this_body.find(".alert-danger").remove();
            this_body.prepend("<div class='alert alert-danger' role='alert'>请选择每月的策略</div>")
        }
        else {
            if ($(".celue").eq(0).text() == "") {
                $.confirm({
                    confirmButtonClass: 'btn btn-info',
                    cancelButtonClass: 'btn-danger',
                    confirmButton: '确认',
                    cancelButton: '取消',
                    animation: 'zoom',
                    closeAnimation: 'rotateXR',
                    title: '操作错误！',
                    content: '选择增量备份前必须有全量备份（此确认框会在3秒后消失）',
                    autoClose: '确认|3000',
                    buttons: {
                        确认: function () {

                        }
                    }
                });
            }
            else {
                var time = this_body.find(".timepicker1").val();
                var date1 = "";
                this_body.find("input[type='checkbox']").each(function () {
                    if ($(this).prop("checked") == true) {
                        date1 = date1 + $(this).val() + ","
                    }
                });
                var date = date1.substring(0, date1.length - 1);
                this_body.find(".alert-danger").remove();
                panel_heading.find(".time").val(time);
                panel_heading.find(".celue").html("(每月策略)");
                panel_heading.find(".date").val(date);
                panel_heading.find(".date_").val(date);
                panel_heading.next(".panel-body").slideUp();
                panel_heading.find(".panel-heading-a").addClass("collapsed");
            }
        }
    });
//点击取消时的样式
    $(".b2").click(function () {
        var panel_heading = $(this).parent().parent().parent().parent().parent().parent(".panel-default").children(".panel-heading");
        panel_heading.find(".celue").html("");
        panel_heading.find(".time").val("");
        panel_heading.find(".date").val("");
        panel_heading.find(".date_").val("");
    });
}

tab2();
/***********************************以下为提交方法相关JS***************************************************/
//最后的提交方法
$(".button-submit").click(function () {
    var DelType = $("#DelType-id").val();
    var Deldata = $("#Deldata-f").text();
    var vcid = $("#vcid-f").text();
    var vmidset = $("#vmidset-f").text();
    var vmnameset = $("#vmnameset-f").text().toString();
    var exetype = $("#backup_way").val();
    var bktype = $("#bktype-id").val();
    var msg = $("#msg-f").text();
    var msg_ = $("#msg-g").text();
    var Isorder = $('#Isorder').val();
    var threadnum = $("#threadnum-f").text();
    var VirtCentType = $("#VirtCentType").val();
    var IsUse1;
    var IsUse2;
    var IsUse3;
    var Exetype1;
    var Exetype2;
    var Exetype3;
    var time1 = $(".panel-heading").eq(0).find(".time").val()+":00";
    var time2 = $(".panel-heading").eq(1).find(".time").val()+":00";
    var time3 = $(".panel-heading").eq(2).find(".time").val()+":00";
    var date1 = $(".panel-heading").eq(0).find(".date_").val();
    var date2 = $(".panel-heading").eq(1).find(".date_").val();
    var date3 = $(".panel-heading").eq(2).find(".date_").val();
    switch ($(".panel-heading").eq(0).find(".celue").text()) {
        case "":
            IsUse1 = 1;
            break;
        case "(每天策略)":
            Exetype1 = 1;
            IsUse1 = 0;
            break;
        case "(每周策略)":
            IsUse1 = 0;
            Exetype1 = 2;
            break;
        case "(每月策略)":
            IsUse1 = 0;
            Exetype1 = 3;
            break;
    }
    switch ($(".panel-heading").eq(1).find(".celue").text()) {
        case "":
            IsUse2 = 1;
            break;
        case "(每天策略)":
            Exetype2 = 1;
            IsUse2 = 0;
            break;
        case "(每周策略)":
            Exetype2 = 2;
            IsUse2 = 0;
            break;
        case "(每月策略)":
            Exetype2 = 3;
            IsUse2 = 0;
            break;
    }
    switch ($(".panel-heading").eq(2).find(".celue").text()) {
        case "":
            IsUse3 = 1;
            break;
        case "(每天策略)":
            Exetype3 = 1;
            IsUse3 = 0;
            break;
        case "(每周策略)":
            Exetype3 = 2;
            IsUse3 = 0;
            break;
        case "(每月策略)":
            IsUse3 = 0;
            Exetype3 = 3;
            break;
    }

    var strategy1 = {
        "strategy": {
            "VirtCentType": VirtCentType,
            "Name": msg,
            'Isorder':Isorder,
            "Vmname": vmnameset,
            "VmId": vmidset,
            "Vcid": vcid,
            "DelType": DelType,
            "Deldata": Deldata,
            "Backup": {
                "1": {
                    "IsUse": IsUse1,
                    "Exetype": Exetype1,
                    "Time": time1,
                    "Date": date1
                },
                "2": {
                    "IsUse": IsUse2,
                    "Exetype": Exetype2,
                    "Time": time2,
                    "Date": date2
                },
                "3": {
                    "IsUse": IsUse3,
                    "Exetype": Exetype3,
                    "Time": time3,
                    "Date": date3
                }
            }
        }
    };
    var strategy = JSON.stringify(strategy1);
    var  strategy_1 = {
        "VirtCentType": VirtCentType,
        "vcid": vcid,
        "vmidset": vmidset,
        "vmnameset": vmnameset,
        "bktype": bktype,
        "threadum": threadnum,
        "exetype": exetype,
        "msg": msg_
    };
    var strategy_ = JSON.stringify(strategy_1);
    //手动备份
     if (exetype == 1) {
          $.ajax({
              url: "http://" + localhost + "/addManuaPlane",
              cache: true,
              dataType:"json",
              type: "post",
              data: {
                "str":strategy_
              },
              async: false,
              success: function (data) {
                  //这里的-1是BUG后期会进行修改
                  if (data.res == 0) {
                      $.confirm({
                          confirmButtonClass: 'btn btn-info',
                          cancelButtonClass: 'btn-danger',
                          confirmButton: '确认',
                          cancelButton: '取消',
                          animation: 'zoom',
                          closeAnimation: 'rotateXR',
                          title: '添加成功！',
                          content: '即将跳转到备份计划页面（此确认框会在2秒后消失）',
                          autoClose: '确定|2000',
                          buttons: {
                              确定: function () {
                                  location.href = "all_task.html#span1";
                              }
                          }
                      });
                  }
                  else if (data.res == -1) {
                      alert("后台报错："+data.err)
                  }
              }
          })
      }
      //按策略备份
      if (exetype == 0) {
          $.ajax({
              url: "http://" + localhost + "/addStrategy",
              cache: true,
              data: {"str": strategy},
              type: "post",
              dataType:"json",
              async: false,
              success: function (data) {
                  if(data.res==0){
                      $.confirm({
                          confirmButtonClass: 'btn btn-info',
                          cancelButtonClass: 'btn-danger',
                          confirmButton: '确认',
                          cancelButton: '取消',
                          animation: 'zoom',
                          closeAnimation: 'rotateXR',
                          title: '添加成功！',
                          content: '即将跳转到备份计划页面（此确认框会在2秒后消失）',
                          autoClose: '确定|2000',
                          buttons: {
                              确定: function () {
                                  location.href = "all_task.html";
                              }
                          }
                      });
                  }
                  else if(data.res==-1){
                   alert("后台报错："+data.err)
                  }

              }
          })
      }
});
var arr1 = [];
var arr2 = [];
//数组去重
Array.prototype.unique3 = function(){
    var res = [];
    var json = {};
    for(var i = 0; i < this.length; i++){
        if(!json[this[i]]){
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
};
//checkbox失去选择删除已有数组元素
function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
//checkbox改变时效果
$("#v_tbody").on("change",".checkboxes",function () {
    if ($(this).prop("checked") == true) {
        var vmid = $(this).parent().parent().parent("td").parent("tr").find("td").eq(3).text();
        arr1.push(vmid);
        var vmname = $(this).parent().parent().parent("td").parent("tr").find("td").eq(2).text();
        arr2.push(vmname)
    }
    else if($(this).prop("checked") == false){
        var vmid = $(this).parent().parent().parent("td").parent("tr").find("td").eq(3).text();
        removeByValue(arr1, vmid);
        var vmname = $(this).parent().parent().parent("td").parent("tr").find("td").eq(2).text();
        removeByValue(arr2, vmname);
    }
    arr1 = arr1.unique3();
    arr2 = arr2.unique3();
    var a = arr1.join(",");
    $("#vmidset-id").val(a);
    var b = arr2.join(",");
    $("#vmnameset-id").val(b);
});
//点击全选时的方法
$("#sample_1").on("change",".group-checkable",function () {
        $("#v_tbody").find(".checkboxes").change();
});
