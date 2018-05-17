layui.use(['admin', 'form', 'user', 'table', 'whui', 'upload'], function() {
	var whui = layui.whui;
	var whconfig = layui.whconfig;
	var router = layui.router();
	var search = router.search;
	var form = layui.form;
	var table = layui.table;
	var upload = layui.upload;

	jQuery('#login-title').html(whconfig.name);
	jQuery('#login-describe').html(whconfig.describe);
	jQuery('#login-reg').attr('lay-href', whconfig.page.login.reg);
	jQuery('#login-forget').attr('lay-href', whconfig.page.login.forget);

	form.render();

	
	document.onkeydown = function (event) {
        var e = event || window.event;
        if (e && e.keyCode == 13) { //回车键的键值为13
            jQuery('button[lay-filter="LAY-user-login-submit"]').click();  
        }
    }; 
	
	//提交
	form.on('submit(LAY-user-login-submit)', function(obj) {

		var url = whconfig.sysurl.login.login;
		whui.request(url, obj.field, function(res) {
			whui.setLocalData(whconfig.req.tokenName, res[whconfig.req.tokenName]);

			//设置table的头
			if(whconfig.req.tokenName) {
				var headers = whconfig.reqHeaders || {};
				headers[whconfig.req.tokenName] = whui.getLocalData(whconfig.req.tokenName) || '';
				table.set({
					headers: headers
				});
				upload.set({
					headers: headers
				});
			}

			//登入成功的提示与跳转
			whui.msg.success('登入成功', function() {
				location.hash = search.redirect ? decodeURIComponent(search.redirect) : '/';
			}, 1000);

		});

	});

});