/**
 * 
 * @authors Lin jianduan (lin_jianduan@163.com)
 * @date    2016-09-09 17:14:00
 * @version $Id$
 */
exports.guessPage = function(fs, path, curDir, pathname) {
	console.log("pathname:" + pathname);
	if(!pathname) {
		pathname = pathname + "/";
	}
	var realPath = path.join(curDir, pathname);
	console.log("realPath:" +realPath);
	var ext = path.extname(realPath);
	console.log("before ext:" + ext);
	if(!ext) {
		// guess index.html, is not exist, then index.htm.
		var tmpPath = realPath + "index.htm";
		console.log("tmpPath:" + tmpPath);
		// fs.existsSync will be deprecated.
        // var exists = fs.existsSync(tmpPath);
        var exists = true;
        try {
        	fs.openSync(tmpPath, "r");
        }catch(e) {
        	console.log("e:" + e);
        	exists = false;
        }
        console.log("exists:" + exists);
        if(exists) {
        	ext = "htm";
        }else{
        	tmpPath = realPath + "index.html";
        	ext = "html";
        }
        realPath = tmpPath;
	} else {
		ext = ext.slice(1);
	}
	console.log("ext:"+ext);
	var result = new Object();
	result.realPath = realPath;
	result.ext = ext;
	console.log('realPath:' + result.realPath);
	console.log('ext:' + result.ext);
	return result;
}
