---
title: 关于Java语言特性
author: 大晚
date: 2020-02-22
tags: 
- Java
- 面向对象
introduce: |
    【草稿预览，未正式发布】Java 编程语言是一种高级的、面向对象的语言。它正在多个方面迅速发展，以简化和加速现代应用程序的开发。
reviews:
  -
    author: 大晚
    body: |
      草稿预览，未正式发布。
  -
    author: Sim
    body: 安全和性能方面可以展开说说哈。
---



⚡ 草稿预览，未正式发布



关于 [Java 语言](https://developer.ibm.com/languages/java/) <sup>[1]</sup> ，IBM Developer 网站上这么描述：



> The Java programming language is a high-level, object-oriented language. It is rapidly evolving across several fronts to simplify and accelerate development of modern applications. 
>
> Java 编程语言是一种高级的、面向对象的语言。它正在多个方面迅速发展，以简化和加速现代应用程序的开发。



清晰概括了 Java 语言本身几个特点： 

- *high-level* （高级语言）

- *object-oriented* （面向对象）

- *rapidly evolving* （快速演化）





## 高级语言


Java 语言是一门 [高级语言](https://baike.baidu.com/item/%E9%AB%98%E7%BA%A7%E8%AF%AD%E8%A8%80) <sup>[2] </sup> ，区别于低级语言（汇编语言、机器语言），高级语言与计算机的硬件结构及指令系统无关，有更强的表达能力，可方便地表示数据的运算和程序的控制结构，能更好的描述各种算法，而且容易学习掌握。如流行的 Java，C，C++，python 等等，都是高级语言，每种高级语言都有自己的语言结构、语法规则和编程范式。



在此基础上，Java 语言作为高级语言，设计上有以下一些特点：




#### 1、简单性

Java 语言是 [C 语言](https://baike.baidu.com/item/c%E8%AF%AD%E8%A8%80) <sup>[3] </sup> 的衍生语言，因此它的语法规则看起来很像 C 语言。例如，代码块被模块化为方法并由大括号 ( `{` 和 `}` ) 分隔，变量在使用之前被声明等，同时又继承了 [C++](https://baike.baidu.com/item/C%2B%2B) <sup>[4] </sup> 语言 [面向对象](https://baike.baidu.com/item/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1) <sup>[5] </sup> 的技术核心，舍弃了很多 C++ 中比较繁杂和不太可靠部分，略去了运算符重载、多重继承等较为复杂的部分，而且  Java 语言不支持指针，杜绝了内存的非法访问，加入了垃圾回收机制，无需人为删除未引用对象， 即可自动垃圾收集，解决了程序员需要管理内存的问题，大大简化了程序的设计与开发。




#### 2、面向对象

Java 语言是一门面向对象的编程（OOP, Object-Oriented Programming）的语言，不同于面向过程编程语言主要通过程序指令作用于 **数据结构**，而是更注重 **数据和行为的打包封装，以及程序接口和实现的解耦设计**。


当然如果想加深对 Java 语言 ”面向对象编程“ 的理解，唯一的途径只能是熟悉其 [OOP 特性](https://developer.ibm.com/tutorials/j-introtojava1/) <sup>[6] </sup> ：

- *encapsulation* （封装）

- *inheritance* （继承）

- *polymorphism*（多态）



#### 3、平台无关性

大部分高级语言，都具备平台可移植性，只不过跨平台的实现方案不同，Java 语言本身借助 JVM 虚拟机机制 write once, run anywhere ，当 Java 被编译时，它不会被编译成特定于平台的机器码，而是被编译成与平台无关的字节码，该字节码交由不同操作系统上安装的虚拟机 (JVM) 进行解释执行。



![platform independent java](http://www.panshenlian.com/images/post/java/platform-independent-java.png)



#### 4、高性能

Java 比其他传统的解释型编程语言更快，因为 Java 字节码接近机器码。不过仍然比编译语言（例如，C++）慢一点，毕竟 Java 是一种解释型语言，这就是它比编译型语言（例如 C、C++ 等）慢的原因，另外，随着 JIT（Just in Time）的发展，Java 的运行速度也越来越高。



#### 5、安全性

目前很多说法认为 Java 语言没有显式的使用指针，并且运行在 JVM 虚拟沙箱中，所以是安全的。



![java security](http://www.panshenlian.com/images/post/java/java-security.png)




> 但是我个人认为 Java 的反射机制和动态加载特性，让字节码存在变化的可能性，反而带来安全性问题。



#### 6、架构兼容

Java 是体系结构中立的，因为没有依赖于实现的特性，例如，原始类型的大小是固定的。在 C 语言中，int 数据类型在 32 位架构中占用 2 字节内存，在 64 位架构中占用 4 字节内存。但是，对于 Java 中的 32 位和 64 位体系结构，它占用 4 个字节的内存。



#### 7、多线程 

Java 语言是多线程的，这也是 Java 语言的一大特性，线程就像一个单独的程序，并发执行。我们可以通过定义多个线程来编写同时处理多个任务的 Java 程序。多线程的主要优点是它不会为每个线程占用内存。它共享一个公共内存区域。线程对于多媒体、Web 应用程序等很重要。



> 不过这样一来也带来了线程安全问题。



#### 8、分布式

Java 语言支持 Internet 应用的开发，在 Java 的基本应用编程接口中就有一个网络应用编程接口，它提供了网络应用编程的类库，包括 URL、URLConnection、Socket 等。Java 的 RMI 机制也是开发分布式应用的重要手段。



#### 9、健壮性

Java 的强类型机制、异常处理、垃圾回收机制等都是 Java 健壮性的重要保证。对指针的丢弃是 Java 的一大进步。另外，Java 的异常机制也是健壮性的一大体现。



#### 10、其它

(补充)



##  快速演化


没有不进步的人生，只有不思进取的人，编程语言也是一样。

Java 语言不因 JVM 而自命不凡，不因 Go 而患得患失，也从来不是效率高的语言，从 1995 年发布的 1.0 版本开始，截止目前为止， Java 版本已经是 [Java17](https://www.oracle.com/news/announcement/oracle-releases-java-17-2021-09-14/) <sup>[7] </sup> ，从最初的 Oak 夹缝求生，到如今拥有庞大的开源社区支持，以及海量高质量的组件支持，使得 Java 语言在互联网/企业应用、移动移动平台应用、大数据平台等领域都占据一定优势，一路来除了商业爸爸的支持，主要得益自身不断快速演化，最终被开发者、被市场所接受。



## 参考 

[1] About Java: https://developer.ibm.com/languages/java/

[2] 高级语言: https://baike.baidu.com/item/%E9%AB%98%E7%BA%A7%E8%AF%AD%E8%A8%80

[3] C 语言: https://baike.baidu.com/item/c%E8%AF%AD%E8%A8%80

[4] C ++: https://baike.baidu.com/item/C%2B%2B

[5] 面向对象: https://baike.baidu.com/item/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1

[6] Principles of OOP: https://developer.ibm.com/tutorials/j-introtojava1/

[7] Oracle Releases Java 17: https://www.oracle.com/news/announcement/oracle-releases-java-17-2021-09-14/