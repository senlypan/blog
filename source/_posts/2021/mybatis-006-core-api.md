---
title: Mybatis系列全解（六）：Mybatis最硬核的API你知道几个？
date: 2021-01-11 08:20:00
tags:
- Mybatis
preview: https://www.panshenlian.com/images/post/java/mybatis/title/06-title.jpg
introduce: |
    上节我们介绍了《 Mybatis系列全解（五）：全网最全！详解Mybatis的Mapper映射文件 》，经此一文，我们基本能掌握 Mapper 映射器九大顶级元素的基本用法和其中技巧。在本节，我们开始深入，我挑选了 Mybatis 框架中几个比较硬核的 API ，跟大家一起探讨，夯实了这些 API ，有助于你学习理解整个 Mybatis 框架，特别是 Mybatis 核心的数据处理层，你绝对会形成一套清晰的脉络印记，总之，希望大家都能成为 Mybatis King ! 
---




![](https://www.panshenlian.com/images/post/java/mybatis/title/06-title.jpg)



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/slogan_start.png)

2020 年的大疫情，把世界撕成几片。

时至今日，依旧人心惶惶。

很庆幸，身处这安稳国，

兼得一份安稳工。

·

东家常讲的一个词：**深秋心态** 。

大势时，不跟风、起哄，

萧条时，不放弃播种和耕耘的信心，

热时不燥、冷时不弃，

这就是深秋心态。

·

大疫情，相信只是大自然的规律，

也恰是我们保持深秋心态的时候，

默默播种和耕耘吧，

今年，世界会慢慢复苏，希望都会来临。

![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/slogan_end.png)







<img src="https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/happy.png" alt="信心满满-朋友圈封面适用图" style="zoom:40%;" />



> 2021年要信心满满 ヾ(◍°∇°◍)ﾉﾞ 
>
> 定会收货满满 ~
>
> 上图保存可做朋友圈封面图 ~



#### 前言

上节我们介绍了 《 **Mybatis系列全解（五）：全网最全！详解Mybatis的Mapper映射文件** 》，经此一文，我们基本能掌握 Mapper 映射器九大顶级元素的基本用法和其中技巧。在本节，我们开始深入，我挑选了 Mybatis 框架中几个比较硬核的 API ，跟大家一起探讨，夯实了这些 API ，有助于你学习理解整个 Mybatis 框架，特别是 Mybatis 核心的数据处理层，你绝对会形成一套清晰的脉络印记，总之，希望大家都能成为 Mybatis King ! 



<img src="https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/king.png" alt="你揍是一个King" style="zoom:50%;" />



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

#### 本文目录

***

**1、Mybatis 架构与核心API**

**2、Configuration -- 全局配置对象**

**3、Resources -- 资源辅助类**

**4、SqlSessionFactoryBuilder -- 会话工厂构建器**

**5、SqlSessionFactory -- 会话工厂**

**6、SqlSession -- 会话**

**7、Executor -- 执行器**

**8、StatementHandler -- 语句处理器**

**9、ParamerHandler -- 参数处理器**

**10、ResultSetHandler -- 结果集处理器**

**11、TypeHandler -- 类型转换器**

**12、MappedStatement -- 语句对象**

**13、SqlSource -- SQL源**

**14、BoundSql -- SQL语句**





![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/01.png)

##### 1、Mybatis 架构与核心API

不出意外的话，在后续源码剖析相关文章中，我们会对 Mybatis 的源码进行一次大扫荡，一起挖掘每一处值得大家深入理解/记忆的知识点。而在本文中，我们主要先把 Mybatis 的架构/层次铺开，俯视 Mybatis 架构的设计全貌，再把几个硬核的 API 详细消化。

整体顺序脉络，希望让你有所期待 ~ 





<img src="https://www.panshenlian.com/images/post/00_old_article_images/emoji/huazhongdian2.png" alt="敲黑板" style="zoom:30%;" />





我们先简单揭开 Mybatis 神秘的源码包，

瞅瞅 Ta 大致目录结构 ：



![Mybatis神秘的源码包](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/package.png)



看，Mybatis 的源代码包整齐划一排在 org.apache.ibatis 目录下，基本设计用途我简单梳理成上面这张图，方便大家直观理解，当然只看源码包目录结构，难免会显得枯燥无物，所以我们再看一下，其实 Mybatis 的源码包功能上可以是这么划分：



![Mybatis三层架构图示抽象](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/mybatis01.jpg)



上图让我们对 Mybatis 的架构有了抽象的理解。

然而，实际上具体的职能分工，核心 API 的场景应用，到底会是怎样一套流程呈现呢？

看下面这幅功能架构设计，或许你能更好的理解。 



![Mybatis三层架构图示具象](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/mybatis02.jpg)



**根据 Mybatis 功能架构我们划分成三层**：

- **接口层**：该层提供一系列接口让用户直接参与使用，包含信息配置与实际数据操作调用。配置方式包括：基于 XML 配置方式、基于 Java API 配置方式两种方式，用户也可以通过接口层 API 对数据库发起增删改查等操作的请求， 本层接口会把接收到的调用请求交给数据处理层的构件去处理。

- **数据处理层**：该层是 Mybatis 的核心层，负责数据处理，主要包括SQL 参数映射解析、SQL 语句的实际执行、执行结果集的映射处理等。


- **框架支撑层**：该层属于 Mybatis 的后勤保障层，包括数据库连接管理、事务把控管理、配置加载与缓存处理、日志处理、异常处理等，提供基础支撑能力，保障上层的数据处理。



> 我们知道，Mybatis 框架让用户只需要提供配置信息，并且专注于 SQL 的编写即可，对于连接管理数据库/事务，或实际的 SQL 参数映射/语句执行/结果集映射等操作，作为用户都并不需要操心和参与。



