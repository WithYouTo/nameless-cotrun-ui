layui.use(['admin', 'table', 'form', 'layer','whcomm'], function() {
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var whconfig = layui.whconfig;
    var whui = layui.whui;
    var $ = layui.jquery;
    var positionUrl=whconfig.bizurl.position;
    var whcomm = layui.whcomm;
    
    /**
	* 必填*效果
	* @param {String} eleId 页面ID
	*/
	//whcomm.ui.form.verifyRequired('position-add #positionName');
	
	/**
	* 更多查询效果
	* @param {String} eleId 页面ID
	*/
	//whcomm.ui.form.querymore(eleId);
	
	jQuery(function(){
		initCompanySelect('#position-index #companyName');
	});

    var cols;
    jQuery.getJSON("../../position/position-index/position-index.json", function(data) {
        cols = data.cols;
        query(table,getWhere());
    });

  

	/**
	 * 初始化公司选择下拉框
	 * @param {Object} companyId
	 */
    function initCompanySelect(companyId){
    	console.log('公司下拉框渲染开始');
    	
    	
    	whui.request(positionUrl.initCompany,{},
			function(data,desc) {
				console.log(data);
				jQuery.each(data, function(index, value){
					var option = "<option value='"+value.code+"'>"+value.name+"</option>";
					jQuery(companyId).append(option);
				});
				$(companyId).get(0).selectedIndex=0;
				form.render('select');
				console.log('公司下拉框渲染完成');
			},
			function(){
				
			},{
				async:false
			}
		);
	
		
    }
	
	/**
	 * 初始化职级选择下拉框
	 * @param {Object} positionLevelId
	 */
	function initPositionLevelSelect(positionLevelId){
		console.log('职位级别下拉框渲染开始');
		var param={'configCode':'POSITION_LEVEL_'};
		whui.request(positionUrl.initPositionLevel,param,
			function(data,desc) {
				console.log(data);
				jQuery.each(data, function(index, value){
					var option = "<option value='"+value.id+"'>"+value.text+"</option>";
					jQuery(positionLevelId).append(option);
				});
				form.render('select');
				console.log('职位级别下拉框渲染结束');
			},
			function(){
				
			},{
				async:false
			}
		);
	
	}

	
    /**
     * 查询
     */
    jQuery('#position-index .whui-btn-query').click(function() {
        form.on('submit(position-query-btn)', function(data) {
            query(table, data.field);
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        jQuery('button[lay-filter="position-query-btn"]').click();
    });

    /**
     * 重置
     */
    jQuery('#position-index .whui-btn-reset').click(function() {
        form.val('position-query-form', {
            //'companyName': '',
            'positionName':''
        });
       initCompanySelect('#position-index #companyName');
    });
   
    /**
    * 获取查询条件 
    */
    function getWhere(){
    	var param={};
    	param.companyName=$('#position-index #companyName').val()||'';
    	param.positionName=$('#position-index #positionName').val()||'';
    	return param;
    }
    /**
     * 新增
     */
    jQuery('#position-index .whui-btn-add').click(function() {
        jQuery.get('../../position/position-add/position-add.html', function(html) {
            layer.open({
                content: html,
                id: 'position_add',
                title: '新增',
                type: 1,
                area: ['500px', '220px'],
                btn: ['确认', '取消'],
                success: function(layero, index){
                	//debugger;
                	//初始化公司下拉框
                	initCompanySelect('#position-add #companyName');
                	initPositionLevelSelect('#position-add #positionLevel');
                },
                yes: function(index, layero) {

debugger;
                    form.on('submit(position-add-submit)', function(data) {
                    	//debugger;
                    	
                        //TODO
                        whui.request(positionUrl.add, data.field, function(data,desc){
                            var where=getWhere();
                        	if('新增成功！'==$.trim(desc)){
                        		 whui.msg.warn(desc);
                           		 query(table,where);
                           		 layer.close(index);
                        	}else{
                        		//新增失败之后不关闭layer弹框
                        		whui.msg.warn(desc);
                        	}
                        },function(data){
	                    	whui.msg.failed(data.desc);
	              		});
						//layer.close(index);
                        // console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
                        // console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
                        // console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                    jQuery('button[lay-filter="position-add-submit"]').click();
                }
            });
        });

    });

    /**
     * 修改
     */
    jQuery('#position-index .whui-btn-update').click(function() {
        var checkStatus = table.checkStatus('position-table');
        //TODO
        // console.log(checkStatus.data) //获取选中行的数据
        // console.log(checkStatus.data.length) //获取选中行数量，可作为是否有选中行的条件
        // console.log(checkStatus.isAll) //表格是否全选

        var editdata = checkStatus.data;
        var eidtlen = editdata.length;

        if(eidtlen>1 || eidtlen == 0){
            whui.msg.warn("请选择一条记录进行编辑！");
            return false;
        }
       // debugger;
        console.log(editdata[0].tbbb05Id);
        var param={
        	tbbb05Id:editdata[0].tbbb05Id
        };
        var tbbb05Id=editdata[0].tbbb05Id;
        jQuery.get('../../position/position-edit/position-edit.html', function(html) {
            layer.open({
                content: html,
                id: 'position_edit',
                title: '修改',
                type: 1,
                area: ['500px', '240px'],
                btn: ['确认', '取消'],
                success: function(layero, index){
                    //初始化公司下拉框
                  	initCompanySelect('#position-edit #companyName');
                  	initPositionLevelSelect('#position-edit #positionLevel');
                	//加载职位的详细信息
                	function initData(){
 
                		whui.request(positionUrl.toDetail+tbbb05Id,{},
               
	                    	function(data){
	                    		 console.log('职位详细信息');
	                    		 console.log(data);
	                    		 //form.render();
	                    		 form.val('position-edit-form', {
			                        'tbbb05Id': data.tbbb05Id,
			                        'positionName': data.positionName,
			                        'positionLevel': data.positionLevel,
			                        'companyCode': data.companyCode,
			                        'oldName': data.positionName
	                   			 });
	                   			
	                   			 $('#position-edit #companyName').val(data.companyCode);
	                   			 form.render('select');
	                    	}
                    	)
                	}
                		initData();
                		
                		
                		//加载职位的详细信息
//                 		whui.request(positionUrl.toDetail+tbbb05Id,{},
//             
//	                    	function(data){
//	                    		 console.log('职位详细信息');
//	                    		 console.log(data);
//	                    		 //form.render();
//	                    		 form.val('position-edit-form', {
//			                        'tbbb05Id': data.tbbb05Id,
//			                        'positionName': data.positionName,
//			                        'positionLevel': data.positionLevel,
//			                        'companyCode': data.companyCode,
//			                        'oldName': data.positionName
//	                   			 });
//	                   			 form.render();
//	                    	}
//                  	)
                	
//              	var deferredCom = jQuery.Deferred();
//              	
//              	 
//              	
//              //	deferred.done(initCompanySelect('#position-edit #companyName',deferredCom),initPositionLevelSelect('#position-edit #positionLevel'),initData());
//              	
//              	$.when(initPositionLevelSelect('#position-edit #positionLevel'),initCompanySelect('#position-edit #companyName',deferredCom)).done(
//              		
//              		initData()
//              	);
                    
                },
                yes: function(index, layero) {

					debugger;
                    form.on('submit(position-edit-submit)', function(data) {
                        //TODO
                        
                        whui.request(positionUrl.edit, data.field, function(data,desc){
                        	var where =getWhere();
                        	if('修改成功！'==$.trim(desc)){
                        		whui.msg.success(desc);
                           		query(table,where);
                           		layer.close(index);
                        	}else{
                        		whui.msg.warn(desc);
                        	}
                        },function(data){
	                    	whui.msg.failed(data.desc);
	              		});
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                   
                    jQuery('button[lay-filter="position-edit-submit"]').click();
                     
                    //layer.close(index);
                }
            });
        });
    });

	/**
	 * 删除
	 */
    jQuery('#position-index .whui-btn-delete').click(function() {
        var checkStatus = table.checkStatus('position-table');
        var ids = '';
        layui.each(checkStatus.data,function(index, item){
            ids += item.tbbb05Id +',';
        });
        
        var editdata = checkStatus.data;
        var eidtlen = editdata.length;
        if(eidtlen == 0){
            whui.msg.warn("请选择要删除的记录！");
            return false;
        }

        var params = {
            tbbb05Id:ids
        }
        layer.open({
            title: '删除',
            content: '是否删除所选信息？',
            btn: ['删除', '取消'],
            yes: function(index, layero) {
	                layer.close(index);
	                debugger;
	                whui.request(positionUrl.delete, params, function(data,desc){
	                	var where =getWhere();
	                    whui.msg.success(desc);
	                    query(table,where);
	                },function(data){
	                    
	                    whui.msg.failed(data.desc);
	                    
	                });
	                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            	}
            });
    });

	/**
	 * 查询
	 * @param {Object} table
	 * @param {Object} where
	 */
    function query(table, where) {
        where = where || {};
        table.render({
            elem: '#position-table',
            id: 'position-table',
            url: positionUrl.query,
            where: where,
            cols: cols
            //隐藏列，传入cols时不设置该列，取出数据是仍可取到该列的数据
//          done:function(res, curr, count){
//				$("[data-field='tbbb05Id']").css('display','none');
//			}
        });
    }

});