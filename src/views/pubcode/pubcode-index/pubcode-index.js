layui.use(['admin', 'table', 'form', 'layer'], function() {
	var table = layui.table;
	var form = layui.form;
	var layer = layui.layer;
	var whconfig = layui.whconfig;
	var whui = layui.whui;

	var cols;
	jQuery.getJSON("../../pubcode/pubcode-index/pubcode-index.json", function(data) {
		cols = data.cols;
		query(table);
	});

	/**
	 * 查询
	 */
	jQuery("#pubcode-index .whui-btn-query").click(function() {
		form.on('submit(pubcode-query-btn)', function(data) {
			query(table, data.field);
			return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		});
		jQuery('button[lay-filter="pubcode-query-btn"]').click();
	});

	/**
	 * 重置
	 */
	jQuery('#pubcode-index .whui-btn-reset').click(function() {
		form.val('pubcode-query-form', {
			'configCode': '',
			'configName': ''
		});
	});

	/**
	 * 新增
	 */
	jQuery('#pubcode-index .whui-btn-add').click(function() {
		jQuery.get('../../pubcode/pubcode-add/pubcode-add.html', function(html) {
			layer.open({
				content: html,
				id: 'pubcode-add',
				title: '新增',
				type: 1,
				area: ['500px', '300px'],
				btn: ['确认', '取消'],
				yes: function(index, layero) {

					form.on('submit(pubcode-add-submit)', function(data) {
						//TODO
						layer.close(index);
						whui.request(layui.whconfig.bizurl.pubcode.add, data.field, function(data, desc) {
							whui.msg.success(desc);
							query(table);
						});

						// console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
						// console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
						// console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
						return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
					});
					jQuery('button[lay-filter="pubcode-add-submit"]').click();
				}
			});
		});

	});

	/**
	 * 修改
	 */
	jQuery('#pubcode-index .whui-btn-update').click(function() {
		var checkStatus = table.checkStatus('pubcode-table');
		//TODO
		// console.log(checkStatus.data) //获取选中行的数据
		// console.log(checkStatus.data.length) //获取选中行数量，可作为是否有选中行的条件
		// console.log(checkStatus.isAll) //表格是否全选

		var editdata = checkStatus.data;
		var eidtlen = editdata.length;

		if(eidtlen > 1 || eidtlen == 0) {
			whui.msg.warn("请选择一条记录进行编辑！");
			return false;
		}
		console.log(editdata[0].id)
		jQuery.get('../../pubcode/pubcode-edit/pubcode-edit.html', function(html) {
			layer.open({
				content: html,
				id: 'pubcode-edit',
				title: '修改',
				type: 1,
				area: ['500px', '300px'],
				btn: ['确认', '取消'],
				success: function(layero, index) {
					form.val('pubcode-edit-form', {
						'tbpubcodeId': editdata[0].tbpubcodeId,
						'configCode': editdata[0].configCode,
						'configName': editdata[0].configName,
						'notice': editdata[0].notice
					});
				},
				yes: function(index, layero) {

					form.on('submit(pubcode-edit-submit)', function(data) {
						//TODO
						layer.close(index);
						whui.request(layui.whconfig.bizurl.pubcode.edit, data.field, function(data, desc) {
							whui.msg.success(desc);
							query(table);
						});
						return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
					});
					jQuery('button[lay-filter="pubcode-edit-submit"]').click();
				}
			});
		});
	});
	
	/**
	 * 删除
	 */
	jQuery('#pubcode-index .whui-btn-delete').click(function() {
		var checkStatus = table.checkStatus('pubcode-table');
		var ids = '',codes='';
		layui.each(checkStatus.data, function(index, item) {
			ids += item.tbpubcodeId + ',';
			codes=item.configCode+',';
		});

		var params = {
			ids: ids,
			codes:codes
		}
		layer.open({
			title: '删除',
			content: '是否删除所选信息？',
			btn: ['删除', '取消'],
			yes: function(index, layero) {
				layer.close(index);
				whui.request(layui.whconfig.bizurl.pubcode.delete, params, function(data, desc) {
					whui.msg.success(desc);
					query(table);
				}, function(data) {
					whui.msg.failed(data.desc);
					query(table);
				});
				return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
			}
		});
	});

	function query(table, where) {
		where = where || {};
		table.render({
			elem: '#pubcode-table',
			id: 'pubcode-table',
			url: layui.whconfig.bizurl.pubcode.query,
			where: where,
			cols: cols,
			done: function(res, curr, count) {
				jQuery('[data-field="tbpubcodeId"]').css('display', 'none');
			}
		});
	}

	//----------------------------------------------------------------
	//--------------------通用代码档二级菜单js--------------------------
	//----------------------------------------------------------------
	//二级菜单表格的列
	var cols01;
	jQuery.getJSON("../../pubcode/pubcode01-index/pubcode01-index.json", function(data) {
		cols01 = data.cols;
		query01(table);
	});

	jQuery("#pubcode-index .whui-btn-list").click(function() {
		var checkStatus = table.checkStatus('pubcode-table');
		//TODO
		// console.log(checkStatus.data) //获取选中行的数据
		// console.log(checkStatus.data.length) //获取选中行数量，可作为是否有选中行的条件
		// console.log(checkStatus.isAll) //表格是否全选

		var editdata = checkStatus.data;
		var eidtlen = editdata.length;

		if(eidtlen > 1 || eidtlen == 0) {
			whui.msg.warn("请选择一条记录！");
			return false;
		}
		var tbpubcodeId = editdata[0].tbpubcodeId;
		var configCode = editdata[0].configCode;

		var param = {
			tbpubcodeId: tbpubcodeId
		};

		jQuery.get('../../pubcode/pubcode01-index/pubcode01-index.html', function(html) {
			layer.open({
				content: html,
				id: 'pubcode01-index',
				title: '二级',
				type: 1,
				area: ['800px', '600px'],
				btn: ['确认', '关闭'],
				success: function(layero, index) {
					query01(table, param);
					//新增二级菜单
					jQuery('#pubcode01-index .whui-btn-add').click(function() {
						jQuery.get('../../pubcode/pubcode01-add/pubcode01-add.html', function(html) {
							layer.open({
								content: html,
								id: 'pubcode01-add',
								title: '新增',
								type: 1,
								area: ['500px', '300px'],
								btn: ['确认', '取消'],
								success: function(layero, index) {
									form.val('pubcode01-add-form', {
										'tbpubcodeId': tbpubcodeId,
										'configCode01': configCode
									});
								},
								yes: function(index, layero) {
									form.on('submit(pubcode01-add-submit)', function(data) {
										//TODO 
										layer.close(index);
										whui.request(layui.whconfig.bizurl.pubcode.add01, data.field, function(data, desc) {
											whui.msg.success(desc);
											query01(table, param);
										});

										// console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
										// console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
										// console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
										return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
									});
									jQuery('button[lay-filter="pubcode01-add-submit"]').click();
								}
							});
						});
					});

					//修改二级菜单
					jQuery('#pubcode01-index .whui-btn-update').click(function() {
						var checkStatus01 = table.checkStatus('pubcode01-table');
						//TODO
						// console.log(checkStatus.data) //获取选中行的数据
						// console.log(checkStatus.data.length) //获取选中行数量，可作为是否有选中行的条件
						// console.log(checkStatus.isAll) //表格是否全选

						var editdata01 = checkStatus01.data;
						var eidtlen01 = editdata01.length;

						if(eidtlen01 > 1 || eidtlen01 == 0) {
							whui.msg.warn("请选择一条记录进行编辑！");
							return false;
						}

						jQuery.get('../../pubcode/pubcode01-edit/pubcode01-edit.html', function(html) {
							layer.open({
								content: html,
								id: 'pubcode01-edit',
								title: '修改',
								type: 1,
								area: ['500px', '300px'],
								btn: ['确认', '取消'],
								success: function(layero, index) {
									form.val('pubcode01-edit-form', {
										'tbpubcode01Id': editdata01[0].tbpubcode01Id,
										'configCode01': editdata01[0].configCode,
										'seq': editdata01[0].seq,
										'desc': editdata01[0].desc0,
										'desc1': editdata01[0].desc1,
										'desc2': editdata01[0].desc2,
										'desc3': editdata01[0].desc3,
									});
								},
								yes: function(index, layero) {
									form.on('submit(pubcode01-edit-submit)', function(data) {
										//TODO 
										layer.close(index);
										whui.request(layui.whconfig.bizurl.pubcode.edit01, data.field, function(data, desc) {
											whui.msg.success(desc);
											query01(table, param);
										});

										// console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
										// console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
										// console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
										return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
									});
									jQuery('button[lay-filter="pubcode01-edit-submit"]').click();
								}
							});
						});
					});

					//删除二级菜单
					jQuery('#pubcode01-index .whui-btn-delete').click(function() {
						var checkStatus01 = table.checkStatus('pubcode01-table');
						var ids = '';
						layui.each(checkStatus01.data, function(index, item) {
							ids += item.tbpubcode01Id + ',';
						});

						var params = {
							ids: ids
						}
						layer.open({
							title: '删除',
							content: '是否删除所选信息？',
							btn: ['删除', '取消'],
							yes: function(index, layero) {
								layer.close(index);
								whui.request(layui.whconfig.bizurl.pubcode.delete01, params, function(data, desc) {
									whui.msg.success(desc);
									query01(table);
								}, function(data) {
									whui.msg.failed(data.desc);
									query01(table);
								});
								return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
							}
						});
					});

				},
				yes: function(index, layero) {

				}
			});
		});

	});

	function query01(table, where) {
		where = where || {};
		table.render({
			elem: '#pubcode01-table',
			id: 'pubcode01-table',
			url: layui.whconfig.bizurl.pubcode.query01,
			where: where,
			cols: cols01,
			done: function(res, curr, count) {
				jQuery('[data-field="tbpubcode01Id"]').css('display', 'none');
			}
		});
	}

})