但是，好奇的我们其实想知道，Mybatis 核心部分的数据处理在整体流程中，是如何支撑用户请求？同时各个构件之间交互，又是怎样流转呢？



<img src="https://www.panshenlian.com/images/post/00_old_article_images/emoji/questionNEW.png" alt="好奇的小脑袋" style="zoom:50%;" />



很巧，我这里有一张图，介绍了整体流程：



![Mybatis核心处理整体流程](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/mybatis03.jpg)



**根据以上框架流程图进行讲解**：

- **创建配置并调用API**：这一环节发生在应用程序端，是开发人员在实际应用程序中进行的两步操作，第一步创建核心配置文件 Configuration.xml 和映射文件 mapper.xml （通过注解方式也可创建以上两种配置），准备好基础配置和 SQL 语句之后；第二步就是直接调用 Mybatis 框架中的数据库操作接口。 
- **加载配置并初始化**：Mybatis 框架会根据应用程序端提供的核心配置文件与 SQL 映射文件的内容，使用资源辅助类 Resources 把配置文件读取成输入流，然后通过对应的解析器解析并封装到 Configuration 对象和 MappedStatement 对象，最终把对象存储在内存之中。
- **创建会话并接收请求**：在 Mybatis 框架加载配置并初始化配置对象之后，会话工厂构建器 SqlSessionFactoryBuilder 同时创建会话工厂 SqlSessionFactory，会话工厂会根据应用程序端的请求，创建会话 SqlSession，以便应用程序端进行数据库交互。
- **处理请求**：SqlSession 接收到请求之后，实际上并没有进行处理，而是把请求转发给执行器 Executor，执行器再分派到语句处理器 StatementHandler ，语句处理器会结合参数处理器 ParameterHandler ，进行数据库操作（底层封装了 JDBC Statement 操作）。
- **返回处理结果**：每个语句处理器 StatementHandler 处理完成数据库操作之后，会协同 ResultSetHandler 以及类型处理器 TypeHandler ，对底层 JDBC 返回的结果集进行映射封装，最终返回封装对象。



针对以上总体框架流程涉及到的这些硬核 API，下面我们逐个展开介绍，但不会详细剖析源码与原理，包括构建细节，因为这些我们在后续的源码剖析章节中都会详细分析。



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/02.png)

##### 2、Configuration -- 全局配置对象

对于 Mybatis 的全局配置对象 Configuration，我相信无论是初学者还是资深玩家，都不会陌生。整个 Mybatis 的宇宙，都围绕着 Configuration 转。Configuration 对象的结构和 config.xml 配置文件的内容几乎相同，涵盖了properties (属性)，settings (设置)，typeAliases (类型别名)，typeHandlers (类型处理器)，objectFactory (对象工厂)，mappers (映射器)等等，之前我们有专门的一篇文章详细进行介绍，感兴趣的朋友往上翻到目录列表，找到 **《Mybatis系列全解（四）：全网最全！Mybatis配置文件XML全貌详解》** 一文详细品味一番吧。



![Configuration配置的9大顶级元素](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/configuration.jpg)



配置对象 Configuration 通过解析器 XMLConfigBuilder 进行解析，把全局配置文件 Config.xml 与 映射器配置文件 Mapper.xml 中的配置信息全部构建成完整的 Configuration 对象，后续我们源码分析时详细剖析整个过程。

![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/03.png)

##### 3、Resources -- 资源辅助类

我们知道，像 Configuration 和 Mapper 的配置信息存放在 XML 文件中，Mybatis 框架在构建配置对象时，必须先把 XML 文件信息加载成流，再做后续的解析封装，而 Resources 作为资源的辅助类，恰恰干的就是这个活，无论是通过加载本地资源或是加载远程资源，最终都会通过 **类加载器** 访问资源文件并输出文件流。

![Resources加载配置文件过程](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/resources_process.png)



```java

//加载核心配置文件
InputStream resourceAsStream = 
    Resources.getResourceAsStream("Config.xml");

```



Resources 实实在在提供了一系列方法分分钟解决你的文件读取加载问题：



![Resources类方法](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/resources.png)



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/04.png)

##### 4、SqlSessionFactoryBuilder -- 会话工厂构建器

我们一撞见 xxxBuilder ，就大致能知道它是某类对象的构建器，这里 SqlSessionFactoryBuilder  也是一样，它是 Mybatis 中的一个会话工厂构建器，在资源辅助类 Resources 读取到文件流信息之后，它负责解析文件流信息并构建会话工厂 SqlSessionFactory。（解析的配置文件包含：全局配置 Configuration 与映射器 Mapper）



![SqlSessionFactoryBuilder构建会话工厂](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/sqlSessionFactoryBuilder_process.png)

在程序应用端，我们一般使用 SqlSessionFactoryBuilder 直接构建会话工厂：



```java

// 获得sqlSession工厂对象
SqlSessionFactory sqlSessionFactory = 
    new SqlSessionFactoryBuilder().build(resourceAsStream);

```



> 当然，如果你集成了 Spring 框架的项目，则不需要自己手工去构建会话工厂，直接在 Spring 配置文件中指定即可，例如指定一个 bean 对象，id 是 sqlSessionFactory，而 class 类指定为 org.mybatis.spring.SqlSessionFactoryBean 。



SqlSessionFactoryBuilder  内部通过解析器 XMLConfigBuilder 解析了文件流，同时封装成为配置对象 Configuration ，再把 Configuration 对象进行传递并构建实例。



```java

public SqlSessionFactory build(
    InputStream inputStream, 
    String environment, 
    Properties properties) {
     
      // 配置解析器解析
      XMLConfigBuilder parser = 
          new XMLConfigBuilder(
          	inputStream,environment, properties);
    
      // 最终实例会话工厂
      return build(parser.parse()); 
    
}

```



