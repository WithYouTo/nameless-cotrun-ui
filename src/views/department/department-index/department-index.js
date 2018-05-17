//if(layui.whui.isEmptyObject(layui.cache.modules.zTree)) {
//	layui.extend({
//		'zTree': '../../../plugins/modules/ztree/js/jquery.ztree.all.min'
//	});
//}

layui.use(['table', 'form','zTree','layer'], function() {
	var table = layui.table;
	var zTree = layui.zTree;
	var layer = layui.layer;
	var whui = layui.whui;
    var $ = layui.jquery;
	//部门维护的url
	var departmentUrl=layui.whconfig.bizurl.department;

	var cols;
	jQuery.getJSON("../../department/department-index/department-index.json", function(data) {
		cols = data.cols;
		query(table);
	});
	
	//部门树对象
	var Dept={
	    oldNodeName:""//用于捕获编辑按钮的 click 事件，并且根据返回值确定是否允许进入名称编辑状态
	};

    Dept.reset=function(){
    	$('#department-index #name').val('');
    }
	/**
	 * 根据树的节点查询  子节点数据
	 * @param {Object} tbdd04Id
	 */
	Dept.search=function(tbdd04Id){
		var where = {
    		parentTbbb04Id: tbdd04Id
    	}
		query(table,where);
	}
	
	//树的点击前事件
	Dept.beforeEditName=function(treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("tree");
		zTree.selectNode(treeNode);
		return true;
	}
	
	//用于捕获编辑名称结束（Input 失去焦点 或 按下 Enter 键）之后，更新分类名称数据之前的事件回调函数  
	Dept.beforeRename=  function(treeId, treeNode, newName) { 
		
    	Dept.oldNodeName=treeNode.deptName;
    	var zTree = $.fn.zTree.getZTreeObj("tree");
        if (newName.length == 0 || newName.indexOf("请输入名称")>=0) {  
             setTimeout( function(){zTree.editName(treeNode)}, 10);  
             return false;  
        }  
        if(newName.length > 25){  
            setTimeout( function(){zTree.editName(treeNode)}, 10);  
            return false;  
        }
        return true;  
	};
	
	//执行编辑操作  
	Dept.onRename= function(e, treeId, treeNode) { 
		//debugger;
		//没做修改 不调用后台
		if(Dept.oldNodeName==treeNode.deptName){
			return;
		}
    	var zTree = $.fn.zTree.getZTreeObj("tree");
        var params = {tbbb04Id:treeNode.tbbb04Id,
      		   parentTbbb04Id:treeNode.parentTbbb04Id,
      		   deptName:treeNode.deptName};  
        whui.request(departmentUrl.edit,params,
        	function(data){
        		if(data.result == "1" ){
               	  	message('修改成功','success');
	               	if(treeNode.isParent){
	               		Dept.search(treeNode.tbbb04Id);
	              	}
               	    zTree.updateNode(treeNode);
                 }else if(data.result == "2" ){
                	message('该名称已存在，请重新命名','warn');
                	zTree.cancelEditName(Dept.oldNodeName);
                	//Dept.onloadZTree();
                	treeNode.deptName=Dept.oldNodeName;
                	zTree.updateNode(treeNode);
                	//zTree.selectNode(treeNode);
                  }else if(data.result == "-1" ){
                	message('公司名称只能在公司管理页面修改','warn');
                  }else{   
                	 message('操作失败，请稍后再试！','warn');
                  }  
        	},
        	function(){
        		message('网络繁忙......！','fail');
        	}
        ); 
	} ;
	
	//新增部门树的一个节点
	Dept.add=function (e) {
		var name=$('#department-index #name').val(),
		ok=true,parentNode;
		var zTree = $.fn.zTree.getZTreeObj("tree"),
		isParent = e.isParent,
		nodes = zTree.getSelectedNodes(),
		treeNode = nodes[0];
		parentNode=treeNode;
		if(!name){
			message('部门名称不能为空！','warn');
			ok=false;
		}
		
		if(ok&&treeNode){
			var parentTbbb04Id=treeNode.tbbb04Id;
			var params = {
	       			deptName : name,
	       			parentTbbb04Id:parentTbbb04Id
	    	};
	    	whui.request(departmentUrl.add,params,
	    		function(data){
	    			if(data.result == "2" ){
            		    message('该名称已存在，请重新命名！','warn');
                    }else if(data.result == "1" ){
	            		if(data.tbbb04Id != "" ){  
		           			var tbbb04Id=data.tbbb04Id;
		           			var treeNode={tbbb04Id:tbbb04Id, parentTbbb04Id:parentTbbb04Id,isParent:false, deptName:name};
		           			zTree.addNodes(nodes[0],treeNode);
	                    }
	            		Dept.reset();
                    }
            	    zTree.selectNode(parentNode);
            	    Dept.search(parentNode.tbbb04Id);
	    		},
	    		function(){
	    			message('网络繁忙!','fail');
	    		}
	    	);
		}
	};
	
	//树的点击事件
	Dept.onClick= function (event, treeId, treeNode) {
		Dept.search(treeNode.tbbb04Id);
		var zTree = $.fn.zTree.getZTreeObj("tree");
		if(treeNode.open){
			zTree.expandNode(treeNode, false, false, true);
		}else{
			zTree.expandNode(treeNode, true, false, true);
		}
	};
	
	/**
	 * 禁止树的拖拽
	 */
	Dept.beforeDrag =function(){
		return false;
	}
	
	/**
	 * 初始化的设置
	 */
	Dept.setting = {
			async: {
				enable: true
			},
			data: {
				key:{
					name:"deptName"
				},
				simpleData: {
					enable: true,
					idKey: "tbbb04Id",
					pIdKey: "parentTbbb04Id",
					rootPId: -1
				}
			},
			view: {
				dblClickExpand: false,
				selectedMulti: false,
			},
			edit: {
				enable: true,
				editNameSelectAll: true,
				showRemoveBtn: false, 
				showRenameBtn: false
			},
			callback: {
				beforeEditName: Dept.beforeEditName,//点击编辑时触发，用来判断该节点是否能编辑
				beforeRename:Dept.beforeRename,//编辑结束时触发，用来验证输入的数据是否符合要求
				onRename:Dept.onRename,//编辑后触发，用于操作后台
				onClick:Dept.onClick,
				beforeDrag:Dept.beforeDrag 
			}
			
		}; 
		
		  
	/**修改节点名称*/
	Dept.edit=function() {
		var zTree = $.fn.zTree.getZTreeObj("tree"),
		nodes = zTree.getSelectedNodes(),
		treeNode = nodes[0];
		
		if (nodes.length == 0) {
			message('请先选择一个节点','warn');
			return;
		}else{
			var treeNode=nodes[0];
			var parentTbbb04Id=treeNode.parentTbbb04Id;
			//顶级节点公司名称     不允许修改
			if('-1'==parentTbbb04Id){
				message('公司名称只能在公司管理页面修改','warn');
				return ;
			}
		}
		zTree.editName(treeNode);
	};
		
	
	Dept.beforeEditName=function (treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj("tree");
		zTree.selectNode(treeNode);
		return true;
	}
	
	//加载ztree  
	Dept.onloadZTree=function (){  
		var ztreeNodes;  
		whui.request(departmentUrl.initTree,{},
		  	function(data){
		  		ztreeNodes = data; //将string类型转换成json对象  
		        $.fn.zTree.init($( "#tree"), Dept.setting, ztreeNodes);  
		  	},
		  	function(){
		  		 whui.msg.warn('网络繁忙','fail');
		  	}
		);
	}  
	
	/**
	 * 初始化部门树
	 */
	jQuery(function(){
		Dept.onloadZTree();
	});
	
	/**
     * 新增叶子节点
     */
    jQuery('#department-index .whui-btn-add').click(function() {
    	Dept.add({isParent:true});
    })
    
	/**
     * 编辑名称
     */
    jQuery('#department-index .whui-btn-update').click(function() {
    	Dept.edit();
    })
    
    /**
     * 删除部门
     */
    //监听工具条
	table.on('tool(departmentFilter)', function(obj){
		//注：tool是工具条事件名，departmentFilter是table原始容器的属性 lay-filter="对应的值"
		var data = obj.data; //获得当前行数据
		var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
		var tr = obj.tr; //获得当前行 tr 的DOM对象
		  
		var deptName=data.deptName;
		var tbbb04Id=data.tbbb04Id;
    	
    	//根据部门名称   拿到表格行  对应的树节点
    	var zTree = $.fn.zTree.getZTreeObj("tree");
    	var node = zTree.getNodeByParam("deptName", deptName, null);
    	var parentNode = node.getParentNode();
    	var parentId=parentNode.tbbb04Id;
		  
		
		var params = {
	   		tbbb04Id : tbbb04Id
		}
		 
	    if(layEvent === 'del'){ //删除
	        layer.confirm('确定删除吗？', function(index){
		      	//向服务端发送删除指令
		         whui.request(departmentUrl.delete, params, function(data,desc){
	                  if(data.result == '1'){
	 					zTree.removeNode(node);
	 					message('删除成功','success');
	 					Dept.search(parentId);
	 					return;
	 				}else if(data.result == '-1'){
	 					message('参数为空','warn');
	 					return;
	 				}else if(data.result == '2'){
	 					message('删除失败，部门正在使用中！','warn');
	 					return;
	 				}else if(data.result == '3'){
	 					message('该部门存在子部门，无法删除！','warn');
	 					return;
	 				}else{
	 					message('程序异常','fail');
	 					return;
	 				}
	            },function(data){
	                message('网络繁忙','fail');
	            });
		      	layer.close(index);
	        });
	    } 
	});
    
	/**
	 * 给出消息提示
	 * @param {Object} mes
	 */
    function message(mes,type){
    	 if("success"==type){
    	 	 whui.msg.success(mes);
    	 }else if("fail"==type){
    	 	 whui.msg.failed(mes);
    	 }else if("warn"==type){
    	 	 whui.msg.warn(mes);
    	 }
    }
	
	/**
	 * 部门信息  查询
	 * @param {Object} table
	 * @param {Object} where
	 */
	function query(table, where) {
		where = where || {};

		table.render({
			elem: '#department-tree-table',
			id: 'department-tree-table',
			url: layui.whconfig.bizurl.department.query,
			where: where,
			cols: cols
			 //隐藏列，传入cols时不设置该列，取出数据是仍可取到该列的数据
//			done:function(res, curr, count){
//				$("[data-field='tbbb04Id']").css('display','none');
//			}
		});
	}
	
});