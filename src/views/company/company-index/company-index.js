layui.use(['admin', 'table', 'form', 'layer'], function() {
	var table = layui.table;
	var form = layui.form;
	var layer = layui.layer;
	var whconfig = layui.whconfig;
	var whui = layui.whui;

	var cols;
	jQuery.getJSON("../../company/company-index/company-index.json", function(data) {
		cols = data.cols;
		query(table);
	});
	
	/**
	 * 自定义验证规则  
	 */
  form.verify({  
         mail: [/^\d{6}$/, '邮政编码必须6位，只能是数字！'] 
        ,email: [/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, '邮箱格式不对']  
  }); 
	
	/**
	 * 查询
	 */
	jQuery("#company-index .whui-btn-query").click(function() {
		form.on('submit(company-query-btn)', function(data) {
			var compName=data.field.compNameMain;
			var companyCode=data.field.companyCodeMain;
			var param={
				compName : compName,
				companyCode : companyCode
			};
			query(table, param);
			return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
		});
		jQuery('button[lay-filter="company-query-btn"]').click();
	});

	/**
	 * 重置
	 */
	jQuery('#company-index .whui-btn-reset').click(function() {
		form.val('company-query-form', {
			'companyNameMain': '',
			'companyCodeMain': ''
		});
	});

	/**
	 * 新增
	 */
	jQuery('#company-index .whui-btn-add').click(function() {
		jQuery.get('../../company/company-add/company-add.html', function(html) {
			layer.open({
				content: html,
				id: 'company-add',
				title: '新增',
				type: 1,
				area: ['600px', '450px'],
				btn: ['确认', '取消'],
				yes: function(index, layero) {

					form.on('submit(company-add-submit)', function(data) {
						//TODO
						layer.close(index);
						whui.request(layui.whconfig.bizurl.company.add, data.field, function(data, desc) {
							whui.msg.success(desc);
							query(table);
						});

						// console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
						// console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
						// console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
						return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
					});
					jQuery('button[lay-filter="company-add-submit"]').click();
				}
			});
		});

	});

	/**
	 * 修改
	 */
	jQuery('#company-index .whui-btn-update').click(function() {
		var checkStatus = table.checkStatus('company-table');
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
		console.log(editdata[0])
		jQuery.get('../../company/company-edit/company-edit.html', function(html) {
			layer.open({
				content: html,
				id: 'company-edit',
				title: '修改',
				type: 1,
				area: ['600px', '450px'],
				btn: ['确认', '取消'],
				success: function(layero, index) {
					form.val('company-edit-form', {
						'companyCode': editdata[0].companyCode,
						'compBrand': editdata[0].compBrand,
						'fullName': editdata[0].fullName,
						'compName': editdata[0].compName,
						'address': editdata[0].address,
						'mail': editdata[0].mail,
						'compTel': editdata[0].compTel,
						'fax': editdata[0].fax,
						'compWeb': editdata[0].compWeb,
						'email': editdata[0].email,
						'nationalTax': editdata[0].nationalTax,
						'landTax': editdata[0].landTax,
						'bank': editdata[0].bank,
						'bankAccount': editdata[0].bankAccount,
						'companyId': editdata[0].companyId,
						'oldCompBrand': editdata[0].compBrand,
						'oldCompName': editdata[0].compName,
						'oldFullName': editdata[0].fullName
					});
				},
				yes: function(index, layero) {

					form.on('submit(company-edit-submit)', function(data) {
						//TODO
						layer.close(index);
						whui.request(layui.whconfig.bizurl.company.edit, data.field, function(data, desc) {
							whui.msg.success(desc);
							query(table);
						});
						return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
					});
					jQuery('button[lay-filter="company-edit-submit"]').click();
				}
			});
		});
	});
	
	/**
	 * 删除
	 */
	jQuery('#company-index .whui-btn-delete').click(function() {
		var checkStatus = table.checkStatus('company-table');
		//TODO
		// console.log(checkStatus.data) //获取选中行的数据
		// console.log(checkStatus.data.length) //获取选中行数量，可作为是否有选中行的条件
		// console.log(checkStatus.isAll) //表格是否全选

		var deldata = checkStatus.data;
		var dellen = deldata.length;

		if(dellen == 0) {
			whui.msg.warn("请选择要删除的记录！");
			return false;
		}
		
		var companyCodes = '';
		layui.each(deldata, function(index, item) {
			companyCodes += item.companyCode + ',';
		});

		var params = {
			companyCodes: companyCodes
		}
		layer.open({
			title: '删除',
			content: '是否删除所选信息？',
			btn: ['删除', '取消'],
			yes: function(index, layero) {
				layer.close(index);
				whui.request(layui.whconfig.bizurl.company.delete, params, function(data, desc) {
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
			elem: '#company-table',
			id: 'company-table',
			url: layui.whconfig.bizurl.company.query,
			where: where,
			cols: cols,
			done: function(res, curr, count) {
				jQuery('[data-field="companyId"]').css('display', 'none');
			}
		});
	}

})