最终实例会话工厂，其实 Mybatis 默认实现是 new 了一个DefaultSqlSessionFactory 实例。



```java

// 最终实例会话工厂
public SqlSessionFactory build(Configuration config) {
    return new DefaultSqlSessionFactory(config);
}

```



会话工厂构建器 SqlSessionFactoryBuilder 应用了构建者模式，主要目的就是为了构建 SqlSessionFactory 对象，以便后续生产 SqlSession 对象，这个构造器基本上算是 Mybatis 框架的入口构建器，它提供了一系列多态方法 build()，支持用户使用 XML 配置文件或 Java API （Properties）来构建会话工厂 SqlSessionFactory 实例。



<img src="https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/SqlSessionFactoryBuilder.jpg" alt="会话构建基础流程" style="zoom:50%;" />



>  SqlSessionFactoryBuilder 的一生只为成就 SqlSessionFactory，当 SqlSessionFactory 一经实例，SqlSessionFactoryBuilder  使命完成，便可消亡，便可被丢弃。 



![SqlSessionFactoryBuilder最佳作用域呈现](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/SqlSessionFactoryBuilder_method.png)



因此 SqlSessionFactoryBuilder 实例的最佳作用域是 **方法作用域**（也就是局部方法变量）。 你可以重用 SqlSessionFactoryBuilder 来创建多个 SqlSessionFactory 实例，但最好不要一直保留着它，以保证所有的 XML 解析资源可以被释放给更重要的事情。



SqlSessionFactoryBuilder 中灵活构建会话工厂的一系列接口：



![SqlSessionFactoryBuilder接口全览](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/SqlSessionFactoryBuilder.png)





![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/05.png)

##### 5、SqlSessionFactory -- 会话工厂

会话工厂 SqlSessionFactory 是一个接口，作用是生产数据库会话对象 SqlSession ，有两个实现类：

- **DefaultSqlSessionFactory **（默认实现）
- **SqlSessionManager **（仅多实现了一个 Sqlsession 接口，已弃用）

在介绍会话工厂构建器 SqlSessionFactoryBuilder 的时候，我们了解到构建器默认创建了  DefaultSqlSessionFactory 实例，并且会话工厂本身会绑定一个重要的属性 Configuration 对象，在生产会话时，最终也会把 Configuration 配置对象传递并设置到会话 SqlSession 上。



![SqlSessionFactory生产会话](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/sqlSessionFactory_process.png)



会话工厂可以简单创建 SqlSession 实例：



```java

// 创建 SqlSession 实例
SqlSession session = sqlSessionFactory.openSession();

```



会话工厂创建 SqlSession 时，会绑定数据源、事务处理、执行器等等，默认会话工厂实现类 DefaultSqlSessionFactory 在创建会话对象时，最终都会调用 openSessionFromDataSource 方法 ，即是如此实现：



```java

// 每一个 openSession 最终都会调用此处
private SqlSession openSessionFromDataSource(
    ExecutorType execType, 
    TransactionIsolationLevel level, 
    boolean autoCommit) {
    
    // 环境配置
    final Environment environment = 
        configuration.getEnvironment();
    
    // 事务工厂
    final TransactionFactory transactionFactory = 
        getTransactionFactoryFromEnvironment(environment);
    
    // 事务
    Transaction tx =
        transactionFactory.newTransaction(
        environment.getDataSource(), 
        level, 
        autoCommit);
    
    // 执行器
    final Executor executor = 
        configuration.newExecutor(tx, execType);
    
    // 最终生成会话
    return new DefaultSqlSession(
          configuration, executor, autoCommit);
    
  }

```



另外，会话工厂其实提供了一系列接口来灵活生产会话 SqlSession，你可以指定：

- **事务处理**：你希望在 session 作用域中使用/开启事务作用域（也就是不自动提交事务），还是使用自动提交（auto-commit），sqlSession 默认不提交事务，对于增删改操作时需要手动提交事务。
- **数据库连接**：你希望 MyBatis 帮你从已配置的数据源获取连接，还是使用自己提供的连接，可以动态创建数据源对象 Connection。
- **执行器类型**：你希望指定某类执行器来创建/执行/预处理语句，可以有普通执行器（SimpleExecutor），或复用执行器（ReuserExecutor）、还是批量执行器（BatchExecutor）等，下面介绍执行器时会详细说明。
- **事务隔离级别支持**：支持 JDBC 的五个隔离级别（NONE、READ_UNCOMMITTED、READ_COMMITTED、REPEATABLE_READ 和 SERIALIZABLE），对于事务相关的内容，我们后续 **《spring 系列全解》** 会详细讲，这里简单说明一下就是事务隔离级别主要为了解决例如脏读、不可重复读、幻读等问题，使用不同的事务隔离级别势必会导致不同的数据库执行效率，因此我们再不同的系统/功能中，对隔离级别有不同的需求。



![SqlSessionFactory接口全览](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/sqlSessionFactory_method.png)





**SqlSessionFactory** 一旦被创建就应该在 **应用的运行期间** 一直存在，没有任何理由丢弃它或重新创建另一个实例。 使用 SqlSessionFactory 的最佳实践是在应用运行期间不要重复创建多次，多次重建 SqlSessionFactory 被视为一种代码“坏习惯”。因此 SqlSessionFactory 的最佳作用域是 **应用作用域**。 最简单的就是使用单例模式或者静态单例模式。



>  请记住，创建 SqlSessionFactory ，一次就好！



<img src="https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/onetime.jpg" alt="一次就好" style="zoom:70%;" />





