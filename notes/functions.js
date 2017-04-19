//------------------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------------------
//ES6测试一个字符由两个字节还是由四个字节组成
function is32Bit(c) {
    return c.codePointAt(0) > 0xFFFF;
}
is32Bit("𠮷"); // true
is32Bit("a"); // false
//------------------------------------------------------------------------------------------
//ES6正确返回字符串长度的函数
function codePointLength(text) {
    var result = text.match(/[\s\S]/gu);
    return result ? result.length : 0;
}
var s = '𠮷𠮷';
s.length; // 4
codePointLength(s); // 2
//------------------------------------------------------------------------------------------
//制定范围内随机数组
function randomArray(min = 2, max = 32, n) {
    let length = max - min + 1;
    //范围数组
    let arr = [];
    //随机数组
    let randomArr = [];
    for (let i = 0; i < length; i++) {
        arr[i] = min + i;
    }
    while (n > 0) {
        let count = arr.length;
        let randomIndex = Math.floor(Math.random() * count);
        randomArr.push(arr[randomIndex]);
        arr.splice(randomIndex, 1);
        n--;
    }
    return randomArr;
}
