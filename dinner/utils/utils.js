// 导出模块
module.exports = {
	random_filename: function (tempFilePath) {
		var newDate = new Date();
		var newDateStr = newDate.toLocaleDateString();
		var extension = /\.([^.]*)$/.exec(tempFilePath);
		if (extension) {
			extension = extension[1].toLowerCase();
		}
		var name = newDateStr + "." + extension;//上传的图片的别名 
		return name;
	}
}