每个数据库对应一个 SqlSessionFactory 实例。SqlSessionFactory 一旦被创建， **它的生命周期应该与应用的生命周期相同** 。所以，如果你想连接两个数据库，就需要创建两个 SqlSessionFactory 实例，每个数据库对应一个；而如果是三个数据库，就需要三个实例，依此类推。



![SqlSessionFactory最佳作用域呈现](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/SqlSessionFactory_app.png)



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/06.png)

##### 6、SqlSession -- 会话

SqlSession 是一个接口，有两个实现类：

- **DefaultSqlSession**（默认实现）
- **SqlSessionManager** （已弃用）

简单来说，通过会话工厂构建出 SqlSession 实例之后，我们就可以进行增删改查了，默认实例 DefaultSqlSession 提供了如此多的方法供用户使用，有超过30个：



![DefaultSqlSession接口全览](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/DefaultSqlSession.png)



sqlSession 的方法除了 CURD，还提供了事务的控制例如提交/关闭/回滚等、提供了配置对象的获取例如 getConfiguration()、提供了批量语句的执行更新例如 flushStatements()、提供了缓存清除例如 clearCache() 、提供了映射器的使用 getMapper() 等等。



![SqlSession会话](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/sqlSession_process.png)



对于客户端应用层面来说，熟悉 sqlSession 的 API 基本就可以任意操作数据库了，不过我们希望想进一步了解 sqlSession 内部是如何执行 sql 呢？其实 sqlSession 是 Mybatis 中用于和数据库交互的 **顶层类**，通常将它与本地线程 ThreadLocal 绑定，一个会话使用一个 SqlSession，并且在使用完毕之后进行 **关闭**。



> 之所以称 SqlSession 为数据交互的 **顶层类**，是它其实没有完成实质的数据库操作。根据之前的架构设计流程我们已经清晰的知道，SqlSession 对数据库的操作都会转发给具体的执行器 Executor 来完成 ；当然执行器也是甩手掌柜，执行器 Executor 会再分派给语句处理器 StatementHandler ，语句处理器会结合参数处理器 ParameterHandler ，共同完成最终的数据库执行处理操作（底层还是封装了 JDBC Statement 操作）。并在每个语句处理器 StatementHandler 处理完成数据库操作之后， 通过结果结处理器 ResultSetHandler 以及类型处理器 TypeHandler ，对底层 JDBC 返回的结果集进行映射封装，最终才返回预期的封装对象。



关注以下图示 sqlSession 红色高亮位置，详细描述了会话的实际执行路径：



![sqlSession会话高亮展示](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/mybatis_sqlsession.jpg)



SqlSession 可以理解为一次数据库会话，一次会话当中既可以执行一次 sql ，也允许你批量执行多次，但是一旦会话关闭之后想要再执行 sql，那就必须重新创建会话。



![SqlSession会话执行](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/sqlSession_process_sql.png)



> 每个线程都应该有它自己的 SqlSession 实例，SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的作用域是 **请求（request）或方法（method）** 作用域。 绝对不能将 SqlSession 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。 也绝不能将 SqlSession 实例的引用放在任何类型的托管作用域中，比如 Servlet 框架中的 HttpSession。 如果你现在正在使用一种 Web 框架，考虑将 SqlSession 放在一个和 HTTP 请求相似的作用域中。 换句话说，每次收到 HTTP 请求，就可以打开一个 SqlSession，返回一个响应后，就关闭它。 这个关闭操作很重要，为了确保每次都能执行关闭操作，你应该把这个关闭操作放到 finally 块中。



**Spring 集成 Mybatis 之后，通过依赖注入可以创建线程安全的、基于事务的 SqlSession ，并管理他们的生命周期，推荐搭配使用。**



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/07.png)

##### 7、Executor -- 执行器

Executor 是一个执行器接口，是 Mybatis 的调度核心，它定义了一组管理 Statement 对象与获取事务的方法，并负责 SQL 语句的生成和一级/二级查询缓存的维护等，SqlSessionFactory 在创建 SqlSession 时会同时创建执行器，并指定执行器类型，默认使用 SimpleExecutor 。执行器接口有5个子孙实现类，其中 BaseExecutor 是抽象类，另外4个子孙实现类分别是：SimpleExecutor 、BatchExecutor、ReuseExecutor、CachingExecutor。



![Executor执行器接口](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/Executor.png)



- **BaseExecutor**：基础执行器（抽象类），对Executor接口进行了基本实现，为下一级实现类执行器提供基础支持。BaseExecutor 有三个子类分别是 SimpleExecutor、ResuseExecutor、BatchExecutor。



- **SimpleExecutor**：普通执行器，继承 BaseExecutor 抽象类，是 MyBatis 中 **默认** 使用的执行器. 每执行一次 update 或 select ，就开启一个 Statement 对象，用完立刻关闭 Statement 对象。（可以是 Statement 或 PrepareStatement 对象）。



- **ReuseExecutor**：复用执行器，继承 BaseExecutor 抽象类，这里的复用指的是重复使用 Statement . 它会在内部利用一个 Map 把创建的 Statement 都缓存起来，每次在执行一条 SQL语 句时，它都会去判断之前是否存在基于该 SQL 缓存的 Statement 对象，存在且之前缓存的 Statement 对象对应的 Connection 还没有关闭则会继续使用之前的 Statement 对象，否则将创建一个新的 Statement 对象，并将其缓存起来。因为每一个新的 SqlSession 都有一个新的 Executor 对象，所以我们缓存在 ReuseExecutor 上的 Statement 的作用域是同一个 SqlSession 。



- **BatchExecutor**：批处理执行器，继承 BaseExecutor 抽象类，通过批量操作来提高性能，用于将多个 sql 语句一次性输送到数据库执行。由于内部有缓存的实现，所以使用完成后需要调用 flushStatements() 来清除缓存。



