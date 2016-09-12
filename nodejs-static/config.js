/**
 * 
 * @authors Lin jianduan (lin_jianduan@163.com)
 * @date    2016-09-12 16:09:06
 * @version $Id$
 */
exports.Expires = {
    fileMatch: /^(gif|png|jpg|js|css)$/ig,
    maxAge: 60 * 60 * 24 * 365
};
exports.Compress = {
    match: /css|js|html/ig
};
