layui.use(['admin', 'table', 'form', 'layer', 'index'], function() {
	var table = layui.table;
	var form = layui.form;
	var layer = layui.layer;
	var whconfig = layui.whconfig;
	var whui = layui.whui;
	var index = layui.index; //得到 index 对象

	jQuery(function() {
		//初始化下拉框
		//管理单位
		var param1 = {
			'configCode': "MANAGEMENT_NAME_"
		};
		initPubCode(param1,'management');
		//房产状态
		var param2={
			'configCode': "ESTATE_STATUS_CODE_"
		};
		initPubCode(param2,'estateStatus');
		//房产类型
		var param3={
			'configCode': "ESTATE_TYPE_CODE_"
		};
		initPubCode(param3,"estateType");
	});

	var cols;
	jQuery.getJSON("../../contract/contract-index/contract-index.json", function(data) {
		cols = data.cols;
		var managementId = jQuery("#management").val();
		query(table, managementId);
	});

	/**
	 * 查询
	 */
	jQuery("#contract-index .whui-btn-query").click(function() {
		form.on('submit(contract-query-btn)', function(data) {
			query(table, data.field);
			return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		});
		jQuery('button[lay-filter="contract-query-btn"]').click();
	});

	/**
	 * 重置
	 */
	jQuery('#contract-index .whui-btn-reset').click(function() {
		form.val('contract-query-form', {
			'management': ''
		});
	});
	
	/**
	 * 新增
	 */
	jQuery("#contract-index .whui-btn-add").click(function(){
		jQuery.get("../../contract/contract-add/contract-add.html",function(html){
			layer.open({
				content:html,
				id: "contract-add",
				title: "租赁合同管理新增",
				type : 1,
				area :["800px","600px"]
				
			});
		});
	});

	/**
	 * 修改
	 */
	jQuery('#contract-index .whui-btn-update').click(function() {
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
	jQuery('#contract-index .whui-btn-delete').click(function() {

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
					console.log(data);
					if(data.code == 200) {
						whui.msg.fail(data.msg);
						query(table);
					} else {
						whui.msg.fail(data.msg);
					}
				});
				return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
			}
		});
	});

	function query(table, where) {
		where = where || {};
		table.render({
			elem: '#estate-table',
			id: 'estate-table',
			url: layui.whconfig.bizurl.contractIn.query,
			where: where,
			cols: cols,
			done: function(res, curr, count) {
				jQuery('[data-field="tbContractId"]').css('display', 'none');
			}
		});
	}
	
	function initPubCode(param,selectId){
		whui.request(layui.whconfig.bizurl.pubcode.queryCode01, param,
			function(data, desc) {
				jQuery("#"+selectId).empty();
				layui.each(data, function(index, item) {
					var $opt = '<option value=' + item.value + '>' + item.text + '</option>';
					jQuery("#"+selectId).append($opt);
				});
				form.render();
			});
	}

});