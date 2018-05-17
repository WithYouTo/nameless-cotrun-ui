layui.use(['admin', 'table', 'form', 'layer','whcomm','zTree'], function() {
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var whconfig = layui.whconfig;
    var whui = layui.whui;
    var $ = layui.jquery;
    var webuserUrl=whconfig.bizurl.webuser;
    var whcomm = layui.whcomm;
    
    /**
	* 必填*效果
	* @param {String} eleId 页面ID
	*/
	//whcomm.ui.form.verifyRequired('webuser-add #webuserName');
	
	/**
	* 更多查询效果
	* @param {String} eleId 页面ID
	*/
	//whcomm.ui.form.querymore(eleId);
	
	jQuery(function(){
		initCompanySelect('#webuser-index #companyName',true);
	});


    var cols;
    jQuery.getJSON("../../webuser/webuser-index/webuser-index.json", function(data) {
        cols = data.cols;
       
        query(table,getWhere());
    });

   
	/**
	 * 初始化公司选择下拉框
	 * @param {Object} companyId
	 */
    function initCompanySelect(companyId,isAsync){
    	var option={};
    	if(isAsync){
    		option.async=false;
    	}
    	whui.request(webuserUrl.initCompany,{},
			function(data,desc) {
				console.log(data);
				jQuery.each(data, function(index, value){
					var option = "<option value='"+value.code+"'>"+value.name+"</option>";
					jQuery(companyId).append(option);
				});
				form.render('select');
				//debugger;
				//layui.event.call($('#webuser-index #companyName'),'form','select(company-change)',{});
				if(companyId.indexOf('webuser-index')>=0){
					$(companyId).get(0).selectedIndex=0;
					initDeptSelect('webuser-index',null,true);
				}
				if(companyId.indexOf('webuser-add')>=0){
					$(companyId).get(0).selectedIndex=0;
					initDeptSelect('webuser-add');
					initPositionSelect('webuser-add');
				}
				
			},
			function(){
				
			},option
		);
    }
	
	/**
	 * 初始化职级选择下拉框
	 * @param {Object} 
	 */
	function initDeptSelect(ele,comCode,isAsync){
		var option={};
    	if(isAsync){
    		option.async=false;
    	}
    	if(comCode){
    		jQuery('#'+ele+ ' #deptName').empty();
			var param={companyCode:comCode};
    	}else{
			jQuery('#'+ele+ ' #deptName').empty();
			var companyCode=$('#'+ele+ ' #companyName').val()||'';
			var param={companyCode:companyCode};
		}
		whui.request(webuserUrl.initDept,param,
			function(data,desc) {
				console.log(data);
				jQuery.each(data, function(index, value){
					var option = "<option value='"+value.id+"'>"+value.text+"</option>";
					jQuery('#'+ele+ ' #deptName').append(option);
				});
				form.render('select');
			},
			function(){
				
			},option
		);
	}
	
	/**
	 * 初始化职级选择下拉框
	 * @param {Object} 
	 */
	function initPositionSelect(ele,comCode,isAsync){
		var option={};
    	if(isAsync){
    		option.async=false;
    	}
    	if(comCode){
    		jQuery('#'+ele+ ' #positionId').empty();
			var param={companyCode:comCode};
    	}else{
    		jQuery('#'+ele+ ' #positionId').empty();
			var companyCode=$('#'+ele+ ' #companyName').val()||'';
			var param={companyCode:companyCode};
    	}
		whui.request(webuserUrl.initPosition,param,
			function(data,desc) {
				console.log(data);
				jQuery.each(data, function(index, value){
					var option = "<option value='"+value.id+"'>"+value.text+"</option>";
					jQuery('#'+ele+ ' #positionId').append(option);
				});
				form.render('select');
			},
			function(){
				
			},
			option
		);
	}

	/**
	 * 初始化 新增修改界面的    用户类型 选择下拉框
	 * @param {Object} 
	 */
	function initManagerTypeSelect(ele,isAsync){
		var option={};
		if(isAsync){
			option.async=false;
		}
		jQuery('#'+ele+ ' #managerType').empty();
		var param={'configCode':'MANAGER_TYPE_'};
		whui.request(webuserUrl.initManagerType,param,
			function(data,desc) {
				console.log(data);
				jQuery.each(data, function(index, value){
					var option = "<option value='"+value.id+"'>"+value.text+"</option>";
					jQuery('#'+ele+ ' #managerType').append(option);
				});
				form.render('select');
			},
			function(){
				
			},option
		);
	}

	/**
	 * 绑定公司选择后的change事件   这么绑定change事件不生效
	 */
//	jQuery('#webuser-index #companyName').change(
//		
//		function(){
//			debugger;
//			initDeptSelect('webuser-index');
//		}
//	)
	
	/**
	 * 绑定公司选择后的select事件 
	 */
	form.on('select(company-change)',function(){
		//debugger;
		initDeptSelect('webuser-index');
	})
	
    /**
     * 查询
     */
    jQuery('#webuser-index .whui-btn-query').click(function() {
        form.on('submit(webuser-query-btn)', function(data) {
        	console.log('webuser查询条件');
        	console.log(data.field);
            query(table, data.field);
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        jQuery('button[lay-filter="webuser-query-btn"]').click();
    });

    /**
     * 重置
     */
    jQuery('#webuser-index .whui-btn-reset').click(function() {
        form.val('webuser-query-form', {
            //'companyName': '',
            'name':'',
            'phone':''
        });
        initCompanySelect('#webuser-index #companyName');
    });

	/**
	 * 获得查询的参数
	 */
    function getWhere(){
    	var param={};
    	param.companyName=$('#webuser-index #companyName').val()||'';
    	param.deptName=$('#webuser-index #deptName').val()||'';
    	param.name=$('#webuser-index #name').val()||'';
    	param.phone=$('#webuser-index #phone').val()||'';
    	return param;
    }
   
	/**
	 * 新增修改客户端数据校验
	 */
    function submitCheck(ele){
	
		//校验
	    var name =$('#'+ele+' #name').val();	  
	    var mobile= $('#'+ele+" #phone").val();	  
	    var email=$('#'+ele+" #mail").val();
	    var idCard=$('#'+ele+" #idCard").val();
	    var companyCode=$('#'+ele+" #companyName").val();
	    var departmentId=$('#'+ele+" #deptName").val();
	    var positionId=$('#'+ele+" #positionId").val();
  
	    if(!companyCode){
	    	whui.msg.warn('请选择公司名称！');
	    	return false;
	    }
	    
	    if(companyCode){
	    	if(!departmentId){
	        	whui.msg.warn('请选择部门！');
	        	return false;
	        }
	    	if(!positionId){
	        	whui.msg.warn('请选择职位！');
	        	return false;
	       }
	    }
	
	    var  re = /^1[34578]\d{9}$/;    //正则表达式
	    if (!re.test(mobile)) {      //判断字符是否是11位数字
	    	whui.msg.warn('手机号码格式错误！');
	  		return false;
	    }
	
	    if(email !=''){
	    	var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	   	    if (!filter.test(email)){      
	   	    	whui.msg.warn('电子邮箱格式错误！');
	   	  		return false;
	       }
	    }
		 
	    
	    if(idCard != ''){
	    	//身份证正则表达式(15位)
	    	isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
	    	//身份证正则表达式(18位)
	    	isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/;
	    	if (!isIDCard1.test(idCard)&&!isIDCard2.test(idCard)){      
	    		whui.msg.warn('身份证格式错误！');
	      		return false;
	        }
		}
	    
	    return true;
	}

    /**
     * 新增
     */
    jQuery('#webuser-index .whui-btn-add').click(function() {
        jQuery.get('../../webuser/webuser-add/webuser-add.html', function(html) {
            layer.open({
                content: html,
                id: 'webuser_add',
                title: '新增',
                type: 1,
                area: ['550px', '380px'],
                btn: ['确认', '取消'],
                success: function(layero, index){
                	//debugger;
                	//初始化公司下拉框
                	initCompanySelect('#webuser-add #companyName');
                	//初始化用户类型下拉框
                	initManagerTypeSelect('webuser-add');
                	
                	/**
					 * 绑定公司选择后的select事件 
					 */
					form.on('select(companyadd-change)',function(){
						initDeptSelect('webuser-add');
						initPositionSelect('webuser-add');
					})
                	
                },
                yes: function(index, layero) {
                	

                    form.on('submit(webuser-add-submit)', function(data) {
                    	//校验信息是否合法
                    	//debugger;
                	    var flag=submitCheck('webuser-add');
                    	if(!flag){
                    		return false;
                    	}else{
                    		//TODO
	                        whui.request(webuserUrl.add, data.field, function(data,desc){
	                        	console.log('新增用户返回');
	                        	console.log(data);
	                        	if(data.flag =="1"){
									whui.msg.success('新增成功！');
									query(table,getWhere());
	                           		layer.close(index);
								}else if(data.flag =="2"){
									whui.msg.failed('新增失败，手机号已存在！');
								}else if(data.flag =="3"){
									whui.msg.failed('新增失败，手机号已存在！');
								}else if(data.flag =="4"){
									whui.msg.failed('新增失败，身份证号已存在！');
								}else{
									whui.msg.failed('处理失败！');
								}
	                        });
	                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    	}
                    });
                    jQuery('button[lay-filter="webuser-add-submit"]').click();
                }
            });
        });

    });

    /**
     * 修改
     */
    jQuery('#webuser-index .whui-btn-update').click(function() {
        var checkStatus = table.checkStatus('webuser-table');
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
       
        console.log(editdata[0].id);

        var id=editdata[0].id;
        debugger;
        //选择行    companyCode
        var companyCode=editdata[0].comcode;
        
        jQuery.get('../../webuser/webuser-edit/webuser-edit.html', function(html) {
            layer.open({
                content: html,
                id: 'webuser_edit',
                title: '修改',
                type: 1,
                area: ['550px', '380px'],
                btn: ['确认', '取消'],
                success: function(layero, index){
                    //初始化公司下拉框
                	//initCompanySelect('#webuser-edit #companyName');
                	//初始化用户类型下拉框
                	//initManagerTypeSelect('webuser-edit');
                	//主动触发select的change事件
                	//layui.event.call($('#webuser-edit #companyName'),'form','select(companyedit-change)',{});
                	
                	initCompanySelect('#webuser-edit #companyName',true);
                	initDeptSelect('webuser-edit',companyCode,true)
                	initManagerTypeSelect('webuser-edit',true);
                	initPositionSelect('webuser-edit',companyCode,true);
                	
                	                	//加载职位的详细信息
                    whui.request(webuserUrl.toDetail+id,{},
               
                    	function(data){
                    		 console.log('web用户详细信息');
                    		 console.log(data);
                    		 var webUser={};
                    		 var webUserField=['id','phone','name','managerType','sex','companyCode','departmentId'
                    		 ,'positionId','account','mail','idCard','race','address'];
                    		 jQuery.each(webUserField,function(index,item){
                    		 	webUser[item]=data[item];
                    		 });
                    		 console.log('webuser修改页面初始化信息');
                    		 console.log(webUser);
                    		 
                    		 //webUser.deptName=data.departmentId;
                    		// webUser.companyName=data.companyCode;
                    		 form.val('webuser-edit-form', webUser);
                    		 form.render();
                    	}
                    );
                	
//              	function triggerComChange(){
//              		layui.event.call($('#webuser-edit #companyName'),'form','select(companyedit-change)',{});
//              	};
//              	//debugger;
//              	$.when(initCompanySelect('#webuser-edit #companyName'),initManagerTypeSelect('webuser-edit')
//              	
//              	).done(
//              		
//              		whui.request(webuserUrl.toDetail+id,{},
//             
//	                    	function(data){
//	                    		 //triggerComChange();
//	                    		 console.log('web用户详细信息');
//	                    		 console.log(data);
//	                    		 var webUser={};
//	                    		 var webUserField=['id','phone','name','managerType','sex','companyCode'
//	                    		 ,'account','mail','idCard','race','address'];
//	                    		 
//	                    		 
//	                    		 
//	                    		 jQuery.each(webUserField,function(index,item){
//	                    		 	webUser[item]=data[item];
//	                    		 });
//	                    		 console.log('webuser修改页面初始化信息');
//	                    		 console.log(webUser);
//	                    		 form.val('webuser-edit-form', webUser);
//	                    		 //给公司赋值之后     部门职位的下拉事件
//	                    		  $.when(initDeptSelect('webuser-edit'),initPositionSelect('webuser-edit')).done(
//										//部门职位的赋值
//		                    		  	form.val('webuser-edit-form',
//		                    		 	 {
//		                    		  	   'positionId':data.positionId,
//		                    		  	    'departmentId':data.departmentId
//	                    		  	 	}
//	                    				  )
//							
//						          )
//	                    		  
//	                    		 //部门职位的赋值
////	                    		  form.val('webuser-edit-form',
////	                    		 	 {
////	                    		  	   'positionId':data.positionId,
////	                    		  	    'departmentId':data.departmentId
////	                    		  	 }
////	                    		  );
////	                    		 
//	                    		 form.render();
//	                    	}
//                 		 )
//              	);
                	
                	/**
					 * 绑定公司选择后的select事件 
					 */
					form.on('select(companyedit-change)',function(){
						initDeptSelect('webuser-edit');
						initPositionSelect('webuser-edit');
					})
					
                	//加载职位的详细信息
//                  whui.request(webuserUrl.toDetail+id,{},
//             
//                  	function(data){
//                  		 console.log('web用户详细信息');
//                  		 console.log(data);
//                  		 var webUser={};
//                  		 var webUserField=['id','phone','name','managerType','sex','companyCode','departmentId'
//                  		 ,'positionId','account','mail','idCard','race','address'];
//                  		 jQuery.each(webUserField,function(index,item){
//                  		 	webUser[item]=data[item];
//                  		 });
//                  		 console.log('webuser修改页面初始化信息');
//                  		 console.log(webUser);
//                  		 form.val('webuser-edit-form', webUser);
//                  		
//                  	}
//                  );	
                   
                   
                },
                yes: function(index, layero) {

                    form.on('submit(webuser-edit-submit)', function(data) {
                        //TODO
                        //校验信息是否合法
                    	//debugger;
                	    var flag=submitCheck('webuser-edit');
                    	if(!flag){
                    		return false;
                    	}else{
	                        whui.request(webuserUrl.edit, data.field, function(data,desc){
	                        	
	                        	if(data.flag =="1"){
									whui.msg.success('修改成功');
									 query(table,getWhere());
	                           		layer.close(index);
								}else if(data.flag =="2"){
									whui.msg.failed('修改失败，手机号已存在');
								}else if(data.flag =="3"){
									whui.msg.failed('修改失败，手机号已存在！');
								}else if(data.flag =="4"){
									whui.msg.failed('修改失败，身份证号已存在');
								}else{
									whui.msg.failed('修改失败');
								}
	                        });
	                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                       }
                    });
                   
                    jQuery('button[lay-filter="webuser-edit-submit"]').click();
                     
                    //layer.close(index);
                }
            });
        });
    });

	/**
	 * 删除
	 */
    jQuery('#webuser-index .whui-btn-delete').click(function() {
        var checkStatus = table.checkStatus('webuser-table');
        var ids = '';
        layui.each(checkStatus.data,function(index, item){
            ids += item.id +',';
        });
        
        var editdata = checkStatus.data;
        var eidtlen = editdata.length;
        if(eidtlen == 0){
            whui.msg.warn("请选择要删除的记录！");
            return false;
        }

        var params = {
            userId:ids
        }
        layer.open({
            title: '删除',
            content: '是否删除所选信息？',
            btn: ['删除', '取消'],
            yes: function(index, layero) {
	                layer.close(index);
	                whui.request(webuserUrl.delete, params, function(data,desc){
	                	if('1'==data.flag){
	                		whui.msg.success('删除成功！');
	                  		 query(table,getWhere());
	                	}else{
	                		whui.msg.warn('删除失败！');
	                	}
	                },function(data){
	                    whui.msg.warn('网络繁忙！');
	                });
	                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            	}
            });
    });
    
    function zTreeCheckedNodes(zTreeId) {
        var zTree = $.fn.zTree.getZTreeObj(zTreeId);
        var nodes = zTree.getCheckedNodes();
        var ids = "";
        for (var i = 0, l = nodes.length; i < l; i++) {
            ids += "," + nodes[i].id;
        }
        return ids.substring(1);
    }
    
    
     /**
     * 角色分配
     */
    jQuery('#webuser-index .whui-btn-roleassign').click(function() {
    	
    	var checkStatus = table.checkStatus('webuser-table');
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
       
        console.log(editdata[0].id);
        
        var userdId=editdata[0].id;
        var companyCode=editdata[0].comcode;
    	var account=editdata[0].account;
    	//debugger;
    	
        jQuery.get('../../webuser/role-assign/role-assign.html', function(html) {
            layer.open({
                content: html,
                id: 'role-assign',
                title: '角色分配',
                type: 1,
                area: ['360px', '240px'],
                btn: ['确认', '取消'],
                success: function(layero, index){
                	//初始化树
                	whui.request(webuserUrl.roleList+userdId+'/'+companyCode, {}, function(data,desc){
	                	
	                	var setting = {
				            check: {
				                enable: true,
				                chkboxType: {
				                    "Y": "",
				                    "N": ""
				                }
				            },
				            data: {
				                simpleData: {
				                    enable: true
				                }
				            }
		           	    };
		                var ztreeNodes = data; //将string类型转换成json对象  
			            $.fn.zTree.init($('#role-assign #tree'), setting, ztreeNodes); 
	                },function(data){
	                    whui.msg.warn('网络繁忙！');
	                });
                },
                yes: function(index, layero) {
                    var ids = zTreeCheckedNodes("tree");
                    var params={};
                    params.roleIds=ids;
                    params.userId=userdId;
                    whui.request(webuserUrl.roleAssign, params, function(data,desc){
                    	if('1'==data.flag){
                    		whui.msg.success('分配角色成功!');
                    		query(table,getWhere());
                    		layer.close(index);
                    	}else{
                    		whui.msg.failed('分配角色失败');
                    	}
                    },
                    function(){
                    	whui.msg.warn('网络繁忙！');
                    })
                    
                }
            });
        });

    });
    
    /**
     * 重置密码
     */
  	jQuery('#webuser-index .whui-btn-resetpass').click(function() {
        var checkStatus = table.checkStatus('webuser-table');
        var ids = '';
        layui.each(checkStatus.data,function(index, item){
            ids += item.id +',';
        });
        
        var editdata = checkStatus.data;
        var eidtlen = editdata.length;
        
        if(eidtlen == 0){
            whui.msg.warn("请选择要重置密码的记录！");
            return false;
        }
        console.log(editdata[0].id);
        
        var params={
        	userId:ids
        };
        layer.open({
            title: '重置密码',
            content: '是否重置密码到 111111',
            btn: ['删除', '取消'],
            yes: function(index, layero) {
	                layer.close(index);
	                whui.request(webuserUrl.resetPass, params, function(data,desc){
	                	if('1'==data.flag){
	                		whui.msg.success('重置密码成功！');
	                  		query(table,getWhere());
	                	}else{
	                		whui.msg.warn('重置密码失败！');
	                	}
	                },function(data){
	                    whui.msg.warn('网络繁忙！');
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
            elem: '#webuser-table',
            id: 'webuser-table',
            url: webuserUrl.query,
            where: where,
            cols: cols
        });
    }

});