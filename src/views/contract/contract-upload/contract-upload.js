layui.use(['admin', 'table', 'form', 'layer', 'upload'], function() {
	var table = layui.table;
	var form = layui.form;
	var layer = layui.layer;
	var whconfig = layui.whconfig;
	var whui = layui.whui;
	var upload = layui.upload; //得到 upload 对象

	jQuery(function() {
		var param1 = {
			'configCode': "MANAGEMENT_NAME_"
		};
		initPubCode(param1, 'management_upload');
		jQuery("#delTip").css({
			"color": "red",
			"font-size": "12px"
		});

	});

	var cols;
	jQuery.getJSON("../../contract/contract-upload/contract-upload.json", function(data) {
		cols = data.cols;
		var managementId = jQuery("#management").val();
		query(table, managementId);
	});

	/**
	 * 下载模板
	 */
	jQuery("#contract-upload .whui-btn-download").click(function() {
		window.location.href = 'http://files.whmodern.cn/whxxesp/contract.xls';
	});

	/**
	 * 查询
	 */
	jQuery("#contract-upload .whui-btn-query").click(function() {
		form.on('submit(contract-query-btn)', function(data) {
			query(table, data.field);
			return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		});
		jQuery('button[lay-filter="contract-query-btn"]').click();
	});

	/**
	 * 重置
	 */
	jQuery('#contract-upload .whui-btn-reset').click(function() {
		form.val('contract-query-form', {
			'management': ''
		});
	});

	/**
	 * 修改
	 */
	jQuery('#contract-upload .whui-btn-update').click(function() {
		var checkStatus = table.checkStatus('contract-table');
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
		jQuery.get('../../contract/contract-edit/contract-edit.html', function(html) {
			layer.open({
				content: html,
				id: 'contract-edit',
				title: '修改',
				type: 1,
				area: ['500px', '300px'],
				btn: ['确认', '取消'],
				success: function(layero, index) {
					form.val('contract-edit-form', {
						'tbcontractId': editdata[0].tbcontractId,
						'configCode': editdata[0].configCode,
						'configName': editdata[0].configName,
						'notice': editdata[0].notice
					});
				},
				yes: function(index, layero) {

					form.on('submit(contract-edit-submit)', function(data) {
						//TODO
						layer.close(index);
						whui.request(layui.whconfig.bizurl.contract.edit, data.field, function(data, desc) {
							whui.msg.success(desc);
							query(table);
						});
						return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
					});
					jQuery('button[lay-filter="contract-edit-submit"]').click();
				}
			});
		});
	});

	/**
	 * 删除
	 */
	jQuery('#contract-upload .whui-btn-delete').click(function() {

		var managementId = jQuery("#management").val();

		var params = {
			managementId: managementId
		}
		layer.open({
			title: '删除',
			content: '是否删除该管理单位下所有的合同数据?',
			btn: ['删除', '取消'],
			yes: function(index, layero) {
				layer.close(index);
				whui.request(layui.whconfig.bizurl.contractIn.delete, params, function(data, desc) {
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
			elem: '#contract-table',
			id: 'contract-table',
			url: layui.whconfig.bizurl.contractIn.query,
			where: where,
			cols: cols,
			done: function(res, curr, count) {
				jQuery('[data-field="tbContractId"]').css('display', 'none');
			}
		});
	}

	function initPubCode(param, selectId) {
		whui.request(layui.whconfig.bizurl.pubcode.queryCode01, param,
			function(data, desc) {
				jQuery("#" + selectId).empty();
				layui.each(data, function(index, item) {
					var $opt = '<option value=' + item.value + '>' + item.text + '</option>';
					jQuery("#" + selectId).append($opt);
				});
				form.render();
			});
	}

	var loading = null;
	var uploadIns = upload.render({
		elem: "#upload",
		url: layui.whconfig.bizurl.contractIn.importContract,
		method: 'POST',
		data: {
			//额外的参数
		},
		auto: false,
		bindAction: '#uploadFile',
		accept: 'file', //允许上传的文件类型
		acceptMime: 'file/xls', //规定打开文件选择框时，筛选出的文件类型
		exts: 'xls', //允许上传的文件后缀
		choose: function(obj) {
			obj.preview(function(index, file, result) {
				jQuery("#uploadFile").removeAttr('disabled');
				jQuery("#uploadFileName").val(file.name);
			});
		},
		before: function(obj) {
			loading = layer.load();
			var managementId = jQuery("#management").val();
			this.data = {
				managementId: managementId
			};
		},
		done: function(res, index, upload) {
			//上传完毕回调
			whui.msg.success(res.desc);
			jQuery("#uploadFile").attr('disabled', 'disabled');
			jQuery("#uploadFileName").val("");
			layer.close(loading);
			query(table);
		},
		error: function(res) {
			//请求异常回调
			whui.msg.failed(res.desc);
			jQuery("#uploadFile").attr('disabled', 'disabled');
			jQuery("#uploadFileName").val("");
			layer.close(loading);
			query(table);
		}
	});
})