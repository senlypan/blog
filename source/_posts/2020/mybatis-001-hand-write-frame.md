---
title: Mybatis系列全解（一）：手写一套持久层框架
date: 2020-11-16 22:05:09
tags:
- Mybatis
preview: https://www.panshenlian.com/images/post/java/mybatis/title/01-title.jpg
introduce: 
    本文详细介绍了模仿 Mybatis 框架，手写一套持久层框架。
---



![手写一套持久层框架](https://www.panshenlian.com/images/post/java/mybatis/title/01-title.jpg)

**未来半年，有幸与导师们一起学习交流，趁这个机会，把所学所感记录下来：**


- 一来是自毕业以后，自己先创业后上班，浮沉了近8年，内心着实焦躁，虽说一直是走科班路线，但在技术道路上却始终没静下心来研究、思考、梳理，机会来了，便抓牢。
- 二来希望自己记录下来的知识内容，对后来的学习之人，能有些许帮助。



> 对文章内容有任何建议或意见，或对互联网开发有希望交流学习，或单纯热爱生活
>
> 都欢迎随时微信我：panshenlian



![趁年轻，终生学习吧](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_0.jpg)



第一个系列的文章主要围绕「**架构师（Java）技术条线**」展开聊，不定时更新。



第一篇我以《**手写一套持久层框架**》先来打个样，本篇文章我们先不介绍MyBatis，也不会分析源码，我们先聊一个 Java API：**JDBC**。



**JDBC**是Java的老朋友，我们再一次认识他吧，挑挑他的毛病，站在Java资老朋友的角度，给他提点优化意见，并送他一套《**自定义持久层框架**》。



> 温馨提示：
>
> 如果大家在阅读过程中，对某些解决思路存在疑问，我建议大家先带着疑问阅读完，消化理解，因为导师们确实是通过研究Mybatis等持久层框架源码之后，反过来剖析的。
>
> 简单来说 “ 大厂都这么写，我们且这么跟随吧 ”。

**Mybatis 全解系列脑图全览一直在更新哦**

<iframe id="embed_dom" name="embed_dom" frameborder="0" style="display:block;width:100%; height:500px;" src="https://www.processon.com/embed/5fb88348f346fb5f0e298069"></iframe>


#### Mybaits系列全解 ( 传送门 )

- [Mybatis系列全解（一）：手写一套持久层框架](/2020/11/16/mybatis-001-hand-write-frame/)
- [Mybatis系列全解（二）：Mybatis简介与环境搭建](/2020/11/28/mybatis-002-introduct-and-environment-construction/)
- [Mybatis系列全解（三）：Mybatis简单CRUD使用介绍](/2020/12/01/mybatis-003-usage-for-crud/)
- [Mybatis系列全解（四）：全网最全！Mybatis配置文件XML全貌详解](/2020/12/10/mybatis-004-xml-config-file/)
- [Mybatis系列全解（五）：全网最全！详解Mybatis的Mapper映射文件](/2020/12/18/mybatis-005-mapping-file/)
- [Mybatis系列全解（六）：Mybatis最硬核的API你知道几个？](/2021/01/11/mybatis-006-core-api/)
- [Mybatis系列全解（七）：全息视角看Dao层两种实现方式之传统与代理？](/2021/01/25/mybatis-007-two-impl-of-dao-layer)
- [Mybatis系列全解（八）：Mybatis的9大动态SQL标签你知道几个？](/2021/03/04/mybatis-008-dynamic-sql)
- Mybatis系列全解（九）：Mybatis的复杂映射
- Mybatis系列全解（十）：Mybatis注解开发
- Mybatis系列全解（十一）：Mybatis缓存全解
- Mybatis系列全解（十二）：Mybatis插件开发
- Mybatis系列全解（十三）：Mybatis代码生成器
- Mybatis系列全解（十四）：Spring集成Mybatis
- Mybatis系列全解（十五）：SpringBoot集成Mybatis
- Mybatis系列全解（十六）：Mybatis源码剖析

#### 目录

1、JDBC是谁？

2、JDBC如何工作？

3、JDBC存在哪些待优化的地方？

4、自定义持久层框架：思路分析

5、自定义持久层框架：编码

6、总结



## 一、JDBC是谁？

---



![JDBC是什么](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_1.jpg)





JDBC是谁？干啥的？到底有多能打？看看网络上的朋友们怎么说。






>
>  Java数据库连接，（Java Database Connectivity，简称JDBC）是Java语言中用来规范客户端程序如何来访问数据库的应用程序接口，提供了诸如查询和更新数据库中数据的方法。  
>
> **-- 来自百度百科**






>
>  JDBC(Java DataBase Connectivity,java数据库连接)是一种用于执行SQL语句的Java API，可以为多种关系数据库提供统一访问，它由一组用Java语言编写的类和接口组成。JDBC提供了一种基准，据此可以构建更高级的工具和接口，使数据库开发人员能够编写数据库应用程序。
>
> **-- 来自360百科**
> 



> 
> ... 无法访问此网站
> 
> **-- 来自维基百科**





以上基本就是JDBC的大致介绍，官方且严谨的说辞，That's It  ， 我们往下看看，它曾经的高光时刻。





> 自从Java语言于1995年5月正式公布以来，Java风靡全球。出现大量的用java语言编写的程序，其中也包括数据库应用程序。由于没有一个Java语言的API，编程人员不得不在Java程序中加入C语言的ODBC函数调用。这就使很多Java的优秀特性无法充分发挥，比如平台无关性、面向对象特性等。随着越来越多的编程人员对Java语言的日益喜爱，越来越多的公司在Java程序开发上投入的精力日益增加，对java语言接口的访问数据库的API的要求越来越强烈。也由于ODBC的有其不足之处，比如它并不容易使用，没有面向对象的特性等等，SUN公司决定开发一Java语言为接口的数据库应用程序开发接口。在JDK1.x版本中，JDBC只是一个可选部件，到了JDK1.1公布时，SQL类包(也就是JDBCAPI)就成为Java语言的标准部件。
>
> 后面从JDBC1.0到JDBC4.0，一路发展。 
>
> **-- 来自网络**





结合介绍说明加深我们对JDBC的了解。

不过，我想知道他平时是如何工作的？一张图 《 **JDBC 基本架构** 》 了解一下：



![JDBC架构图](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_2.jpg)



>有了JDBC，向各种关系数据库发送SQL语句就是一件很容易的事。
>
>换言之，有了JDBC API，就不必为访问Sybase数据库专门写一个程序，为访问Oracle数据库又专门写一个程序，或为访问Mysql数据库又编写另一个程序等等，程序员只需用JDBC API写一个程序就够了，它可向相应数据库发送SQL调用。
>
>同时，将Java语言和JDBC结合起来使程序员不必为不同的平台编写不同的应用程序，只须写一遍程序就可以让它在任何平台上运行，这也是Java语言"编写一次，处处运行"的优势。



我们再来看看他工作的细节。



#### 毕竟，有人说过：想了解一个人，就得先仔细了解Ta的工作。



![鲁迅爷爷](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_luxun.jpg)





## 二、JDBC如何工作？

---



##### JDBC API 允许应用程序访问任何形式的表格数据，特别是存储在关系数据库中的数据。

##### 执行流程主要分三步：



- 连接数据源。
- 为数据库传递查询和更新指令。
- 处理数据库响应并返回的结果。



##### 但实际上，每步流程都特别细节：



![JDBC使用流程](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_3.jpg)



##### 使用流程 （详细说明）



> 1.加载数据库驱动： 

程序中使用Class.forName('驱动')加载驱动，JVM会寻找并加载指定驱动类，同时执行驱动类的静态代码段，在JDK1.6之前JDBC规范中明确要求各家在实现Driver类时必须在静态代码段中向DriverManager注册实例，JDK1.6之后各家实现的Driver类则不再需要主动注册实例，因为DriverManager已经在初始化阶段对所有jar包中实现了java.sql.Driver的类进行扫描并进行初始化。



> 2. 创建数据库连接： 

DriverManager通过遍历所有已注册的驱动来尝试获取连接，第一个匹配上就会直接返回，并使用对应驱动建立起客户端与数据库服务器的网络连接（物理连接Socket了解一下）。



> 3. 创建编译对象： 

数据库连接connection成功之后，我们会向数据库发送一次请求（statement），执行一条sql语句，一个连接可以执行多次statement，除非你关闭连接，其中还有一个概念就是事务transaction，事务和请求可以是一对一，也可以是一对多，这取决于你是想把多个请求statement作为同一个事务提交，还是一个请求提交一次事务，JDBC默认是事务是自动提交，即auto-commit是打开的，所以默认是一对一。



> 4. 设置入参执行SQL： 

为了防止SQL注入，我们使用预处理在sql中使用?作为输入参数的占位符，sql在编译后成为安全的sql语句再进行查询（有缘我们可以聊聊为何预处理机制能防止SQL注入）。



> 5. 封装返回结果集： 

SQL执行之后会把结果集封装到ResultSet类，ResultSet类本身的迭代器初始行数的位置是1，所以我们会发现与java.util.Iterator接口的迭代初始行数为0有差异，同时ResultSet类本身没有提供hasNext方法，所以我们会不断的while(rs.next())往后定位，再通过不同的类型的访问器读取数据（例如getString,getInteger等）。



> 6. 释放数据库连接资源： 

考虑到数据库连接占用了数据库服务器的内存资源，所以不可能无限制建立连接，用完就释放，养成好习惯，目前很多成熟的数据连接池技术，很好的优化管理的数据连接问题。



##### 我们通过一段简单的例子来演示一下使用流程，本例子使用JDBC操作mysql数据库，先看看我们最终的项目结构与JDBC API在JDK中rt.jar的结构：



- 项目结构：



![项目结构](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_test_project_org.jpg)



- JDBC API在JDK中rt.jar的结构：



![JDBC API 在JDK的结构](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_jar_org.jpg)




> 默认已具备java开发环境、mysql数据库



1. 创建mave工程，并且引入mysql驱动依赖



```xml

<dependencies>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.25</version>
    </dependency>
</dependencies>

```

2. 创建java测试类

```java
    
package com.panshenlian.jdbc;

import com.panshenlian.po.User;

import java.sql.*;

/**
 * @Author: panshenlian
 * @Description: 演示通过JDBC连接mysql数据库
 * @Date: Create in 20:11 2020/11/10
 */
public class Test01 {

    public static void main(String[] args) {
        User user = new User();
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            // 加载数据库驱动
            Class.forName("com.mysql.jdbc.Driver");
            // 通过驱动管理类获取数据库连接
            connection = 
               DriverManager.getConnection(
                  "jdbc:mysql://localhost:3306/mybatis"+
                  "?characterEncoding=utf-8",
                  "root","123456");
            // 定义SQL语句 ？ 表示占位符
            String sql = " select * from user where username = ? ";
            // 获取预处理statement对象
            preparedStatement = connection.prepareStatement(sql);
            // 设置参数
            //   第一个参数sql语句中参数的序号（从1开始）
            //   第二个参数为设置的参数值
            preparedStatement.setString(1,"panshenlian");
            // 向数据库发出sql执行查询，查询出结果集
            resultSet = preparedStatement.executeQuery();
            // 遍历查询结果集
            while(resultSet.next()){
                int id = resultSet.getInt("id");
                String name = resultSet.getString("username");
                // 封装User
                user.setId(id);
                user.setUserName(name);
                System.out.println(user);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 释放资源
           if(resultSet!=null){
               try {
                   resultSet.close();
               } catch (SQLException e) {
                   e.printStackTrace();
               }
           }
          if(preparedStatement!=null){
              try {
                  preparedStatement.close();
              } catch (SQLException e) {
                  e.printStackTrace();
              }
          }
          if(connection!=null){
              try {
                  connection.close();
              } catch (SQLException e) {
                  e.printStackTrace();
              }
           }
        }
    }
}

```

3. 创建User类

```java

package com.panshenlian.po;

/**
 * @Author: panshenlian
 * @Description: 用户实体
 * @Date: Create in 20:10 2020/11/10
 */
public class User {

    private  Integer id;
    private String userName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                '}';
    }
}



```

4. 创建sql语句

```sql

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `birthday` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'senly', '123', '2020-11-10');
INSERT INTO `user` VALUES ('2', 'panshenlian', '123456', '2020-11-10');

```

5. 执行结果，nice , 成功。

```cmd

User{id=2, userName='panshenlian'}

```



看完这段演示，大家是否发现一个问题？就是整个JDBC操作数据库的使用过程繁琐而尴尬，就如这场对话：



![用户使用原始JDBC日常](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_4.jpg)




> 额(⊙o⊙)… JDBC你确实挺烦的。
>
> 我懂你需要和数据库建立连接、执行SQL语句、处理查询结果集...
>
> 但是，这整个过程，能不能优化一下呢？





## 三、JDBC存在哪些待优化的地方？

---





我们平时瘦身增肌，工作更得提质增效，来，我们剖开代码，逐个分析：





``` java
			
// 加载数据库驱动
Class.forName("com.mysql.jdbc.Driver");
// 通过驱动管理类获取数据库链接
connection = DriverManager.getConnection(
    "jdbc:mysql://localhost:3306/mybatis?characterEncoding=utf-8",
    "root","123456");
                    
```





- 存在问题1：数据库配置信息存在**硬编码**问题。
  
  > 优化思路：使用配置文件！ 






- 存在问题2：频繁创建、释放**数据库连接**问题。
  
  > 优化思路：使用数据连接池！ 





``` java
			
 // 定义SQL语句 ？ 表示占位符
 String sql = " select * from user where username = ? ";
 // 获取预处理statement对象
 preparedStatement = connection.prepareStatement(sql);
 // 设置参数，第一个参数sql语句中参数的序号（从1开始），第二个参数为设置的参数值
 preparedStatement.setString(1,"tom");
 // 向数据库发出sql执行查询，查询出结果集
 resultSet = preparedStatement.executeQuery();
                    
```





- 存在问题3：SQL语句、设置参数、获取结果集参数均存在**硬编码**问题 。
  
  > 优化思路：使用配置文件！
  





``` java

// 遍历查询结果集
while(resultSet.next()){
   int id = resultSet.getInt("id");
   String userName = resultSet.getString("username");
   // 封装User
   user.setId(id);
   user.setUserName(userName);
   System.out.println(user);
}
                    
```





- 存在问题4：**手动封装**返回结果集，较为繁琐。
  
  > 优化思路：使用Java反射、自省！ 
  





针对JDBC各个环节中存在的不足，现在，我们整理出对应的优化思路，统一汇总：

| 存在问题                                          | 优化思路           |
| ------------------------------------------------- | ------------------ |
| 数据库配置信息存在硬编码问题                      | 使用配置文件       |
| 频繁创建、释放数据库连接问题                      | 使用数据连接池     |
| SQL语句、设置参数、获取结果集参数均存在硬编码问题 | 使用配置文件       |
| 手动封装返回结果集，较为繁琐                      | 使用Java反射、自省 |



> 假如让你来优化，你会根据这些优化思路如何设计一套持久层框架呢？




## 四、自定义持久层框架：思路分析

---



JDBC是个人作战，凡事亲力亲为，低效而高险，自己加载驱动，自己建连接，自己 ...

而持久层框架好比是多工种协作，分工明确，执行高效，有专门负责解析注册驱动建立连接的，有专门管理数据连接池的，有专门执行sql语句的，有专门做预处理参数的，有专门装配结果集的 ...



```text

 框架的作用，就是为了帮助我们减去繁重开发细节与冗余代码，使我们能更加专注于业务应用开发。 

```



##### 来，我们一起看看使用JDBC和使用持久层框架有什么区别？
##### 使用框架对于我们使用者（主要是研发人员），是有多舒爽呢？




![JDBC VS 持久层框架](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_8.jpg)



> 是不是发现，拥有这么一套持久层框架是如此舒适，我们仅仅需要干两件事：
> - **配置数据源**（地址/数据名/用户名/密码）
> - **编写SQL与参数准备**（SQL语句/参数类型/返回值类型）
>




#####  框架，除了思考本身的工程设计，还需要考虑到实际项目端的使用场景，干系方涉及两端：

- 使用端（实际项目）

- 持久层框架本身



以上两步，我们通过一张架构图《 **手写持久层框架基本思路** 》来梳理清楚：



![手写持久层框架基本思路](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_5.jpg)



##### 核心接口/类重点说明：

| 分工协作                                        | 角色定位          | 类名定义                 |
| ----------------------------------------------- | ----------------- | ------------------------ |
| 负责读取配置文件                                | 资源辅助类        | Resources                |
| 负责存储数据库连接信息                          | 数据库资源类      | Configuration            |
| 负责存储SQL映射定义、存储结果集映射定义         | SQL与结果集资源类 | MappedStatement          |
| 负责解析配置文件，创建会话工厂SqlSessionFactory | 会话工厂构建者    | SqlSessionFactoryBuilder |
| 负责创建会话SqlSession                          | 会话工厂          | SqlSessionFactory        |
| 指派执行器Executor                              | 会话              | SqlSession               |
| 负责执行SQL （配合指定资源Mapped Statement）    | 执行器            | Executor                 |



>正常来说项目只对应一套数据库环境，一般对应一个SqlSessionFactory实例对象，我们使用单例模式只创建一个SqlSessionFactory实例。
>
>如果需要配置多套数据库环境，那需要做一些拓展，例如Mybatis中通过environments等配置就可以支持多套测试/生产数据库环境进行切换。



##### 梳理完持久层框架的基本思路，明确了框架各角色分工，我们开始梳理详细方案：



A、项目使用端，调用框架API，除了引入持久层框架的jar包之外，还需额外提供两部分配置信息：

​    


  ``` text
  
   1. sqlMapConfig.xml : 数据库配置信息（地址/数据名/用户名/密码），以及mapper.xml的全路径。
   2. mapper.xml : SQL配置信息，存放SQL语句、参数类型、返回值类型相关信息。
  
  ```




B、框架本身，实质上就是对JDBC代码进行封装，基本6步：





1. 加载配置文件：根据配置文件的路径，加载配置文件成字节输入流，存储在内存中。
          



  ``` text
  
  创建Resource类，提供加载流方法：InputStream getResourceAsStream(String path)
  
  ```





2. 创建两个javaBean（容器对象）：存放配置文件解析出来的内容





 ``` text
  
  Configuration（核心配置类）：存放sqlMapConfig.xml解析出来的内容。
  MappedStatement（映射配置类）：存放mapper.xml解析出来的内容。
  
 ```





3. 解析配置文件（使用dom4j） ，并创建SqlSession会话对象





 ``` text
  
  创建类：SqlSessionFactoryBuilder 方法：build(InputStream in)
  > 使用dom4j解析配置文件，将解析出来的内容封装到容器对象中
  > 创建SqlSessionFactory对象，生产sqlSession会话对象（工厂模式）
  
 ```

 



4. 创建SqlSessionFactory接口以及实现类DefaultSqlSessionFactory





 ``` text
 
   创建openSession()接口方法，生产sqlSession
  
 ```

 



5. 创建SqlSession接口以及实现类DefaultSqlSession





 ``` text
 
   定义对数据库的CRUD操作：
   > selectList();
   > selectOne();
   > update();
   > delete();
  
 ```





6. 创建Executor接口以及实现类SimpleExecutor





 ``` text
 
   创建query(Configuration conf,MappedStatement ms,Object... params)
   实际执行的就是JDBC代码。
  
 ```



基本过程我们已经清晰，我们再细化一下类图，更好的助于我们实际编码：



> 简约版



![持久层框架UML简约版](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_6.jpg)




 > 详细版




![持久层框架UML详细版](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_7.jpg)



##### 最终手写的持久层框架结构参考：



![自定义持久层框架项目结构图](https://www.panshenlian.com/images/post/00_old_article_images/1_persistence_org.jpg)



##### 包接口类说明

- config包

| 接口/类          | 作用                                                        |
| ---------------- | ----------------------------------------------------------- |
| BoundSql         | 保存Sql语句的对象，替换sql#{}成为?号并且存储#{}对应的参数名 |
| XMLConfigBuilder | SqlMapConfig.xml配置文件解析工具类                          |
| XMLMapperBuilder | Mapper.xml配置文件解析工具类                                |

- *io*包

| 接口/类  | 作用                                                         |
| -------- | ------------------------------------------------------------ |
| Resource | 读取SqlMapConfig.xml和Mapper.xml的工具类，转换为输入流inputStream |

- *pojo*包

| 接口/类         | 作用                         |
| --------------- | ---------------------------- |
| Configuration   | 封装SqlMapConfig.xml配置参数 |
| MappedStatement | 封装Mapper.xml配置的sql参数  |

- *sqlSession*包

| 接口/类                  | 作用                                            |
| ------------------------ | ----------------------------------------------- |
| SqlSessionFactoryBuilder | SqlSessionFactory构建者类                       |
| SqlSessionFactory        | 生产SqlSession的工厂接口                        |
| DefaultSqlSessionFactory | SqlSessionFactory的默认实现类                   |
| SqlSession               | SqlSession接口定义数据库基本的CRUD方法          |
| DefaultSqlSession        | SqlSession的实现类                              |
| Executor                 | Executor接口sql的真正执行者，使用JDBC操作数据库 |
| SimpleExecutor           | Executor的实现类                                |

- *utils*

| 接口/类                      | 作用                                                     |
| ---------------------------- | -------------------------------------------------------- |
| ParameterMapping             | 来源于Mybatis框架，SQL参数映射类，存储#{}、${}中的参数名 |
| TokenHandler                 | 来源于Mybatis框架，标记处理器接口                        |
| ParameterMappingTokenHandler | 来源于Mybatis框架，标记处理器实现类，解析#{}、${}成为?   |
| GenericTokenParser           | 来源于Mybatis框架，通用标记解析器，标记#{与}开始结束处理 |




## 五、自定义持久层框架：编码

---


结合UML图和项目结构图，脑海里开始有点东西了，烧脑且枯燥的编码过程，我们开始吧。

框架依赖 pom.xml

``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.panshenlian</groupId>
    <artifactId>MyPersistence</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.encoding>UTF-8</maven.compiler.encoding>
        <java.version>1.8</java.version>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <!-- 持久层框架所需要的的依赖 -->
    <dependencies>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.17</version>
        </dependency>
        <dependency>
            <groupId>c3p0</groupId>
            <artifactId>c3p0</artifactId>
            <version>0.9.1.2</version>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.12</version>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.10</version>
        </dependency>
        <dependency>
            <groupId>dom4j</groupId>
            <artifactId>dom4j</artifactId>
            <version>1.6.1</version>
        </dependency>
        <dependency>
            <groupId>jaxen</groupId>
            <artifactId>jaxen</artifactId>
            <version>1.1.6</version>
        </dependency>
    </dependencies>

</project>
```

config包下BoundSql类

```java
package com.panshenlian.config;

import com.panshenlian.utils.ParameterMapping;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: panshenlian
 * @Description: SQL通配类
 * @Date: Create in 16:12 2020/11/12
 */
public class BoundSql {

    /**
     * 解析过的sql语句
     */
    private String sqlText;

    private List<ParameterMapping> parameterMappingList =
            new ArrayList<ParameterMapping>();

    public BoundSql(String sqlText, List<ParameterMapping> parameterMappingList) {
        this.sqlText = sqlText;
        this.parameterMappingList = parameterMappingList;
    }

    public String getSqlText() {
        return sqlText;
    }

    public void setSqlText(String sqlText) {
        this.sqlText = sqlText;
    }

    public List<ParameterMapping> getParameterMappingList() {
        return parameterMappingList;
    }

    public void setParameterMappingList(List<ParameterMapping> parameterMappingList) {
        this.parameterMappingList = parameterMappingList;
    }
}

```



config包下XMLConfigBuilder类

```java
package com.panshenlian.config;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import com.panshenlian.io.Resource;
import com.panshenlian.pojo.Configuration;
import com.sun.javafx.scene.control.skin.EmbeddedTextContextMenuContent;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import java.io.InputStream;
import java.util.List;
import java.util.Properties;

/**
 * @Author: panshenlian
 * @Description: 数据库配置信息解析类
 * @Date: Create in 13:56 2020/11/12
 */
public class XMLConfigBuilder {

    private Configuration configuration;

    public XMLConfigBuilder() {
        this.configuration = new Configuration();
    }

    public Configuration parseConfig(InputStream inputStream) throws Exception {

        Document document = new SAXReader().read(inputStream);
        Element configurationRootElement = document.getRootElement();

        // 解析数据源配置dataSource下的参数信息
        List<Element> elementList = configurationRootElement.selectNodes("//property");
        Properties properties = new Properties();
        for (Element element : elementList){
            String name = element.attributeValue("name");
            String value = element.attributeValue("value");
            properties.put(name,value);
        }

        // 使用c3p0数据源
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setDriverClass(properties.getProperty("driverClass"));
        dataSource.setJdbcUrl(properties.getProperty("jdbcUrl"));
        dataSource.setUser(properties.getProperty("userName"));
        dataSource.setPassword(properties.getProperty("password"));

        // 设置数据源
        configuration.setDataSource(dataSource);

        // 解析mapper.xml，根据路径读取字节输入流，使用dom4j进行解析
        List<Element> mapperElementList = configurationRootElement.selectNodes("//mapper");
        for (Element element : mapperElementList) {
            String mapperPath = element.attributeValue("resource");
            InputStream resourceAsStream = Resource.getResourceAsStream(mapperPath);
            XMLMapperBuilder xmlMapperBuilder = new XMLMapperBuilder(configuration);
            xmlMapperBuilder.parseMapper(resourceAsStream);
        }

        return configuration;
    }
}

```



config包下XMLMapperBuilder类

```java
package com.panshenlian.config;

import com.panshenlian.pojo.Configuration;
import com.panshenlian.pojo.MappedStatement;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import java.io.InputStream;
import java.util.List;

/**
 * @Author: panshenlian
 * @Description: SQL配置信息解析类
 * @Date: Create in 14:28 2020/11/12
 */
public class XMLMapperBuilder {

    private Configuration configuration;

    public XMLMapperBuilder(Configuration configuration) {
        this.configuration = configuration;
    }

    public void parseMapper(InputStream inputStream) throws DocumentException {

        Document mapperDocument = new SAXReader().read(inputStream);
        Element rootElement = mapperDocument.getRootElement();
        String namespace = rootElement.attributeValue("namespace");

        // 解析每一个select节点
        List<Element> selectNodes = mapperDocument.selectNodes("//select");
        for (Element element : selectNodes) {
            String id = element.attributeValue("id");
            String resultType = element.attributeValue("resultType");
            String parameterType = element.attributeValue("parameterType");
            String sql = element.getTextTrim();

            // 解析封装进入MapperdStatement对象
            MappedStatement mappedStatement = new MappedStatement();
            mappedStatement.setId(id);
            mappedStatement.setResultType(resultType);
            mappedStatement.setParameterType(parameterType);
            mappedStatement.setSql(sql);
            String statementId = namespace + "." + id;
            configuration.getMappedStatementMap().put(statementId,mappedStatement);
        }

    }
}

```



io包下Resource工具类

```java
package com.panshenlian.io;

import java.io.InputStream;

/**
 * @Author: panshenlian
 * @Description: 资源类
 * @Date: Create in 9:22 2020/11/12
 */
public class Resource {

    /**
     * 根据配置文件路径，将配置文件加载成字节输入流，存储在内存中
     * @param path
     * @return
     */
    public static InputStream getResourceAsStream(String path){
        InputStream inputStream = Resource.class.getClassLoader().getResourceAsStream(path);
        return inputStream;
    }

}

```



pojo包下Configuration

```java
package com.panshenlian.pojo;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

/**
 * @Author: panshenlian
 * @Description: 数据库配置类
 * @Date: Create in 13:58 2020/11/12
 */
public class Configuration {

    private DataSource dataSource;

    /**
     * key:statementId
     * value:封装好的mappedStatement对象
     */
    private Map<String,MappedStatement> mappedStatementMap = new HashMap<String, MappedStatement>();

    public DataSource getDataSource() {
        return dataSource;
    }

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Map<String, MappedStatement> getMappedStatementMap() {
        return mappedStatementMap;
    }

    public void setMappedStatementMap(Map<String, MappedStatement> mappedStatementMap) {
        this.mappedStatementMap = mappedStatementMap;
    }
}

```



pojo包下MappedStatement

```java
package com.panshenlian.pojo;

/**
 * @Author: panshenlian
 * @Description: SQL与结果集资源类 （负责存储SQL映射定义、存储结果集映射定义）
 * @Date: Create in 14:17 2020/11/12
 */
public class MappedStatement {

    /**
     * id标识
     */
    private String id;

    /**
     * 返回值类型
     */
    private String resultType;

    /**
     * 参数值类型
     */
    private String parameterType;

    /**
     * sql语句
     */
    private String sql;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getResultType() {
        return resultType;
    }

    public void setResultType(String resultType) {
        this.resultType = resultType;
    }

    public String getParameterType() {
        return parameterType;
    }

    public void setParameterType(String parameterType) {
        this.parameterType = parameterType;
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }
}

```



sqlSession包下DefaultSqlSession

```java
package com.panshenlian.sqlSession;

import com.panshenlian.pojo.Configuration;
import com.panshenlian.pojo.MappedStatement;

import java.lang.reflect.*;
import java.util.List;

/**
 * @Author: panshenlian
 * @Description: sql会话实现类
 * @Date: Create in 14:43 2020/11/12
 */
public class DefaultSqlSession implements SqlSession{

    private Configuration configuration;

    public DefaultSqlSession(Configuration configuration) {
        this.configuration = configuration;
    }

    @Override
    public <E> List<E> selectList(String statementId, Object... params) throws Exception {

        // 1、构建sql执行器
        SimpleExecutor simpleExecutor = new SimpleExecutor();

        // 2、获取最终执行sql对象
        MappedStatement mappedStatement = configuration.getMappedStatementMap().get(statementId);

        // 3、执行sql，返回结果集
        List<Object> queryResultList = simpleExecutor.query(configuration, mappedStatement, params);
        return (List<E>)queryResultList;
    }

    @Override
    public <T> T selectOne(String statementId, Object... params) throws Exception {
        List<Object> objects = selectList(statementId, params);
        if (null != objects && objects.size() == 1){
            return (T)objects.get(0);
        } else {
           throw  new RuntimeException("查询结果为空或者返回结果多于1条");
        }
    }

    @Override
    public int update(String statementId, Object... params) {
        return 0;
    }

    @Override
    public int delete(String statementId, Object... params) {
        return 0;
    }

    @Override
    public <T> T getMapper(Class<?> mapperClass) {

        //使用JDK动态代理来为Dao接口生成代理对象，并返回调用结果
        Object proxyInstance =  Proxy.newProxyInstance(DefaultSqlSession.class.getClassLoader(), new Class[]{mapperClass}, new InvocationHandler(){
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

                // 底层都还是去执行JDBC
                // 根据不同情况，来调用selectList或selectOne
                // 1.准备参数statementId = sql 语句的唯一标识： namespace.id =接口全限定名.方法名
                String methodName = method.getName();
                String className = method.getDeclaringClass().getName();
                String statementId = className + "." + methodName;

                // 2.准备参数 params 即args
                // 获取被调用方法的返回值类型
                Type genericReturnType = method.getGenericReturnType();
                // 判断是否进行了 泛型类型参数化
                if ( genericReturnType instanceof ParameterizedType){
                    List<Object> objects = selectList(statementId, args);
                    return objects;
                }

                return selectOne(statementId,args);
            }
        });
        return (T)proxyInstance;

    }
}

```



sqlSession包下DefaultSqlSessionFactory

```java
package com.panshenlian.sqlSession;

import com.panshenlian.pojo.Configuration;

/**
 * @Author: panshenlian
 * @Description: 默认SqlSession工厂实现类
 * @Date: Create in 14:41 2020/11/12
 */
public class DefaultSqlSessionFactory implements  SqlSessionFactory{

    private Configuration configuration;

    public DefaultSqlSessionFactory(Configuration configuration) {
        this.configuration = configuration;
    }

    @Override
    public SqlSession openSession() {
        return new DefaultSqlSession(configuration);
    }
}

```



sqlSession包下Executor

```java
package com.panshenlian.sqlSession;

import com.panshenlian.pojo.Configuration;
import com.panshenlian.pojo.MappedStatement;

import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.List;

/**
 * @Author: panshenlian
 * @Description: sql执行器接口
 * @Date: Create in 15:02 2020/11/12
 */
public interface Executor {

    public <E> List<E> query(Configuration configuration,
                             MappedStatement mappedStatement,
                             Object... params) throws Exception;

}

```



sqlSession包下SimpleExecutor

```java
package com.panshenlian.sqlSession;

import com.mysql.jdbc.StringUtils;
import com.panshenlian.config.BoundSql;
import com.panshenlian.pojo.Configuration;
import com.panshenlian.pojo.MappedStatement;
import com.panshenlian.utils.GenericTokenParser;
import com.panshenlian.utils.ParameterMapping;
import com.panshenlian.utils.ParameterMappingTokenHandler;

import java.beans.ExceptionListener;
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * @Author: panshenlian
 * @Description: sql执行器接口简单实现类
 * @Date: Create in 15:55 2020/11/12
 */
public class SimpleExecutor implements Executor {

    @Override
    public <E> List<E> query(Configuration configuration,
                             MappedStatement mappedStatement,
                             Object... params) throws Exception {

        // 1、注册驱动 , 获取数据库连接
        Connection connection = configuration.getDataSource().getConnection();

        // 2、获取sql语句： select * from user where id = #{id}
        //    转换sql语句： select * from user where id = ?
        //    转换的过程，还需要对#{}里面的值进行解析存储
        String sql = mappedStatement.getSql();
        BoundSql bounSql = getBoundSql(sql);

        // 3、获取预处理对象: preparedStatement
        PreparedStatement preparedStatement =
                connection.prepareStatement(bounSql.getSqlText());

        // 4、设置参数，通过反射机制获取到参数
        String parameterType = mappedStatement.getParameterType();
        Class<?> parameterTypeClass = getClassType(parameterType);

        List<ParameterMapping> parameterMappingList =
                bounSql.getParameterMappingList();
        for (int i = 0; i < parameterMappingList.size(); i++) {
            ParameterMapping parameterMapping = parameterMappingList.get(i);
            String filedName = parameterMapping.getContent();

            // 反射
            Field declaredField = parameterTypeClass.getDeclaredField(filedName);
            // 暴力访问
            declaredField.setAccessible(true);
            Object declaredFieldValue = declaredField.get(params[0]); // params[0] 是对象
            preparedStatement.setObject(i+1,declaredFieldValue);
        }

        // 5、执行SQL
        ResultSet resultSet = preparedStatement.executeQuery();
        String resultType = mappedStatement.getResultType();
        Class<?> resultTypeClass = getClassType(resultType);
        List<Object> objects = new ArrayList<Object>();

        // 6、封装返回结果集
        while (resultSet.next()){
            Object o = resultTypeClass.newInstance();
            // 元数据
            ResultSetMetaData metaData = resultSet.getMetaData();
            for (int i = 1; i <= metaData.getColumnCount(); i++) {
                // 字段名
                String columnName = metaData.getColumnName(i);
                // 字段值
                Object columnValue = resultSet.getObject(columnName);

                // 使用内省（反射），根据数据库表和实体的对应关系，完成封装
                PropertyDescriptor propertyDescriptor =
                        new PropertyDescriptor(columnName, resultTypeClass);
                Method writeMethod = propertyDescriptor.getWriteMethod();
                writeMethod.invoke(o,columnValue);
            }
            objects.add(o);
        }
        return (List<E>)objects;
    }

    /**
     * 根据参数的全路径反射获取类
     * @param parameterType
     * @return
     */
    private Class<?> getClassType(String parameterType) throws ClassNotFoundException {
        if (StringUtils.isNullOrEmpty(parameterType)) {
            return null;
        }
        Class<?> clazz = Class.forName(parameterType);
        return clazz;
    }

    /**
     * 完成对#{}的解析工作：1、将#{}使用？进行代替，2、解析出#{}里面的值并存储
     * @param sql
     * @return
     */
    private BoundSql getBoundSql(String sql) {

        // 标记处理类，配置标记解析器来完成对占位符的解析处理工作
        ParameterMappingTokenHandler parameterMappingTokenHandler
                = new ParameterMappingTokenHandler();
        GenericTokenParser genericTokenParser =
                new GenericTokenParser("#{","}",
                        parameterMappingTokenHandler);

        // 解析出来的sql
        String parseSql = genericTokenParser.parse(sql);
        // 解析出来的参数名称
        List<ParameterMapping> parameterMappings =
                parameterMappingTokenHandler.getParameterMappings();

        // 封装成为通配sql返回结果
        BoundSql boundSql = new BoundSql(parseSql, parameterMappings);
        return boundSql;
    }
}

```



sqlSession包下SqlSession

```java
package com.panshenlian.sqlSession;

import java.util.List;

/**
 * @Author: panshenlian
 * @Description: Sql会话接口
 * @Date: Create in 14:40 2020/11/12
 */
public interface SqlSession {

    /**
     * 查询所有
     * @param statementId
     * @param params
     * @param <E>
     * @return
     */
    public <E> List<E> selectList(String statementId , Object ... params) throws Exception;

    /**
     * 根据条件查询单个
     * @param statementId
     * @param params
     * @param <T>
     * @return
     */
    public <T> T selectOne(String statementId , Object ... params) throws Exception;

    /**
     * 根据条件更新
     * @param statementId
     * @param params
     * @return
     */
    public int update(String statementId , Object ... params);

    /**
     * 根据条件删除
     * @param statementId
     * @param params
     * @return
     */
    public int delete(String statementId , Object ... params);

    /**
     * 为Dao接口生成代理实现类
     * @param mapperClass
     * @param <T>
     * @return
     */
    public <T> T getMapper(Class<?> mapperClass);

}

```



sqlSession包下SqlSessionFactory

```java
package com.panshenlian.sqlSession;

/**
 * @Author: panshenlian
 * @Description: SqlSession工厂接口
 * @Date: Create in 13:51 2020/11/12
 */
public interface SqlSessionFactory {

    public SqlSession openSession();
}

```



sqlSession包下SqlSessionFactoryBuilder

```java
package com.panshenlian.sqlSession;

import com.panshenlian.config.XMLConfigBuilder;
import com.panshenlian.pojo.Configuration;

import java.io.InputStream;

/**
 * @Author: panshenlian
 * @Description: SqlSession会话工厂构建类
 * @Date: Create in 13:48 2020/11/12
 */
public class SqlSessionFactoryBuilder {

    public SqlSessionFactory build(InputStream inputStream) throws Exception {

        // 第一步：用dom4j解析配置文件，将解析出来的内容封装到Configuration中
        XMLConfigBuilder xmlConfigBuilder = new XMLConfigBuilder();
        Configuration configuration = xmlConfigBuilder.parseConfig(inputStream);

        // 第二步：创建SqlSessionFactory对象，生产sqlSession会话对象（工厂模式）
        DefaultSqlSessionFactory defaultSqlSessionFactory =
                new DefaultSqlSessionFactory(configuration);

        return defaultSqlSessionFactory;
    }
}

```



utils包下GenericTokenParser

```java
/**
 *    Copyright 2009-2017 the original author or authors.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package com.panshenlian.utils;

/**
 * 通用标记解析器，标记#{与}开始结束处理
 * @author Clinton Begin
 */
public class GenericTokenParser {

  private final String openToken; //开始标记
  private final String closeToken; //结束标记
  private final TokenHandler handler; //标记处理器

  public GenericTokenParser(String openToken, String closeToken, TokenHandler handler) {
    this.openToken = openToken;
    this.closeToken = closeToken;
    this.handler = handler;
  }

  /**
   * 解析${}和#{}
   * @param text
   * @return
   * 该方法主要实现了配置文件、脚本等片段中占位符的解析、处理工作，并返回最终需要的数据。
   * 其中，解析工作由该方法完成，处理工作是由处理器handler的handleToken()方法来实现
   */
  public String parse(String text) {
    // 验证参数问题，如果是null，就返回空字符串。
    if (text == null || text.isEmpty()) {
      return "";
    }

    // 下面继续验证是否包含开始标签，如果不包含，默认不是占位符，直接原样返回即可，否则继续执行。
    int start = text.indexOf(openToken, 0);
    if (start == -1) {
      return text;
    }

   // 把text转成字符数组src，并且定义默认偏移量offset=0、存储最终需要返回字符串的变量builder，
    // text变量中占位符对应的变量名expression。判断start是否大于-1(即text中是否存在openToken)，如果存在就执行下面代码
    char[] src = text.toCharArray();
    int offset = 0;
    final StringBuilder builder = new StringBuilder();
    StringBuilder expression = null;
    while (start > -1) {
     // 判断如果开始标记前如果有转义字符，就不作为openToken进行处理，否则继续处理
      if (start > 0 && src[start - 1] == '\\') {
        builder.append(src, offset, start - offset - 1).append(openToken);
        offset = start + openToken.length();
      } else {
        //重置expression变量，避免空指针或者老数据干扰。
        if (expression == null) {
          expression = new StringBuilder();
        } else {
          expression.setLength(0);
        }
        builder.append(src, offset, start - offset);
        offset = start + openToken.length();
        int end = text.indexOf(closeToken, offset);
        while (end > -1) {////存在结束标记时
          if (end > offset && src[end - 1] == '\\') {//如果结束标记前面有转义字符时
            // this close token is escaped. remove the backslash and continue.
            expression.append(src, offset, end - offset - 1).append(closeToken);
            offset = end + closeToken.length();
            end = text.indexOf(closeToken, offset);
          } else {//不存在转义字符，即需要作为参数进行处理
            expression.append(src, offset, end - offset);
            offset = end + closeToken.length();
            break;
          }
        }
        if (end == -1) {
          // close token was not found.
          builder.append(src, start, src.length - start);
          offset = src.length;
        } else {
          //首先根据参数的key（即expression）进行参数处理，返回?作为占位符
          builder.append(handler.handleToken(expression.toString()));
          offset = end + closeToken.length();
        }
      }
      start = text.indexOf(openToken, offset);
    }
    if (offset < src.length) {
      builder.append(src, offset, src.length - offset);
    }
    return builder.toString();
  }
}

```



utils包下ParameterMapping

```java
package com.panshenlian.utils;

/**
 * @Author: panshenlian
 * @Description: 参数映射类（SQL参数映射类，存储#{}、${}中的参数名）
 * @Date: Create in 16:14 2020/11/12
 */
public class ParameterMapping {

    private String content;

    public ParameterMapping(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

```



utils包下ParameterMappingTokenHandler

```java
package com.panshenlian.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * 标记处理器实现类，解析#{}、${}成为?
 */
public class ParameterMappingTokenHandler implements TokenHandler {
	private List<ParameterMapping> parameterMappings = new ArrayList<ParameterMapping>();

	// context是参数名称 #{id} #{username}

	public String handleToken(String content) {
		parameterMappings.add(buildParameterMapping(content));
		return "?";
	}

	private ParameterMapping buildParameterMapping(String content) {
		ParameterMapping parameterMapping = new ParameterMapping(content);
		return parameterMapping;
	}

	public List<ParameterMapping> getParameterMappings() {
		return parameterMappings;
	}

	public void setParameterMappings(List<ParameterMapping> parameterMappings) {
		this.parameterMappings = parameterMappings;
	}

}

```



utils包下TokenHandler

```java
/**
 *    Copyright 2009-2015 the original author or authors.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package com.panshenlian.utils;

/**
 * 标记处理器接口
 * @author Clinton Begin
 */
public interface TokenHandler {
  String handleToken(String content);
}


```



框架书写好了，我们写一个测试工程验证一下框架，我们在现有框架下新加一个测试项目（以module模块的方式创建）保证测试工程和框架项目在一个工作组下面：



![引入测试工程](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_idea_1.jpg)



由于我已经写好了测试工程，我直接引入即可，效果都一样，创建和引入都以module方式就可以：

![引入测试工程](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_idea_2.jpg)

![引入测试工程](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_idea_3.jpg)

![引入测试工程](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_idea_4.jpg)

![引入测试工程](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_idea_5.jpg)

![引入测试工程](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_idea_6.jpg)

![引入测试工程](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_idea_7.jpg)



测试工程基本流程也说明一下：

1、引入依赖pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.panshenlian</groupId>
    <artifactId>MyPersistenceTest</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.encoding>UTF-8</maven.compiler.encoding>
        <java.version>1.8</java.version>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <!-- 引入自定义持久层框架的依赖 -->
    <dependencies>
        <dependency>
            <groupId>com.panshenlian</groupId>
            <artifactId>MyPersistence</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
    </dependencies>

</project>
```

2、配置数据源sqlMapConfig.xml

```xml
<configuration>

    <!-- 数据库配置信息 -->
    <dataSource>
        <property name="driverClass"
                  value="com.mysql.jdbc.Driver" ></property>
        <property name="jdbcUrl"
                  value="jdbc:mysql:///mybatis" ></property>
        <property name="userName"
                  value="root" ></property>
        <property name="password"
                  value="123456" ></property>
    </dataSource>

    <!-- 应用到的mapper.xml全路径 -->
    <mapper resource="userMapper.xml"></mapper>
    <mapper resource="orderMapper.xml"></mapper>

</configuration>
```

3、我们以用户表为例子，建立用户sql配置userMapper.xml

```xml
<mapper namespace="com.panshenlian.dao.IUserDao">

    <!-- sql的唯一标识：namespace.id 来组成：statementId -->
    <select id="findAll"
            resultType="com.panshenlian.pojo.User">
        select * from user
    </select>

    <!--
        User user = new User();
        user.setId(1);
        user.setUsername("panshenlian");
    -->
    <select id="findByCondition"
            resultType="com.panshenlian.pojo.User"
            parameterType="com.panshenlian.pojo.User">
        select * from user
        where id= #{id} and username = #{username}
        and password= #{password} and birthday = #{birthday}
    </select>


</mapper>
```

4、用户dao接口

```java
package com.panshenlian.dao;

import com.panshenlian.pojo.User;

import java.util.List;

/**
 * @Author: panshenlian
 * @Description:
 * @Date: Create in 21:35 2020/11/12
 */
public interface IUserDao {

    /**
     * 查询所有用户
     * @return
     * @throws Exception
     */
    public List<User> findAll() throws Exception;

    /**
     * 根据条件进行用户查询
     * @return
     * @throws Exception
     */
    public User findByCondition(User user) throws Exception;

}

```

5、用户dao的实体类

```java
package com.panshenlian.pojo;

/**
 * @Author: panshenlian
 * @Description: 用户实体
 * @Date: Create in 9:20 2020/11/12
 */
public class User {

    private Integer id;
    private String username;
    private String password;
    private String birthday;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", birthday='" + birthday + '\'' +
                '}';
    }
}

```

注意：用户sql配置文件userMapper.xml中的namespace需要和用户dao的全限定名一致，这是我们框架默认规则：namespace="com.panshenlian.dao.IUserDao" 同时select标签的id和用户dao接口的方法名保持一致，也是框架默认的规则，例如id="findAll"

6、最终我们创建测试类：MyPersistenceTest

```java
package com.panshenlian.test;

import com.panshenlian.dao.IUserDao;
import com.panshenlian.io.Resource;
import com.panshenlian.pojo.User;
import com.panshenlian.sqlSession.SqlSession;
import com.panshenlian.sqlSession.SqlSessionFactory;
import com.panshenlian.sqlSession.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.InputStream;
import java.util.List;

/**
 * @Author: panshenlian
 * @Description: 持久层框架测试类
 * @Date: Create in 9:24 2020/11/12
 */
public class MyPersistenceTest {

    @Test
    public void test() throws Exception {
        InputStream resourceAsStream =
                Resource.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory =
                new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();

        // 一、传统DAO方式调用
        User user = new User();
        user.setId(3);
        user.setUsername("panshenlian");
        user.setBirthday("2020-11-12");
        user.setPassword("123456");
        User dbUser = sqlSession.selectOne("com.panshenlian.dao.IUserDao.findByCondition",user);
        System.out.println(dbUser);
        List<User> userList = sqlSession.selectList("com.panshenlian.dao.IUserDao.findAll", user);
        for (User db : userList) {
            System.out.println(db);
        }

        // 二、代理模式调用
        IUserDao userDao = sqlSession.getMapper(IUserDao.class);
        List<User> users = userDao.findAll();
        for (User db : users) {
            System.out.println("代理调用=" + db);
        }

    }
}

```

7、运行测试类，结果符合预期

![运行测试类](https://www.panshenlian.com/images/post/00_old_article_images/1_jdbc_idea_8.jpg)



框架和测试验证我们基本完成，其实以上主要是对于持久层框架的一个简单框架介绍，方面我们以后学习分析Mybatis框架，基本我们做到了一个模拟雏形，流程大致是这样。

同时框架和测试工程的源码都已上传，传送门：[点击看看](https://gitee.com/senlypan/notes/tree/master/01%E7%AC%AC1%E9%98%B6%E6%AE%B5--%E6%A8%A1%E5%9D%97%E4%B8%80--%E6%8C%81%E4%B9%85%E5%B1%82%E6%A1%86%E6%9E%B6%E8%AE%BE%E8%AE%A1%E5%AE%9E%E7%8E%B0%E5%8F%8AMyBatis%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/02%E7%BB%83%E4%B9%A0%E9%A1%B9%E7%9B%AE)



> 编码实现过程中涉及到几个有意思的知识点，我们后续找时间聊聊，包括：
>
> - 内省机制
> - 反射机制
> - JDK动态代理
> - 设计模式
> - 泛型
>




## 总结



如今大型项目一般都不会直接使用JDBC，要么采用市面上成熟的持久层方案，要么自研持久层框架，说到底，还是单纯的JDBC无法保证高效高稳定性能的数据层访问与应用，而越来越多持久层框架方案，不仅消除了大量的JDBC冗余代码，还提供极低的学习曲线，既能保证协同传统的数据库还接受SQL语句，也为其他框架提供了拓展集成支持，包括连接池、缓存、性能等都做了极大的优化与提升，所以框架大行其道是必然趋势。



JDBC在90年代诞生之初也是高光而伟大，只不过随着技术水平的跃迁和业务场景的迭代更新，旧技术满足不了现有的诉求，所有事物都会轮换更新，我们仅仅是站在伟人的肩膀上，顺势变迁。



> 好，本篇完，晚安。



下一篇，我们或许会聊聊 **Mybatis基础和架构** 。