//ES6 过滤HTML，经过处理的特殊字符都将被转义
var message =
    SaferHTML `<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
    var s = templateData[0];
    for (var i = 1; i < arguments.length; i++) {
        var arg = String(arguments[i]);

        // Escape special characters in the substitution.
        s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Don't escape special characters in the template.
        s += templateData[i];
    }
    return s;
}


//ES6测试一个字符由两个字节还是由四个字节组成
function is32Bit(c) {
    return c.codePointAt(0) > 0xFFFF;
}
is32Bit("𠮷"); // true
is32Bit("a"); // false
