//获取虚拟化中心列表
$.ajax({
    cache: true,
    type: "post",
    url: "http://" + localhost + "/virtCentGetAll",
    dataType: "json",
    async: false,
    success: function (data2) {
        if (data2.res == 0) {
            var data = data2.info;
            var length = data.length;
            var i = 0;
            for (i; i < length; i++) {
                var vcid = parseInt(data[i].id);
                var vcip = data[i].vc_ip;
                var name = data[i].vc_name;
                var tyep = data[i].vc_type;
                var vcuser = data[i].vc_user;
                var vccreattime = data[i].isused;
                var admin = "暂时没有";
                var vcStorepath = data[i].vc_backuppath;
                var vcpasswd = data[i].vc_password;
                $("#v_tbody").append("<tr class='odd gradeX'><td class='sorting_1'><input type='checkbox' name='vcid' class='checkboxes'value='" + vcid + "'></td><td>" + vcid + "</td><td>" + vcip + "</td><td class='hidden-480' data-type='"+tyep+"'>" + tyep + "</td><td class='hidden-480'>" + vcuser + "</td><td class='hidden-480'>" + name + "</td><td class='hide'>" + admin + "</td><td>" + vcStorepath + "<input type='text' value='" + vcpasswd + "' class='pwd'></td><td><div class='btn-group mmm'><button type='button' class='btn btn yellow pad' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='glyphicon glyphicon-hand-up'></i>操作<span class='fa fa-angle-down'></span></button><ul class='dropdown-menu'><li><a href='javascript:void(0)'  data-toggle='modal' data-target='#myModal' class='change'><i class='fa fa-wrench'></i>修&nbsp&nbsp&nbsp改</a></li><li><a href='javascript:void(0)'   class='oneway'><i class='fa fa-exchange'></i>同&nbsp&nbsp&nbsp步</a></li></ul></div></td></tr>")

            }

            $("#v_tbody tr").each(function () {
                if ($(this).find("td").eq(3).text() == "1") {
                    $(this).find("td").eq(3).text("VMware vSphere")
                }
             /*  else if ($(this).find("td").eq(3).text() == "1") {
                    $(this).find("td").eq(3).text("Citrix XenServer")
                }
               else if ($(this).find("td").eq(3).text() == "2") {
                    $(this).find("td").eq(3).text("Hyper-V")
                }*/
                else if ($(this).find("td").eq(3).text() == "2") {
                    $(this).find("td").eq(3).text("华为虚拟化")
                }
                /*if($(this).find("td").eq(3).text()=="1"){
                 $(this).find("td").eq(3).text("全磁盘备份")
                 }*/
            });
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
                "aoColumnDefs": [
                    {"orderable": false, "aTargets": [0, 2, 3, 4, 5, 6, 7, 8]}// 制定列不参与排序
                ],
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
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
                "aaSorting": [[1, "asc"]],//默认第几个排序
            });
            //checkboxes的全选和全不选
            jQuery('#sample_1 .group-checkable').change(function () {

                var set = jQuery(this).attr("data-set");
                var checked = jQuery(this).is(":checked");
                jQuery(set).each(function () {
                    if (checked) {
                        $(this).attr("checked", true);
                    } else {
                        $(this).attr("checked", false);
                    }
                });
                jQuery.uniform.update(set);
            });
            checkboxChange($('#sample_1'));

        }
        else if (data2.res == -1) {
            alert("后台报错：" + data2.err)
        }
    },

    error: function (data) {

        alert("wrong");

    }

});
//删除虚拟机
$("#delete_virtcent").click(function () {
    if($("#v_tbody").find("input[type='checkbox']:checked").length===0){
        $.confirm({
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn-danger',
            confirmButton: '确认',
            cancelButton: '取消',
            animation: 'zoom',
            closeAnimation: 'rotateXR',
            title: '操作错误！',
            content: '请选择至少一条数据！（此确认框会在3秒后消失）',
            autoClose: '确定|3000',
            buttons: {
                确定: function () {
                }
            }
        });
    }
    else{
        var tr = $("#v_tbody").find("input[type='checkbox']:checked").parent().parent().parent().parent("tr");
        var string = "";
        $("#v_tbody").find("input[type='checkbox']:checked").each(function () {
            string += ($(this).val()) + ","
        });
        string = string.substring(0, string.length - 1);
        var str_ = {'id': string};
        var str = JSON.stringify(str_);
        $.confirm({
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn-danger',
            confirmButton: '确认',
            cancelButton: '取消',
            animation: 'zoom',
            closeAnimation: 'rotateXR',
            title: '删除？',
            content: '确认是否删除（此确认框会在8秒后消失）',
            autoClose: '否|8000',
            buttons: {
                deleteUser: {
                    text: '是',
                    action: function () {
                        $.ajax({
                            url: "http://" + localhost + "/virtCentDel",
                            cache: true,
                            type: "post",
                            dataType: "json",
                            data: {str: str},
                            async: false,
                            success: function (data) {
                                if (data.res == 0) {
                                    $.confirm({
                                        confirmButtonClass: 'btn btn-info',
                                        cancelButtonClass: 'btn-danger',
                                        confirmButton: '确认',
                                        cancelButton: '取消',
                                        animation: 'zoom',
                                        closeAnimation: 'rotateXR',
                                        title: '删除成功！',
                                        content: '虚拟化中心成功删除！（此确认框会在3秒后消失）',
                                        autoClose: '确定|3000',
                                        buttons: {
                                            确定: function () {
                                                tr.each(function () {
                                                    $("#sample_1").DataTable().row($(this)).remove().draw(false);
                                                });
                                            }
                                        }
                                    });
                                }
                                else if (data.res == -1) {
                                    alert("后台报错：" + data.err)
                                }

                            }
                        })
                    }
                },
                否: function () {

                }
            }
        });
    }
});
//同步虚拟机
$("body").on("click", ".oneway", function () {
    var this_ = $(this).parent("li").parent("ul").parent().parent("td").parent("tr");
    var vcid = this_.find("td").eq(1).text();
    var ip = this_.find("td").eq(2).text();
    var username = this_.find("td").eq(4).text();
    var path = this_.find("td").eq(7).text();
    var password = this_.find(".pwd").val();
    var VirtType = this_.find("td").eq(3).data("type");
    var str_ = {
        "vcid": vcid,
        "vcip": ip,
        "vcUser": username,
        "vcPassword": password,
        "backupPath": path,
        "VirtType":VirtType
    };
    var str = JSON.stringify(str_);
    $.confirm({
        confirmButtonClass: 'btn btn-info',
        cancelButtonClass: 'btn-danger',
        confirmButton: '确认',
        cancelButton: '取消',
        animation: 'zoom',
        closeAnimation: 'rotateXR',
        title: '同步？',
        content: '确认是否同步（此确认框会在8秒后消失）',
        autoClose: '否|8000',
        buttons: {
            deleteUser: {
                text: '是',
                action: function () {
                    $(".spinner").show();
                    $(".black_overlay").show();
                    $.ajax({
                        url: "http://" + localhost + "/synchronousVirtCent",
                        cache: true,
                        type: "post",
                        dataType:"json",
                        data: {str:str},
                        async: true,
                        success: function (data) {
                            $(".spinner").hide();
                            $(".black_overlay").hide();
                            if (data.res == 0) {
                                $.confirm({
                                    confirmButtonClass: 'btn btn-info',
                                    cancelButtonClass: 'btn-danger',
                                    confirmButton: '确认',
                                    cancelButton: '取消',
                                    animation: 'zoom',
                                    closeAnimation: 'rotateXR',
                                    title: '同步成功！',
                                    content: '恭喜你同步成功！（此确认框会在3秒后消失）',
                                    autoClose: '确定|3000',
                                    buttons: {
                                        确定: function () {

                                        },
                                    }
                                });
                            }
                            else {
                                data.err==="java.rmi.RemoteException: VI SDK invoke exception:com.vmware.vim25.InvalidLogin"?data.err='主机密码错误':'';
                                alert("后台错误："+data.err)
                            }
                        }
                    })
                }
            },
            否: function () {

            },
        }
    });
});
//将选中虚拟机数据赋值在模态框里
$("body").on("click", ".change", function () {
    var this_ = $(this).parent("li").parent("ul").parent().parent("td").parent("tr");
    var vcid = this_.find("td").eq(1).text();
    var name = this_.find("td").eq(5).text();
    var ip = this_.find("td").eq(2).text();
    var username = this_.find("td").eq(4).text();
    var path = this_.find("td").eq(7).text();
    var password = this_.find(".pwd").val();
    var modal = $("#change_vcenter").find("input");
    modal.eq(0).val(vcid);
    modal.eq(1).val(name);
    modal.eq(2).val(username);
    modal.eq(3).val(password);
    modal.eq(4).val(ip);
    modal.eq(5).val(path)
});
//修改虚拟机
$("body").on("click", "#modal-submit", function () {
    let json = serializeJson($("#modal-form").serializeArray());
    json['isused'] = true;
    $.ajax({
        url: "http://" + localhost + "/virtCentUpdate",
        cache: true,
        type: "post",
        dataType:"json",
        data: {str:JSON.stringify(json)},
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
                    title: '修改成功！',
                    content: '数据成功进行修改！（此确认框会在3秒后消失）',
                    autoClose: '确定|3000',
                    buttons: {
                        确定: function () {
                            window.location.reload();
                        },
                    }
                });
            }
            else if(data.res==-1){
                alert("后台报错："+data.err)
            }

        }
    })
});