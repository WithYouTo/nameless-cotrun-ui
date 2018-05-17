layui.config({
	base: '../../../lib/whui/js/'
}).use(['whui', 'table', 'layer', 'upload'], function() {
	var whconfig = layui.whconfig;
	var device = layui.device();
	var table = layui.table;
	var upload = layui.upload;
	var layer = layui.layer;
	
	/**
	 * 兼容性
	 */
	if(device.ie && device.ie < 10) {
		jQuery.support.cors = true;
	}
	if(whconfig.runtime === 'D' || whconfig.debug) {
		if(device.ie && device.ie < 11) {
			//IE8、9、10不支持vconsole
		} else {
			jQuery.getScript('../../../plugins/vconsole/vconsole.min.js', function() {
				var vConsole = new VConsole();
			});
		}
	}
	
	/**
	 * 全局table配置
	 */
	table.set({
		size: 'sm', //尺寸
		cellMinWidth: 70, //单元格最小宽度
		page: true, //开启分页
		method: 'post',
		request: {
			pageName: whconfig.req.pageName,
			limitName: whconfig.req.limitName
		},
		response: {
			statusName: whconfig.resp.codeName,
			statusCode: whconfig.resp.code.success,
			msgName: whconfig.resp.descName,
			countName: whconfig.resp.countName,
			dataName: whconfig.resp.dataName
		}
	});
	//设置table的头
	if(whconfig.req.tokenName) {
		var headers = whconfig.reqHeaders || {};
		headers[whconfig.req.tokenName] = layui.whui.getLocalData(whconfig.req.tokenName) || "";
		table.set({
			headers: headers
		});
		upload.set({
			headers: headers
		});
	}
	
	/**
	 * 全局layer配置
	 */
	layer.config({
		btnAlign: 'c', //按钮居中
		closeBtn: 0, //不显示关闭按钮
	});
	layui.config({
		base: '../../../lib/admin/', //指定 layuiAdmin 项目路径，本地开发用 src，线上用 dist
		version: '1.0.0'
	}).use('index');
});
//唤起调试窗口(Ctrl+Alt+Enter键)
jQuery(document).keyup(function(event) {
	if(event.ctrlKey && event.altKey && event.keyCode === 13) {
		var device = layui.device();
		if(device.ie && device.ie < 11) {
			//IE8、9、10不支持vconsole
		} else {
			if(jQuery('#__vconsole').length === 0) {
				jQuery.getScript('../../../plugins/vconsole/vconsole.min.js', function() {
					var vConsole = new VConsole();
				});
			}
		}
	}　　
});