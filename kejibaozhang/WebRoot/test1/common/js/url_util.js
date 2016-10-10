function url_generate(str) {
	var _url = "http://192.168.6.84:8080/webapp/";
	var _json = window.JSON.parse(str);
	_url = _url + _json.mk + "/?action=" + _json.hs;
	for (var i = 0; i < _json.csList.length; ++i) {
		_url = _url + "&" + _json.csList[i].key + "=" + _json.csList[i].value;
	}
	return _url;
}
var ImageDownload = (function() {
	var instance = null;
	var dtask = null;
	var waitingArray = new Array();

	function init() {
		//[{“url”:”http://aaaa.png”, “local”:”a/aaa.png”, “sfhc”:”true”，”sfReady”:”true”}]
		function isInImageURLtoLocalSystemList(originURL, sfhc) {
			var u2lList = JSON.parse(plus.storage.getItem("ImageURLtoLocalSystemList"));
			if (u2lList == null) {
				alert("程序报错，请检查ImageURLtoLocalSystemList是否已初始化");
			}
			for (var i = 0; i < u2lList.length; ++i) {
				if (u2lList[i].url == originURL && u2lList[i].sfhc == sfhc) {
					var tmp = "{\"sfcz\":\"true\",\"sfReady\":\"" + u2lList[i].sfReady + "\",\"local\":\"" + u2lList[i].local + "\"}";
					return tmp;
				}
			}
			var tmp = "{\"sfcz\":\"false\",\"sfReady\":\"\",\"local\":\"\"}";
			return tmp;
		}

		function updateImageURLtoLocalSystemList(originURL, localFile, sfhc) {
			var u2lList = JSON.parse(plus.storage.getItem("ImageURLtoLocalSystemList"));
			if (u2lList == null) {
				alert("程序报错，请检查ImageURLtoLocalSystemList是否已初始化");
			}
			for (var i = 0; i < u2lList.length; ++i) {
				if (u2lList[i].url == originURL && u2lList[i].sfhc == sfhc) {
					var u2l = "{\"url\":\"" + u2lList[i].url + "\",\"local\":\"" + localFile + "\",\"sfhc\":\"" + u2lList[i].sfhc + "\",\"sfReady\":\"true\"}";
					u2lList[i].local = localFile;
					u2lList[i].sfReady = "true";
					plus.storage.setItem("ImageURLtoLocalSystemList", JSON.stringify(u2lList));
					console.log(plus.storage.getItem("ImageURLtoLocalSystemList"));
					return;
				}
			}
			console.error("更新图片信息失败");
		}

		function downloadImage(originURL, sfhc) {
			if (sfhc == "false") {
				dtask = plus.downloader.createDownload(originURL, {}, function(d, status) {
					// 下载完成
					if (status == 200) {
						console.log("Download success: " + d.filename);
						updateImageURLtoLocalSystemList(originURL, d.filename, "false");
						var index = 0;
						while (index < waitingArray.length) {
							if (waitingArray[index].sfhc == "false" && waitingArray[index].url == d.url) {
								eval(waitingArray[index].callback).call(this, waitingArray[index].id, plus.io.convertLocalFileSystemURL(d.filename)); 
								waitingArray.splice(index, 1); 
								index = 0;
							} else {
								++index;
							}
						}
					} else {
						console.error("Download failed: " + status);
					}
				});
			} else if (sfhc == "true") {
				dtask = plus.downloader.createDownload(originURL, {
					"filename": "_downloads/_tmp/"
				}, function(d, status) {
					if (status == 200) {
						console.log("Download success: " + d.filename);
						updateImageURLtoLocalSystemList(originURL, d.filename, "true");
						var index = 0; 
						while (index < waitingArray.length) {
							if (waitingArray[index].sfhc == "true" && waitingArray[index].url == d.url) {
								eval(waitingArray[index].callback).call(this, waitingArray[index].id, plus.io.convertLocalFileSystemURL(d.filename)); 
								waitingArray.splice(index, 1); 
								index = 0;
							} else {
								++index;
							}
						} 
						console.log(JSON.stringify(waitingArray));
					} else {
						console.error("Download failed: " + status);
					}
				});
			}
			dtask.start();
		}

		return {
			//原始地址，标签标识，成功回调，是否缓存
			addTask: function(originURL, id, completedCB, sfhc) {
				var resJSON = JSON.parse(isInImageURLtoLocalSystemList(originURL, sfhc));

				if (resJSON.sfcz == "true") {
					if (resJSON.sfReady == "true") {
						console.log("已有相应图片信息:" + resJSON.local);
						completedCB(id, plus.io.convertLocalFileSystemURL(resJSON.local));
					} else {
						console.log("已有相应图片信息:" + originURL + "，但是还没有下载完成，请稍后...");
						waitingArray.push({
							"url": originURL,
							"id": id,
							"callback": completedCB,
							"sfhc": sfhc
						});
						console.log(JSON.stringify(waitingArray));
					}
				} else {
					console.log("添加新图片对信息" + originURL);
					var u2lListArray = eval('(' + plus.storage.getItem("ImageURLtoLocalSystemList") + ')');
					u2lListArray.push({
						"url": originURL,
						"local": "",
						"sfhc": sfhc,
						"sfReady": "false"
					});
					plus.storage.setItem("ImageURLtoLocalSystemList", JSON.stringify(u2lListArray));
					console.log(JSON.stringify(u2lListArray));
					waitingArray.push({
						"url": originURL,
						"id": id,
						"callback": "ImageDownload.getInstance().cssCallback", 
						"sfhc": sfhc
					});
					console.log(JSON.stringify(waitingArray));
					downloadImage(originURL, sfhc); 
				}
			},
			cssCallback: function(id, localFile) {
				if (document.getElementById(id) == null) {
					console.error("没有找到对应ID的标签");
					return;
				}
				document.getElementById(id).setAttribute("style", "background-image: url(" + localFile + ");");
			}

		};
	};
	return {
		getInstance: function() {
			if (!instance) {
				if (plus.storage.getItem("ImageURLtoLocalSystemList") == null) {
					console.log("only once");
					plus.storage.setItem("ImageURLtoLocalSystemList", "[]");
				} 
//				else {
//					plus.storage.removeItem("ImageURLtoLocalSystemList");
//				} 
				instance = init();
			}
			return instance;
		}
	};
})();