- **CachingExecutor** ： 缓存执行器，继承 BaseExecutor 抽象类，它为 Executor 对象增加了 **二级缓存** 的相关功能，cachingExecutor 有一个重要属性 delegate，即为委托的执行器对象，可以是 SimpleExecutor、ReuseExecutor、BatchExecutor 中任意一个。CachingExecutor 在执行数据库 update 操作时，它直接调用 委托对象 delegate 的 update 方法；而执行查询时，它会先从缓存中获取查询结果，存在就返回，不存在则委托 delegate 去数据库取，然后存储到缓存 cache 中。



Mybatis 在构建 Configuration 配置类时默认把 **ExecutorType.SIMPLE** 作为执行器类型，当我们的会话工厂 DefaultSqlSessionFactory 开始生产 SqlSession 会话时，会同时构建执行器，此时就会依据配置类 Configuration 构建时指定的执行器类型来实例具体执行器 ，流程如下：



```java
// 1、Configuration配置类构建时
//   指定了默认执行器类型为：普通执行器
protected ExecutorType defaultExecutorType 
    = ExecutorType.SIMPLE;

// 2、Configuration配置类中
//   提供方法获取默认执行器类型
public ExecutorType getDefaultExecutorType() {
    return defaultExecutorType;
}

// 3、会话工厂创建 SqlSession 实例时
SqlSession session = sqlSessionFactory.openSession();

// 4、openSession 实际逻辑
public SqlSession openSession() {
    return 
       openSessionFromDataSource(
           // 这里可就获取了默认执行器
           configuration.getDefaultExecutorType(), 
           null, 
           false
        );
}  
```



这里，肯定有人想知道，我们能否指定其它执行器呢？

答案是：当然可以，有两种方式指定：

- 第一种方式是通过 Java API 指定，在开启会话 openSession 时进行指定。例如：

 

```java

// 创建 SqlSession 实例
SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.REUSE)
    
// ExecutorType是一个枚举
// 有三个值SIMPLE, REUSE, BATCH

```



- 另一种通过 Configuration 配置方式来指定默认执行器类型。例如



```xml
<settings>
    <!--取值范围 SIMPLE, REUSE, BATCH -->
	<setting name="defaultExecutorType" value="REUSE"/>
</settings>
```



对于第二种 settings 的配置方式，其实之前我们在介绍 Mybatis 的配置文件中已经讲过，这里再简单说明一下，像上面配置 settings 中的属性 defaultExecutorType ，基本这些属性都是 Mybatis 额外提供给我们灵活设置的，就算我们不设置 Mybatis 也会有默认值，例如像 defaultExecutorType 的默认值就是 SIMPLE。你看一下 Mybatis 在解析 Configuration 配置时的默认构建，就会明白：



**解析 Configuration 的解析器（类与具体方法的代码路径）：**

**org.apache.ibatis.builder.xml.XMLConfigBuilder#settingsElement**

**我们截取部分代码逻辑，下面是设置默认执行器类型属性 defaultExecutorType 的内容：** 



``` java

// 配置文件解析器 
public class XMLConfigBuilder {
    
    // 最终解析到的 Configuration 对象
    protected final Configuration configuration;
    
    // 为 Configuration 对象设置属性
    private void settingsElement(Properties props) {
        
        // 设置默认执行器类型，默认是 SIMPLE
        configuration.setDefaultExecutorType(
            ExecutorType.valueOf(
                props.getProperty(
                    "defaultExecutorType", "SIMPLE")));
        
        // .... 当然这里还有很多属性设置
        // .... 只要你在<settings>中配置即可
    
    }
}


```



注意，到此我们知道可以根据业务需要指定执行器类型，例如 SIMPLE（普通执行器）, REUSE（复用执行器）, BATCH（批处理执行器）。

但是，有朋友就好奇了，那缓存执行器 CachingExecutor 好像不见说明呢？



<img src="https://www.panshenlian.com/images/post/00_old_article_images/emoji/questionNEW.png" alt="好奇的小脑袋" style="zoom:50%;" />



确实如此，因为缓存执行器个其它三个执行器还不太一样，CachingExecutor 是需要我们开启二级缓存才会有，这里大家先不要思考什么是一级缓存，什么二级缓存，后续我们有一文会详细讲缓存整个知识内容。



<img src="https://www.panshenlian.com/images/post/00_old_article_images/emoji/huazhongdian2.png" alt="敲黑板了" style="zoom:40%;" />





大家先了解一个概念即可，就是 Mybatis 的一级缓存是默认开启的，不管你要不要，都会有一级缓存，而二级缓存呢，是默认关闭的，但允许我们手工开启。

对比开启二级缓存前后，执行器执行的区别吧！



- **不开启二级缓存，执行器执行时**：



![Executor无缓存执行器](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/Executor_noCache.jpg)



- **开启二级缓存之后，执行器执行时**：



![Executor二级缓存执行器](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/Executor_hasCache.jpg)



其实我们实际操作数据库，不会直接接触到执行器 Executor ，不过我们确实可以了解一下基本的执行原理，下面列出了执行器接口提供的众多重载方法，基本用于事务/缓存/数据库管理与访问，可以知道一下：



![Executor执行器接口](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/Executor_method.png)



到此，对于执行器有了基本的认识，但是实际上，我们知道执行器自身没有去具体执行 SQL 语句，而是分派到语句处理器 StatementHandler ，语句处理器会结合参数处理器 ParameterHandler ，最终进行数据库操作。



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/08.png)

##### 8、StatementHandler -- 语句处理器

