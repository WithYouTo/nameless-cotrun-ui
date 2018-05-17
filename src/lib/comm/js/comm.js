/*项目组自定义方法区*/
layui.define(function(exports) {
	var comm = {};
	jQuery.extend(comm, {
		ui: {
			form: {
				/**
				 * 更多查询效果
				 * @param {String} eleId 页面ID
				 */
				querymore: function(eleId) {
					jQuery('#' + eleId + ' .whui-btn-querymore').click(function() {
						if(jQuery(this).html() === '更多查询') {
							jQuery(this).html('收起更多查询');
						} else {
							jQuery(this).html('更多查询');
						}
						jQuery('#' + eleId + ' .whui-form-area-querymore').toggle('fast');
					});
				},
				/**
				 * 必填*效果
				 * @param {String} eleId 页面ID
				 */
				verifyRequired: function(eleId) {
					jQuery('#' + eleId + ' .whui-form input[lay-verify=required]').parent().attr('whui-verify', 'required');
					jQuery('#' + eleId + ' .whui-form select[lay-verify=required]').parent().attr('whui-verify', 'required');
				}
			}
		}

	});

	exports('whcomm', comm);
});