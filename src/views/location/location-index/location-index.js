layui.use(['table', 'form','zTree','whcomm'], function() {
	var table = layui.table;
	var zTree = layui.zTree;
	var whui=layui.whui;
	var locationUrl=layui.whconfig.bizurl.location;
	var form = layui.form;
	var zTreeObj;
	// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
	var setting = {
		async: {
			enable: true
		},
		data: {
			key:{
				name:"name"
			},
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "pId",
				rootPId: '-1'
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
			onClick: zTreeOnClick
		}
	};
	/*初始化加载ztree*/
	function onloadZTree (){ 
		debugger;
		whui.request(locationUrl.load,{},
		function(data,desc){
			var ztreeNodes = data.locationList; 
		    $.fn.zTree.init($( "#tree"), setting, ztreeNodes);  
		}
	);
  }
	jQuery(function(){
		onloadZTree();
	});
	/*-----------------------初始化加载tree-------------------------------------end*/
	/*onclick事件-------------------------start-----------------------------------*/
	var cols;
	jQuery.getJSON("../../location/location-index/location-index.json", function(data) {
		cols = data.cols;
		query(table);
	});
	function zTreeOnClick(event, treeId, treeNode) {
	    search(treeNode.id);
		var zTree = $.fn.zTree.getZTreeObj("tree");
		if(treeNode.open){
			zTree.expandNode(treeNode, false, false, true);
		}else{
			zTree.expandNode(treeNode, true, false, true);
		}
	};
	function search(id){
		var where = {
    		pId: id
    	}
		query(table,where);
	}
	
	function query(table, where) {
		where = where || {};
		table.render({
			elem: '#location-tree-table',
			id: 'location-tree-table',
			url: layui.whconfig.bizurl.location.query,
			where: where,
			cols: cols
		});
	}	
});