StatementHandler 是一个语句处理器接口，它封装了 JDBC Statement 操作，负责对 JDBC Statement 的操作，如 **设置参数、结果集映射**，是实际跟数据库做交互的一道。StatementHandler 语句处理器实例，是在执行器具体执行 CRUD 操作时构建的，默认使用 PrepareStatementHandler。语句处理器接口有5个子孙实现类，其中 BaseStatementHandler 是抽象类，另外4个子孙实现类分别是：SimpleStatementHandler、PrepareStatementHandler、CallableStatementHandler、RoutingStatementHandler。



![StatementHandler语句处理器接口](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/StatementHandler.png)



- **BaseStatementHandler**：基础语句处理器（抽象类），它基本把语句处理器接口的核心部分都实现了，包括配置绑定、执行器绑定、映射器绑定、参数处理器构建、结果集处理器构建、语句超时设置、语句关闭等，并另外定义了新的方法 instantiateStatement 供不同子类实现以便获取不同类型的语句连接，子类可以普通执行 SQL 语句，也可以做预编译执行，还可以执行存储过程等。



- **SimpleStatementHandler**：普通语句处理器，继承 BaseStatementHandler 抽象类，对应 java.sql.Statement 对象的处理，处理普通的不带动态参数运行的 SQL，即执行简单拼接的字符串语句，同时由于 Statement 的特性，SimpleStatementHandler 每次执行都需要编译 SQL （**注意：我们知道 SQL 的执行是需要编译和解析的**）。



- **PreparedStatementHandler**：预编译语句处理器，继承 BaseStatementHandler 抽象类，对应 java.sql.PrepareStatement 对象的处理，相比上面的普通语句处理器，它支持可变参数 SQL 执行，由于 PrepareStatement 的特性，它会进行预编译，在缓存中一旦发现有预编译的命令，会直接解析执行，所以减少了再次编译环节，能够有效提高系统性能，并预防 SQL 注入攻击（**所以是系统默认也是我们推荐的语句处理器**）。



- **CallableStatementHandler**：存储过程处理器，继承 BaseStatementHandler 抽象类，对应 java.sql.CallableStatement 对象的处理，很明了，它是用来调用存储过程的，增加了存储过程的函数调用以及输出/输入参数的处理支持。



> 其实普通语句处理器、预执行语句处理器以及存储过程处理器，只是 Mybatis 对于 JDBC 的语句执行对象的简单包装而已，没有特别神秘，看以下 JDBC 的语句执行对象的类图关系也就能够清楚。



<img src="https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/statement.png" alt="Statement语句执行对象" style="zoom:50%;" />





- **RoutingStatementHandler**：路由语句处理器，直接实现了 StatementHandler 接口，作用如其名称，确确实实只是起到了路由功能，并把上面介绍到的三个语句处理器实例作为自身的委托对象而已，所以执行器在构建语句处理器时，都是直接 new 了 RoutingStatementHandler 实例。



```java
// 1、执行器构建语句处理器实例
public StatementHandler newStatementHandler(...) {
    
    // 构建路由语句处理器即可！
    StatementHandler statementHandler = 
        new RoutingStatementHandler(...);
    
    // 其它逻辑忽略...
    return statementHandler;
}

// 2、实际构造方法（路由关系）
public RoutingStatementHandler(...) {

    // 根据指定类型构造委托实例
    switch (ms.getStatementType()) {
      case STATEMENT:
        delegate = new SimpleStatementHandler(...);
        break;
      case PREPARED:
        delegate = new PreparedStatementHandler(...);
        break;
      case CALLABLE:
        delegate = new CallableStatementHandler(...);
        break;
      default:
        throw new ExecutorException(
            "Unknown statement type: " 
                + ms.getStatementType());
    }
}

```



我们前面介绍了执行器具体执行 CRUD 操作时，构造的语句处理器默认使用 PrepareStatementHandler ，不过有些好奇的脑袋就想问问，那我们能不能指定语句处理器类型呢？



当然可以，例如我们指定更新用户语句适用预编译处理语句处理器：



```xml
<!--取值范围 STATEMENT, PREPARED, CALLABLE -->
<update id="updateUser" statementType="STATEMENT">
    update t_user set name = #{newName}
</update>
```



当 Mybatis 在解析映射器中的每条语句时，会设置语句处理器类型：



```java
// 语句对象解析器 
public class XMLStatementBuilder {
    
    // 解析语句节点
    public void parseStatementNode() { 
        
        // 设置语句处理器类型
        // 默认是 PREPARED 类型
        StatementType statementType = 
         StatementType.valueOf(
            context.getStringAttribute(
                "statementType", 
                StatementType.PREPARED.toString()
            )
        ); 
    }  
}
```



所以，语句执行器与数据库的交互过程：

![StatementHandler执行过程](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/StatementHandler.jpg)



当然，语句处理器接口 StatementHandler 提供了基本接口，一般我们没必要自定义实现类，所以可以简单看一下即可：



![StatementHandler接口](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/StatementHandler_method.png)



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/09.png)

##### 9、ParamerHandler -- 参数处理器

ParameterHandler 是一个参数处理器接口，它负责把用户传递的参数转换成 JDBC Statement 所需要的参数，底层做数据转换的工作会交给类型转换器 TypeHandler，后面会介绍。



很显然，需要对传入的参数进行转换处理的 StatementHandler 实例只有两个，分别是：

- **PrepareStatementHandler** 预编译处理器
- **CallableStatementHandler** 存储过程处理器



上面在介绍语句处理器的时候，我们有介绍说基础语句处理器 BaseStatementHandler 在进行实例构建时，会同时构建参数处理器与结果集处理器，所以参数处理器就是在此时被构建。



```java
// 基础语句处理器
public abstract class BaseStatementHandler{
    
    // 构造实例时
    protected BaseStatementHandler(...){
        
        // 其它逻辑可忽略...
        
        // 1、构建参数处理器
        this.parameterHandler = 
            conf.newParameterHandler(...);
    	
        // 2、构建结果集处理器
        this.resultSetHandler = 
        	conf.newResultSetHandler(...);
    } 
}
```



