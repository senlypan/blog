---
title: Mybatis系列全解（七）：全息视角看Dao层两种实现方式之传统与代理
date: 2021-01-25 08:20:00
tags:
- Mybatis
---



> 封面：洛小汐
>
> 作者：潘深练




![](https://pic2.zhimg.com/v2-7eec74a18a3d77f5008c04f97b283910_r.jpg)



![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/slogan_start.png)

一直以来

他们都说为了生活

便追求所谓成功

顶级薪水、名牌包包

还有学区房

·

不过

总有人丢了生活

仍一无所获

·

我比较随遇而安

有些事懒得明白

平日里问心无愧

感兴趣的事能一直做

便很知足

·

难道不是

除了活着

其他都只是锦上添花吗

![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/slogan_end.png)



#### 前言

上节我们介绍了 《 **Mybatis系列全解（六）：Mybatis最硬核的API你知道几个？** 》一文，详细解读了 Mybatis 框架核心设计和 API ，图文并茂，干货满满，感兴趣的朋友可以往下翻目录找到文章的链接传送门进行阅读，文章发布之后被很多网站推荐阅读，以致于持续至今依然会收到读者朋友们的点赞评论关注、还有催更，阅读量日日攀升，当然我甚是开心，一来是两周梳理的成果能得到认同，二来也是发觉坚持做自己喜欢的事还能给大家带来一些知识体验，总之很欣慰。回到本篇文章计划讲解内容，我们还是继续沿用以往的文章风格，对 Mybatis 框架在实际开发应用过程中，Dao 层的实现原理和方式进行解读，开篇也简单从 Mybatis 执行 SQL 语句的流程切入，引出我们研究的内容，再与大家一同以全息视角知其然并知其所以然，下面我们一起探索吧。



![](https://gitee.com/senlypan/notes/raw/master/images/emoji/learning.png)



**号外： 我们的 Mybatis 全解系列一直在更新哦**



![Mybatis 全解系列脑图全览](https://img-blog.csdnimg.cn/20201229155652461.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01yUmlnaHRfc2VubHlwYW4=,size_16,color_FFFFFF,t_70#pic_center)



#### Mybaits系列全解 ( 传送门 )

***

- [Mybatis系列全解（一）：手写一套持久层框架]()
- [Mybatis系列全解（二）：Mybatis简介与环境搭建]()
- [Mybatis系列全解（三）：Mybatis简单CRUD使用介绍]()
- [Mybatis系列全解（四）：全网最全！Mybatis配置文件XML全貌详解]()
- [Mybatis系列全解（五）：全网最全！详解Mybatis的Mapper映射文件]()
- [Mybatis系列全解（六）：Mybatis最硬核的API你知道几个？]()
- [Mybatis系列全解（七）：全息视角看Dao层两种实现方式]()
- Mybatis系列全解（八）：Mybatis的动态SQL
- Mybatis系列全解（九）：Mybatis的复杂映射
- Mybatis系列全解（十）：Mybatis注解开发
- Mybatis系列全解（十一）：Mybatis缓存全解
- Mybatis系列全解（十二）：Mybatis插件开发
- Mybatis系列全解（十三）：Mybatis代码生成器
- Mybatis系列全解（十四）：Spring集成Mybatis
- Mybatis系列全解（十五）：SpringBoot集成Mybatis
- Mybatis系列全解（十六）：Mybatis源码剖析



#### 本文目录

***

**1、Mybatis 是如何找到 SQL 语句的 ？**

**2、为什么有 Dao 层 ？**

**3、Dao 层的两种实现方式：传统与代理**





![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/01.png)
##### 1、Mybatis 是如何找到 SQL 语句的  ？
通过前面的学习，我们已经对 Mybatis 的架构设计以及核心数据层执行流程都非常了解，其实对于我们应用层的研发用户来说，使用 Mybatis 框架的目的很简单，就是希望通过它来消除原有 JDBC 的冗余代码逻辑、减轻我们开发工作量、提升研发效率、以便于我们能够专注于 SQL 的编写。所以说到底，是我们写 SQL，Mybatis 帮我们执行 SQL ，跟数据库做交互，更简单来说，我们和 Mybatis 的配合就5步：

**1、我们编写 SQL**

**2、发号施令**(调用API)

**3、Mybatis 找 SQL**

**4、Mybatis 执行 SQL**

**5、返回执行结果**






![](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/executeSQL.png)



看吧，Mybatis 实实在在是数据库交互的好帮手呢，乖巧又高效，我们只需编写好 SQL ，在程序应用中就可以随处发号施令（调用API），让 Mybatis 帮我们具体执行 SQL。但其实我们知道 Mybatis 默默做了许多事情，我们前面也都详细剖析过的：

**例如第1步编写 SQL**，其实 Mybatis 就要求我们必须提前完成信息配置 Config.xml 与 映射文件 Mapper.xml （后面注解道理相同）再开始编写 SQL；

**例如第2步发号施令**，其实就是我们实际应用当中调用增删改查接口（ 好比sqlsession.selectList ）；

**例如第4步执行 SQL**，其实就是会话调用执行器，执行器调用语句处理器，语句处理器结合参数处理器与类型处理器最终底层通过 JDBC 与数据库交互；

**例如第5步返回执行结果**，是 JDBC 返回的结果集并映射封装，最终返回预期的封装对象。



细心的你可能会发现，我们第3步没说到，那第3步是做什么的呢：**Mybatis 找 SQL** 。





![](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/findSQL.png)



到此，开始我们本小结的研究主题：



>  Mybatis 是如何找到 SQL 语句的？



针对这个问题，我们首先细细回想，平日里我们的 SQL 语句都编写在哪些地方呢？嗯 ~ 不出意外的话，我相信大家脑海里都会浮现两个地方：**一个是 XML 配置文件，另一个是 Java 注解**。

没错！假如使用 XML 配置方式则在 UserMapper.xml 配置文件中编写 SQL 语句：



```xml
<mapper namespace="com.panshenlian.dao.UserDao">

    <!-- 查询用户列表 -->
    <select id="findAll" resultType="com.panshenlian.pojo.User" >
        select * from User 
    </select>
    
</mapper>
```



使用 XML 配置方式编写 SQL，会把 XML 中的「 命名空间标识 + 语句块 ID 」作为唯一的语句标识，这里的唯一语句标识为：



>  **com.panshenlian.dao.UserDao.findAll**



假如使用 Java 注解方式则在 UserDao 接口中编写 SQL 语句：



```java
public class UserDao {
    
    /**
     * 查询用户列表 
     * @return
     */
    @Select(value ="  select * from User  ")
    List<User> findAll();
    
}
```



使用 Java 注解方式编写 SQL，会把接口中的「 接口全限定名 + 方法名 」作为唯一的语句标识，这里的唯一语句标识也是一样：



> **com.panshenlian.dao.UserDao.findAll**



其实，我们的 Mybatis 是支持使用 XML 配置方式和 Java 注解两种方式来编写 SQL 语句的，两者没有绝对的孰优孰劣，每个项目团队都可以根据自身研发人员编码习惯/能力、工程的耦合性要求、研发效能性价比等多方面综合考虑之后去做选择。毕竟无论我们使用哪种方式，目的都只是为了把实际需要执行的 SQL 准备好，供 Mybatis 跟数据库交互时使用。



![SQL语句集合池](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/mappedstatement.png)



是这样的，Mybatis 在启动构建之初，会扫描我们编写的 SQL 文件。假如你使用 XML 配置方式编写 SQL，那么需要在 Config.xml 核心配置文件中指定映射器文件 mapper.xml （**下面代码演示第一种**）；如果你使用 Java 注解方式编写 SQL ，那么需要在 Config.xml 核心配置文件中也指定加载使用了注解的Mapper接口（**下面代码演示第二种**）。



```xml
<!-- 第一种：XML配置方式：指定映射器文件 -->
<mappers>
    <mapper resource="UserMapper.xml" />
</mappers>

<!-- 第二种：Java注解方式：指定映射器接口 -->
<mappers> 
    <mapper class="com.panshenlian.dao.UserDao"/>  
</mappers>
```



同样无论你使用哪一种方式告诉 Mybatis 来扫描/构建，最终都会被统一加载到一个 SQL 语句集合的大池子里面，它是一个 Map 集合，以我们上面说的 **唯一语句标识** 作为集合的 key，以每一条 SQL 语句对象作为 value ，并且最终这个 SQL 语句 Map 集合的大池子，会作为一个属性设置在全局配置 Configuration 上面，供我们 Mybatis 在整个应用周期里头随时使用。



> 看看，每一个 SQL 语句都实例成一个 MappedStatement 语句对象，并且这个 SQL 语句 Map 集合的大池子，会作为全局配置 Configuration 的属性 mappedStatements 。



```java
// Mybatis 全局配置对象
public class Configuration{
    
    // 存储SQL语句的集合池 
    Map<String, MappedStatement> mappedStatements 
        = new StrictMap<MappedStatement>
}
```



基本简单的 SQL 语句解析过程：



![SQL语句兑现解析过程](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/mappedstatement_process.png)



到这里，我相信有部分好奇的朋友还是想知道，那 Mybatis 是如何把我们编写的每一条 SQL 语句加载到语句集合大池子的呢？又是怎么保证每条语句在集合大池子中的 Key 值（唯一语句标识）是唯一不会重复的呢？



![好奇的小脑袋](http://gitee.com/senlypan/notes/raw/master/images/emoji/questionNEW.png)



嗯，我们抱着好奇的小脑袋，对这两个疑问进行探索：

**1、Mybatis 是如何把我们编写的每一条 SQL 语句加载到语句集合大池子的呢？**



首先，我们看看 Mybatis 在初始构建会话时，会通过加载核心配置文件，获得会话工厂对象：

 

```java
//加载核心配置文件
InputStream is = 
    Resources.getResourceAsStream("SqlMapConfig.xml");

// 获得sqlSession工厂对象
SqlSessionFactory f = 
    new SqlSessionFactoryBuilder().build(is);

```



我们跟踪了源代码，发现会话工厂构建器 SqlSessionFactoryBuilder 的build() 逻辑中，在实现会话工厂实例构建的同时，会解析配置文件并封装成全局配置对象 Configuration 和语句对象集合 MappedStatement 。



![Mybatis的SQL语句是怎么构建成对象的](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/sql_process.png)



用殊途同归，来形容 XML 配置方式和 Java 注解方式编写 SQL 并构建语句集合的过程再好不过了。



**2、Mybatis 是怎么保证每条语句在集合大池子中的 Key 值（唯一语句标识）是唯一不会重复的呢？？**



根据第1个问题的分析结果，我们知道 SQL 语句最终会被存放在语句集合中，那这个语句集合是普通 Map 吗？显示不是，这个集合实例其实是 Mybatis 框架在 Configuration 全局配置对象中的一个静态的匿名内部类 StrictMap，它继承 HashMap ，重写了 put() 方法，在 put() 中实现对 Key 值（唯一语句标识）的重复校验。



```java
// 全局配置
public class Configuration {
    
    // 静态匿名内部类
    protected static class 
        StrictMap<V> extends HashMap<String, V> {
        
        // 重写了put方法
        @Override 
    	public V put(String key, V value) {
            
          // 如果出现重复key则抛出异常
          if (containsKey(key)) {
            throw 重复异常;
          } 
    	} 
    }
}
    
```



所以，无论是使用 XML 配置方式还是 Java 注解方式，都必须保证每条 SQL 语句有一个 **唯一的语句标识**，否则在 Mybatis 启动构建阶段，就会收到来自 Mybatis 的解析异常，例如我在 UserMapper.xml 中设置两个 findAll 语句。



```xml
<select id="findAll">
    select 1 from User
</select>

<select id="findAll">
    select * from User
</select>
```



不出意外，出现 Mybatis 解析 SQL 的异常警告：



```java
// 异常定位很准确 --> 解析 mapper sql 时
### org.apache.ibatis.builder.BuilderException: Error parsing SQL Mapper Configuration.

// 哪个 mapper 文件呢 -->  UserMapper.xml
### Cause: org.apache.ibatis.builder.BuilderException: Error parsing Mapper XML. The XML location is 'UserMapper.xml'

// 哪个 id 重复了呢 --> findAll
### Cause: java.lang.IllegalArgumentException: Mapped Statements collection already contains value for com.panshenlian.dao.IUserDao.findAll. please check UserMapper.xml and UserMapper.xml
```



好，到这里我们基本清晰，SQL 怎么存，并且怎么不重复的存，而且存在哪？那剩下的就很简单，对于一个 Map 集合的取值，我相信大家都知道，无非就是通过 key 来取到存储的 value 值。而 Mybatis 中这个语句集合的取值方式也是一样通过 key 值来去，这个 key 呢，我们这里是每一条语句的 **唯一语句标识** ，当我们调用会话 SqlSession 的增删改查 API 的时候，就会传递这个唯一语句标识，告诉 Mybatis ：“ 帮我们把这个 key 对应的语句对象的 SQL 执行一下吧 “ ，仅此而已。



![先卖个关子](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/saleGZ.png)



只不过，这里面当我们应用层的用户调用增删改查 API 的时候，我们到底是 **如何把 Key 值告知给 Mybatis 呢？**是 **直接** 告诉 Mybatis 呢？还是委婉的（**通过代理方式**）告诉 Mybatis 。





![代理方式](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/proxy.png)





这个就比较有意思了，也是我们第3部分主题要讲解的内容，我们下面会细说，先看第2部分主题吧~



![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/02.png)
##### 2、为什么有 Dao 层 ？
在软件开发中，为了方便应用程序的研发与维护，一般我们都会使用清晰合理的框架模式来规范开发行为，提高同模块内聚性，减低异模块耦合性，例如 MVC、MVP、MVVM 等，而其中 **MVC（Model-View-Controller）** 则是 Java 语言中应用最广泛的分层框架模式。



![MVC框架模式](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/mvc.png)



对于 MVC 分层模式，其实最早的设计来源于桌面应用程序，一般 M 代表业务模型 Model，V 代表视图界面 view，C 代表控制器 Controller ，一般的：

**View （视图层）：**视图层直接面向用户/终端，提供给用户/终端的指令输入或界面操作请求。

**Controller （控制层）：**控制层负责接收 “视图层” 的指令或操作请求，并转移分派至 “模型层”，接收到 “模型层” 的返回结果之后，会同步传送回 “视图层”，达到控制/纽带的作用。

**Model （模型层）：**模型层是核心的数据信息处理层，分为业务逻辑处理与数据持久化处理，模型层接收来自 “控制层” 的请求，并通过逻辑运算与数据转换，再把处理结果返回到 “控制层”。



![MVC框架模式模型/视图转移过程](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/mvc2.png)



从程序编码角度看，我们使用 MVC 的主要目的就是将 M 层与 V 层的实现代码分离，方便代码分层设计与维护；从结果形态角度分析，其实 M 层与 V 层可以理解为相同信息（或物质）的不同表现形态，类比水与冰、或水与气（可能不恰当，But 我确实理解为信息/物质形态转移），而 C 层的存在目的就是为了连接转移 M 层与 V 层，保证 M 层与 V 层的同步/更新。



>  那有好奇的朋友就想知道，上面这介绍的 MVC 框架模式，跟我们 Dao 层有什么关系呢？



![必须有关系](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/kenan.jpg)



**那必须有关系！**

我们知道在 MVC 框架模式中，模型层 Model 是核心的数据信息处理层，包括业务逻辑处理与数据持久化处理，其中业务逻辑处理我们划为 Service 模块，负责具体业务需求对应的运算逻辑；数据持久化处理我们划为 **Dao** 模块（全称 Data Access Object ，即数据访问对象），负责与数据库交互，连接 Service 模块与数据库。所以只要是跟数据库打交道，我们的 Dao 层就必不可少！



![Dao](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/Dao.png)



到这里，我相信很多朋友会联想到，Dao 模块是负责数据持久化处理 ，而我们的 **Mybatis** 不就是一个持久层框架吗？没错，所以跟数据库打交道的活，Mybatis 框架绝对是能全权负责，所以当我们的项目应用集成 Mybatis 框架之后， Mybatis 的增删改查等 API 就基本在 Dao 模块中使用，并且接口调用与代码实现也是极为简单便捷。

第3部分，我们讲讲本文的关键主题 **” Dao 层的两种实现方式：传统与代理 “。**





![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/03.png)
##### 3、Dao 层的两种实现方式：传统与代理
有了前面两点作为基础，我们的第三个主题《 Dao 层的两种实现方式：传统与代理 》的内容讲解会让大家很容易接受，因为我们在第一部分主题中花大篇幅阐明 Mybatis 是如何找到 SQL 语句的，让大家对于 SQL 语句的寻找有了全面的了解，所以我在此处先提前跟大家剧透：Dao 层的两种实现方式：传统与代理 ，可以粗糙的理解为他两仅仅在SQL 语句的 **寻找方式** 和 **执行对象** 上存在区别而已。



![Dao层两种实现方式](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/dao_execute.png)



我们先简单看看我们一般的工程目录结构简例（掐头去尾只留下基本的 MVC 目录骨架）。



![packages](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/project_packages.png)



一般 Dao 层 **传统上** 的代码实现方式：



**1、编写UserDao接口**



```java
public interface UserDao { 
    List<User> findAll() ; 
}
```



**2、编写UserDaoImpl实现**



```java
public class UserDaoImpl implements UserDao { 
    
    @Override
    public List<User> findAll() { 
        
        //加载核心配置文件
        InputStream is = Resources.getResourceAsStream("config.xml");

        // 获得sqlSession工厂对象
        SqlSessionFactory fy = new SqlSessionFactoryBuilder().build(is);

        //获得sqlSession对象
        SqlSession sqlSession = fy.openSession();

        // 执行sql语句
        List<User> userList = sqlSession.selectList("dao.UserDao.findAll");
        
        return userList;
       
    }
}
```



**3、编写 UserMapper.xml**



```xml
<mapper namespace="dao.UserDao">

    <select id="findAll">
        select * from User
    </select>

</mapper>
```



**4、Dao 层调用** （通过应用程序的 Service 层调用或者直接使用 Junit 框架进行测试）



```java
// Service 服务层调用 
// 或
// Junit 测试框架测试

@Test 
public void tesDaoMethod(){
    UserDao userDao = new UserDaoImpl(); 
	List<User> userList = userDao.findAll();
    System.out.println(userList);
}
```



以上调用结果可以获取到所有 User 记录，这种通过在 Dao层定义接口、并创建 Dao 层接口实现类的方式，我们一般称之为 **Dao 层的传统实现方式**，此方式会构建一个接口实现类去作为 Dao 层的执行对象，并且对于 SQL 语句的找寻方式特别简单直接，**直接指定唯一语句标识，Java 文件中存在硬编码**, 例如本示例中的 SQL 语句唯一标识为： dao.UserDao.findAll。

 ![dao1](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/dao1.png)



介绍完传统的开发实现方式，我们说说 Dao 层的代理开发实现方式吧，首先 Dao 层的代理开发方式有什么特别呢？



>  首先代理开发实现方式只需我们编写 Dao 接口而不需要编写实现类。



那么既然不用编写实现类，是不是会有一些其它方面的约束呢？

那是当然了，这种代理开发实现方式，要求我们的接口与配置文件 Mapper.xml 需要遵循一些规范：

**1) Mapper.xml 文件中的 namespace 与 mapper 接口的全限定名相同**
**2) Mapper 接口方法名和 Mapper.xml 中定义的每个 statement 的 id 相同**
**3) Mapper 接口方法的输入参数类型和 mapper.xml 中定义的每个 sql 的 parameterType 的类型相同**
**4) Mapper 接口方法的输出参数类型和 mapper.xml 中定义的每个 sql 的 resultType 的类型相同**



