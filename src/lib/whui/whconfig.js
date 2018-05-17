layui.define(function(exports) {
	"use strict";
	var runtime = 'D'; //运行环境：D开发、T测试、P生产
	var baseurl = '';
	if('P' === runtime) {
		baseurl = 'http://127.0.0.1:8020/WhUITest/';
	} else if('T' === runtime) {
		baseurl = 'http://192.168.185.167:3000/whui/';
	} else if('D' === runtime) {
		baseurl = 'http://localhost:8060/';
	}
	var whconfig = {};
	jQuery.extend(true, whconfig, {
		debug: runtime === 'D' || false, //是否开启调试模式。如开启，接口异常时会抛出异常 URL等信息
		runtime: runtime,
		name: '不动产管理系统', //系统名
		describe: 'ESP', //系统描述
		tableName: 'WhUI', //localstorage本地存储表名
		pageTabs: true, //是否开启页面选项卡功能。单页面专业版不推荐开启
		interceptor: true, //是否开启未登入拦截
		page: {
			src: '../../../views/', //页面目录
			main: {
				layout: 'main/layout/layout', //布局页地址
				index: 'main/main-index/main-index' //首页地址
			},
			login: {
				login: '/login/login/login', //登录页地址
				forget: '/login/forget/forget', //找回密码页地址
				reg: '/login/reg/reg' //注册页地址
			},
			error: {
				e404: 'main/error/404', //404页地址
				other: 'main/error/other' //错误页地址
			}
		},
		req: {
			tokenName: 'access_token', //token字段名
			pageName: 'page', //当前第几页字段名
			limitName: 'limit', //每页笔数字段名
			timeout: 7000 //请求超时时间
		},
		resp: {
			codeName: 'code', //返回码字段名
			dataName: 'data', //返回数据字段名
			descName: 'desc', //返回描述字段名
			countName: 'count', //返回总笔数字段名
			code: {
				success: 200, //成功返回码
				logout: 4001 //token错误返回码
			}
		},
		sysurl: {
			base: baseurl,
			main: {
				menu: baseurl + 'menu',
				personal: baseurl + 'personal',
				msg: baseurl + 'main/msg'
			},
			login: {
				login: baseurl + 'login',
				logout: baseurl + 'login/logout',
				forget: baseurl + 'login/forget',
				reg: baseurl + 'login/reg'
			},
			menu: {
				query: baseurl + 'menu/list',
                add: baseurl + 'menu/add',
                edit: baseurl + 'menu/edit',
                delete: baseurl + 'menu/remove',
				getMenus:baseurl + 'menu/selectMenuTreeList',
				toMenu: baseurl + 'menu/menuTreeListByRoleId'
			},
			user: {
				query: baseurl + 'mgr/list',
				add: baseurl + 'mgr/add',
				edit: baseurl + 'mgr/edit',
				delete: baseurl + 'mgr/delete'
			},
			role: {
				query: baseurl + 'role/list',
				add: baseurl + 'role/add',
				edit: baseurl + 'role/edit',
				delete: baseurl + 'role/remove',
				toEdit: baseurl + 'role/toEdit',
				setAuthority: baseurl + 'role/setAuthority'
			},
            org:{
                query: baseurl + 'org/list',
                add: baseurl + 'org/add',
                edit: baseurl + 'org/edit',
                delete: baseurl + 'org/delete'
            },
			'': ''
		},
		reqHeaders: {
			api_version: 'v1'
		},
		reqParams: {},
		//独立页面路由，可随意添加（无需写参数）
		indPage: [
			'/login/login/login', //登入页
			'/login/reg/reg', //注册页
			'/login/forget/forget' //找回密码
		],
		'': ''
	}, {
		//TODO 业务配置，由主程序员负责修改
		reqHeaders: {},
		reqParams: {},
		bizurl: {
			//职位管理
			position: {
				initCompany: baseurl + 'property/selectSubCompaniesV2',
				initPositionLevel: baseurl + 'property/selectTemplateTypes',
				query: baseurl + 'position/selectPositionsByPage',
				add: baseurl + 'position/insertNewPosition',
				toDetail: baseurl + 'position/toUpdate/',
				edit: baseurl + 'position/updatePositionInfo',
				delete: baseurl + 'position/deletePosition'
			},
			estate_manage: {
				query: baseurl + 'estate_management/list',
				add: baseurl + 'estate_management/addEstateInfo',
				edit: baseurl + 'estate_management/updateEstateInfo',
				delete: baseurl + 'estate_management/deleteByPrimaryId',
				areaList: baseurl + 'estate_management/areaList',
				areaChange: baseurl + 'estate_management/generateEstateNo',
				provinceCityDistinct: baseurl + 'estate_management/provinceCityDistinct',
				toEdit: baseurl + 'estate_management/toEdit',
				updateEstateInfo: baseurl + 'estate_management/updateEstateInfo'
			},
			estate_import:{
				import:baseurl+"estate_import/import",
				query:baseurl+"estate_import/list",
				delete:baseurl+"estate_import/deleteByManagementUnit"
			},
			pubcode: {
				query: baseurl + 'pubCode/list',
				add: baseurl + 'pubCode/pubCodeAdd',
				edit: baseurl + 'pubCode/pubCodeEdit',
				delete: baseurl + 'pubCode/delete',
				query01: baseurl+ 'pubCode/listPubCode01',
				add01: baseurl + 'pubCode/pubCode01Add',
				edit01: baseurl + 'pubCode/pubCode01Edit',
				delete01: baseurl + 'pubCode/deletePubCode01',
				queryCode: baseurl + 'pubCode/selectConfigCode',
				queryCode01: baseurl + 'pubCode/selectGroupDropdown'
			},
			contractIn: {
				importContract: baseurl + "contract/importContract",
				query: baseurl + "contract/listImportContract",
				edit: baseurl + "contract/editImportContract",
				delete: baseurl + "contract/deleteImportContract",
			},
			//部门管理
			department:{
				query:baseurl+'dept/selectBb04ByPage',
				initTree:baseurl+'dept/select',
				delete:baseurl+'dept/delete',
				edit:baseurl+'dept/update',
				add:baseurl+'dept/insert'
			},
			//公司管理
			company:{
				query: baseurl + 'company/list',
				add: baseurl + 'company/add',
				edit: baseurl + 'company/update',
				delete: baseurl + 'company/delete',
			},
			//web用户管理
			webuser:{
				initCompany: baseurl + 'property/selectSubCompaniesV2',
				initDept:baseurl+'property/listDeptInfo',
				initPosition:baseurl+'webUser/selectPositionInfo',
				initManagerType: baseurl + 'property/selectTemplateTypes',
				query:baseurl+'webUser/list',
				add:baseurl+'webUser/add',
				edit:baseurl+'webUser/update',
				delete:baseurl+'webUser/delete',
				toDetail:baseurl+'webUser/toUpdate/',
				roleAssign:baseurl+'webUser/setRole',
				roleList:baseurl+'webUser/roleTreeListByUserIdAndCom/',
				resetPass:baseurl+'webUser/resetPwd'
			},//登录日志
			loginLog:{
				query:baseurl+'loginLogmanage/list',
				delete:baseurl+'loginLogmanage/delete'
			},
			//省市区字典
			location:{
				load:baseurl+'location/select',
				query:baseurl+'location/selectLocationByPage'
			}
		}
	});
	exports('whconfig', whconfig);
});