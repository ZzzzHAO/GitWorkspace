ECMAScript 6简介
=========
1.ECMAScript 和 JavaScript 的关系是，前者是后者的规格，后者是前者的一种实现（另外的 ECMAScript 方言还有 Jscript 和 ActionScript）。日常场合，这两个词是可以互换的。

2.ES6 既是一个历史名词，也是一个泛指，含义是5.1版以后的 JavaScript 的下一代标准，涵盖了ES2015、ES2016、ES2017等等，而ES2015 则是正式名称，特指该年发布的正式版本的语言标准。

let 和 const 命令
=========
1.在没有let之前，typeof运算符是百分之百安全的，永远不会报错。现在这一点不成立了。这样的设计是为了让大家养成良好的编程习惯，变量一定要在声明之后使用，否则就报错。

2.暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。

3.const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。

4.const实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址不得改动。

5.ES6 声明变量的六种方法：var function let const import class

6.let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从ES6开始，全局变量将逐步与顶层对象的属性脱钩。

变量的解构赋值
=========
1.ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

2.只要某种数据结构具有 Iterator 接口或者转为对象以后具备 Iterator 接口，都可以采用数组形式的解构赋值。

3.解构赋值允许指定默认值，如果一个数组成员不严格等于undefined，默认值是不会生效的（只有严格等于undefined，默认值才会生效，对象解构同样适用）。

4.如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。

5.对象的解构赋值是下面形式的简写
```js
  let { foo: foo, bar: bar } = { foo: "aaa", bar: "bbb" };
```
  对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。

6.由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。
```js
  let arr = [1, 2, 3];
  let {0 : first, [arr.length - 1] : last} = arr;
  first // 1
  last // 3
```

7.解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

8.用途：（1）交换变量的值（2）从函数返回多个值（3）函数参数的定义（4）提取JSON数据（5）函数参数的默认值（6）遍历Map结构（7）输入模块的指定方法

字符串的扩展
=========
1.includes()：返回布尔值，表示是否找到了参数字符串。
  startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
  endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
  这三个方法都支持第二个参数，表示开始搜索的位置。

2.repeat() ：repeat方法返回一个新字符串，表示将原字符串重复n次。

3.如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。

4.大括号内部可以放入任意的JavaScript表达式，可以进行运算，以及引用对象属性，还能调用函数。

5.模板字符串甚至还能嵌套。
```js
  const tmpl = addrs => `
  <table>
  ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
  </table>
  `;
```

函数的扩展
=========
1.函数参数变量是默认声明的，所以不能用let或const再次声明。
```js
  function foo(x = 5) {
    let x = 1; // error
    const x = 2; // error
  }
```
  上面代码中，参数变量x是默认声明的，在函数体中，不能用let或const再次声明，否则会报错。

2.参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。

3.函数的 length 属性：指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，length属性将失真。
  如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了。
```js
  (function (a) {}).length // 1
  (function (a = 5) {}).length // 0
  (function (a, b, c = 5) {}).length // 2
  (function(...args) {}).length // 0
  (function (a = 0, b, c) {}).length // 0
  (function (a, b = 1, c) {}).length // 1
```
3.一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。

4.rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。

5.箭头函数：由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。
```js
  // 报错
  let getTempItem = id => { id: id, name: "Temp" };

  // 不报错
  let getTempItem = id => ({ id: id, name: "Temp" });
```
6.箭头函数的一个用处是简化回调函数。
  // 正常函数写法
  [1,2,3].map(function (x) {
    return x * x;
  });

  // 箭头函数写法
  [1,2,3].map(x => x * x);

7.箭头函数有几个使用注意点：
  （1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。（this对象的指向是可变的，但是在箭头函数中，它是固定的。）

  （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

  （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

  （4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

8.this指向的固定化，并不是因为箭头函数内部有绑定this的机制，实际原因是箭头函数根本没有自己的this，导致内部的this就是外层代码块的this。正是因为它没有this，所以也就不能用作构造函数。
  // ES6
  function foo() {
    setTimeout(() => {
      console.log('id:', this.id);
    }, 100);
  }

  // ES5
  function foo() {
    var _this = this;

    setTimeout(function () {
      console.log('id:', _this.id);
    }, 100);
  }

9.请问下面的代码之中有几个this？
  function foo() {
    return () => {
      return () => {
        return () => {
          console.log('id:', this.id);
        };
      };
    };
  }

  var f = foo.call({id: 1});

  var t1 = f.call({id: 2})()(); // id: 1
  var t2 = f().call({id: 3})(); // id: 1
  var t3 = f()().call({id: 4}); // id: 1
  上面代码之中，只有一个this，就是函数foo的this，所以t1、t2、t3都输出同样的结果。因为所有的内层函数都是箭头函数，都没有自己的this，它们的this其实都是最外层foo函数的this。

