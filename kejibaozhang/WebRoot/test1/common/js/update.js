(function(w) {
	var server = "http://192.168.6.84:8080/webapp/update/update.json", //获取升级描述文件服务器地址
		localDir = "update",
		localJSONFile = "update.json",
		localAPKFile = "update.apk",
		localWGTFile = "update.wgt",
		dir = null;

	/**
	 * 准备升级操作
	 * 创建升级文件保存目录
	 */
	function initUpdate() {
		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
			fs.root.getDirectory(localDir, {
				create: true
			}, function(entry) {
				dir = entry;
				checkUpdate();
			}, function(e) {
				console.error("准备升级操作，打开update目录失败：" + e.message);
			});
		}, function(e) {
			console.error("准备升级操作，打开doc目录失败：" + e.message);
		});
	}

	/**
	 * 检测程序升级
	 */
	function checkUpdate() {
		dir.getFile(localJSONFile, {
			create: false
		}, function(fentry) {
			fentry.file(function(file) {
				var reader = new plus.io.FileReader();
				reader.readAsText(file);
				reader.onloadend = function(e) {
					var data = null;
					try {
						data = JSON.parse(e.target.result);
					} catch (e) {
						console.log("读取本地升级文件，数据格式错误！");
						return;
					}
					checkUpdateDataLocal(data);
				}
			}, function(e) {
				console.log("读取本地升级文件，获取文件对象失败：" + e.message);
				dir.removeRecursively(function(entry) {
					console.log("删除update文件成功");
				}, function(e) {
					console.log("删除update文件失败：" + e.code + "..." + e.message);
				});
			});
		}, function(e) {
			getUpdateData();
		});
	}

	/**
	 * 检查升级数据
	 */
	function checkUpdateDataLocal(j) {
		var inf = j[plus.os.name];
		if (inf) {
			var curVer = plus.runtime.version;
			var srvVer = inf.apk.version;
			console.log("apkVersion...cur:" + curVer + "  srv:" + srvVer);
			if (compareVersion(curVer, srvVer)) {
				dir.getFile(localAPKFile, {
					create: false
				}, function(fentry) {
					console.log("安装升级软件" + fentry.fullPath);
					plus.runtime.openFile(fentry.fullPath, {}, function(e) {
						console.error("安装失败..." + e);
						dir.removeRecursively(function(entry) {
							console.log("删除update文件成功");
						}, function(e) {
							console.log("删除update文件失败：" + e.code + "..." + e.message);
						});
					});
				}, function(e) {
					console.log("没有需要安装的升级包");
					dir.removeRecursively(function(entry) {
						console.log("删除update文件成功");
					}, function(e) {
						console.log("删除update文件失败：" + e.code + "..." + e.message);
					});
				});
			} else {
				plus.runtime.getProperty(plus.runtime.appid, function(appinf) {
					var curWGTVer = appinf.version;
					var srvWGTVer = inf.wgt.version;
					console.log("wgtVersion...cur:" + curWGTVer + "  srv:" + srvWGTVer);
					if (compareVersion(curWGTVer, srvWGTVer)) {
						var dtask = plus.downloader.createDownload(inf.wgt.url, {
							filename: "_doc/update/update.wgt"
						}, function(d, status) {
							if (status == 200) {
								console.log("下载wgt升级包成功..." + d.filename);
								plus.nativeUI.showWaiting("安装新版本资源文件...");
								plus.runtime.install(d.filename, {}, function() {
									plus.nativeUI.closeWaiting();
									console.log("安装wgt文件成功！");
									dir.removeRecursively(function(entry) {
										console.log("删除update文件成功");
									}, function(e) {
										console.log("删除update文件失败：" + e.code + "..." + e.message);
									});
									plus.runtime.restart();
								}, function(e) {
									plus.nativeUI.closeWaiting();
									console.error("安装wgt文件失败[" + e.code + "]：" + e.message);
									dir.removeRecursively(function(entry) {
										console.log("删除update文件成功");
									}, function(e) {
										console.log("删除update文件失败：" + e.code + "..." + e.message);
									});
								});
							} else {
								console.error("下载wgt升级包失败");
							}
						});
						dtask.start();
		} else {
						dir.removeRecursively(function(entry) {
							console.log("删除update文件成功");
						}, function(e) {
							console.log("删除update文件失败：" + e.code + "..." + e.message);
						});
					}
				});
			}
		}
	}


	function downloadAPK(url) {
		var dtask = plus.downloader.createDownload(url, {
			filename: "_doc/update/update.apk"
		}, function(d, status) {
			if (status == 200) {
				console.log("下载APK升级包成功..." + d.filename);
			} else {
				console.error("下载APK升级包失败");
			}
		});
		dtask.start();
	}

	function downloadWGT(url) {
		var dtask = plus.downloader.createDownload(url, {
			filename: "_doc/update/update.wgt"
		}, function(d, status) {
			if (status == 200) {
				console.log("下载wgt升级包成功..." + d.filename);
			} else {
				console.error("下载wgt升级包失败");
			}
		});
		dtask.start();
	}

	function writeJSONFile(content) {
		// 保存到本地文件中
		dir.getFile(localJSONFile, {
			create: true
		}, function(fentry) {
			fentry.createWriter(function(writer) {
				writer.onerror = function() {
					console.error("获取升级数据，保存文件失败！");
				}
				writer.onwrite = function() {
					console.log("写入文件成功");
				}
				writer.write(content);
			}, function(e) {
				console.error("获取升级数据，创建写文件对象失败：" + e.message);
			});
		}, function(e) {
			console.error("获取升级数据，打开保存文件失败：" + e.message);
		});
	}


	/**
	 * 检查升级数据
	 */
	function checkUpdateData(resp) {
		var j = JSON.parse(resp);
		var inf = j[plus.os.name];
		if (inf) {
			var curVer = plus.runtime.version;
			var srvVer = inf.apk.version;
			console.log("apkVersion...cur:" + curVer + "  srv:" + srvVer);
			plus.runtime.getProperty(plus.runtime.appid, function(appinf) {
				var curWGTVer = appinf.version;
				var srvWGTVer = inf.wgt.version;
				console.log("wgtVersion...cur:" + curWGTVer + "  srv:" + srvWGTVer);
				if (compareVersion(curVer, srvVer)) {
					downloadAPK(inf.apk.url);
					writeJSONFile(resp);
				} else if (compareVersion(curWGTVer, srvWGTVer)) {
					var dtask = plus.downloader.createDownload(inf.wgt.url, {
						filename: "_doc/update/update.wgt"
					}, function(d, status) {
						if (status == 200) {
							console.log("下载wgt升级包成功..." + d.filename);
							plus.nativeUI.showWaiting("安装新版本资源文件...");
							plus.runtime.install(d.filename, {}, function() {
								plus.nativeUI.closeWaiting();
								console.log("安装wgt文件成功！");
								dir.removeRecursively(function(entry) {
									console.log("删除update文件成功");
								}, function(e) {
									console.log("删除update文件失败：" + e.code + "..." + e.message);
								});
								plus.runtime.restart();
							}, function(e) {
								plus.nativeUI.closeWaiting();
								console.error("安装wgt文件失败[" + e.code + "]：" + e.message);
								dir.removeRecursively(function(entry) {
									console.log("删除update文件成功");
								}, function(e) {
									console.log("删除update文件失败：" + e.code + "..." + e.message);
								});
							});
						} else {
							console.error("下载wgt升级包失败");
						}
					});
					dtask.start();
				} else {
					console.log("没有需要升级的版本");
				}

			});
		}
	}

	/**
	 * 从服务器获取升级数据
	 */
	function getUpdateData() {
		var xhr = new plus.net.XMLHttpRequest();
		xhr.onreadystatechange = function() {
			switch (xhr.readyState) {
				case 4:
					if (xhr.status == 200) {
						checkUpdateData(xhr.responseText);
					} else {
						plus.
						console.log("获取升级数据，联网请求失败：" + xhr.status);
					}
					break;
				default:
					break;
			}
		}
		xhr.open("GET", server);
		xhr.send();
	}

	/**
	 * 比较版本大小，如果新版本nv大于旧版本ov则返回true，否则返回false
	 * @param {String} ov
	 * @param {String} nv
	 * @return {Boolean}
	 */
	function compareVersion(ov, nv) {
		if (!ov || !nv || ov == "" || nv == "") {
			return false;
		}
		var b = false,
			ova = ov.split(".", 4),
			nva = nv.split(".", 4);
		for (var i = 0; i < ova.length && i < nva.length; i++) {
			var so = ova[i],
				no = parseInt(so),
				sn = nva[i],
				nn = parseInt(sn);
			if (nn > no || sn.length > so.length) {
				return true;
			} else if (nn < no) {
				return false;
			}
		}
		if (nva.length > ova.length && 0 == nv.indexOf(ov)) {
			return true;
		}
	}

	if (w.plus) {
		initUpdate();
	} else {
		document.addEventListener("plusready", initUpdate, false);
	}

})(window);