layui.use(['table', 'form', 'layer', 'dateformat', 'whcomm', 'upload'], function() {
	var table = layui.table;
	var form = layui.form;
	var layer = layui.layer;
	var upload = layui.upload;
	var whconfig = layui.whconfig;
	var dateformat = layui.dateformat;
	var whcomm = layui.whcomm;

	whcomm.ui.form.querymore('demo-index');
	whcomm.ui.form.verifyRequired('demo-index');
	//	console.log(dateformat.format(new Date(), 'yyyy-M-dd'));

	var cols;
	jQuery.getJSON("../../demo/demo-index/demo-index.json", function(data) {
		cols = data.cols;
		query(table);
	});

	function query(table, where) {
		where = where || {};

		table.render({
			elem: '#demo-index-table',
			id: 'demo-index-table',
			url: layui.whconfig.bizurl.demo.query,
			where: where,
			cols: cols
		});
	}

	/**
	 * 查询
	 */
	jQuery('#demo-index .whui-btn-query').click(function() {
		form.on('submit(demo-query-btn)', function(data) {
			query(table, data.field);
			return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		});
		jQuery('button[lay-filter="demo-query-btn"]').click();
	});

	/**
	 * 重置
	 */
	jQuery('#demo-index .whui-btn-reset').click(function() {
		form.val('demo-query-form', {
			'userName': '方天涯',
			'sex': '女',
			'auth': 3,
			'check[write]': true,
			'open': false,
			'desc': '描述'
		});
	});

	/**
	 * 新增
	 */
	jQuery('#demo-index .whui-btn-add').click(function() {
		//iframe
//		layer.open({
//			content: '../../demo/demo-add2/demo-add2.html',
//			id: 'demo-add2',
//			title: '新增-iframe',
//			type: 2,
//			area: ['500px', '300px'],
//			btn: ['确认', '取消'],
//			yes: function(index, layero) {
//				form.on('submit(demo-add-submit)', function(data) {
//					layer.close(index);
//					//TODO 
//					console.log(data.elem); //被执行事件的元素DOM对象，一般为button对象
//					console.log(data.form); //被执行提交的form对象，一般在存在form标签时才会返回
//					console.log(data.field); //当前容器的全部表单字段，名值对形式：{name: value}
//					return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
//				});
//				jQuery('button[lay-filter="demo-add-submit"]').click();
//
//			}
//		});
		//html片段
				jQuery.get('../../demo/demo-add/demo-add.html', function(html) {
					layer.open({
						content: html,
						id: 'demo-add',
						title: '新增-html片段',
						type: 1,
						area: ['500px', '300px'],
						btn: ['确认', '取消'],
						yes: function(index, layero) {
							form.on('submit(demo-add-submit)', function(data) {
								layer.close(index);
								//TODO 
								console.log(data.elem); //被执行事件的元素DOM对象，一般为button对象
								console.log(data.form); //被执行提交的form对象，一般在存在form标签时才会返回
								console.log(data.field); //当前容器的全部表单字段，名值对形式：{name: value}
								return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
							});
							jQuery('button[lay-filter="demo-add-submit"]').click();
		
						}
					});
				});

	});

	/**
	 * 修改
	 */
	jQuery('#demo-index .whui-btn-update').click(function() {
		var checkStatus = table.checkStatus('demo-table');

		var params = {
			"a": 1,
			"b": "2"
		};
		layui.whui.request(whconfig.bizurl.demo.query, params, function(data) {
			console.log(data);
		});

		//TODO
		console.log(checkStatus.data); //获取选中行的数据
		console.log(checkStatus.data.length); //获取选中行数量，可作为是否有选中行的条件
		console.log(checkStatus.isAll); //表格是否全选
	});

	/**
	 * 树
	 */
	jQuery('#demo-index #open-tree').click(function() {
		jQuery.get('../../demo/demo-tree/demo-tree.html', function(html) {
			layer.open({
				content: html,
				id: 'demo-index-tree',
				title: '树',
				type: 1,
				area: ['500px', '300px'],
				btn: ['确认', '取消'],
				yes: function(index, layero) {
					layer.close(index);

				}
			});
		});
	});

	/**
	 * 上传
	 */
	jQuery('#demo-index .whui-btn-upload').click(function() {
		//选完文件后不自动上传
		var obj = upload.render({
			elem: '.whui-btn-upload',
			url: '/upload/',
			auto: false,
			bindAction: '.whui-btn-download',
			done: function(res, index, upload) {
				console.log(res);
				console.log(index);
				console.log(upload);
			},
			error: function(index, upload) {
				console.log(index);
				console.log(upload);
				console.log(obj);
				console.log(this.item);
			}
		});

	});

});