对于参数处理器接口，相对简单，只有1个默认实现类 DefaultParameterHandler ，该接口只有两个方法，分别是：



![参数处理器接口](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/ParameterHandler_method.png)



- **1、setParameters** 设置参数，发生在 CURD 语句执行时，语句处理器设置参数



```java
// 有2个处理器会使用，分别是：
// 预编译处理器 PreparedStatementHandler
// 存储过程处理器 CallableStatementHandler

public void parameterize(Statement statement) {
    
    //使用ParameterHandler对象来完成对Statement的设值
    parameterHandler.setParameters(statement);
}
```



应用场景例如查询用户对象时，设置姓名，参数处理器结合类型处理器把 name 属性占位符进行赋值。



```xml 
<select id="queryUSer">
    select * from t_user where name = #{name}
</select>
```



- **2、getParameterObject** 获取参数，发生在结果集返回时，结果集处理器获取对象参数，值得注意的时，该方法只用于存储过程处理器 CallableStatementHandler 。



```java
// 默认结果集处理器
public class DefaultResultSetHandler{
   
    // 处理输出参数
    public void handleOutputParameters(...) {
    
        // 获取参数
        final Object parameterObject = 
            parameterHandler.getParameterObject();
    
    	// 其它存储过程输出参数处理逻辑...
	}    
}
```



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/10.png)

##### 10、ResultSetHandler -- 结果集处理器

ResultSetHandler 是一个结果集处理器接口，它负责负责将 JDBC 返回的结果集 resultSet 对象转换为 List 类型的集合，是在语句处理器构建实例时被同时创建，底层做数据转换的工作会交给类型转换器 TypeHandler，它有1个默认实现类 DefaultResultSetHandler，该接口有3个方法，分别是：



![结果集处理器接口](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/ResultSetHandler_method.png)



- **handleResultSets**：负责结果集处理，完成映射返回结果对象
- **handleCursorResultSets** ：负责游标对象处理
- **handleOutputParameters** ：负责存储过程的输出参数处理



结果集处理器对于 JDBC 返回的结果集的基本处理，是先获取我们在映射器 Mapper 中指定 resultType 或 resultMap 映射关系，然后遍历解析结果集中的每一列数据，底层通过 MetaObject 对象做相关的反射处理。



> 对于详细的源码逻辑，我们后续源码剖析部分详细讲。
>
> 不讲不是中国人 O(∩_∩)O ~





![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/11.png)

##### 11、TypeHandler -- 类型转换器

TypeHandler 是一个类型转换器/处理器接口，它负责 Java 数据类型和 JDBC 数据类型之间的映射与转换，当对 Statement 对象设置参数时，由 JavaType 转换为 JdbcType，当对 Statement 返回结果集进行封装映射时，又会将 JdbcType 转换为 JavaType。



![类型转换器处理](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/TypeHandler_process.png)



一般，我们可以直接使用 Mybatis 内置的类型处理器，简单看了一下有 65+ 个，当然我们是可以根据业务需要自定义类型处理器的，以便处理复杂类型或非标类型。



具体做法为：

1、实现 `org.apache.ibatis.type.TypeHandler` 接口；

2、继承 `org.apache.ibatis.type.BaseTypeHandler` 类。



> 其中 BaseTypeHandler 类作为抽象类就已经实现了 TypeHandler 接口。



我们看到接口 TypeHandler 定义了四个方法：



```java
public interface TypeHandler<T> {

  // 设置参数
  void setParameter(
      PreparedStatement ps, 
      int i, T parameter, 
      JdbcType jdbcType);

  // 根据列名获取转换结果
  T getResult(ResultSet rs, String columnName);

  // 根据列下标获取转换结果
  T getResult(ResultSet rs, int columnIndex);

  // 根据列下标获取【存储过程】的输出结果
  T getResult(CallableStatement cs, int columnIndex);

}
```



其实，我之前在介绍 Mybatis 核心配置的时候，有大力介绍过类型处理器，没必要重复写（其实是懒），感兴趣的朋友可以直接看我们之前的文章 **《Mybatis系列全解（四）：全网最全！Mybatis配置文件XML全貌详解》**中对类型处理器 TypeHandler 的介绍。



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/12.png)

##### 12、MappedStatement -- 语句对象

MappedStatement 语句对象，就是我们在映射器 Mapper 中维护的每一条语句，例如 <select|update|delete|insert>，Mybatis 中通过语句构造器 XMLStatementBuilder 对每一个语句进行解析：



![语句对象解析过程](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/MappedStatement_parse.jpg)



整个解析过程分为4步骤：



- 1、配置解析器 XMLConfigBuilder 解析映射器：



```java
// Configuration 配置解析器
public class XMLConfigBuilder{
    
    // 解析映射器
    private void mapperElement(){
        
        // 创建映射器解析实例
        XMLMapperBuilder mapperParser = 
            new XMLMapperBuilder(...);
        
        // 开始解析
        mapperParser.parse();
    }
}
```



2、映射对象解析器 XMLMapperBuilder 解析语句



```java
// 映射对象解析器
public class XMLMapperBuilder{
    
    // 1、解析入口
    public void parse() { 
        
        // 解析映射器文件
        configurationElement(
            parser.evalNode("/mapper"));
    }
    
    // 2、节点解析
    private void configurationElement(XNode context) {
        
        // 构建语句对象
        buildStatementFromContext(
            context.evalNodes(
                "select|insert|update|delete"));
    }
    
    // 3、最终调用语句解析器
    private void buildStatementFromContext(){
        
        // 创建语句解析实例
        XMLStatementBuilder statementParser = 
            new XMLStatementBuilder();
        
        // 解析语句节点
        statementParser.parseStatementNode();
    }
}
```



