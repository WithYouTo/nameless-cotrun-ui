layui.use(['admin', 'table', 'form', 'layer','laydate'], function() {
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var whconfig = layui.whconfig;
    var whui = layui.whui;
    var laydate=layui.laydate;

    var cols;
    jQuery.getJSON("../../loginLog/loginLog-index/loginLog-index.json", function(data) {
        cols = data.cols;
        query(table);
    });

    /**
     * 查询
     */
    jQuery('#loginLog-index .whui-btn-query').click(function() {
        form.on('submit(loginLog-query-btn)', function(data) {
            query(table, data.field);
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        jQuery('button[lay-filter="loginLog-query-btn"]').click();
    });

    /**
     * 重置
     */
    jQuery('#loginLog-index .whui-btn-reset').click(function() {
        form.val('loginLog-query-form', {
        	'logName':'',
            'userName': '',
            'beginTime':''
        });
    });

    /**
     * 新增
     */
/*    jQuery('#user-index .whui-btn-add').click(function() {
        jQuery.get('../../user/user-add/user-add.html', function(html) {
            layer.open({
                content: html,
                id: 'user_add',
                title: '新增',
                type: 1,
                area: ['500px', '300px'],
                btn: ['确认', '取消'],
                yes: function(index, layero) {

                    form.on('submit(user-add-submit)', function(data) {
                  
                        layer.close(index);
                        whui.request(layui.whconfig.sysurl.user.add, data.field, function(data,desc){
                            whui.msg.warn(desc);
                            query(table);
                        });

                        // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
                        // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
                        // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                    jQuery('button[lay-filter="user-add-submit"]').click();
                }
            });
        });

    });*/

    /**
     * 修改
     */
 /*   jQuery('#user-index .whui-btn-update').click(function() {
        var checkStatus = table.checkStatus('user-table');
      
        // console.log(checkStatus.data) //获取选中行的数据
        // console.log(checkStatus.data.length) //获取选中行数量，可作为是否有选中行的条件
        // console.log(checkStatus.isAll) //表格是否全选

        var editdata = checkStatus.data;
        var eidtlen = editdata.length;

        if(eidtlen>1 || eidtlen == 0){
            whui.msg.warn("请选择一条记录进行编辑！");
            return false;
        }
        console.log(editdata[0].id)
        jQuery.get('../../user/user-edit/user-edit.html', function(html) {
            layer.open({
                content: html,
                id: 'user_edit',
                title: '修改',
                type: 1,
                area: ['500px', '300px'],
                btn: ['确认', '取消'],
                success: function(layero, index){
                    form.val('user-edit-form', {
                        'id': editdata[0].id,
                        'account': editdata[0].account,
                        'name': editdata[0].name,
                        'mail': editdata[0].mail,
                        'phone': editdata[0].phone
                    });
                },
                yes: function(index, layero) {

                    form.on('submit(user-edit-submit)', function(data) {
                    
                        layer.close(index);
                        whui.request(layui.whconfig.sysurl.user.edit, data.field, function(data,desc){
                            whui.msg.warn(desc);
                            query(table);
                        });
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                    jQuery('button[lay-filter="user-edit-submit"]').click();
                }
            });
        });
    });
*/
  jQuery('#loginLog-index .whui-btn-delete').click(function() {
        var checkStatus = table.checkStatus('loginLog-table');
        var ids = '';
        layui.each(checkStatus.data,function(index, item){
            ids += item.id +',';
        });

        var params = {
            ids:ids
        }
        if(isNull(ids)){
        	whui.msg.warn("请选择要删除的登录日志");
        	return;
        }
        layer.open({
            title: '删除',
            content: '是否删除所选信息？',
            btn: ['删除', '取消'],
            yes: function(index, layero) {
                layer.close(index);
                whui.request(layui.whconfig.bizurl.loginLog.delete, params, function(data,desc){
                        whui.msg.warn(desc);
                        query(table);
                },function(data){
                    whui.msg.warn(desc);
                    if (data.code == 200){
                        whui.msg.warn(data.msg);
                        query(table);
                    }else{
                        whui.msg.warn(data.msg);
                    }
                });
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            }
            });
    });

    function query(table, where) {
        where = where || {};
        table.render({
            elem: '#loginLog-table',
            id: 'loginLog-table',
            url: layui.whconfig.bizurl.loginLog.query,
            where: where,
            cols: cols
        });
    }
    laydate.render({
    	  elem: '#loginLog-index #beginTime',
          type: 'datetime',
          range: true
    })
    function isNull(str){
    	if(str==null||str==''||str=="undefined"){
    		return true;
    	}
    }
});