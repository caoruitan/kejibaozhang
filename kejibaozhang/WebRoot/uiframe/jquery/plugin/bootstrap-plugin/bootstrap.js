/**
* jquery.bootstrap.js
Copyright (c) Kris Zhang <kris.newghost@gmail.com>
License: MIT (https://github.com/newghost/bootstrap-jquery-plugin/blob/master/LICENSE)
*/
String.prototype.format||(String.prototype.format=function(){var e=arguments;return this.replace(/{(\d+)}/g,function(t,n){return typeof e[n]!="undefined"?e[n]:t})}),function(e){e.fn.dialog=function(t){var n=this,r=e(n),i=e(document.body),s=r.closest(".dialog"),o="dialog-parent",u=arguments[1],a=arguments[2],f=function(){var t='<div class="dialog modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close">&times;</button><h4 class="modal-title"></h4></div><div class="modal-body"></div><div class="modal-footer"></div></div></div></div>';s=e(t),e(document.body).append(s),s.find(".modal-body").append(r)},l=function(r){var i=(r||t||{}).buttons||{},o=s.find(".modal-footer");o.html("");for(var u in i){var a=i[u],f="",l="",c="btn-default",h="";a.constructor==Object&&(f=a.id,l=a.text,c=a["class"]||a.classed||c,h=a.click),a.constructor==Function&&(l=u,h=a),$button=e('<button type="button" class="btn {1}">{0}</button>'.format(l,c)),f&&$button.attr("id",f),h&&function(e){$button.click(function(){e.call(n)})}(h),o.append($button)}o.data("buttons",i)},c=function(){s.modal("show")},h=function(e){s.modal("hide").on("hidden.bs.modal",function(){e&&(r.data(o).append(r),s.remove())})};t.constructor==Object&&(!r.data(o)&&r.data(o,r.parent()),s.size()<1&&f(),l(),e(".modal-title",s).html(t.title||""),e(".modal-dialog",s).addClass(t.dialogClass||""),e(".modal-header .close",s).click(function(){var e=t.onClose||h;e.call(n)}),(t["class"]||t.classed)&&s.addClass(t["class"]||t.classed),t.autoOpen!==!1&&c()),t=="destroy"&&h(!0),t=="close"&&h(),t=="open"&&c();if(t=="option"&&u=="buttons"){if(!a)return s.find(".modal-footer").data("buttons");l({buttons:a}),c()}return n}}(jQuery),$.messager=function(){var e=function(e,t){var n=$.messager.model;arguments.length<2&&(t=e||"",e="&nbsp;"),$("<div>"+t+"</div>").dialog({title:e,onClose:function(){$(this).dialog("destroy")},buttons:[{text:n.ok.text,classed:n.ok.classed||"btn-success",click:function(){$(this).dialog("destroy")}}]})},t=function(e,t,n){var r=$.messager.model;$("<div>"+t+"</div>").dialog({title:e,onClose:function(){$(this).dialog("destroy")},buttons:[{text:r.ok.text,classed:r.ok.classed||"btn-success",click:function(){$(this).dialog("destroy"),n&&n()}},{text:r.cancel.text,classed:r.cancel.classed||"btn-danger",click:function(){$(this).dialog("destroy")}}]})};return{alert:e,confirm:t}}(),$.messager.model={ok:{text:"OK",classed:"btn-success"},cancel:{text:"Cancel",classed:"btn-danger"}},function(e){e.fn.datagrid=function(t,n){var r=this,i="success",s=e(this),o=function(t){var n=s.data("config"),r=n.selectChange,o=n.singleSelect,u=n.edit,a=function(t){var n=e(this),u=n.hasClass(i),a=e("tbody tr",s).index(n),f=s.data("rows")[a]||{};o&&e("tbody tr",s).removeClass(i),n.toggleClass(i),r&&r(!u,a,f,n)};(r||typeof o!="undefined")&&t.click(a);var f=function(t){var n=e(this),r=n.closest("tr"),i=e("tbody tr",s).index(r),o=s.data("rows")[i]||{},u=n.attr("name");u&&(o[u]=n.val())};u&&t.find("input").keyup(f)},u=function(e,t,n){var r="<tr>";for(var i=0,s=e[0].length;i<s;i++){var o=e[0][i],u=o.formatter,a=o.field,f=o.tip,l=t[a],c=o.maxlength,h=o.readonly;typeof l=="undefined"&&(l=""),n.edit&&(c=c?' maxlength="{0}"'.format(o.maxlength):"",h=h?' readonly="readonly"':"",l='<input name="{0}" value="{1}" class="form-control"{2}{3}/>'.format(o.field,l,c,h)),l=u?u(t[a],t):l,r=r+"<td>"+l+"</td>"}return r+="</tr>",r},a=function(t){if(!n)return;var r=s.data("config")||{},i=r.columns,a=n.rows||n,f="<tbody>";if(a)for(var l=0,c=a.length;l<c;l++)f+=u(i,a[l],r);f+="</tbody>",e("tbody",s).remove(),s.data("rows",a).append(f),r.edit&&s.addClass("edit"),o(e("tbody tr",s))};if(t&&t.constructor==Object){var f=t.columns;if(f){e("thead",s).size()<1&&s.append("<thead></thead>");var l="<tr>";for(var c=0,h=f[0].length;c<h;c++){var p=f[0][c];l+="<th>"+(p.title||"")+"</th>"}l+="</tr>",s.data("config",t),e("thead",s).html(l)}}t=="loadData"&&a();if(t=="getData")return s.data("rows");if(t=="getConfig")return s.data("config");if(t=="getColumns")return s.data("config").columns;t=="unselectRow"&&(typeof n!="undefined"?e("tbody tr",s).eq(n).removeClass(i):e("tbody tr",s).removeClass(i));if(t=="updateRow"){var d=n.index,v=s.data("config"),m=s.data("rows"),g=n.row,f=v.columns;m&&(g=e.extend(m[d],g),s.data("rows",m));var y=e(u(f,g,v));e("tbody tr",s).eq(d).after(y).remove(),o(y)}if(t=="getSelections"){var m=s.data("rows"),b=[];return e("tbody tr",s).each(function(t){e(this).hasClass(i)&&b.push(m[t])}),b}if(t=="insertRow"){var d=n.index||0,g=n.row,v=s.data("config"),m=s.data("rows")||[];if(!v||!g)return s;var w=e("tbody tr",s),y=e(u(v.columns,g,v)),E=w.eq(d);o(y),E.size()?E.before(y):e("tbody",s).append(y),m.splice(d,0,g)}if(t=="deleteRow"&&n>-1){e("tbody tr",s).eq(n).remove();var m=s.data("rows");m.splice(n,1)}return r}}(jQuery),function(e){e.fn.tree=function(t,n){var r=this,i=e(r),s=Array.prototype.push,o="glyphicon-file",u="glyphicon-folder-open",a="glyphicon-folder-close",f=function(e,t,n){var r=[];!t&&r.push('<ul style="display:{0}">'.format(n=="close"?"none":"block"));for(var i=0,l=e.length;i<l;i++){var c=e[i],h=c.children,p=c.id,d=c.state,v=c.attributes;r.push("<li>");var m=typeof h=="undefined"?o:d=="close"?a:u;r.push('<span class="glyphicon {0}"></span> '.format(m)),r.push("<a{1}{2}{3}>{0}</a>".format(c.text,h?" class='tree-node'":"",p?" data-id='{0}'".format(p):"",v?" data-attr='{0}'".format(JSON.stringify(v)):"")),h&&s.apply(r,f(h,!1,d)),r.push("</li>")}return!t&&r.push("</ul>"),r},l=function(){e("span.glyphicon-folder-open, span.glyphicon-folder-close",i).click(function(t){var n=e(this),r=n.closest("li").children("ul");n.hasClass(a)?(n.removeClass(a).addClass(u),r.show()):(n.removeClass(u).addClass(a),r.hide())})};if(t&&t.constructor==Object){var c=t.data;if(c&&c.constructor==Array){var h=f(c,!0);i.html(h.join("")),i.data("config",t),l()}var p=t.onClick;p&&e("li>a",i).click(function(){var t=e(this);attrs=t.attr("data-attr"),p.call(r,{id:t.attr("data-id"),attributes:attrs?JSON.parse(attrs):{},text:t.text()},t)})}return r}}(jQuery)