![dao1](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/dao2.png)



由于代理开发实现方式与 Mapper 配置紧密关联，故此我们也称之为 Mapper 接口开发方法，之所以不需要编写实现类的原因是其底层创建了 Dao 接口的动态代理对象，代理对象本身会构建有 Dao 接口的方法体， Dao 层 **代理实现方式** 的代码实现方式：



**1、编写UserDao接口**



```java
public interface UserDao { 
    User findOne( int userId ) ; 
}
```



**2、编写 UserMapper.xml**



```xml
<mapper namespace="dao.UserDao">
    <select id="findOne"  parameterType="int"  resultType="user">
    	select * from User where id =#{id}
    </select>
</mapper>
```



**3、Dao 层调用** （通过应用程序的 Service 层调用或者直接使用 Junit 框架进行测试）



```java
// Service 服务层调用 
// 或
// Junit 测试框架测试

@Test 
public void tesDaoMethod(){
    
    //加载核心配置文件
    InputStream is = Resources.getResourceAsStream("config.xml");

    // 获得sqlSession工厂对象
    SqlSessionFactory fy = new SqlSessionFactoryBuilder().build(is);

    //获得sqlSession对象
    SqlSession sqlSession = fy.openSession(); 

    //获得MyBatis框架生成的 UserMapper接口的代理类
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class); 
    
    //代理类执行SQL
    User user = userMapper.findById(1); 
    System.out.println(user); 
    sqlSession.close(); 
}
```



