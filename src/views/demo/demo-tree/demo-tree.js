layui.use(['table', 'form','zTree','whcomm'], function() {
	var table = layui.table;
	var zTree = layui.zTree;
	var whcomm = layui.whcomm;
	
	whcomm.ui.form.querymore('demo-tree');
	whcomm.ui.form.verifyRequired('demo-tree');
	
	var cols;
	jQuery.getJSON("../../demo/demo-tree/demo-tree.json", function(data) {
		cols = data.cols;
		query(table);
	});
	
	

	var zTreeObj;
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
	// zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
	var zNodes = [{
			name: "test1",
			open: true,
			children: [{
				name: "test1_1"
			}, {
				name: "test1_2"
			}]
		},
		{
			name: "test2",
			open: true,
			children: [{
				name: "test2_1"
			}, {
				name: "test2_2"
			}]
		}
	];

	zTree.init(jQuery("#tree"), setting, zNodes);
	
	
	
	
	
	
	function query(table, where) {
		where = where || {};

		table.render({
			elem: '#demo-tree-table',
			id: 'demo-tree-table',
			url: layui.whconfig.bizurl.demo.query,
			where: where,
			cols: cols
		});
	}
	
});