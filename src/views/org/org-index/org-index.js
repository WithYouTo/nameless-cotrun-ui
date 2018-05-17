if(layui.whui.isEmptyObject(layui.cache.modules.zTree)) {
    layui.extend({
        'zTree': '../../../plugins/modules/ztree/js/jquery.ztree.all.min'
    });
}


layui.use(['table', 'form', 'zTree'], function() {
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var zTree = layui.zTree;
    var whconfig = layui.whconfig;

    var cols;
    jQuery.getJSON("../../org/org-index/org-index.json", function(data) {
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

    zTree.init(jQuery("#org-tree"), setting, zNodes);



    /**
     * 查询
     */
    jQuery('#org-index .whui-btn-query').click(function() {
        form.on('submit(org-query-btn)', function(data) {
            query(table, data.field);
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        jQuery('button[lay-filter="org-query-btn"]').click();
    });

    /**
     * 重置
     */
    jQuery('#org-index .whui-btn-reset').click(function() {
        form.val('org-query-form', {
            'userName': '方天涯',
            'sex': '女',
        });
    });

    /**
     * 新增
     */
    jQuery('#org-index .whui-btn-add').click(function() {
        jQuery.get('../../org/org-add/org-add.html', function(html) {
            layer.open({
                content: html,
                id: 'org_add',
                title: '新增',
                type: 1,
                area: ['500px', '300px'],
                btn: ['确认', '取消'],
                yes: function(index, layero) {
                    layer.close(index);

                    form.on('submit(org-add-submit)', function(data) {
                        //TODO
                        console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
                        console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
                        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                    jQuery('button[lay-filter="org-add-submit"]').click();

                }
            });
        });

    });

    /**
     * 修改
     */
    jQuery('#org-index .whui-btn-update').click(function() {
        var checkStatus = table.checkStatus('org-table');
        //TODO
        console.log(checkStatus.data) //获取选中行的数据
        console.log(checkStatus.data.length) //获取选中行数量，可作为是否有选中行的条件
        console.log(checkStatus.isAll) //表格是否全选
    });

    function query(table, where) {
        where = where || {};

        table.render({
            elem: '#org-table',
            id: 'org-table',
            url: layui.whconfig.sysurl.org.query,
            where: where,
            cols: cols
        });
    }

});