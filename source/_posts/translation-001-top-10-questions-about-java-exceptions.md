---
title: 译文《最常见的10种Java异常问题》
date: 2020-11-30 08:30:00
tags:
- 译文集
- 异常
- JAVA
---



> 封面：洛小汐
> 
> 译者：潘深练



![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/slogan_start.png)

知彼知己，方能百战不殆。

![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/slogan_end.png)



#### 前言



本文总结了有关Java异常的十大常见问题。



#### 目录



1. 检查型异常（checked） vs.  非检查型异常（Unchecked）

2. 异常管理的最佳实践箴言

3. 为什么在try代码块中声明的变量不能在catch或者finally中被引用？

4. 为什么 Double.parseDouble(null) 和 Integer.parseInt(null) 抛出的异常不一样呢？

5. Java中经常使用的运行时异常

6. 我们可以在同一个catch子句中捕获多个异常吗？

7. 在 Java 中构造方法能抛出异常吗？

8. 在 final 代码块中抛出异常

9. try语句有return那么finally还会执行吗？

10. 为何有些开发人员对异常置之不理？



![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/01.png)
##### 检查型异常（checked） vs.  非检查型异常（Unchecked）



简单来说，对于检查型异常， 一般在 **编译期** 就会被检查到，所以我们肯定会提前在方法内进行捕获处理，或者在方法头部申明并抛出。而非检查型异常，往往无法提前预知，例如被除数是0、空指针等。检查型异常特别重要，它会告诉那些调用你的接口的开发者们，如何提前预知并处理好这些可能发生的异常。



例如，IOException就是常见的检查型异常，而 RuntimeException（运行时异常）就是非检查型异常。在阅读剩余部分之前你或许可以研读这份 [Java异常的层次结构图](https://www.programcreek.com/2009/02/diagram-for-hierarchy-of-exception-classes/)。



![Java异常的层次结构图](C:\Users\Super Man\Desktop\Exception-Hierarchy-Diagram.jpg)


![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/02.png)
##### 异常管理的最佳实践箴言

如果可以正确处理异常，则应将其捕获并处理，否则应将其抛出。


![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/03.png)
##### 为什么在try代码块中声明的变量不能在catch或者finally中被引用？

看下面这段代码，在try代码块中声明的 **String s** 就不能在catch中被引用， 这段代码在编译期是通不过的。

```java

try {
	File file = new File("path");
	FileInputStream fis = new FileInputStream(file);
	String s = "inside";
} catch (FileNotFoundException e) {
	e.printStackTrace();
	System.out.println(s);
}

```

原因是你不知道在try代码块中哪个位置会引发异常， 很有可能在声明对象之前就引发了异常。对于这个特定的示例，是正确的。

![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/04.png)
##### 为什么 Double.parseDouble(null) 和 Integer.parseInt(null) 抛出的异常不一样呢？

它俩抛出的异常确实不同，但这是JDK的问题，当时开发这两个接口的开发人员不是同一波，所以我们没必要去纠结这个问题。

```java

Integer.parseInt(null); 
// throws java.lang.NumberFormatException: null 

Double.parseDouble(null); 
// throws java.lang.NullPointerException

```

![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/05.png)
##### Java中经常使用的运行时异常

这里列举一部分：
> IllegalArgumentException
> ArrayIndexOutOfBoundsException

在有些场景某个目标对象不满足我们的预期，会用到这些异常，例如下面在 if 判断语句中被使用：

``` java

if (obj == null) {
   throw new IllegalArgumentException("obj can not be null");

```

![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/06.png)
##### 我们可以在同一个catch子句中捕获多个异常吗？

答案是当然可以，不过如果在同一个catch子句中捕获的这些异常都直接或间接继承自同一父类，那么就只能在catch子句中捕获父类了。


```java
// Java 7 之前需要这样
catch (AException a) {
     logger.error(a);
     throw new MyException("a");
catch (BException b) {
     logger.error(b);
     throw new MyException("b");
}catch (CException c) {
     logger.error(c);
     throw new MyException("c");
}

// 在Java 7中，可以捕获所有这些异常 
catch(AException | BException | CException ex){
     logger.error(ex);
     throw new MyException(ex);
}

```


> 补充说明 : 其实是这样，在 Java7 就开始支持catch子句捕获多个异常，多个异常使用 **XOR符号（I）**连接，异常的发生有可能是 A | B，但不能同时出现，相当于这些异常不能是间接或直接继承自同一个父类，因为如果AB都继承同一父类，那就不能 A|B 都写上，这也是继承原则。

![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/07.png)
##### 在 Java 中构造方法能抛出异常吗？

答案是当然可以，构造方法仅是一种特殊方法而已。可以参考这个[示例](https://www.programcreek.com/2013/01/constructor-can-throw-exceptions-in-java/)。

![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/08.png)
##### 在 final 代码块中抛出异常

下面这个写法是合法的：

```java

public static void main(String[] args) {
	File file1 = new File("path1");
	File file2 = new File("path2");
	try {
 
		FileInputStream fis = new FileInputStream(file1);
	} catch (FileNotFoundException e) {
		e.printStackTrace();
	} finally {
		try {
			FileInputStream fis = new FileInputStream(file2);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
	}
}

```



但是为了获得更好的代码可读性，你应该将把 try-catch代码块封装成一个新方法，然后将方法调用放在finally子句中：



```java

public static void main(String[] args) {
	File file1 = new File("path1");
	File file2 = new File("path2");
	try {
 
		FileInputStream fis = new FileInputStream(file1);
	} catch (FileNotFoundException e) {
		e.printStackTrace();
	} finally {
        // 封装方法
		methodThrowException(); 
	}
}

```


![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/09.png)
##### try语句有return那么finally还会执行吗？

答案是肯定会执行。

> Java官方文档描述：The finally block **always** executes when the try block exits

意思就是 ” 只要存在try代码块，finally代码块就一定会执行 ” ，这种特性可以让程序员避免在try语句中使用return, continue或者break关键字而忽略了关闭相关资源的操作等。


![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/10.png)
##### 为何有些开发人员对异常置之不理？

很多时候会见到下面这种代码写法。允许的情况下尽可能捕获异常并且进行处理，不知道为什么很多开发人员就是这么干？


```java

try {
     ...
} catch(Exception e) {
     e.printStackTrace();
}

```

忽略异常是一件很容易做到的事，虽然这种写法很常见，但不一定是正确的写法。



##### 参考文献:

1. [Unchecked exceptions in Java](https://docs.oracle.com/javase/tutorial/essential/exceptions/runtime.html)
2. [The root of Java exception class hierarchy](https://docs.oracle.com/javase/6/docs/api/java/lang/Throwable.html)
3. [Java exceptions related questions in stackoverflow](https://stackoverflow.com/questions/tagged/java+exception)



> 译文完，由于个人理解能力和知识宽度有限，译文中存在失误之处，还请见谅，欢迎指正。

![the end](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/article_the_end.png)