数组的扩展
=========
1.扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

2.对于那些没有部署 Iterator 接口的类似数组的对象，扩展运算符就无法将其转为真正的数组。对于那些没有部署 Iterator 接口的类似数组的对象，扩展运算符就无法将其转为真正的数组。

对象的扩展
=========
1.简介表示（属性、方法）
  var foo = 'bar';
  var baz = {foo};
  baz // {foo: "bar"}

  // 等同于
  var baz = {foo: foo};

  var o = {
    method() {
      return "Hello!";
    }
  };

  // 等同于

  var o = {
    method: function() {
      return "Hello!";
    }
  };

2.ES6 允许字面量定义对象时，用表达式作为对象的属性名，即把表达式放在方括号内。表达式还可以用于定义方法名。
  let propKey = 'foo';

  let obj = {
    [propKey]: true,
    ['a' + 'bc']: 123
  };

  let obj = {
    ['h' + 'ello']() {
      return 'hi';
    }
  };

  obj.hello() // hi

3.Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）。如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。

4.Object.assign方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。

5.Object.assign可以用来处理数组，但是会把数组视为对象。
  Object.assign([1, 2, 3], [4, 5])
  // [4, 5, 3]

6.Object.assign方法用途
  （1）为对象添加属性
  （2）为对象添加方法
  （3）克隆对象
  （4）合并多个对象
  （5）为属性指定默认值

7.目前，有四个操作会忽略enumerable为false的属性。
  （1）for...in循环：只遍历对象自身的和继承的可枚举的属性。
  （2）Object.keys()：返回对象自身的所有可枚举的属性的键名。
  （3）JSON.stringify()：只串行化对象自身的可枚举的属性。
  （4）Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

8.实际上，引入“可枚举”（enumerable）这个概念的最初目的，就是让某些属性可以规避掉for...in操作，不然所有内部属性和方法都会被遍历到。比如，对象原型的toString方法，以及数组的length属性，就通过“可枚举性”，从而避免被for...in遍历到。

9.__proto__属性（前后各两个下划线），用来读取或设置当前对象的prototype对象。(__proto__前后的双下划线,说明它本质上是一个内部属性，而不是一个正式的对外的 API，只是由于浏览器广泛支持，才被加入了 ES6。)

10.ES2017 引入了跟Object.keys配套的Object.values和Object.entries，作为遍历一个对象的补充手段，供for...of循环使用。

11.对象的扩展运算符
  （1）解构赋值 (解构赋值必须是最后一个参数，否则会报错。)
    let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
    x // 1
    y // 2
    z // { a: 3, b: 4 }
  （2）扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。
    let z = { a: 3, b: 4 };
    let n = { ...z };
    n // { a: 3, b: 4 }

12.Null 传导运算符 ?.

Symbol
=========
1.ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。

2.七种数据类型：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）、Symbol。

Set
=========
1.ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

2.Set 函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。

3.也展示了一种去除数组重复成员的方法。
  [...new Set(array)] // 去除数组的重复成员

4.向Set加入值的时候，不会发生类型转换，它类似于精确相等运算符（===），主要的区别是NaN等于自身，而精确相等运算符认为NaN不等于自身。
  let set = new Set();
  let a = NaN;
  let b = NaN;
  set.add(a);
  set.add(b);
  set // Set {NaN}

5.Set 实例的属性和方法
  （1）实例属性：
  Set.prototype.constructor：构造函数，默认就是Set函数。
  Set.prototype.size：返回Set实例的成员总数。
  （2）实例操作方法：
  add(value)：添加某个值，返回Set结构本身。
  delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
  has(value)：返回一个布尔值，表示该值是否为Set的成员。
  clear()：清除所有成员，没有返回值。
  （3）实例遍历方法：（keys方法、values方法、entries方法返回的都是遍历器对象。由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法和values方法的行为完全一致。）
  keys()：返回键名的遍历器
  values()：返回键值的遍历器
  entries()：返回键值对的遍历器
  forEach()：使用回调函数遍历每个成员

Map
=========
1.ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。

2.事实上，不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数。

3.实例的属性和操作方法:
  （1）size属性
  （2）set(key, value)
  （3）get(key)
  （4）has(key)
  （5）delete(key)
  （6）clear()
  遍历方法：
  keys()：返回键名的遍历器。
  values()：返回键值的遍历器。
  entries()：返回所有成员的遍历器。
  forEach()：遍历 Map 的所有成员。

