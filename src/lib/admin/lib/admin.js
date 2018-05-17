layui.define("view",function(e){var a,m=layui.jquery,l=layui.laytpl,t=layui.element,o=layui.setter,i=layui.view,n=layui.device(),s=m(window),r=m("body"),u=m("#"+o.container),d="layui-show",y="layui-this",c="layui-disabled",h="#LAY_app_body",f="LAY_app_flexible",p="layadmin-side-spread-sm",v="layadmin-tabsbody-item",b="layui-icon-shrink-right",g="layui-icon-spread-left",x="layadmin-side-shrink",C={v:"1.0.0-beta8 pro",req:i.req,sendAuthCode:function(i){var t,n=(i=m.extend({seconds:60,elemPhone:"#LAY_phone",elemVercode:"#LAY_vercode"},i)).seconds,s=function(e){var a=m(i.elem);--n<0?(a.removeClass(c).html("获取验证码"),n=i.seconds,clearInterval(t)):a.addClass(c).html(n+"秒后重获"),e||(t=setInterval(function(){s(!0)},1e3))};r.on("click",i.elem,function(){i.elemPhone=m(i.elemPhone),i.elemVercode=m(i.elemVercode);var e=i.elemPhone,a=e.val();if(n===i.seconds&&!m(this).hasClass(c)){if(!/^1\d{10}$/.test(a))return e.focus(),layer.msg("请输入正确的手机号");if("object"==typeof i.ajax){var t=i.ajax.success;delete i.ajax.success}C.req(m.extend(!0,{url:"/auth/code",type:"get",data:{phone:a},success:function(e){layer.msg("验证码已发送至你的手机，请注意查收",{icon:1,shade:0}),i.elemVercode.focus(),s(),t&&t(e)}},i.ajax))}})},screen:function(){var e=s.width();return 1200<=e?3:992<=e?2:768<=e?1:0},exit:i.exit,sideFlexible:function(e){var a=u,t=m("#"+f),i=C.screen();"spread"===e?(t.removeClass(g).addClass(b),i<2?a.addClass(p):a.removeClass(p),a.removeClass(x)):(t.removeClass(b).addClass(g),i<2?a.removeClass(x):a.addClass(x),a.removeClass(p)),layui.event.call(this,o.MOD_NAME,"side({*})",{status:e})},on:function(e,a){return layui.onevent.call(this,o.MOD_NAME,e,a)},popup:i.popup,popupRight:function(e){return C.popup.index=layer.open(m.extend({type:1,id:"LAY_adminPopupR",anim:-1,title:!1,closeBtn:!1,offset:"r",shade:.1,shadeClose:!0,skin:"layui-anim layui-anim-rl layui-layer-adminRight",area:"300px"},e))},theme:function(e){o.theme;var t=layui.data(o.tableName),a="LAY_layadmin_theme",i=document.createElement("style"),n=l([".layui-side-menu,",".layadmin-pagetabs .layui-tab-title li:after,",".layadmin-pagetabs .layui-tab-title li.layui-this:after,",".layui-layer-admin .layui-layer-title,",".layadmin-side-shrink .layui-side-menu .layui-nav>.layui-nav-item>.layui-nav-child","{background-color:{{d.color.main}} !important;}",".layui-nav-tree .layui-this,",".layui-nav-tree .layui-this>a,",".layui-nav-tree .layui-nav-child dd.layui-this,",".layui-nav-tree .layui-nav-child dd.layui-this a","{background-color:{{d.color.selected}} !important;}",".layui-layout-admin .layui-logo{background-color:{{d.color.logo || d.color.main}} !important;}}"].join("")).render(e=m.extend({},t.theme,e)),s=document.getElementById(a);"styleSheet"in i?(i.setAttribute("type","text/css"),i.styleSheet.cssText=n):i.innerHTML=n,i.id=a,s&&r[0].removeChild(s),r[0].appendChild(i),r.attr("layadmin-themealias",e.color.alias),t.theme=t.theme||{},layui.each(e,function(e,a){t.theme[e]=a}),layui.data(o.tableName,{key:"theme",value:t.theme})},tabsPage:{},tabsBody:function(e){return m(h).find("."+v).eq(e||0)},tabsBodyChange:function(e){C.tabsBody(e).addClass(d).siblings().removeClass(d),A.rollPage("auto",e)},resize:function(e){var a=layui.router().path.join("-");s.off("resize",C.resizeFn[a]),e(),C.resizeFn[a]=e,s.on("resize",C.resizeFn[a])},resizeFn:{},runResize:function(){var e=layui.router().path.join("-");C.resizeFn[e]&&C.resizeFn[e]()},delResize:function(){var e=layui.router().path.join("-");s.off("resize",C.resizeFn[e]),delete C.resizeFn[e]},correctRouter:function(e){return/^\//.test(e)||(e="/"+e),e.replace(/^(\/+)/,"/").replace(new RegExp("/"+o.entry+"$"),"/")},closeThisTabs:function(){C.tabsPage.index&&m(k).eq(C.tabsPage.index).find(".layui-tab-close").trigger("click")}},A=C.events={flexible:function(e){var a=e.find("#"+f).hasClass(g);C.sideFlexible(a?"spread":null)},refresh:function(){layui.index.render()},message:function(e){e.find(".layui-badge-dot").remove()},theme:function(){C.popupRight({id:"LAY_adminPopupTheme",success:function(){i(this.id).render("system/theme")}})},note:function(e){var a=C.screen()<2,n=layui.data(o.tableName).note;A.note.index=C.popup({title:"便签",shade:0,offset:["41px",a?null:e.offset().left-250+"px"],anim:-1,id:"LAY_adminNote",skin:"layadmin-note layui-anim layui-anim-upbit",content:'<textarea placeholder="内容"></textarea>',resize:!1,success:function(e,a){var t=e.find("textarea"),i=void 0===n?"便签中的内容会存储在本地，这样即便你关掉了浏览器，在下次打开时，依然会读取到上一次的记录。是个非常小巧实用的本地备忘录":n;t.val(i).focus().on("keyup",function(){layui.data(o.tableName,{key:"note",value:this.value})})}})},about:function(){C.popupRight({id:"LAY_adminPopupAbout",success:function(){i(this.id).render("system/about")}})},more:function(){C.popupRight({id:"LAY_adminPopupMore",success:function(){i(this.id).render("system/more")}})},back:function(){history.back()},setTheme:function(e){var a=o.theme,t=e.data("index");e.siblings(".layui-this").data("index");e.hasClass(y)||(e.addClass(y).siblings(".layui-this").removeClass(y),a.color[t]&&(a.color[t].index=t,C.theme({color:a.color[t]})))},rollPage:function(e,t){var n=m("#LAY_app_tabsheader"),s=n.children("li"),l=(n.prop("scrollWidth"),n.outerWidth()),o=parseFloat(n.css("left"));if("left"===e){if(!o&&o<=0)return;var i=-o-l;s.each(function(e,a){var t=m(a).position().left;if(i<=t)return n.css("left",-t),!1})}else"auto"===e?function(){var e,a=s.eq(t);if(a[0]){if((e=a.position().left)<-o)return n.css("left",-e);if(e+a.outerWidth()>=l-o){var i=e+a.outerWidth()-(l-o);s.each(function(e,a){var t=m(a).position().left;if(0<t+o&&i<t-o)return n.css("left",-t),!1})}}}():s.each(function(e,a){var t=m(a),i=t.position().left;if(i+t.outerWidth()>=l-o)return n.css("left",-i),!1})},leftPage:function(){A.rollPage("left")},rightPage:function(){A.rollPage()},closeThisTabs:function(){C.closeThisTabs()},closeOtherTabs:function(e){var t="LAY-system-pagetabs-remove";"all"===e?(m(k+":gt(0)").remove(),m(h).find("."+v+":gt(0)").remove()):(m(k).each(function(e,a){e&&e!=C.tabsPage.index&&(m(a).addClass(t),C.tabsBody(e).addClass(t))}),m("."+t).remove())},closeAllTabs:function(){A.closeOtherTabs("all"),location.hash=""},shade:function(){C.sideFlexible()}};(a=layui.data(o.tableName)).theme&&C.theme(a.theme),r.addClass("layui-layout-body"),C.screen()<1&&delete o.pageTabs,o.pageTabs||u.addClass("layadmin-tabspage-none"),n.ie&&n.ie<10&&i.error("IE"+n.ie+"下访问可能不佳，推荐使用：Chrome / Firefox / Edge 等高级浏览器",{offset:"auto",id:"LAY_errorIE"}),C.on("hash(side)",function(e){var a,r,u=e.path,d=function(e){return{list:e.children(".layui-nav-child"),name:e.data("name"),jump:e.data("jump")}},t=m("#LAY-system-side-menu"),c="layui-nav-itemed";t.find("."+y).removeClass(y),C.screen()<2&&C.sideFlexible(),a=t.children("li"),r=C.correctRouter(u.join("/")),a.each(function(e,a){var t=m(a),o=d(t),i=o.list.children("dd"),n=u[0]==o.name||0===e&&!u[0]||o.jump&&r==C.correctRouter(o.jump);if(i.each(function(e,a){var t=m(a),s=d(t),i=s.list.children("dd"),n=u[0]==o.name&&u[1]==s.name||s.jump&&r==C.correctRouter(s.jump);if(i.each(function(e,a){var t=m(a),i=d(t);if(u[0]==o.name&&u[1]==s.name&&u[2]==i.name||i.jump&&r==C.correctRouter(i.jump)){var n=i.list[0]?c:y;return t.addClass(n).siblings().removeClass(n),!1}}),n){var l=s.list[0]?c:y;return t.addClass(l).siblings().removeClass(l),!1}}),n){var s=o.list[0]?c:y;return t.addClass(s).siblings().removeClass(s),!1}})}),t.on("nav(layadmin-system-side-menu)",function(e){e.siblings(".layui-nav-child")[0]&&u.hasClass(x)&&(C.sideFlexible("spread"),layer.close(e.data("index"))),C.tabsPage.type="nav"}),t.on("nav(layadmin-pagetabs-nav)",function(e){var a=e.parent();a.removeClass(y),a.parent().removeClass(d)});var P=function(e){var a=e.attr("lay-id"),t=e.attr("lay-attr"),i=e.index();C.tabsBodyChange(i),location.hash=a===o.entry?"/":t},k="#LAY_app_tabsheader>li";r.on("click",k,function(){var e=m(this),a=e.index();if(C.tabsPage.type="tab",C.tabsPage.index=a,"iframe"===e.attr("lay-attr"))return C.tabsBodyChange(a);P(e),C.runResize()}),t.on("tabDelete(layadmin-layout-tabs)",function(e){var a=m(k+".layui-this");e.index&&C.tabsBody(e.index).remove(),P(a),C.delResize()}),r.on("click","*[lay-href]",function(){var e=m(this),a=e.attr("lay-href");layui.router();C.tabsPage.elem=e,location.hash=C.correctRouter(a)}),r.on("click","*[layadmin-event]",function(){var e=m(this),a=e.attr("layadmin-event");A[a]&&A[a].call(this,e)}),r.on("mouseenter","*[lay-tips]",function(){var e=m(this);if(!e.parent().hasClass("layui-nav-item")||u.hasClass(x)){var a=e.attr("lay-tips"),t=e.attr("lay-offset"),i=e.attr("lay-direction"),n=layer.tips(a,this,{tips:i||1,time:-1,success:function(e,a){t&&e.css("margin-left",t+"px")}});e.data("index",n)}}).on("mouseleave","*[lay-tips]",function(){layer.close(m(this).data("index"))});var z=layui.data.resizeSystem=function(){layer.closeAll("tips"),z.lock||setTimeout(function(){C.sideFlexible(C.screen()<2?"":"spread"),delete z.lock},100),z.lock=!0};s.on("resize",layui.data.resizeSystem),e("admin",C)});