/**
 * @author tupengfei
 * @version 1.0.0 2018.5.15
 */
layui.extend({
	"whconfig": "../whconfig",
	'dateformat': '../../../plugins/modules/dateformat/dateformat.min',
	'zTree': '../../../plugins/modules/ztree/js/jquery.ztree.all.min',
	"whcomm": "../../comm/js/comm"
}).define("whconfig", function(exports) {
	"use strict";
	var whui = {};
	var whconfig = layui.whconfig;
	jQuery.extend(whui, {
		/**
		 * 判断字符串为空。
		 * 空字符串，null，undefined，"null"，"undefined"均判空
		 * @param {String} str 字符串
		 * @returns boolean true：为空，false：不为空
		 */
		isEmpty: function(str) {
			return str === "" || str === null || str === undefined || str === "null" || str === "undefined";
		},
		/**
		 * 判断字符串非空
		 * @param {String} str 字符串
		 * @returns boolean true：不为空，false：为空
		 */
		isNotEmpty: function(str) {
			return !whui.isEmpty(str);
		},
		/**
		 * 判断对象、数组为空
		 * @param {Object|Array} obj 数组或对象
		 * @returns boolean true：为空，false：不为空
		 */
		isEmptyObject: function(obj) {
			for(var a in obj) {
				return false;
			}
			return true;
		}
	}, {
		/***
		 * 数据存储
		 */
		/**
		 * 设置持久化参数
		 * @param {String} key 键
		 * @param {Object} value 值
		 */
		setLocalData: function(key, value) {
			layui.data(whconfig.tableName, {
				key: key,
				value: value
			});
		},
		/**
		 * 取出持久化参数
		 * @param {String} key 键
		 */
		getLocalData: function(key) {
			var table = layui.data(whconfig.tableName);
			return table[key];
		},
		/**
		 * 设置临时参数
		 * @param {String} key 键
		 * @param {Object} value 值
		 */
		setSessionData: function(key, value) {
			layui.sessionData(whconfig.tableName, {
				key: key,
				value: value
			});
		},
		/**
		 * 取出临时参数
		 * @param {String} key 键
		 */
		getSessionData: function(key) {
			var table = layui.sessionData(whconfig.tableName);
			return table[key];
		}

	}, {
		/**
		 * AJAX请求
		 * @param {String} reqUrl 请求地址
		 * @param {Object} reqParams 请求参数
		 * @param {Function} doSuccess 成功回调
		 * @param {Function} doFail 失败回调
		 * @param {Object} options 配置参数
		 * @param {Object} options.headers 请求头
		 * @param {String} options.contentType 内容类型，默认application/x-www-form-urlencoded
		 * @param {String} options.type 请求方式，默认POST
		 * @param {String} options.dataType 响应数据格式，默认json
		 * @param {Boolean} options.normal 是否常规模式(自动解析返回码200)，默认true
		 * @param {Boolean} options.showloading 是否显示加载圈，默认true
		 * @param {Number} options.timeout 超时时间，默认7000
		 */
		request: function(reqUrl, reqParams, doSuccess, doFail, options) {
			var _reqParams = whconfig.reqParams || {};
			jQuery.extend(_reqParams, reqParams || {});

			var _options = {
				headers: whconfig.reqHeaders || {},
				contentType: "application/x-www-form-urlencoded",
				type: "POST",
				dataType: "json",
				async: true,
				normal: true,
				showloading: true,
				timeout: whconfig.req.timeout,
			};
			//			var debugInfo = function() {
			//				return whconfig.debug ? "<br><cite>URL：</cite>" + options.url : "";
			//			};

			if(typeof doFail !== "function") {
				jQuery.extend(_options, doFail || {});
			} else {
				jQuery.extend(_options, options || {});
			}

			//向header中加入token
			if(whconfig.req.tokenName) {
				_options.headers[whconfig.req.tokenName] = whui.getLocalData(whconfig.req.tokenName) || "";
			}

			if(_options.contentType.indexOf("application/json") > -1) {
				_reqParams = JSON.stringify(_reqParams);
			}
			var loadingIndex;
			jQuery.ajax({
				headers: _options.headers,
				contentType: _options.contentType,
				type: _options.type,
				url: reqUrl,
				data: _reqParams,
				cache: false,
				dataType: _options.dataType,
				timeout: _options.timeout,
				async: _options.async,
				beforeSend: function(xhr) {
					if(_options.showloading) {
						loadingIndex = layer.load();
					}
				},
				success: function(resp, textStatus) {
					if(_options.normal) {
						var code = resp[whconfig.resp.codeName];
						if(code === whconfig.resp.code.success) {
							var data = resp[whconfig.resp.dataName] || {};
							if(typeof data === "string") {
								data = JSON.parse(data);
							}
							doSuccess(data, resp[whconfig.resp.descName]);
						} else {
							//返回token失效码时登出
							if(code === whconfig.resp.code.logout) {
								layui.view.exit();
								return;
							}
							if(typeof doFail === "function") {
								doFail(resp);
							} else {
								whui.msg.warn(resp[whconfig.resp.descName]);
							}
						}
					} else {
						doSuccess(resp);
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					if(typeof doFail === "function") {
						doFail({}, xhr, textStatus, errorThrown);
					} else {
						if(textStatus === "timeout") {
							whui.msg.warn("请求超时");
						} else {
							whui.msg.warn("请求错误(" + xhr.status + " " + textStatus + ")");
						}
					}
				},
				complete: function(xhr, textStatus) {
					if(_options.showloading) {
						layer.close(loadingIndex);
					}
				}
			});
		}
	}, {
		msg: {
			/**
			 * 成功提示
			 * @param {String} msg 消息
			 * @param {Function} callback 回调
			 * @param {Number} time 自动关闭所需毫秒
			 */
			success: function(msg, callback, time) {
				layer.msg(msg, {
					'icon': 1,
					'time': time || 3000
				}, function() {
					if(typeof callback === 'function') {
						callback();
					}
				});
			},
			/**
			 * 失败提示
			 * @param {String} msg 消息
			 * @param {Function} callback 回调
			 * @param {Number} time 自动关闭所需毫秒
			 */
			failed: function(msg, callback, time) {
				layer.msg(msg, {
					'icon': 2,
					'time': time || 3000
				}, function() {
					if(typeof callback === 'function') {
						callback();
					}
				});
			},
			/**
			 * 警告提示
			 * @param {String} msg 消息
			 * @param {Function} callback 回调
			 * @param {Number} time 自动关闭所需毫秒
			 */
			warn: function(msg, callback, time) {
				layer.msg(msg, {
					'icon': 0,
					'time': time || 3000
				}, function() {
					if(typeof callback === 'function') {
						callback();
					}
				});
			}
		}
	}, {
		/**
		 * 将json对象转为form序列化数据
		 */
		json2Form: function(json) {
			var str = [];
			for(var p in json) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
			}
			return str.join("&");
		},
		/**
		 * 将form序列化数据转为json对象
		 */
		form2Json: function(form) {
			var arr = form.split("&");
			var item, key, value, newData = {};
			for(var i = 0; i < arr.length; i++) {
				item = arr[i].split("=");
				key = item[0];
				value = decodeURIComponent(item[1]);
				newData[key] = value;
			}
			return newData;
		}
	});
	exports("whui", whui);
});