3、语句解析器 XMLStatementBuilder 解析每一个节点



```java
// 语句解析器
public class XMLStatementBuilder{
    
    // 解析语句节点
    public void parseStatementNode() {
        
        // 通过语句辅助类构建语句对象
        builderAssistant.addMappedStatement(...)
    }
}
```



4、语句辅助类 MapperBuilderAssistant 添加进语句集合中



```java
// 语句辅助类
public class MapperBuilderAssistant{
    
    // 添加语句对象
    public MappedStatement addMappedStatement(
         
        // 最终添加到配置类的语句集合中
    	configuration.addMappedStatement(statement);
    }
}
```





![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/13.png)

##### 13、SqlSource -- SQL源

SqlSource 是一个 SQL 源接口，它会结合用户传递的参数对象 parameterObject，动态地生成 SQL 语句，并最终封装成 BoundSql 对象。SqlSource 接口有5个实现类，分别是：StaticSqlSource、DynamicSqlSource、RawSqlSource、ProviderSqlSource、~~VelocitySqlSource~~ （这只是一个测试用例，而非真正模板 Sql 源实现类）。

![sql源接口与实现](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project06/sqlSource_all.jpg)



- **StaticSqlSource**：静态 SQL 源实现类，所有的 SQL 源最终都会构建 StaticSqlSource 实例，该实现类会生成最终可执行的 SQL 语句供 statement 或 prepareStatement 使用。
- **RawSqlSource**：原生 SQL 源实现类，解析构建含有 '#{}' 占位符的 SQL 语句或原生 SQL 语句，解析完最终会构建 StaticSqlSource 实例。
- **DynamicSqlSource**：动态 SQL 源实现类，解析构建含有 '${}' 替换符的 SQL 语句或含有动态 SQL 的语句（例如 If/Where/Foreach等），解析完最终会构建 StaticSqlSource 实例。
- **ProviderSqlSource**：注解方式的 SQL 源实现类，会根据 SQL 语句的内容分发给 RawSqlSource 或 DynamicSqlSource ，当然最终也会构建 StaticSqlSource 实例。
- **VelocitySqlSource**：模板 SQL 源实现类，官方申明这只是一个测试用例，而非真正的模板 Sql 源实现类。



SqlSource 实例在配置类 Configuration 解析阶段就被创建，Mybatis 框架会依据3个维度的信息来选择构建哪种数据源实例：



- **第一个维度**：客户端的 SQL 配置方式：XML 方式或者注解方式。
- **第二个维度**：SQL 语句中是否使用动态 SQL （ if/where/foreach 等 ）。
- **第三个维度**：SQL 语句中是否含有替换符 '${}' 或占位符 '#{}' 。



SqlSource 接口只有一个方法 getBoundSql ，就是创建 BoundSql 对象。



```java
public interface SqlSource {

  BoundSql getBoundSql(Object parameterObject);

}
```



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/14.png)

##### 14、BoundSql -- SQL语句

BoundSql 对象存储了动态生成的 SQL 语句以及相应的参数信息，BoundSql 对象是在执行器具体执行 CURD 时通过实际的 SqlSource 实例所构建。通过 BoundSql 能够获取到实际数据库执行的 SQL 语句，系统可根据 SQL 语句构建 Statement 或者 PrepareStatement 。



```java
public class BoundSql {

  //该字段中记录了SQL语句，该SQL语句中可能含有"?"占位符
  private final String sql;
    
  //SQL中的参数属性集合
  private final List<ParameterMapping> parameterMappings;
    
  //客户端执行SQL时传入的实际参数值
  private final Object parameterObject;
    
  //复制 DynamicContext.bindings 集合中的内容
  private final Map<String, Object> additionalParameters;
    
  //通过 additionalParameters 构建元参数对象
  private final MetaObject metaParameters;
    
}
```





![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/15.png)

#### 总结

本文整整2周才基本修整完善，顺着 Mybatis 的数据库核心执行流程，我们大致介绍了 Mybatis 中几个相对核心的 API，我们是一边构建核心架构功能设计图示，一边梳理 API 相关知识脉络，目前基本算是捋清。

其中比较苦恼的问题就是，对于文章内容范围尺度的把控，每篇文章我都希望讲得全面，讲得细致，这两个坚持就注定了文章的内容不可能全是干货，导致略懂的人只能选择跳跃式阅读，对于有营养的知识点需要挑挑拣拣，自我取舍；同时还会导致内容篇幅巨长，导致整体阅读耗时过长，不易快速吸收。

后续尝试改变一下写作方式，尽量输出干货、内容点到为止，对于需要巨细剖析的内容，我们单立文章解读。




>本篇完，本系列下一篇我们讲《 **Mybatis系列全解（七）：Dao层两种实现方式** 》。



<img src="https://www.panshenlian.com/images/post/00_old_article_images/emoji/next.png" style="zoom:40%;" />







![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/article_the_end.png)




> 文章持续更新，微信搜索「**潘大晚**」第一时间阅读，随时有惊喜。本文会在 **GitHub** [https://github.com/JavaWorld](https://github.com/senlypan/JavaWorld) 收录，关于热腾腾的技术、框架、面经、解决方案、摸鱼技巧、教程、视频、漫画等等等等，我们都会以最美的姿势第一时间送达，欢迎 Star ~ 我们未来 **不止文章**！想进读者群的朋友欢迎撩我个人号：panshenlian，备注「**加群**」我们群里畅聊， **BIU ~** 





![](https://www.panshenlian.com/images/post/00_old_article_images/emoji/love.png)