以上调用结果可以获取到了指定 ID 的 User 记录，此方式通过代理执行实际 SQL 语句，由于 Dao 接口与 Mapper.xml 配置已经约定好规范，所以不需要在调用接口时指定唯一语句标识，Java 文件中也不会存在硬编码问题。



到这里，就会有部分朋友疑惑？ sqlSession 会话通过 getMapper 获取接口代理类之后去调用接口方法，那到底实际执行接口方法的时候，Mybatis 的代理在代码逻辑上是怎么跟 mapper.xml 配置文件中的 SQL 语句对应匹配起来的呢？



![Dao 代理开发实现方式](https://gitee.com/senlypan/notes/raw/master/images/Mybatis/project07/proxy_interface_process.png)



上图黑色 ① ~ ⑥ ，是构建 Dao 代理对象的实际过程，基本就是生成代理对象的过程，其中 MapperProxy 代理类本身实现了 InvocationHandler 接口，所以符合一个代理类的要求，MapperProxy 代理实例最终是指派 MapperMethod 对象进行语句分发执行，包含增删改查等操作。

上图红色 ① ~ ③ ，是代理对象在执行实际接口时根据接口全限定名去 SQL 语句集合池查找 SQL 具体语句的过程。



```java
// 实际语句执行方法对象
public class MapperMethod{
    // 根据指令类型分配执行SQL
	public Object execute(SqlSession sqlSession, Object[] args) {
        switch (command.getType()) {
      		case INSERT: sqlSession.insert(接口语句ID); break;
      		case UPDATE: sqlSession.update(接口语句ID); break;
      		case DELETE: sqlSession.insert(接口语句ID); break;
      		case SELECT: sqlSession.select(接口语句ID); break;
        }
	}   
}
```



另外，本文关于代理的构建过程，建议大家看一下我的另外一个系列一文读懂系列中的一篇文章 **《一文读懂Java动态代理》**，就会对于 JDK 的动态代理有一个深刻的理解。（在我个人中心文章列表中查找吧~）

 

![一文读懂Java动态代理](https://gitee.com/senlypan/notes/raw/master/images/oneKnow/01/java_proxy_cover.jpg)






![](https://gitee.com/senlypan/notes/raw/master/images/sourceMaterial/04.png)
#### 总结
本篇文章主要围绕 Dao 层的两种实现方式展开讨论，首先铺垫一些基础认识例如 Mybatis 是如何找到 SQL 语句的、以及为什么有 Dao 层，然后我们集合代码实现了解了传统开发方式与代理开发方式实现 Dao 层的区别，无非就是传统方式是通过实现接口构建实现类，而代理模式是通过会话创建代理对象，不过他们只是执行对象不同，其实最终执行 SQL 语句还是需要从 SQL 语句集合池中匹配查找，并最终还是通过 SqlSession 去执行增删改查。






>本篇完，本系列下一篇我们讲《 **Mybatis系列全解（八）：Mybatis的动态SQL** 》。



![](https://gitee.com/senlypan/notes/raw/master/images/emoji/next.png)





![](D:\learn\lagou\notes\01-M1-Mybatis\01笔记\Mybatis\article_the_end.png)




> 文章持续更新，微信搜索「**潘潘和他的朋友们**」第一时间阅读，随时有惊喜。本文会在 **GitHub** [https://github.com/JavaWorld](https://github.com/senlypan/JavaWorld) 收录，关于热腾腾的技术、框架、面经、解决方案、摸鱼技巧、教程、视频、漫画等等等等，我们都会以最美的姿势第一时间送达，欢迎 Star ~ 我们未来 **不止文章**！想进读者群的朋友欢迎撩我个人号：panshenlian，备注「**加群**」我们群里畅聊， **BIU ~** 






![](https://gitee.com/senlypan/notes/raw/master/images/emoji/love.png) 