Promise对象
=========
1.Promise对象象实现Ajax操作的例子
  var getJSON = function(url) {
    var promise = new Promise(function(resolve, reject){
      var client = new XMLHttpRequest();
      client.open("GET", url);
      client.onreadystatechange = handler;
      client.responseType = "json";
      client.setRequestHeader("Accept", "application/json");
      client.send();

      function handler() {
        if (this.readyState !== 4) {
          return;
        }
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(new Error(this.statusText));
        }
      };
    });

    return promise;
  };

  getJSON("/posts.json").then(function(json) {
    console.log('Contents: ' + json);
  }, function(error) {
    console.error('出错了', error);
  });

2.调用resolve或reject并不会终结 Promise 的参数函数的执行。
  new Promise((resolve, reject) => {
    resolve(1);
    console.log(2);
  }).then(r => {
    console.log(r);
  });
  // 2
  // 1
  上面代码中，调用resolve(1)以后，后面的console.log(2)还是会执行，并且会首先打印出来。这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。

3.then方法返回的是一个新的Promise实例（注意，不是原来那个Promise实例）。因此可以采用链式写法，即then方法后面再调用另一个then方法。
  getJSON("/posts.json").then(function(json) {
    return json.post;
  }).then(function(post) {
    // ...
  });
  上面的代码使用then方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

4.Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。
  getJSON('/post/1.json').then(function(post) {
    return getJSON(post.commentURL);
  }).then(function(comments) {
    // some code
  }).catch(function(error) {
    // 处理前面三个Promise产生的错误
  });
  上面代码中，一共有三个Promise对象：一个由getJSON产生，两个由then产生。它们之中任何一个抛出的错误，都会被最后一个catch捕获。

5.一般来说，不要在then方法里面定义Reject状态的回调函数（即then的第二个参数），总是使用catch方法。

6.Promise.all方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。
  var p = Promise.all([p1, p2, p3]);.
  （1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
  （2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

7.如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法。

8.有时需要将现有对象转为Promise对象，Promise.resolve方法就起到这个作用。
  var jsPromise = Promise.resolve($.ajax('/whatever.json'));

Iterator 和 for...of 循环
=========
1.Iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是ES6创造了一种新的遍历命令for...of循环，Iterator接口主要供for...of消费。

2.调用 Iterator 接口的场合
  （1）解构赋值
  （2）扩展运算符
  （3）yield*
  （4）其他场合
      for...of
      Array.from()
      Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
      Promise.all()
      Promise.race()

Generator 函数
=========
1.执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

2.不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，也就是上一章介绍的遍历器对象（Iterator Object）。

3.Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。

4.yield表达式后面的表达式，只有当调用next方法、内部指针指向该语句时才会执行，因此等于为 JavaScript 提供了手动的“惰性求值”（Lazy Evaluation）的语法功能。

5.for...of循环可以自动遍历 Generator 函数时生成的Iterator对象，且此时不再需要调用next方法。
  function *foo() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
  }

  for (let v of foo()) {
    console.log(v);
  }
  // 1 2 3 4 5

6.Promise 的写法只是回调函数的改进，使用then方法以后，异步任务的两段执行看得更清楚了，除此以外，并无新意。

  Promise 的最大问题是代码冗余，原来的任务被 Promise 包装了一下，不管什么操作，一眼看去都是一堆then，原来的语义变得很不清楚。

async 函数
=========
1.async 函数是什么？一句话，它就是 Generator 函数的语法糖。

2.async函数对 Generator 函数的改进，体现在以下四点。
  （1）内置执行器。
  （2）更好的语义。
  （3）更广的适用性。
  （4）返回值是 Promise。

3.async函数返回的 Promise 对象，必须等到内部所有await命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到return语句或者抛出错误。也就是说，只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数。

4.只要一个await语句后面的 Promise 变为reject，那么整个async函数都会中断执行。
  async function f() {
    await Promise.reject('出错了');
    await Promise.resolve('hello world'); // 不会执行
  }

Class 的基本语法
=========
1.类的内部所有定义的方法，都是不可枚举的（non-enumerable）。这一点与 ES5 的行为不一致。

2.constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。

3.constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。

4.类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。

5.与函数一样，类也可以使用表达式的形式定义。
  const MyClass = class Me {
    getClassName() {
      return Me.name;
    }
  };
  let inst = new MyClass();
  inst.getClassName() // Me
  Me.name // ReferenceError: Me is not defined
  上面代码使用表达式定义了一个类。需要注意的是，这个类的名字是MyClass而不是Me，Me只在 Class 的内部代码可用，指代当前类。

6.类不存在变量提升（hoist），这一点与 ES5 完全不同。
  {
    let Foo = class {};
    class Bar extends Foo {
    }
  }
  上面的代码不会报错，因为Bar继承Foo的时候，Foo已经有定义了。但是，如果存在class的提升，上面代码就会报错，因为class会被提升到代码头部，而let命令是不提升的，所以导致Bar继承Foo的时候，Foo还没有定义。

