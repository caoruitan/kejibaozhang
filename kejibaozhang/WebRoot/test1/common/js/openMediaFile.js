//调用wps插件
document.addEventListener("plusready", function() {
	var _BARCODE = 'RunTimeExternal',
		B = window.plus.bridge;
	var RunTimeExternal = {
		OpenFile: function(Argus1, Argus2, Argus3, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "OpenFile", [callbackID, Argus1, Argus2, Argus3]);
		}
	};
	window.plus.RunTimeExternal = RunTimeExternal;
}, true);

document.addEventListener("plusready", function() {
	var _BARCODE = 'plugintest',
		B = window.plus.bridge;
	var plugintest = {
		PluginTestFunction: function(Argus1, Argus2, Argus3, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);

			return B.exec(_BARCODE, "PluginTestFunction", [callbackID, Argus1, Argus2, Argus3]);
		},
		PluginTestFunctionArrayArgu: function(Argus, successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "PluginTestFunctionArrayArgu", [callbackID, Argus]);
		},
		PluginTestFunctionSync: function(Argus1, Argus2, Argus3, Argus4) {
			return B.execSync(_BARCODE, "PluginTestFunctionSync", [Argus1, Argus2, Argus3]);
		},
		PluginTestFunctionSyncArrayArgu: function(Argus) {
			return B.execSync(_BARCODE, "PluginTestFunctionSyncArrayArgu", [Argus]);
		},

		addfunc: function(argv1) {
			return B.execSync("madjplugin", "add", [argv1]);
		}

	};
	window.plus.madjrand = plugintest;


	window.plus.openVedioFile = function(argv1) {
		return B.execSync("madjplugin", "add", [argv1]);
	};

}, true);


function openWPSFile(fileName) {
	plus.RunTimeExternal.OpenFile(plus.io.convertLocalFileSystemURL(fileName), "cn.wps.moffice_eng", "cn.wps.moffice.documentmanager.PreStartActivity", function(e) {}, function(e) {
		plus.nativeUI.toast("打开失败！");
		plus.nativeUI.confirm("检查到您未安装\"WPS Office\"，是否到商城搜索下载？", function(i) {
			if (i.index == 0) {
				plus.runtime.openURL("market://details?id=cn.wps.moffice_eng");
			}
		});
	});
}

function openVedioFile(URL) {
	plus.openVedioFile(URL);
}