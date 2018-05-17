layui.use(['admin', 'table', 'form', 'layer','zTree'], function() {
    var table = layui.table;
    var zTree = layui.zTree;
    var form = layui.form;
    var layer = layui.layer;
    var whconfig = layui.whconfig;
	var whui = layui.whui;
	
    var cols;
    jQuery.getJSON("../../role/role-index/role-index.json", function(data) {
        cols = data.cols;
        query(table);
    });

    /**
     * 查询
     */
    jQuery('#role-index .whui-btn-query').click(function() {
        form.on('submit(role-query-btn)', function(data) {
            query(table, data.field);
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        jQuery('button[lay-filter="role-query-btn"]').click();
    });

    /**
     * 重置
     */
    jQuery('#role-index .whui-btn-reset').click(function() {
        form.val('role-query-form', {
            'roleName': '',
            'companyName': ''
        });
    });


	/**
     * 新增
     */
    jQuery('#role-index .whui-btn-add').click(function() {
        jQuery.get('../../role/role-add/role-add.html', function(html) {
        	form.render('select');
            layer.open({
                content: html,
                id: 'role-add',
                title: '新增',
                type: 1,
                area: ['500px', '220px'],
                btn: ['确认', '取消'],
                success: function(layero, index){
                	//初始化公司下拉框
                	initCompanySelect('#role-add #companycode');
                },
                yes: function(index, layero) {

                    form.on('submit(role-add-submit)', function(data) {
                        //TODO
                        whui.request(layui.whconfig.sysurl.role.add, data.field, function(data,desc){
                            layer.close(index);
                            whui.msg.success(desc);
                            query(table);
                        },function(data){
                        	whui.msg.warn(data.desc);
		                });
						
                        // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
                        // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
                        // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                    jQuery('button[lay-filter="role-add-submit"]').click();
                }
            });
        });

    });
    
    jQuery(function(){
		initCompanySelect('#role-index #companyName');
	});

	/**
	 * 初始化公司选择下拉框
	 * @param {Object} companyId
	 */
    function initCompanySelect(companyId){
    	
    	whui.request(layui.whconfig.bizurl.webuser.initCompany,{},
			function(data,desc) {
				jQuery.each(data, function(index, value){
					var option = "<option value='"+value.code+"'>"+value.name+"</option>";
					jQuery(companyId).append(option);
				});
				form.render('select');
			}
		);
    }
    

	/**
     * 修改
     */
    jQuery('#role-index .whui-btn-update').click(function() {
        var checkStatus = table.checkStatus('role-table');

        var editdata = checkStatus.data;
        var eidtlen = editdata.length;

        if(eidtlen>1 || eidtlen == 0){
            whui.msg.warn("请选择一条记录进行编辑！");
            return false;
        }
        jQuery.get('../../role/role-edit/role-edit.html', function(html) {
            layer.open({
                content: html,
                id: 'role-edit',
                title: '修改',
                type: 1,
                area: ['500px', '220px'],
                btn: ['确认', '取消'],
                success: function(layero, index){
   					
   					form.val('role-edit-form', {
                        'id': editdata[0].id,
                        'companycode': editdata[0].companycode,
                        'num': editdata[0].num,
                        'name': editdata[0].name
                   });
              	  
                },
                yes: function(index, layero) {

                    form.on('submit(role-edit-submit)', function(data) {
                        //TODO
                        whui.request(layui.whconfig.sysurl.role.edit, data.field, function(data,desc){
                            whui.msg.success(desc);
                            layer.close(index);
                            query(table);
                            
                        },function(data){
                        	whui.msg.warn(data.desc);
		                });
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                    jQuery('button[lay-filter="role-edit-submit"]').click();
                }
            });
        });
    });
    
    jQuery('#role-index .whui-btn-delete').click(function() {
    	var checkStatus = table.checkStatus('role-table');
        var editdata = checkStatus.data;
        var eidtlen = editdata.length;

        if(eidtlen == 0){
            whui.msg.warn("请选择记录！");
            return false;
        }
        
        var ids = '';
        layui.each(checkStatus.data,function(index, item){
           ids += item.id +',';
        });
		
        var params = {
            ids:ids
        }
        layer.open({
            title: '删除',
            content: '是否删除所选信息？',
            btn: ['删除', '取消'],
            yes: function(index, layero) {
                layer.close(index);
                whui.request(layui.whconfig.sysurl.role.delete, params, function(data,desc){
                        whui.msg.success(desc);
                        query(table);
                },function(data){
                    whui.msg.warn(data.desc);
                });
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            }
            });
    });
    
    function query(table, where) {
        where = where || {};

        table.render({
            elem: '#role-table',
            id: 'role-table',
            url: layui.whconfig.sysurl.role.query,
            where: where,
            cols: cols
        });
    }

	
	var zTree_ids ;
	
	/**
     * 权限配置
     */
    jQuery('#role-index .whui-btn-upload').click(function() {
    	var checkStatus = table.checkStatus('role-table');
        var editdata = checkStatus.data;
        var eidtlen = editdata.length;

        if(eidtlen>1 || eidtlen == 0){
            whui.msg.warn("请选择一条记录进行编辑！");
            return false;
        }
        var param = {id : editdata[0].id}
        jQuery.get('../../role/role-auth/role-auth.html', function(html) {
            layer.open({
                content: html,
                id: 'role-auth',
                title: '权限配置',
                type: 1,
                area: ['500px', '660px'],
                btn: ['确认', '取消'],
                success: function(layero, index){
                	jQuery('#roleName').val(editdata[0].name);
                	//初始化
                	initTree(param);
                },
                yes: function(index, layero) {

					var id = editdata[0].id ;
				    var ids = getCheckedTreeNodeId();
				     
				     var params ={
						id : id,
						ids : ids
					}
                    form.on('submit(role-auth-submit)', function(data) {
                        //TODO
                        whui.request(layui.whconfig.sysurl.role.setAuthority, params, function(data,desc){
                            layer.close(index);
                            whui.msg.success(desc);
                        },function(data){
                        	whui.msg.warn(data.desc);
		                });
						
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                    jQuery('button[lay-filter="role-auth-submit"]').click();
                }
            });
        });

    });
 

    
    
    var zTreeObj;
	var menus;
	function initTree(param){
        whui.request(layui.whconfig.sysurl.menu.toMenu,param, function(data,desc){
                menus = data;
                zTreeObj =  zTree.init(jQuery("#auth-menu-tree"), setting, menus);
            });
	}



    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        check: {
            enable: true,
            chkStyle: "checkbox",
            chkboxType: {
                "Y": "ps",
                "N": "s"
            }
        }
    };
    
    function getCheckedTreeNodeId() {
         var checkCount = zTreeObj.getCheckedNodes(true);
		 var nodes = new Array();
	     for(i = 0; i < checkCount.length; i++) {
	          nodes[i] = checkCount[i].id;
	     }
	     return nodes.join(",") ;
    };
});