7.类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。
  class Logger {
    printName(name = 'there') {
      this.print(`Hello ${name}`);
    }

    print(text) {
      console.log(text);
    }
  }

  const logger = new Logger();
  const { printName } = logger;
  printName(); // TypeError: Cannot read property 'print' of undefined
  上面代码中，priantName方法中的this，默认指向Logger类的实例。但是，如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境，因为找不到print方法而导致报错。

8.Class 的静态方法
  类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
  class Foo {
    static classMethod() {
      return 'hello';
    }
  }

  Foo.classMethod() // 'hello'

  var foo = new Foo();
  foo.classMethod()
  // TypeError: foo.classMethod is not a function
  上面代码中，Foo类的classMethod方法前有static关键字，表明该方法是一个静态方法，可以直接在Foo类上调用（Foo.classMethod()），而不是在Foo类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。

9.静态方法可以与非静态方法重名。

10.父类的静态方法，可以被子类继承。
  class Foo {
    static classMethod() {
      return 'hello';
    }
  }

  class Bar extends Foo {
  }

  Bar.classMethod() // 'hello'

Class 的继承
=========
1.子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。
  class Point { /* ... */ }

  class ColorPoint extends Point {
    constructor() {
    }
  }

  let cp = new ColorPoint(); // ReferenceError

2.ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先创造父类的实例对象this（所以必须先调用super方法），然后再用子类的构造函数修改this。

3.如果子类没有定义constructor方法，这个方法会被默认添加，代码如下。也就是说，不管有没有显式定义，任何一个子类都有constructor方法。
  class ColorPoint extends Point {
  }

  // 等同于
  class ColorPoint extends Point {
    constructor(...args) {
      super(...args);
    }
  }

4.在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，是基于对父类实例加工，只有super方法才能返回父类实例。
  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

  class ColorPoint extends Point {
    constructor(x, y, color) {
      this.color = color; // ReferenceError
      super(x, y);
      this.color = color; // 正确
    }
  }

5.ES6 规定，通过super调用父类的方法时，super会绑定子类的this。
  class A {
    constructor() {
      this.x = 1;
    }
    print() {
      console.log(this.x);
    }
  }

  class B extends A {
    constructor() {
      super();
      this.x = 2;
    }
    m() {
      super.print();
    }
  }

  let b = new B();
  b.m() // 2

Module语法
=========
1.ES6 模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西
// CommonJS模块
let { stat, exists, readFile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
上面代码的实质是整体加载fs模块（即加载fs的所有方法），生成一个对象（_fs），然后再从这个对象上面读取3个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。
import { stat, exists, readFile } from 'fs';
上面代码的实质是从fs模块加载3个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。

2.由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}

3.import后面的from指定模块文件的位置，可以是相对路径，也可以是绝对路径，.js后缀可以省略。如果只是模块名，不带有路径，那么必须有配置文件，告诉 JavaScript 引擎该模块的位置。
import {myMethod} from 'util';
上面代码中，util是模块文件名，由于不带有路径，必须通过配置，告诉引擎怎么取到这个模块。

4.ES6 的模块自动采用严格模式，不管你有没有在模块头部加上"use strict";。

Module 的加载实现
=========
1.默认情况下，浏览器是同步加载 JavaScript 脚本，即渲染引擎遇到<script>标签就会停下来，等到执行完脚本，再继续向下渲染。如果是外部脚本，还必须加入脚本下载的时间。

如果脚本体积很大，下载和执行的时间就会很长，因此造成浏览器堵塞，用户会感觉到浏览器“卡死”了，没有任何响应。这显然是很不好的体验，所以浏览器允许脚本异步加载，下面就是两种异步加载的语法。

<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
上面代码中，<script>标签打开defer或async属性，脚本就会异步加载。渲染引擎遇到这一行命令，就会开始下载外部脚本，但不会等它下载和执行，而是直接执行后面的命令。

defer与async的区别是：前者要等到整个页面正常渲染结束，才会执行；后者一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，defer是“渲染完再执行”，async是“下载完就执行”。另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。

2.CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

3.如果不指定绝对路径，Node 加载 ES6 模块会依次寻找以下脚本，与require()的规则一致。

import './foo';
// 依次寻找
//   ./foo.js
//   ./foo/package.json
//   ./foo/index.js

import 'baz';
// 依次寻找
//   ./node_modules/baz.js
//   ./node_modules/baz/package.json
//   ./node_modules/baz/index.js
// 寻找上一级目录
//   ../node_modules/baz.js
//   ../node_modules/baz/package.json
//   ../node_modules/baz/index.js
// 再上一级目录