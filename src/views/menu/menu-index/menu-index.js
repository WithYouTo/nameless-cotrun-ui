if(layui.whui.isEmptyObject(layui.cache.modules.zTree)) {
    layui.extend({
        'zTree': '../../../plugins/modules/ztree/js/jquery.ztree.all.min'
    });
}

layui.use(['admin', 'table', 'form', 'layer',"zTree"], function() {
	var table = layui.table;
	var form = layui.form;
	var layer = layui.layer;
	var zTree = layui.zTree;
    var addzTree = layui.zTree;
	var whconfig = layui.whconfig;
	var whui = layui.whui;
    var treeObj = zTree.getZTreeObj("menu-tree");

	var cols;
	jQuery.getJSON("../../menu/menu-index/menu-index.json", function(data) {
		cols = data.cols;
		query(table);
	});

    jQuery(function(){
        initTree();
    });



    /**
	 * 查询
	 */
	jQuery('#menu-index .whui-btn-query').click(function() {
		form.on('submit(menu-query-btn)', function(data) {
			query(table, data.field);
			return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		});
		jQuery('button[lay-filter="menu-query-btn"]').click();
	});

	/**
	 * 重置
	 */
	jQuery('#menu-index .whui-btn-reset').click(function() {
		form.val('menu-query-form', {
			'name': ''
		});
	});

	/**
	 * 新增
	 */
	jQuery('#menu-index .whui-btn-add').click(function() {
		jQuery.get('../../menu/menu-add/menu-add.html', function(html) {
			layer.open({
				content: html,
				id: 'menu_add',
				title: '新增',
				type: 1,
				area: ['500px', '300px'],
				btn: ['确认', '取消'],
				success:function(index,layero){
                    var addzTreeObj;
                    //初始化ztree
					initSelect('menu-add-select');
                    addzTreeObj =  addzTree.init(jQuery("#menu-add-tree"), addSetting, menus);
                    //触发菜单下拉框
                    jQuery('#menu-add-pMenu').click(function(){
                        jQuery('#pMenu').toggle();
                    })
				},
				yes: function(index, layero) {
					layer.close(index);

					form.on('submit(menu-add-submit)', function(data) {
						//TODO 新增菜单
                        whui.request(layui.whconfig.sysurl.menu.add, data.field, function(data,desc){
                            whui.msg.warn(desc);
                            query(table);
                            initTree();
                        });
						return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
					});
					jQuery('button[lay-filter="menu-add-submit"]').click();
				}
			});
		});
	});



	/**
	 * 修改
	 */
	jQuery('#menu-index .whui-btn-update').click(function() {
		var checkStatus = table.checkStatus('menu-table');
        var editdata = checkStatus.data;
        var eidtlen = editdata.length;

        if(eidtlen>1 || eidtlen == 0){
            whui.msg.warn("请选择一条记录进行编辑！");
            return false;
        }
        jQuery.get('../../menu/menu-edit/menu-edit.html', function(html) {
            layer.open({
                content: html,
                id: 'menu_edit',
                title: '修改',
                type: 1,
                area: ['500px', '300px'],
                btn: ['确认', '取消'],
                success:function(index,layero){
                    var addzTreeObj;
                    initSelect('menu-edit-select');
                    //初始化ztree
                    addzTreeObj =  addzTree.init(jQuery("#menu-edit-tree"), editSetting, menus);
                    //触发菜单下拉框
                    jQuery('#menu-edit-pMenu').click(function(){
                        jQuery('#pMenu').toggle();
                    })
                    var node = addzTreeObj.getNodeByParam("id", editdata[0].pcode, null);
                    var pmenu;
                    if(node == null){
						pmenu = '顶级';
					}else{
                        pmenu = node.name;
					}
                    form.val('menu-edit-form', {
                        'id': editdata[0].id,
                        'url': editdata[0].url,
                        'name': editdata[0].name,
                        'pcode': editdata[0].pcode,
                        // 'num': editdata[0].num,
						'pmenu': pmenu,
                        'ismenu': editdata[0].ismenu
                    });
                },
                yes: function(index, layero) {
                    layer.close(index);
                    form.on('submit(menu-edit-submit)', function(data) {
                        //TODO 修改菜单

                        whui.request(layui.whconfig.sysurl.menu.edit, data.field, function(data,desc){
                            whui.msg.warn(desc);
                            query(table);
                            initTree();
                        });
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                    jQuery('button[lay-filter="menu-edit-submit"]').click();
                }
            });
        });
	});

	/*
	* 删除
	* */
    jQuery('#menu-index .whui-btn-delete').click(function() {
        var checkStatus = table.checkStatus('menu-table');
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
                whui.request(layui.whconfig.sysurl.menu.delete, params,
                    function(data,desc){
                        whui.msg.warn(desc);
                        query(table);
                        initTree();
                    });
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            }
        });
    });


	function query(table, where) {
		where = where || {};

		table.render({
			elem: '#menu-table',
			id: 'menu-table',
			url: layui.whconfig.sysurl.menu.query,
			where: where,
			cols: cols
		});
	}

    var zTreeObj;
	var menus;
	function initTree(){
        whui.request(layui.whconfig.sysurl.menu.getMenus,"",
            function(data,desc){
                menus = data;
                console.log(menus);
                // var zNodes = transData(data, 'code', 'pcode', 'children');
                // console.log(zNodes);
                zTreeObj =  zTree.init(jQuery("#menu-tree"), setting, menus);
            });
	}



    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        check: {
            enable: false,
            chkStyle: "checkbox",
            chkboxType: {
                "Y": "ps",
                "N": "s"
            }
        },
        callback: {
            onClick: zTreeOnClick
        }
    };

    /*
     * 新增弹出框zTree配置
     */
    var addSetting = {
        check: {
            enable: false,
            chkStyle: "checkbox",
            chkboxType: {
                "Y": "ps",
                "N": "s"
            }
        },
		callback: {
                onClick: setAddFormValue
		}
    };

    /*
    * 修改弹出框zTree配置
    */
    var editSetting = {
        check: {
            enable: false,
            chkStyle: "checkbox",
            chkboxType: {
                "Y": "ps",
                "N": "s"
            }
        },
        callback: {
            onClick: setEditFormValue
        }
	};

    /*
    * 主页面zTree回调方法点击树节点获取节点信息
    */
    function zTreeOnClick(event, treeId, treeNode) {
        var params = {
        	code:treeNode.id
		}
        query(table,params);
    };

    /*
     * 新增弹出框zTree回调方法
     */
    function setAddFormValue(event, treeId, treeNode){
        form.val('menu-add-form', {
            'pcode': treeNode.id,
            'pmenu': treeNode.name
        });
    }

    /*
    * 修改弹出框zTree回调方法
    */
    function setEditFormValue(event, treeId, treeNode){
        form.val('menu-edit-form', {
            'pcode': treeNode.id,
            'pmenu': treeNode.name
        });
    }

    /*
    * 初始化下拉框
    * */
    function initSelect(selectId){
    	var option ='<option value=""></option><option value="1">是</option><option value="0">否</option>';
    	jQuery('#'+selectId).append(option);
    	form.render();
    }

});