layui.use(['table', 'form', 'layer', 'whcomm'], function() {
	var table = layui.table;
	var form = layui.form;
	var layer = layui.layer;
	var whconfig = layui.whconfig;
	var dateformat = layui.dateformat;
	var whcomm = layui.whcomm;

	whcomm.ui.form.querymore('demo-add');
	whcomm.ui.form.verifyRequired('demo-add');

	var cols;
	jQuery.getJSON("../../demo/demo-updown-table/demo-updown-table.json", function(data) {
		cols = data.cols;
		query1(table);
		query2(table);
	});

	function query1(table, where) {
		where = where || {};

		table.render({
			elem: '#demo-updown-table-table1',
			id: 'demo-updown-table-table1',
			url: layui.whconfig.bizurl.demo.query,
			where: where,
			cols: cols
		});
	}

	function query2(table, where) {
		where = where || {};

		table.render({
			elem: '#demo-updown-table-table2',
			id: 'demo-updown-table-table2',
			url: layui.whconfig.bizurl.demo.query,
			where: where,
			cols: cols
		});
	}
});