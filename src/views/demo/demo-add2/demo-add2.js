layui.extend({
	'whcomm':'../../../lib/comm/js/comm'
});

layui.use(['whcomm','form'], function() {
	var whcomm = layui.whcomm;
	var form = layui.form;
	
	form.render();

	whcomm.ui.form.querymore('demo-add2');
	whcomm.ui.form.verifyRequired('demo-add2');
});