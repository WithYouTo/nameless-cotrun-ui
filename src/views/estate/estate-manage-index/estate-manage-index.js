layui.use(['admin', 'table', 'form', 'layer'], function() {
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var whconfig = layui.whconfig;
    var whui = layui.whui;

    var cols;
    jQuery.getJSON("../../estate/estate-manage-index/estate-manage-index.json", function(data) {
        cols = data.cols;
        query(table);
    });

	jQuery(function(){
		index_init();
	})
	
	function index_init(){
		//初始化首页的管理单元下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'MANAGEMENT_NAME_'}, function(data,desc){
            $("#management_Unit").html("<option value=''>请选择管理单位</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#management_Unit").append(option);
            }); 
   			$("#management_Unit").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化首页的小区下拉框
		whui.request(layui.whconfig.bizurl.estate_manage.areaList, {}, function(data,desc){
            $("#area_name").html("<option value=''>请选择小区</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#area_name").append(option);
            }); 
   			$("#area_name").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化房产状态下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'ESTATE_STATUS_CODE_'}, function(data,desc){
            $("#estate_status").html("<option value=''>请选择房产状态</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#estate_status").append(option);
            }); 
   			$("#estate_status").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化房产类型下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'ESTATE_TYPE_CODE_'}, function(data,desc){
            $("#estate_type").html("<option value=''>请选择房产类型</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#estate_type").append(option);
            }); 
   			$("#estate_type").get(0).selectedIndex=0;
   			form.render('select');
		});
	}
   
   
	
    /**
     * 查询
     */
    jQuery('#estate-manage-index .whui-btn-query').click(function() {
        form.on('submit(manage-query-btn)', function(data) {
            query(table, data.field);
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        jQuery('button[lay-filter="manage-query-btn"]').click();      
    });

    /**
     * 重置
     */
    jQuery('#estate-manage-index .whui-btn-reset').click(function() {
        form.val('estate-manage-query-form', {
            'management_Unit': '',
            'district': '',
            'street':'',
            'area_name': '',
            'estateName':'',
            'estateNo': '',
            'estate_status':'',
            'estate_type': ''
        });
    });

	function check(ele){	
		//校验
	    var completionTime = $('#'+ele+' #completionTime').val();
	    
	    var a = /^(\d{4})-(\d{2})-(\d{2})$/;
	    if(completionTime != '' && !a.test(completionTime)){
	    	whui.msg.warn('房屋竣工时间的格式不对，只能输入格式是YYYY-MM-DD的数据！');
	    	return false;
	    }
	    
	    var totalFloorNum = $('#'+ele+' #totalFloorNum').val();
	    
	    var b = /^\+?[1-9][0-9]*$/;
	    if(totalFloorNum != '' && !b.test(totalFloorNum)){
	    	whui.msg.warn('总楼层的数据格式不对，只能输入正整数！');
	    	return false;
	    }
	    
	    var c1 = /^[0-9]+(.[0-9]{1})?$/;//1位小数
	    var c2 = /^[0-9]+(.[0-9]{2})?$/;//2位小数
	    var calArea = $('#'+ele+' #calArea').val();
	    var registeredArea = $('#'+ele+' #registeredArea').val();
	    var notRegisteredArea = $('#'+ele+' #notRegisteredArea').val();
	    
	    if(calArea != '' && !b.test(calArea) && !c1.test(calArea) && !c2.test(calArea)){
	    	whui.msg.warn('建筑面积的数据格式不对！');
	    	return false;
	    }
	    if(registeredArea != '' && !b.test(registeredArea) && !c1.test(registeredArea)&& !c2.test(registeredArea)){
	    	whui.msg.warn('在册面积的数据格式不对！');
	    	return false;
	    }
	    if(notRegisteredArea != '' && !b.test(notRegisteredArea)&& !c1.test(notRegisteredArea)&& !c2.test(notRegisteredArea)){
	    	whui.msg.warn('不在册面积的数据格式不对！');
	    	return false;
	    }
	    return true;
	}
	
    /**
     * 新增
     */
    jQuery('#estate-manage-index .whui-btn-add').click(function() {
        jQuery.get('../../estate/estate-manage-add/estate-manage-add.html', function(html) {
        	form.render('select');
            layer.open({
                content: html,
                id: 'manage-add',
                title: '新增',
                type: 1,
                area: ['900px', '550px'],
                btn: ['确认', '取消'],
                success: function(index, layero) {
                	//初始化下拉框
                	add_init();               	
                },
                yes: function(index, layero) {

                    form.on('submit(manage-add-submit)', function(data) {
                        //TODO
						data.field.pcdText = province_city_district_text ;
						
						var flag=check('manage-add');
                    	if(!flag){
                    		return false;
                    	}else{
                    		whui.request(layui.whconfig.bizurl.estate_manage.add, data.field, function(data,desc){
	                            layer.close(index);
	                            whui.msg.success(desc);
	                            query(table);
	                        },function(data){
	                        	whui.msg.warn(data.desc);
			                });
                    	}
                        
						
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                    jQuery('button[lay-filter="manage-add-submit"]').click();
                }
            });
        });

    });

	var province_city_district_text;
	var managementUnit_text;
	
	function add_init(){	
		//初始化管理单元下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'MANAGEMENT_NAME_'}, function(data,desc){
            $("#managementUnit").html("<option value=''>请选择小区</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#managementUnit").append(option);
            }); 
   			$("#managementUnit").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化小区下拉框
		whui.request(layui.whconfig.bizurl.estate_manage.areaList, {}, function(data,desc){
            $("#areaName").html("<option value=''>请选择小区</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#areaName").append(option);
            }); 
   			$("#areaName").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化省市区下拉框
		whui.request(layui.whconfig.bizurl.estate_manage.provinceCityDistinct, {}, function(data,desc){
            $("#province_city_district").html("<option value=''>请选择省市区</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#province_city_district").append(option);
            }); 
   			$("#province_city_district").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化房产状态下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'ESTATE_STATUS_CODE_'}, function(data,desc){
            $("#estateStatus").html("<option value=''>请选择房产状态</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#estateStatus").append(option);
            }); 
   			$("#estateStatus").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化房产类型下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'ESTATE_TYPE_CODE_'}, function(data,desc){
            $("#estateType").html("<option value=''>请选择房产类型</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#estateType").append(option);
            }); 
   			$("#estateType").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化房产结构下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'ESTATE_STRUCTURE_CODE_'}, function(data,desc){
            $("#estateStructure").html("<option value=''>请选择房产结构</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#estateStructure").append(option);
            }); 
   			$("#estateStructure").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		form.on('select(managementUnit_change)', function(data){
			
			var code = data.elem[data.elem.selectedIndex].value;
			var params = {
	            managementUnit : code
	        }
			whui.request(layui.whconfig.bizurl.estate_manage.areaChange, params, function(data){
				$("#estateNo").val(data.estateNo);
			});
		});
	
		layui.use('laydate', function(){
	  		var laydate = layui.laydate;
	     	//日期时间选择器
			laydate.render({ 
			  elem: '#completionTime',
			  type: 'date'
			});
		});
		
		form.on('select(pcd_change)', function(data){
			province_city_district_text = data.elem[data.elem.selectedIndex].text;
		});
	}
	
	
    /**
     * 修改
     */
    jQuery('#estate-manage-index .whui-btn-update').click(function() {
        var checkStatus = table.checkStatus('estate-manage-table');
        var editdata = checkStatus.data;
        var eidtlen = editdata.length;

        if(eidtlen>1 || eidtlen == 0){
            whui.msg.warn("请选择一条记录进行编辑！");
            return false;
        }
        jQuery.get('../../estate/estate-manage-edit/estate-manage-edit.html', function(html) {
            layer.open({
                content: html,
                id: 'manage-edit',
                title: '修改',
                type: 1,
                area: ['900px', '550px'],
                btn: ['确认', '取消'],
                success: function(layero, index){
                	//修改页面初始化
                	update_init();
                	
                	var params = {
                		id: editdata[0].id
                	}
                	
                	whui.request(layui.whconfig.bizurl.estate_manage.toEdit, params, function(data,desc){
                        form.val('manage-edit-form', {
	                        'id': editdata[0].id,
	                        'managementUnit': data.companyName,
	                        'estateNo': data.estateNo,
	                        'estateName': data.estateName,
	                        'province_city_district': data.pcdCode,
	                        'street': data.street,
	                        'areaName': data.communityId,
	                        'building': data.building,
	                        'cellName': data.cellName,
	                        'roomName': data.roomName,
	                        'estateStatus': data.estateStatus,
	                        'estateType': data.estateType,
	                        'estateStructure': data.estateStructure,
	                        'completionTime': data.completionTime,
	                        'propertyRightNo': data.propertyRightNo,
	                        'landUseNo': data.landUseNo,
	                        'estateRightNo': data.estateRightNo,
	                        'ownerName': data.ownerName,
	                        'calArea': data.calArea,
	                        'floorNum': data.floorNum,
	                        'totalFloorNum': data.totalFloorNum,
	                        'registeredUnit': data.registeredUnit,
	                        'registeredArea': data.registeredArea,
	                        'notRegisteredArea': data.notRegisteredArea,
	                        'remark1': data.remark1
	                         });
              	  	});
                	
                },
                yes: function(index, layero) {

                    form.on('submit(manage-edit-submit)', function(data) {
                    	var flag=check('manage-edit');
	                	if(!flag){
	                		return false;
	                	}else{
	                		//TODO
	                        whui.request(layui.whconfig.bizurl.estate_manage.edit, data.field, function(data,desc){
	                            whui.msg.success(desc);
	                            query(table);
	                            layer.close(index);
	                        },function(data){
	                        	whui.msg.warn(data.desc);
			                });
	                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
	                	}
                        
                    });
                    jQuery('button[lay-filter="manage-edit-submit"]').click();
                }
            });
        });
    });


	function update_init(){	
		//初始化管理单元下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'MANAGEMENT_NAME_'}, function(data,desc){
            $("#managementUnit").html("<option value=''>请选择小区</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#managementUnit").append(option);
            }); 
   			$("#managementUnit").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化小区下拉框
		whui.request(layui.whconfig.bizurl.estate_manage.areaList, {}, function(data,desc){
            $("#areaName").html("<option value=''>请选择小区</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#areaName").append(option);
            }); 
   			$("#areaName").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化省市区下拉框
		whui.request(layui.whconfig.bizurl.estate_manage.provinceCityDistinct, {}, function(data,desc){
            $("#province_city_district").html("<option value=''>请选择省市区</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#province_city_district").append(option);
            }); 
   			$("#province_city_district").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化房产状态下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'ESTATE_STATUS_CODE_'}, function(data,desc){
            $("#estateStatus").html("<option value=''>请选择房产状态</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#estateStatus").append(option);
            }); 
   			$("#estateStatus").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化房产类型下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'ESTATE_TYPE_CODE_'}, function(data,desc){
            $("#estateType").html("<option value=''>请选择房产类型</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#estateType").append(option);
            }); 
   			$("#estateType").get(0).selectedIndex=0;
   			form.render('select');
		});
		
		//初始化房产结构下拉框
		whui.request(layui.whconfig.bizurl.pubcode.queryCode, {configCode:'ESTATE_STRUCTURE_CODE_'}, function(data,desc){
            $("#estateStructure").html("<option value=''>请选择房产结构</option>");
       		$.each(data, function(key, val) {
     			var option = $("<option>").val(val.id).text(val.text);
                $("#estateStructure").append(option);
            }); 
   			$("#estateStructure").get(0).selectedIndex=0;
   			form.render('select');
		});
		layui.use('laydate', function(){
	  		var laydate = layui.laydate;
	     	//日期时间选择器
			laydate.render({ 
			  elem: '#completionTime',
			  type: 'date'
			});
		});
		form.on('select(pcd_change)', function(data){
			province_city_district_text = data.elem[data.elem.selectedIndex].text;
		});
	}

    jQuery('#estate-manage-index .whui-btn-delete').click(function() {
        var checkStatus = table.checkStatus('estate-manage-table');
        var ids = '';
        layui.each(checkStatus.data,function(index, item){
           ids += item.id +',';
        });
		
        var params = {
            ids:ids
        }
        layer.open({
            title: '删除',
            content: '是否删除所选信息？',
            btn: ['删除', '取消'],
            yes: function(index, layero) {
                layer.close(index);
                whui.request(layui.whconfig.bizurl.estate_manage.delete, params, function(data,desc){
                        whui.msg.success(desc);
                        query(table);
                },function(data){
                    whui.msg.warn(data.desc);
                });
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            }
            });
    });

    function query(table, where) {
        where = where || {};
        table.render({
            elem: '#estate-manage-table',
            id: 'estate-manage-table',
            url: layui.whconfig.bizurl.estate_manage.query,
            where: where,
            cols: cols
        });
    }

});