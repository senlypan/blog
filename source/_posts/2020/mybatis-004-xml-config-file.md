---
title: Mybatis系列全解（四）：全网最全！Mybatis配置文件XML全貌详解
date: 2020-12-10 08:20:00
tags:
- Mybatis
---



> 封面：洛小汐
>
> 作者：潘深练


![](https://pic2.zhimg.com/v2-7eec74a18a3d77f5008c04f97b283910_r.jpg)


![](https://img-blog.csdnimg.cn/img_convert/4db7093706a82aa09e4e4bb5e9c93d1d.png)

做大事和做小事的难度是一样的。两者都会消耗你的时间和精力，所以如果决心做事，就要做大事，要确保你的梦想值得追求，未来的收获可以配得上你的努力。

![](https://img-blog.csdnimg.cn/img_convert/d2f0a18e1d4b92c98b8bf219766381f3.png)



#### 前言



上一篇文章 **《Mybatis系列全解（三）：Mybatis简单CRUD使用介绍》** ，我们基本上手了 Mybatis 的增删改查操作，也感受到 Mybatis 的简单高效舒美，但是肯定有部分朋友对于 Mybatis 的配置文件只是了解基本组成和大致用法，尚无一套完整的结构记忆，所以本篇文章我们将详细的介绍 Mybatis 的配置全貌，毕竟 Mybatis 的配置文件对于整个 Mybatis 体系的构建与支撑有着深远的影响。



**Mybatis系列全解脑图分享，持续更新中**

 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20201208231159894.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01yUmlnaHRfc2VubHlwYW4=,size_16,color_FFFFFF,t_70#pic_center)





#### 目录


1、为什么要使用配置文件

2、Mybatis 配置全貌

3、XML 核心配置

4、XML 映射文件

5、总结


![](https://img-blog.csdnimg.cn/img_convert/78a36bf5b4f6c5b660ec41cc90d1e52d.png)
#### 为什么要使用配置文件

试想，如果没有配置文件，我们的应用程序将只能沿着固定的姿态运行，几乎不能做任何动态的调整，那么这不是一套完美的设计，因为我们希望拥有更宽更灵活的操作空间和更多的兼容度，同时也能解决硬编码等问题，所以我们需要有配置文件，对应用程序进行参数预设和设置初始化工作。



**那我们为何钟情XML**？



> 首先，当然是 XML 配置文件本身就足够优秀，格式规范，存储小，跨平台，读取快...等等，所谓窈窕淑女，谁人不爱。
>
> 其次，也是一个重要影响因素，就是各大领域大佬的支持，像微软、像Java系...等等，世上本无路，只是走的人多了，也就成了路 （ 这句话是鲁迅老先生说的）。



**所以，Mybatis选择搭配XML配置，实属合理。**

![](https://img-blog.csdnimg.cn/img_convert/30ec400a6ee06546af3fdfa8923d31ff.png)
#### Mybatis 配置全貌

Mybatis框架本身，理论上就一个配置文件，其实也只需要一个配置文件，即mybatis-config.xml （当然文件名允许自由命名），只不过这个配置文件其中的一个属性mappers(映射器)，由于可能产生过多的SQL映射文件，于是我们物理上单独拓展出来，允许使用者定义任意数量的 xxxMapper.xml 映射文件。




> 把SQL映射文件单独配置，是有好处的，一是灵活度上允许任意拓展，二也避免了其它无需经常变动的属性配置遭遇误改。



**我们看看Mybatis官网给出的配置文件层次结构：**

- configuration（配置）
	- properties（属性）
	- settings（设置）
	- typeAliases（类型别名）
		- *三种别名定义方式*
	- typeHandlers（类型处理器）
		- *自定义类型处理器*
	- objectFactory（对象工厂）
	- plugins（插件）
	- environments（环境配置）
		- environment（环境变量）
			- transactionManager（事务管理器）
			- dataSource（数据源）
				- *三种支持数据源与自定义数据源* 
	- databaseIdProvider（数据库厂商标识）
	- mappers（映射器）
	



**实际配置文件XML内容如下，除了约束头 <?xml> 与 <!DOCTYPE>，**

**其余标签元素都是 Mybatis 的核心配置属性 ：**

```xml

<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!-- 1、属性：例如jdbc.properties -->
    <properties resource="jdbc.properties"></properties>

    <!-- 2、设置：定义全局性设置，例如开启二级缓存 -->
    <settings>
        <setting name="cacheEnabled" value="true"/>
    </settings>

    <!-- 3、类型名称：为一些类定义别名 -->
    <typeAliases>
        <typeAlias type="com.panshenlian.pojo.User" alias="user"></typeAlias>
    </typeAliases>

    <!-- 4、类型处理器：定义Java类型与数据库中的数据类型之间的转换关系 -->
    <typeHandlers></typeHandlers>

    <!-- 5、对象工厂 -->
    <objectFactory type=""></objectFactory>

    <!-- 6、插件：mybatis的插件，支持自定义插件 -->
    <plugins>
        <plugin interceptor=""></plugin>
    </plugins>

    <!-- 7、环境：配置mybatis的环境 -->
    <environments default="development">
        <!-- 环境变量：支持多套环境变量，例如开发环境、生产环境 -->
        <environment id="development">
            <!-- 事务管理器：默认JDBC -->
            <transactionManager type="JDBC" />
            <!-- 数据源：使用连接池，并加载mysql驱动连接数据库 -->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver" />
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis" />
                <property name="username" value="root" />
                <property name="password" value="123456" />
            </dataSource>
        </environment>
    </environments>

    <!-- 8、数据库厂商标识 -->
    <databaseIdProvider type=""></databaseIdProvider>

    <!-- 9、映射器：指定映射文件或者映射类 -->
    <mappers>
        <mapper resource="UserMapper.xml" />
    </mappers>
    
</configuration>

```



> 必须注意：Mybatis配置文件的属性位置顺序是 **固定** 的，不允许 **颠倒顺序**，否则 Mybatis 在解析 XML 文件的时候就会抛出异常，这个与 Mybatis 框架启动加载配置信息顺序有关，后续我们源码分析会讲到。



**以上基本能够清晰看明白 Mybatis 配置文件的层次结构关系，我们简单画一张脑图：**



![在这里插入图片描述](https://img-blog.csdnimg.cn/20201208231009604.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01yUmlnaHRfc2VubHlwYW4=,size_16,color_FFFFFF,t_70#pic_center)



基本是需要我们掌握 9 大顶级元素配置，其中标记 **橘红色** 的属性配置，由于涉及 **插件** 和 **动态SQL** ，插件配置可以应用于分页与功能增强等，动态SQL例如 if 标签、where 标签、foreach标签等，初步理解为应用于SQL语句拼接。这两块属于 Mybatis 的两个特性，我们后续单独详细进行梳理讨论。



![](https://img-blog.csdnimg.cn/img_convert/6046a59b498ec911b5218ec06beec6e2.png)

#### XML 核心配置



我们的核心配置文件 configuration（配置）作为最顶级节点，其余 9 大属性都必须嵌套在其内，对于内部 9 大节点，我们逐一讲解：



##### 1、properties（属性）

***

属性标签，显而易见就是提供属性配置，可进行动态替换，一般可以在 Java 属性文件中配置，例如 jdbc.properties 配置文件 ，或通过 properties 元素标签中的子元素 property 来指定配置。



举例我们需要配置数据源信息，采用 property 标签可以这样配置：

```xml

<properties>
  <property name="driver" value="com.mysql.jdbc.Driver"/>
  <property name="url" value="jdbc:mysql://127.0.0.1:3306/myDB"/>
  <property name="username" value="user1"/>
  <property name="password" value="123456"/>
</properties>

```


设置好的属性可以在整个配置文件中用来替换需要动态配置的属性值。比如：

```xml

<dataSource type="POOLED">
  <property name="driver" value="${driver}"/>
  <property name="url" value="${url}"/>
  <property name="username" value="${username}"/>
  <property name="password" value="${password}"/>
</dataSource>

```

或者我们使用  Java 中的属性配置文件，把属性配置元素具体化到一个属性文件中，并且使用属性文件的 key 名作为占位符。例如 jdbc.properties 

```properties

driver=com.mysql.jdbc.Driver
url=jdbc\:mysql\://127.0.0.1\:3306/myDB
username=root
password=123456

```
使用时我们把属性文件引入，并使用文件中定义的占位符，例如 db.driver ：

```xml

<!-- 引入属性配置文件 -->
<properties resource="jdbc.properties"></properties>
    
<dataSource type="POOLED">
  <property name="driver" value="${driver}"/>
  <property name="url" value="${url}"/>
  <property name="username" value="${username}"/>
  <property name="password" value="${password}"/>
</dataSource>

```



![在这里插入图片描述](https://img-blog.csdnimg.cn/2020120823102835.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01yUmlnaHRfc2VubHlwYW4=,size_16,color_FFFFFF,t_70#pic_center)





但是问题来了，当我们既使用 *.properties 配置文件，同时又设置了 property 元素值，Mybatis 会使用哪边配置的属性值呢？ 例如这种情况 ：



```xml 
<properties resource="jdbc.properties"> 
  <property name="driver" value="com.mysql.jdbc.Driver"/>
  <property name="url" value="jdbc:mysql://127.0.0.1:3306/myDB"/>
  <property name="username" value="user1"/>
  <property name="password" value="123456"/>
</properties>

```

这里，如果在 property 标签元素与 jdbc.properties 文件中同时存在相同属性，那么属性文件将会覆盖 property 标签元素的属性，例如最终 username属性值会使用 jdbc.properties 文件中设置的 **root**，而不会使用属性元素设置的 **user1** 。这样实际为配置提供了诸多灵活选择。



另外，properties 元素允许配置 resource 属性或 url 属性，**只能二选一**，要么使用 resource 指定本地的配置文件，要么使用 url 指定远程的配置文件，因为 Mybatis 在加载配置时，如果发现 url 与 resource 同时存在，会抛出异常禁止。

```xml

<!-- 配置resource-->
<properties resource="xxx.properties">
    <property name="driver" value="com.mysql.jdbc.Driver"/>
</properties>

<!-- 配置url-->
<properties url="http://xxxx">
    <property name="driver" value="com.mysql.jdbc.Driver"/>
</properties>

```



还有一种情况，像 Mybatis 在解析配置的时候，也可以在 Java 代码中构建属性 java.util.Properties 属性对象并传递到  SqlSessionFactoryBuilder.build() 方法中，例如：



```java
// 构建属性对象
Properties props = new Properties();
props.setProperty("driver","com.mysql.jdbc.Driver"); 
props.setProperty("url","jdbc:mysql://127.0.0.1:3306/myDB"); 
props.setProperty("username","user1"); 
props.setProperty("password","123456");  

// 传递属性构建 SqlSessionFactory
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, props);
```

那么这三种方式都允许配置，那在属性配置重复的情况下，优先级别是怎样呢？



**properties 优先级**

1、第一优先级：在 Java 代码中构建的 properties 属性对象；

2、第二优先级：通过属性 resource 或 url 读取到的本地文件或远程文件；

3、第三优先级：直接在 properties 内部子标签元素 property 中设置的属性。 



> 注意，在实际开发中，为了避免给后期维护造成困扰，建议使用单一种配置方式。




##### 2、settings（设置）

***

settings 标签元素，是 MyBatis 中极为重要的调整设置，它们会动态改变 MyBatis 的运行时行为，这些配置就像 Mybatis 内置的许多功能，当你需要使用时可以根据需要灵活调整，并且 settings 能配置的东西特别多，我们先来一起看看，一个完整的属性配置示例：

```xml

<settings>
  <setting name="cacheEnabled" value="true"/>
  <setting name="lazyLoadingEnabled" value="true"/>
  <setting name="multipleResultSetsEnabled" value="true"/>
  <setting name="useColumnLabel" value="true"/>
  <setting name="useGeneratedKeys" value="false"/>
  <setting name="autoMappingBehavior" value="PARTIAL"/>
  <setting name="autoMappingUnknownColumnBehavior" value="WARNING"/>
  <setting name="defaultExecutorType" value="SIMPLE"/>
  <setting name="defaultStatementTimeout" value="25"/>
  <setting name="defaultFetchSize" value="100"/>
  <setting name="safeRowBoundsEnabled" value="false"/>
  <setting name="mapUnderscoreToCamelCase" value="false"/>
  <setting name="localCacheScope" value="SESSION"/>
  <setting name="jdbcTypeForNull" value="OTHER"/>
  <setting name="lazyLoadTriggerMethods" value="equals,clone,hashCode,toString"/>
  <... more .../>
</settings>

```



- **属性cacheEnabled**
	- 全局性地开启或关闭所有映射器配置文件中已配置的任何缓存
	- 支持 true | false	
	- 默认 true

- **属性lazyLoadingEnabled**	
	- 延迟加载的全局开关。当开启时，所有关联对象都会延迟加载。 特定关联关系中可通过设置 **fetchType** 属性来覆盖该项的开关状态。	
	- 支持 true | false	
	- 默认 false

- **属性 aggressiveLazyLoading**
	- 开启时，任一方法的调用都会加载该对象的所有延迟加载属性。 否则，每个延迟加载属性会按需加载（参考 **lazyLoadTriggerMethods**)。	
	- 支持 true | false	
	- 默认 false （在 3.4.1 及之前的版本中默认为 true）

- **属性 multipleResultSetsEnabled**
	- 是否允许单个语句返回多结果集（需要数据库驱动支持）。	
	- 支持 true | false	
	- 默认 true

- **属性 useColumnLabel**
	- 使用列标签代替列名。实际表现依赖于数据库驱动，具体可参考数据库驱动的相关文档，或通过对比测试来观察。	
	- 支持 true | false	
	- 默认 true

- **属性 useGeneratedKeys**
	- 允许 JDBC 支持自动生成主键，需要数据库驱动支持。如果设置为 true，将强制使用自动生成主键。尽管一些数据库驱动不支持此特性，但仍可正常工作（如 **Derby**）。	
	- 支持 true | false	
	- 默认 false

- **属性 autoMappingBehavior**
	- 指定 MyBatis 应如何自动映射列到字段或属性。 NONE 表示关闭自动映射；PARTIAL 只会自动映射没有定义嵌套结果映射的字段。 FULL 会自动映射任何复杂的结果集（无论是否嵌套）。	
	- 支持 NONE, PARTIAL, FULL	
	- 默认 PARTIAL

- **属性 autoMappingUnknownColumnBehavior**
	- 指定发现自动映射目标未知列（或未知属性类型）的行为。
		- NONE: 不做任何反应
		- WARNING: 输出警告日志（ *org.apache.ibatis.session.AutoMappingUnknownColumnBehavior* 的日志等级必须设置为 WARN）
		- FAILING: 映射失败 (抛出 SqlSessionException)	
	- 支持 NONE, WARNING, FAILING	
	- 默认 NONE

- **属性 defaultExecutorType**
	- 配置默认的执行器。SIMPLE 就是普通的执行器；REUSE 执行器会重用预处理语句（PreparedStatement）； BATCH 执行器不仅重用语句还会执行批量更新。	
	- 支持 SIMPLE REUSE BATCH	
	- 默认 SIMPLE

- **属性 defaultStatementTimeout**
	- 设置超时时间，它决定数据库驱动等待数据库响应的秒数。
	- 支持 任意正整数	
	- 默认 未设置 (null)
	
- **属性 defaultFetchSize**
	- 动的结果集获取数量（fetchSize）设置一个建议值。此参数只可以在查询设置中被覆盖。
	- 支持 任意正整数	
	- 默认 未设置 (null)

- **属性 defaultResultSetType**
	- 指定语句默认的滚动策略。（新增于 3.5.2）	
	- 支持 FORWARD_ONLY | SCROLL_SENSITIVE | SCROLL_INSENSITIVE | DEFAULT（等同于未设置）	
	- 默认 未设置 (null)

- **属性 safeRowBoundsEnabled**
	- 是否允许在嵌套语句中使用分页（RowBounds）。如果允许使用则设置为 false。	
	- 支持 true | false	
	- 默认 false

- **属性 safeResultHandlerEnabled**
	- 是否允许在嵌套语句中使用结果处理器（ResultHandler）。如果允许使用则设置为 false。
	- 支持 true | false	
	- 默认 true

- **属性 mapUnderscoreToCamelCase**
	- 是否开启驼峰命名自动映射，即从经典数据库列名 A_COLUMN 映射到经典 Java 属性名 aColumn。	
	- 支持 true | false	
	- 默认 false

- **属性 localCacheScope**
	- MyBatis 利用本地缓存机制（Local Cache）防止循环引用和加速重复的嵌套查询。 默认值为 SESSION，会缓存一个会话中执行的所有查询。 若设置值为 STATEMENT，本地缓存将仅用于执行语句，对相同 SqlSession 的不同查询将不会进行缓存。	
	- 支持 SESSION | STATEMENT	
	- 默认 SESSION

- **属性 jdbcTypeForNull**
	- 当没有为参数指定特定的 JDBC 类型时，空值的默认 JDBC 类型。 某些数据库驱动需要指定列的 JDBC 类型，多数情况直接用一般类型即可，比如 NULL、VARCHAR 或 OTHER。	
	- JdbcType 常量，常用值：NULL、VARCHAR 或 OTHER。	
	- 默认 OTHER

- **属性 lazyLoadTriggerMethods**
	- 指定对象的哪些方法触发一次延迟加载。	
	- 支持 用逗号分隔的方法列表。	
	- 默认 equals,clone,hashCode,toString

- **属性 defaultScriptingLanguage**
	- 指定动态 SQL 生成使用的默认脚本语言。	
	- 支持 一个类型别名或全限定类名。
	- 默认 *org.apache.ibatis.scripting.xmltags.XMLLanguageDriver*

- **属性 defaultEnumTypeHandler**
	- 指定 Enum 使用的默认 TypeHandler 。（新增于 3.4.5）	
	- 支持 一个类型别名或全限定类名。	
	- 默认 *org.apache.ibatis.type.EnumTypeHandler*

- **属性 callSettersOnNulls**
	- 指定当结果集中值为 null 的时候是否调用映射对象的 setter（map 对象时为 put）方法，这在依赖于 Map.keySet() 或 null 值进行初始化时比较有用。注意基本类型（int、boolean 等）是不能设置成 null 的。	
	- 支持 true | false	
	- 默认 false

- **属性 returnInstanceForEmptyRow**
	- 当返回行的所有列都是空时，MyBatis默认返回 null。 当开启这个设置时，MyBatis会返回一个空实例。 请注意，它也适用于嵌套的结果集（如集合或关联）。（新增于 3.4.2）	
	- 支持 true | false	
	- 默认 false

- **属性 logPrefix**
	- 指定 MyBatis 增加到日志名称的前缀。	
	- 支持 任何字符串	
	- 默认 未设置

- **属性 logImpl**
	- 指定 MyBatis 所用日志的具体实现，未指定时将自动查找。
	- 支持 SLF4J | LOG4J | LOG4J2 | JDK_LOGGING | COMMONS_LOGGING | STDOUT_LOGGING | NO_LOGGING	
	- 默认 未设置

- **属性 proxyFactory**
	- 指定 Mybatis 创建可延迟加载对象所用到的代理工具。	
	- 支持 CGLIB | JAVASSIST	
	- 默认 JAVASSIST （**MyBatis 3.3 以上**）

- **属性 vfsImpl**
	- 指定 VFS 的实现	
	- 支持 自定义 VFS 的实现的类全限定名，以逗号分隔。	
	- 默认 未设置

- **属性 useActualParamName**
	- 允许使用方法签名中的名称作为语句参数名称。 为了使用该特性，你的项目必须采用 Java 8 编译，并且加上 -parameters 选项。（新增于 3.4.1）	
	- 支持 true | false	
	- 默认 true

- **属性 configurationFactory**
	- 指定一个提供 Configuration 实例的类。 这个被返回的 Configuration 实例用来加载被反序列化对象的延迟加载属性值。 这个类必须包含一个签名为static Configuration getConfiguration() 的方法。（新增于 3.2.3）	
	- 支持 一个类型别名或完全限定类名。	
	- 默认 未设置

- **属性 shrinkWhitespacesInSql**
	- 从SQL中删除多余的空格字符。请注意，这也会影响SQL中的文字字符串。 (新增于 3.5.5)
	- 支持 true | false	
	- 默认 false

- **属性 defaultSqlProviderType**
	- 指定一个本身拥查询方法的类（ 从 3.5.6 开始 ），这个类可以配置在注解 @SelectProvider 的 type 属性值上。
	- 支持 一个类型别名或完全限定类名。
	- 默认 未设置



> settings 支持了特别多功能支持，其实常规开发中使用到的属性项不会特别多，除非项目有特殊要求，所以建议大家把这些设置当做字典即可，**不必详记** 每一个属性使用，需要时翻阅研读。



##### 3、typeAliases（类型别名）

***

类型别名可以给 Java 类型设置一个简称。 它仅用于 XML 配置，意在降低冗余的全限定类名书写，因为书写类的全限定名太长了，我们希望有一个简称来指代它。类型别名在 Mybatis 中分为 **系统内置** 和 **用户自定义** 两类，Mybatis 会在解析配置文件时把 typeAliases 实例存储进入 Configuration 对象中，需要使用时直接获取。

一般我们可以自定义别名，例如：



```xml
<typeAliases>
  <typeAlias alias="Author" type="domain.blog.Author"/>
  <typeAlias alias="Blog" type="domain.blog.Blog"/> 
</typeAliases>
```



像这样配置时，我们就可以在任何需要使用 domain.blog.Author 的地方，直接使用别名 author 。

但是，如果遇到项目中特别多 Java 类需要配置别名，怎么更快的设置呢？

可以指定一个包名进行扫描，MyBatis 会在包名下面扫描需要的 Java Bean，比如：



```xml
<typeAliases>
  <package name="domain.blog"/>
</typeAliases>
```



每一个在包 domain.blog 中的 Java Bean，在没有注解的情况下，会使用 Bean 的首字母小写的非限定类名来作为它的别名。 比如 domain.blog.Author 的别名为 author；若有 **注解** ，则别名为其自定义的注解值。见下面的例子：



```java
@Alias("myAuthor")
public class Author {
    ...
}
```



Mybatis 已经为许多常见的 Java 类型内建了相应的类型别名。下面就是一些为常见的 Java 类型内建的类型别名。它们都是不区分大小写的，注意，为了应对原始类型的命名重复，采取了特殊的命名风格，可以发现 **基本类型** 的别名前缀都有下划线  **‘_’**，而基本类型的 **包装类** 则没有，这个需要注意：



- 别名 _byte，对应的类型是：byte
- 别名 _long，对应的类型是：long
- 别名 _short，对应的类型是：short
- 别名 _int，对应的类型是：int
- 别名 _integer，对应的类型是：int
- 别名 _double，对应的类型是：double
- 别名 _float，对应的类型是：float
- 别名 _boolean，对应的类型是：boolean
- 别名 string，对应的类型是：String
- 别名 byte，对应的类型是：Byte
- 别名 long，对应的类型是：Long
- 别名 short，对应的类型是：Short
- 别名 int，对应的类型是：Integer
- 别名 integer，对应的类型是：Integer
- 别名 double，对应的类型是：Double
- 别名 float，对应的类型是：Float
- 别名 boolean，对应的类型是：Boolean
- 别名 date，对应的类型是：Date
- 别名 decimal，对应的类型是：BigDecimal
- 别名 bigdecimal，对应的类型是：BigDecimal
- 别名 object，对应的类型是：Object
- 别名 map，对应的类型是：Map
- 别名 hashmap，对应的类型是：HashMap
- 别名 list，对应的类型是：List
- 别名 arraylist，对应的类型是：ArrayList
- 别名 collection，对应的类型是：Collection
- 别名 iterator，对应的类型是：Iterator



**我们可以通过源码查看内置的类型别名的注册信息。**

具体源码路径在 org.apache.ibatis.type.TypeAliasRegistry # TypeAliasRegistry() ：



```java
public TypeAliasRegistry() {
    registerAlias("string", String.class);

    registerAlias("byte", Byte.class);
    registerAlias("long", Long.class);
    registerAlias("short", Short.class);
    registerAlias("int", Integer.class);
    registerAlias("integer", Integer.class);
    registerAlias("double", Double.class);
    registerAlias("float", Float.class);
    registerAlias("boolean", Boolean.class);

    registerAlias("byte[]", Byte[].class);
    registerAlias("long[]", Long[].class);
    registerAlias("short[]", Short[].class);
    registerAlias("int[]", Integer[].class);
    registerAlias("integer[]", Integer[].class);
    registerAlias("double[]", Double[].class);
    registerAlias("float[]", Float[].class);
    registerAlias("boolean[]", Boolean[].class);

    registerAlias("_byte", byte.class);
    registerAlias("_long", long.class);
    registerAlias("_short", short.class);
    registerAlias("_int", int.class);
    registerAlias("_integer", int.class);
    registerAlias("_double", double.class);
    registerAlias("_float", float.class);
    registerAlias("_boolean", boolean.class);

    registerAlias("_byte[]", byte[].class);
    registerAlias("_long[]", long[].class);
    registerAlias("_short[]", short[].class);
    registerAlias("_int[]", int[].class);
    registerAlias("_integer[]", int[].class);
    registerAlias("_double[]", double[].class);
    registerAlias("_float[]", float[].class);
    registerAlias("_boolean[]", boolean[].class);

    registerAlias("date", Date.class);
    registerAlias("decimal", BigDecimal.class);
    registerAlias("bigdecimal", BigDecimal.class);
    registerAlias("biginteger", BigInteger.class);
    registerAlias("object", Object.class);

    registerAlias("date[]", Date[].class);
    registerAlias("decimal[]", BigDecimal[].class);
    registerAlias("bigdecimal[]", BigDecimal[].class);
    registerAlias("biginteger[]", BigInteger[].class);
    registerAlias("object[]", Object[].class);

    registerAlias("map", Map.class);
    registerAlias("hashmap", HashMap.class);
    registerAlias("list", List.class);
    registerAlias("arraylist", ArrayList.class);
    registerAlias("collection", Collection.class);
    registerAlias("iterator", Iterator.class);

    registerAlias("ResultSet", ResultSet.class);
  }
```





> 别名是不区分大小写的，同时也支持数组类型，只需要加 “[]” 即可使用，比如 Long 数组别名我们可以用 long[] 直接代替，例如在实际开发中，int 、INT 、integer 、INTEGER 都是代表 Integer ， 这里主要由于 MyBatis 在注册别名的时候会全部转为小写字母进行存储，另外以上列表 **无需牢记**，仅仅在需要使用的时候查阅即可，基本也都可以看得明白。




##### 4、typeHandlers（类型处理器）

***

MyBatis 在设置预处理SQL语句（PreparedStatement）中所需要的 **参数** 或从 **结果集** ResultSet 中获取对象时， 都会用类型处理器将获取到的值以合适的方式转换成 Java 类型。



![在这里插入图片描述](https://img-blog.csdnimg.cn/20201208231131325.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01yUmlnaHRfc2VubHlwYW4=,size_16,color_FFFFFF,t_70#pic_center)



**类型处理器，主要用于处理 Java 类型与 JDBC 类型的映射匹配关系处理，下表描述了一些默认的类型处理器。**



- 类型处理器 BooleanTypeHandler	
	- Java 类型：java.lang.Boolean, boolean	
	- JDBC 类型：数据库兼容的 BOOLEAN
- 类型处理器 ByteTypeHandler	
	- Java 类型：java.lang.Byte, byte	
	- JDBC 类型：数据库兼容的 NUMERIC 或 BYTE
- 类型处理器 ShortTypeHandler	
	- Java 类型：java.lang.Short, short	
	- JDBC 类型：数据库兼容的 NUMERIC 或 SMALLINT
- 类型处理器 IntegerTypeHandler	
	- Java 类型：java.lang.Integer, int	
	- JDBC 类型：数据库兼容的 NUMERIC 或 INTEGER
- 类型处理器 LongTypeHandler	
	- Java 类型：java.lang.Long, long	
	- JDBC 类型：数据库兼容的 NUMERIC 或 BIGINT
- 类型处理器 FloatTypeHandler	
	- Java 类型：java.lang.Float, float	
	- JDBC 类型：数据库兼容的 NUMERIC 或 FLOAT
- 类型处理器 DoubleTypeHandler	
	- Java 类型：java.lang.Double, double	
	- JDBC 类型：数据库兼容的 NUMERIC 或 DOUBLE
- 类型处理器 BigDecimalTypeHandler	
	- Java 类型：java.math.BigDecimal	
	- JDBC 类型：数据库兼容的 NUMERIC 或 DECIMAL
- 类型处理器 StringTypeHandler	
	- Java 类型：java.lang.String	
	- JDBC 类型：CHAR, VARCHAR
- 类型处理器 ClobReaderTypeHandler	
	- Java 类型：java.io.Reader	
	- JDBC 类型：-
- 类型处理器 ClobTypeHandler	
	- Java 类型：java.lang.String	
	- JDBC 类型：CLOB, LONGVARCHAR
- 类型处理器 NStringTypeHandler	
	- Java 类型：java.lang.String	
	- JDBC 类型：NVARCHAR, NCHAR
- 类型处理器 NClobTypeHandler	
	- Java 类型：java.lang.String	
	- JDBC 类型：NCLOB
- 类型处理器 BlobInputStreamTypeHandler	
	- Java 类型：java.io.InputStream	
	- JDBC 类型：-
- 类型处理器 ByteArrayTypeHandler	
	- Java 类型：byte[]	
	- JDBC 类型：数据库兼容的字节流类型
- 类型处理器 BlobTypeHandler	
	- Java 类型：byte[]	
	- JDBC 类型：BLOB, LONGVARBINARY
- 类型处理器 DateTypeHandler	
	- Java 类型：java.util.Date	
	- JDBC 类型：TIMESTAMP
- 类型处理器 DateOnlyTypeHandler	
	- Java 类型：java.util.Date	
	- JDBC 类型：DATE
- 类型处理器 TimeOnlyTypeHandler	
	- Java 类型：java.util.Date	
	- JDBC 类型：TIME
- 类型处理器 SqlTimestampTypeHandler	
	- Java 类型：java.sql.Timestamp	
	- JDBC 类型：TIMESTAMP
- 类型处理器 SqlDateTypeHandler	
	- Java 类型：java.sql.Date	
	- JDBC 类型：DATE
- 类型处理器 SqlTimeTypeHandler	
	- Java 类型：java.sql.Time	
	- JDBC 类型：TIME
- 类型处理器 ObjectTypeHandler	
	- Java 类型：Any	
	- JDBC 类型：OTHER 或未指定类型
- 类型处理器 EnumTypeHandler	
	- Java 类型：Enumeration Type	
	- JDBC 类型：VARCHAR 或任何兼容的字符串类型，用来存储枚举的名称（而不是索引序数值）
- 类型处理器 EnumOrdinalTypeHandler	
	- Java 类型：Enumeration Type	
	- JDBC 类型：任何兼容的 NUMERIC 或 DOUBLE 类型，用来存储枚举的序数值（而不是名称）。
- 类型处理器 SqlxmlTypeHandler	
	- Java 类型：java.lang.String	
	- JDBC 类型：SQLXML
- 类型处理器 InstantTypeHandler	
	- Java 类型：java.time.Instant	
	- JDBC 类型：TIMESTAMP
- 类型处理器 LocalDateTimeTypeHandler	
	- Java 类型：java.time.LocalDateTime	
	- JDBC 类型：TIMESTAMP
- 类型处理器 LocalDateTypeHandler	
	- Java 类型：java.time.LocalDate	
	- JDBC 类型：DATE
- 类型处理器 LocalTimeTypeHandler	
	- Java 类型：java.time.LocalTime	
	- JDBC 类型：TIME
- 类型处理器 OffsetDateTimeTypeHandler	
	- Java 类型：java.time.OffsetDateTime	
	- JDBC 类型：TIMESTAMP
- 类型处理器 OffsetTimeTypeHandler	
	- Java 类型：java.time.OffsetTime	
	- JDBC 类型：TIME
- 类型处理器 ZonedDateTimeTypeHandler	
	- Java 类型：java.time.ZonedDateTime	
	- JDBC 类型：TIMESTAMP
- 类型处理器 YearTypeHandler	
	- Java 类型：java.time.Year	
	- JDBC 类型：INTEGER
- 类型处理器 MonthTypeHandler	
	- Java 类型：java.time.Month	
	- JDBC 类型：INTEGER
- 类型处理器 YearMonthTypeHandler	
	- Java 类型：java.time.YearMonth	
	- JDBC 类型：VARCHAR 或 LONGVARCHAR
- 类型处理器 JapaneseDateTypeHandler	
	- Java 类型：java.time.chrono.JapaneseDate	
	- JDBC 类型：DATE





**我们可以通过源码查看内置的类型别名的注册信息。**

具体源码路径在 org.apache.ibatis.type.TypeHandlerRegistry # TypeHandlerRegistry() ：



```java
 public TypeHandlerRegistry() {
    register(Boolean.class, new BooleanTypeHandler());
    register(boolean.class, new BooleanTypeHandler());
    register(JdbcType.BOOLEAN, new BooleanTypeHandler());
    register(JdbcType.BIT, new BooleanTypeHandler());

    register(Byte.class, new ByteTypeHandler());
    register(byte.class, new ByteTypeHandler());
    register(JdbcType.TINYINT, new ByteTypeHandler());

    register(Short.class, new ShortTypeHandler());
    register(short.class, new ShortTypeHandler());
    register(JdbcType.SMALLINT, new ShortTypeHandler());

    register(Integer.class, new IntegerTypeHandler());
    register(int.class, new IntegerTypeHandler());
    register(JdbcType.INTEGER, new IntegerTypeHandler());

    register(Long.class, new LongTypeHandler());
    register(long.class, new LongTypeHandler());

    register(Float.class, new FloatTypeHandler());
    register(float.class, new FloatTypeHandler());
    register(JdbcType.FLOAT, new FloatTypeHandler());

    register(Double.class, new DoubleTypeHandler());
    register(double.class, new DoubleTypeHandler());
    register(JdbcType.DOUBLE, new DoubleTypeHandler());

    register(Reader.class, new ClobReaderTypeHandler());
    register(String.class, new StringTypeHandler());
    register(String.class, JdbcType.CHAR, new StringTypeHandler());
    register(String.class, JdbcType.CLOB, new ClobTypeHandler());
    register(String.class, JdbcType.VARCHAR, new StringTypeHandler());
    register(String.class, JdbcType.LONGVARCHAR, new ClobTypeHandler());
    register(String.class, JdbcType.NVARCHAR, new NStringTypeHandler());
    register(String.class, JdbcType.NCHAR, new NStringTypeHandler());
    register(String.class, JdbcType.NCLOB, new NClobTypeHandler());
    register(JdbcType.CHAR, new StringTypeHandler());
    register(JdbcType.VARCHAR, new StringTypeHandler());
    register(JdbcType.CLOB, new ClobTypeHandler());
    register(JdbcType.LONGVARCHAR, new ClobTypeHandler());
    register(JdbcType.NVARCHAR, new NStringTypeHandler());
    register(JdbcType.NCHAR, new NStringTypeHandler());
    register(JdbcType.NCLOB, new NClobTypeHandler());

    register(Object.class, JdbcType.ARRAY, new ArrayTypeHandler());
    register(JdbcType.ARRAY, new ArrayTypeHandler());

    register(BigInteger.class, new BigIntegerTypeHandler());
    register(JdbcType.BIGINT, new LongTypeHandler());

    register(BigDecimal.class, new BigDecimalTypeHandler());
    register(JdbcType.REAL, new BigDecimalTypeHandler());
    register(JdbcType.DECIMAL, new BigDecimalTypeHandler());
    register(JdbcType.NUMERIC, new BigDecimalTypeHandler());

    register(InputStream.class, new BlobInputStreamTypeHandler());
    register(Byte[].class, new ByteObjectArrayTypeHandler());
    register(Byte[].class, JdbcType.BLOB, new BlobByteObjectArrayTypeHandler());
    register(Byte[].class, JdbcType.LONGVARBINARY, new BlobByteObjectArrayTypeHandler());
    register(byte[].class, new ByteArrayTypeHandler());
    register(byte[].class, JdbcType.BLOB, new BlobTypeHandler());
    register(byte[].class, JdbcType.LONGVARBINARY, new BlobTypeHandler());
    register(JdbcType.LONGVARBINARY, new BlobTypeHandler());
    register(JdbcType.BLOB, new BlobTypeHandler());

    register(Object.class, UNKNOWN_TYPE_HANDLER);
    register(Object.class, JdbcType.OTHER, UNKNOWN_TYPE_HANDLER);
    register(JdbcType.OTHER, UNKNOWN_TYPE_HANDLER);

    register(Date.class, new DateTypeHandler());
    register(Date.class, JdbcType.DATE, new DateOnlyTypeHandler());
    register(Date.class, JdbcType.TIME, new TimeOnlyTypeHandler());
    register(JdbcType.TIMESTAMP, new DateTypeHandler());
    register(JdbcType.DATE, new DateOnlyTypeHandler());
    register(JdbcType.TIME, new TimeOnlyTypeHandler());

    register(java.sql.Date.class, new SqlDateTypeHandler());
    register(java.sql.Time.class, new SqlTimeTypeHandler());
    register(java.sql.Timestamp.class, new SqlTimestampTypeHandler());

    // mybatis-typehandlers-jsr310
    if (Jdk.dateAndTimeApiExists) {
      Java8TypeHandlersRegistrar.registerDateAndTimeHandlers(this);
    }

    // issue #273
    register(Character.class, new CharacterTypeHandler());
    register(char.class, new CharacterTypeHandler());
  }
```



>  从 3.4.5 开始，MyBatis 默认支持 JSR-310（日期和时间 API） ,可以在以上源码上看到新增支持。





**一般，你可以重写已有的类型处理器**，

**或根据业务需要创建你自己的类型处理器，**

**以处理不支持的类型或非标准的类型。** 



具体做法为：

1、实现 `org.apache.ibatis.type.TypeHandler` 接口；

2、继承 `org.apache.ibatis.type.BaseTypeHandler` 类。



> 本身 BaseTypeHandler 类作为抽象类就已经实现了 TypeHandler 接口。



所以我们看到接口 TypeHandler  定义了四个方法：



```java
public interface TypeHandler<T> {

  void setParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException;

  T getResult(ResultSet rs, String columnName) throws SQLException;

  T getResult(ResultSet rs, int columnIndex) throws SQLException;

  T getResult(CallableStatement cs, int columnIndex) throws SQLException;

}
```



从方法名 **setParameter** 和  **getResult** 我们就可以知道，是发生在预编译时设置参数（增删改查传入参数）与查询结果集后转换为 Java 类型时，类型处理器发挥作用。



具体实现如下，先自定义类型处理器类 MyExampleTypeHandler ：

```java
// MyExampleTypeHandler.java
@MappedJdbcTypes(JdbcType.VARCHAR)
public class MyExampleTypeHandler extends BaseTypeHandler<String> {

  @Override
  public void setNonNullParameter(PreparedStatement ps, int i, String parameter, JdbcType jdbcType) throws SQLException {
    ps.setString(i, parameter);
  }

  @Override
  public String getNullableResult(ResultSet rs, String columnName) throws SQLException {
    return rs.getString(columnName);
  }

  @Override
  public String getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
    return rs.getString(columnIndex);
  }

  @Override
  public String getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
    return cs.getString(columnIndex);
  }
}
```



自定义类已设定：JdbcType.VARCHAR 与 String 类做映射转换（**注解和泛型已体现**）。

其次，在核心配置文件中设置类型处理器：  



```xml
<!-- mybatis-config.xml -->
<typeHandlers>
  <typeHandler handler="org.mybatis.example.MyExampleTypeHandler"/>
</typeHandlers>
```



或者不使用注解方式的话，取消 @MappedJdbcTypes(JdbcType.VARCHAR) 注解，直接在 xml 配置中指定 jdbcType 与 javaType 映射 ：



```xml
<!-- mybatis-config.xml -->
<typeHandlers>
  <typeHandler jdbcType="VARCHAR" javaType="string" handler="org.mybatis.example.MyExampleTypeHandler"/>
</typeHandlers>
```



>  记住， typeHandler 的配置方式优先级高于注解配置方式。



这里，自定义类型处理器将会覆盖已有的处理 Java String 类型的属性以及 VARCHAR 类型的参数和结果的类型处理器，基本以上步骤就已经自定了 **JdbcType.VARCHAR** 与 **String**类做映射转换。



**其实到这里，我们基本也就完成了类型处理器的自定义转换，但是有一种情况，就是我们希望我们自定义的类型处理器只处理某一个 Java 实体中的 JdbcType.VARCHAR 与 String 类映射转换，其它实体的处理还是使用系统内置的转换，很简单，我们只需要把以上两步都去掉，在自定义类型处理类的注解@javaType和@MappedJdbcTypes都移除，配置文件中把 typehandler 属性配置移除，直接在映射文件中编写：**



```xml
    <resultMap id="MyResultMap" type="com.panshenlian.pojo.User">
        <!-- id为int类型，但是没指定自定义类型处理器，不受影响-->
        <id column="id" property="id" />
        <!-- username为String类型，但是没指定自定义类型处理器，不受影响-->
        <id column="username" property="username" />
        <!-- password为String类型，但是没指定自定义类型处理器，不受影响-->
        <id column="password" property="password" />
        
        
        <!-- birthday为String类型，指定自定义类型处理器，受影响！-->
        <id column="birthday" property="birthday"  typeHandler="com.panshenlian.typeHandler.MyStringHandler"/>
        
    </resultMap>
    <select id="findAll" resultType="com.panshenlian.pojo.User" resultMap="MyResultMap">
        select * from User
    </select>
```



User 实体参考：



```java
package com.panshenlian.pojo;

/**
 * @Author: panshenlian
 * @Description: 用户实体
 * @Date: Create in 2:08 2020/12/07
 */
public class User {
    private int id;
    private String username;
    private String password;
    private String birthday;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

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
}
```



最终自定义类型处理器，只会对 birthday 字段产生影响，其余字段均不受影响。



> 自定义类型处理器很灵活，只有当指定对应的 Java 类型和 Jdbc 类型时，处理器才会具体生效，否则 Mybatis 会默认匹配系统内置的类型处理器。



另外，当我们自定义很多类型处理器时，系统支持配置包扫描的方式查找类型处理器：



```xml
<!-- mybatis-config.xml -->
<typeHandlers>
  <package name="org.mybatis.example"/>
</typeHandlers>
```



>  注意在使用自动发现功能的时候，只能通过注解方式来指定 JDBC 的类型。



你可以创建能够处理多个类的泛型类型处理器。为了使用泛型类型处理器， 需要增加一个接受该类的 class 作为参数的构造器，这样 MyBatis 会在构造一个类型处理器实例的时候传入一个具体的类。



```java
//GenericTypeHandler.java
public class GenericTypeHandler<E extends MyObject> extends BaseTypeHandler<E> {

  private Class<E> type;

  public GenericTypeHandler(Class<E> type) {
    if (type == null) throw new IllegalArgumentException("Type argument cannot be null");
    this.type = type;
  }
  ...
```



**处理枚举类型**



若想映射枚举类型 `Enum`，则需要从 `EnumTypeHandler` 或者 `EnumOrdinalTypeHandler` 中选择一个来使用。

比如说我们想存储取近似值时用到的舍入模式。默认情况下，MyBatis 会利用 `EnumTypeHandler` 来把 `Enum` 值转换成对应的名字。



> **注意 `EnumTypeHandler` 在某种意义上来说是比较特别的，其它的处理器只针对某个特定的类，而它不同，它会处理任意继承了 `Enum` 的类。**
>
> 不过，我们可能不想存储名字，相反我们的 DBA 会坚持使用整形值代码。那也一样简单：在配置文件中把 `EnumOrdinalTypeHandler` 加到 `typeHandlers` 中即可， 这样每个 `RoundingMode` 将通过他们的序数值来映射成对应的整形数值。



```xml
<!-- mybatis-config.xml -->
<typeHandlers>
  <typeHandler handler="org.apache.ibatis.type.EnumOrdinalTypeHandler" javaType="java.math.RoundingMode"/>
</typeHandlers>
```



但要是你想在一个地方将 `Enum` 映射成字符串，在另外一个地方映射成整形值呢？



自动映射器（auto-mapper）会自动地选用 `EnumOrdinalTypeHandler` 来处理枚举类型， 所以如果我们想用普通的 `EnumTypeHandler`，就必须要显式地为那些 SQL 语句设置要使用的类型处理器。



> 下一篇文章我们才开始介绍映射器 mapper.xml 文件，如果你首次阅读映射器概念，可能需要先跳过这里先去了解 mapper.xml 文件配置，再回头过来看。



```xml
<!DOCTYPE mapper
    PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.apache.ibatis.submitted.rounding.Mapper">
	<resultMap type="org.apache.ibatis.submitted.rounding.User" id="usermap">
		<id column="id" property="id"/>
		<result column="name" property="name"/>
		<result column="funkyNumber" property="funkyNumber"/>
		<result column="roundingMode" property="roundingMode"/>
	</resultMap>

	<select id="getUser" resultMap="usermap">
		select * from users
	</select>
	<insert id="insert">
	    insert into users (id, name, funkyNumber, roundingMode) values (
	    	#{id}, #{name}, #{funkyNumber}, #{roundingMode}
	    )
	</insert>

	<resultMap type="org.apache.ibatis.submitted.rounding.User" id="usermap2">
		<id column="id" property="id"/>
		<result column="name" property="name"/>
		<result column="funkyNumber" property="funkyNumber"/>
		<result column="roundingMode" property="roundingMode" typeHandler="org.apache.ibatis.type.EnumTypeHandler"/>
	</resultMap>
	<select id="getUser2" resultMap="usermap2">
		select * from users2
	</select>
	<insert id="insert2">
	    insert into users2 (id, name, funkyNumber, roundingMode) values (
	    	#{id}, #{name}, #{funkyNumber}, #{roundingMode, typeHandler=org.apache.ibatis.type.EnumTypeHandler}
	    )
	</insert>

</mapper>
```



注意，这里的 select 语句强制使用 `resultMap` 来代替 `resultType`。




##### 5、objectFactory（对象工厂）

***

每次 MyBatis 创建结果对象的新实例时，它都会使用一个对象工厂（ObjectFactory）实例来完成实例化工作。 默认的对象工厂需要做的仅仅是实例化目标类，要么通过默认无参构造方法，要么通过存在的参数映射来调用带有参数的构造方法。 如果想覆盖对象工厂的默认行为，可以通过创建自己的对象工厂来实现。比如：



```java
// ExampleObjectFactory.java
public class ExampleObjectFactory extends DefaultObjectFactory {
      public Object create(Class type) {
        return super.create(type);
      }
      public Object create(Class type, List constructorArgTypes, List constructorArgs) {
        return super.create(type, constructorArgTypes, constructorArgs);
      }
      public void setProperties(Properties properties) {
        super.setProperties(properties);
      }
      public  boolean isCollection(Class type) {
        return Collection.class.isAssignableFrom(type);
      }
}
```

```xml
<!-- mybatis-config.xml -->
<objectFactory type="org.mybatis.example.ExampleObjectFactory">
  <property name="someProperty" value="100"/>
</objectFactory>
```



ObjectFactory 接口很简单，它包含两个创建用的方法，一个是处理默认构造方法的，另外一个是处理带参数的构造方法的。 最后，setProperties 方法可以被用来配置 ObjectFactory，在初始化你的 ObjectFactory 实例后， objectFactory 元素体中定义的属性会被传递给 setProperties 方法。



> 正常情况下我们不需要使用到，或者说不建议使用，除非业务上确实需要对一个特殊实体初始构造做一个默认属性值配置等处理，其余情况不推荐使用，避免产生不可控风险。





##### 6、plugins（插件）

***

MyBatis 允许你在映射语句执行过程中的某一点进行拦截调用。默认情况下，MyBatis 允许使用插件来拦截的方法调用包括：

- **Executor** (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed)
- **ParameterHandler** (getParameterObject, setParameters)
- **ResultSetHandler**  (handleResultSets, handleOutputParameters)
- **StatementHandler** (prepare, parameterize, batch, update, query)



插件功能主要开放拦截的对象就是以上列举的 Mybatis 四大组件，后续我们讲 Mybatis 核心API 的时候或者单独介绍自定义插件的时候会详细说明，这里大家可以先大致了解，包括数据分页、操作日志增强、sql 性能监控等都可以通过插件实现，不过会存储改造的风险，毕竟这些都是核心的 API 。



> 这四大类中方法具体可以通过查看每个方法的签名来发现，或者直接查看 MyBatis 发行包中的源代码。 如果你想做的不仅仅是监控方法的调用，那么你最好相当了解要重写的方法的行为。 因为在试图修改或重写已有方法的行为时，很可能会破坏 MyBatis 的核心模块。 这些都是更底层的类和方法，所以使用插件的时候要特别当心。



通过 MyBatis 提供的强大机制，使用插件是非常简单的，只需实现 Interceptor 接口，并指定想要拦截的类，方法，参数（由于有多态的情况）即可。



```java
// ExamplePlugin.java
@Intercepts({
    @Signature(
  		type= Executor.class,
  		method = "update",
  		args = {MappedStatement.class,Object.class})})
public class ExamplePlugin implements Interceptor {
  private Properties properties = new Properties();
  public Object intercept(Invocation invocation) throws Throwable {
    // implement pre processing if need
    Object returnObject = invocation.proceed();
    // implement post processing if need
    return returnObject;
  }
  public void setProperties(Properties properties) {
    this.properties = properties;
  }
}
```



```xml
<!-- mybatis-config.xml -->
<plugins>
  <plugin interceptor="org.mybatis.example.ExamplePlugin">
    <property name="someProperty" value="100"/>
  </plugin>
</plugins>
```



上面的插件将会拦截在 Executor 实例中所有的 “update” 方法调用， 这里的 Executor 是负责执行底层映射语句的内部对象。



**覆盖配置类** 「 谨慎使用，存在风险 」



> 除了用插件来修改 MyBatis 核心行为以外，还可以通过完全覆盖配置类来达到目的。只需继承配置类后覆盖其中的某个方法，再把它传递到 SqlSessionFactoryBuilder.build(myConfig) 方法即可。再次重申，这可能会极大影响 MyBatis 的行为，务请慎之又慎。






##### 7、environments（环境配置）

***

MyBatis 可以配置成适应多种环境，这种机制有助于将 SQL 映射应用于多种数据库之中， 现实情况下有多种理由需要这么做。例如，开发、测试和生产环境需要有不同的配置；或者想在具有相同 Schema 的多个生产数据库中使用相同的 SQL 映射。还有许多类似的使用场景。



**不过要记住：尽管可以配置多个环境，但每个 SqlSessionFactory 实例只能选择一种环境。**



所以，如果你想连接两个数据库，就需要创建两个 SqlSessionFactory 实例，每个数据库对应一个。而如果是三个数据库，就需要三个实例，依此类推，记起来很简单：



> 每个数据库对应一个 SqlSessionFactory 实例。



为了指定创建哪种环境，只要将它作为可选的参数传递给 SqlSessionFactoryBuilder 即可。可以接受环境配置的两个方法签名是：



```java
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, environment);
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, environment, properties);
```



如果忽略了环境参数，那么将会加载默认环境，如下所示：



```java
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader);
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, properties);
```



environments 元素定义了如何配置环境。



```xml
<environments default="development">
  <environment id="development">
    <transactionManager type="JDBC">
      <property name="..." value="..."/>
    </transactionManager>
    <dataSource type="POOLED">
      <property name="driver" value="${driver}"/>
      <property name="url" value="${url}"/>
      <property name="username" value="${username}"/>
      <property name="password" value="${password}"/>
    </dataSource>
  </environment>
</environments>
```



注意一些关键点:

- 默认使用的环境 ID（比如：default="development"）。
- 每个 environment 元素定义的环境 ID（比如：id="development"）。
- 事务管理器的配置（比如：type="JDBC"）。
- 数据源的配置（比如：type="POOLED"）。

默认环境和环境 ID 顾名思义。 环境可以随意命名，但务必保证默认的环境 ID 要匹配其中一个环境 ID。



**事务管理器（transactionManager）**



在 MyBatis 中有两种类型的事务管理器（也就是 type="[JDBC|MANAGED]"）：

- JDBC – 这个配置直接使用了 JDBC 的提交和回滚设施，它依赖从数据源获得的连接来管理事务作用域。
- MANAGED – 这个配置几乎没做什么。它从不提交或回滚一个连接，而是让容器来管理事务的整个生命周期（比如 JEE 应用服务器的上下文）。 默认情况下它会关闭连接。然而一些容器并不希望连接被关闭，因此需要将 closeConnection 属性设置为 false 来阻止默认的关闭行为。例如:



```xml
<transactionManager type="MANAGED">
  <property name="closeConnection" value="false"/>
</transactionManager>
```



> 如果你正在使用 Spring + MyBatis，则没有必要配置事务管理器，因为 Spring 模块会使用自带的管理器来覆盖前面的配置。这两种事务管理器类型都不需要设置任何属性。它们其实是类型别名，换句话说，你可以用 TransactionFactory 接口实现类的全限定名或类型别名代替它们。



```java
public interface TransactionFactory {
  default void setProperties(Properties props) { // 从 3.5.2 开始，该方法为默认方法
    // 空实现
  }
  Transaction newTransaction(Connection conn);
  Transaction newTransaction(DataSource dataSource, TransactionIsolationLevel level, boolean autoCommit);
}
```



在事务管理器实例化后，所有在 XML 中配置的属性将会被传递给 setProperties() 方法。你的实现还需要创建一个 Transaction 接口的实现类，这个接口也很简单：



```java
public interface Transaction {
  Connection getConnection() throws SQLException;
  void commit() throws SQLException;
  void rollback() throws SQLException;
  void close() throws SQLException;
  Integer getTimeout() throws SQLException;
}
```



使用这两个接口，你可以完全自定义 MyBatis 对事务的处理。



**数据源（dataSource）**

dataSource 元素使用标准的 JDBC 数据源接口来配置 JDBC 连接对象的资源。



> 大多数 MyBatis 应用程序会按示例中的例子来配置数据源。虽然数据源配置是可选的，但如果要启用延迟加载特性，就必须配置数据源。



有三种内建的数据源类型（也就是 type="[UNPOOLED|POOLED|JNDI]"）：



**UNPOOLED**– 这个数据源的实现会每次请求时打开和关闭连接。虽然有点慢，但对那些数据库连接可用性要求不高的简单应用程序来说，是一个很好的选择。 性能表现则依赖于使用的数据库，对某些数据库来说，使用连接池并不重要，这个配置就很适合这种情形。UNPOOLED 类型的数据源仅仅需要配置以下 5 种属性：

- `driver` – 这是 JDBC 驱动的 Java 类全限定名（并不是 JDBC 驱动中可能包含的数据源类）。
- `url` – 这是数据库的 JDBC URL 地址。
- `username` – 登录数据库的用户名。
- `password` – 登录数据库的密码。
- `defaultTransactionIsolationLevel` – 默认的连接事务隔离级别。
- `defaultNetworkTimeout` – 等待数据库操作完成的默认网络超时时间（单位：毫秒）。查看 `java.sql.Connection#setNetworkTimeout()` 的 API 文档以获取更多信息。



作为可选项，你也可以传递属性给数据库驱动。只需在属性名加上“driver.”前缀即可，例如：

- `driver.encoding=UTF8`



> 这将通过 DriverManager.getConnection(url, driverProperties) 方法传递值为 `UTF8` 的 `encoding` 属性给数据库驱动。



**POOLED**– 这种数据源的实现利用“池”的概念将 JDBC 连接对象组织起来，避免了创建新的连接实例时所必需的初始化和认证时间。 这种处理方式很流行，能使并发 Web 应用快速响应请求。

除了上述提到 UNPOOLED 下的属性外，还有更多属性用来配置 POOLED 的数据源：

- `poolMaximumActiveConnections` – 在任意时间可存在的活动（正在使用）连接数量，默认值：10
- `poolMaximumIdleConnections` – 任意时间可能存在的空闲连接数。
- `poolMaximumCheckoutTime` – 在被强制返回之前，池中连接被检出（checked out）时间，默认值：20000 毫秒（即 20 秒）
- `poolTimeToWait` – 这是一个底层设置，如果获取连接花费了相当长的时间，连接池会打印状态日志并重新尝试获取一个连接（避免在误配置的情况下一直失败且不打印日志），默认值：20000 毫秒（即 20 秒）。
- `poolMaximumLocalBadConnectionTolerance` – 这是一个关于坏连接容忍度的底层设置， 作用于每一个尝试从缓存池获取连接的线程。 如果这个线程获取到的是一个坏的连接，那么这个数据源允许这个线程尝试重新获取一个新的连接，但是这个重新尝试的次数不应该超过 `poolMaximumIdleConnections` 与 `poolMaximumLocalBadConnectionTolerance` 之和。 默认值：3（新增于 3.4.5）
- `poolPingQuery` – 发送到数据库的侦测查询，用来检验连接是否正常工作并准备接受请求。默认是“NO PING QUERY SET”，这会导致多数数据库驱动出错时返回恰当的错误消息。
- `poolPingEnabled` – 是否启用侦测查询。若开启，需要设置 `poolPingQuery` 属性为一个可执行的 SQL 语句（最好是一个速度非常快的 SQL 语句），默认值：false。
- `poolPingConnectionsNotUsedFor` – 配置 poolPingQuery 的频率。可以被设置为和数据库连接超时时间一样，来避免不必要的侦测，默认值：0（即所有连接每一时刻都被侦测 — 当然仅当 poolPingEnabled 为 true 时适用）。





**JNDI** – 这个数据源实现是为了能在如 EJB 或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置一个 JNDI 上下文的数据源引用。这种数据源配置只需要两个属性：

- `initial_context` – 这个属性用来在 InitialContext 中寻找上下文（即，initialContext.lookup(initial_context)）。这是个可选属性，如果忽略，那么将会直接从 InitialContext 中寻找 data_source 属性。
- `data_source` – 这是引用数据源实例位置的上下文路径。提供了 initial_context 配置时会在其返回的上下文中进行查找，没有提供时则直接在 InitialContext 中查找。



> JNDI 可理解是一种仿 windows 注册表形式的数据源。



和其他数据源配置类似，可以通过添加前缀“env.”直接把属性传递给 InitialContext。比如：

- `env.encoding=UTF8`

这就会在 InitialContext 实例化时往它的构造方法传递值为 `UTF8` 的 `encoding` 属性。

你可以通过实现接口 `org.apache.ibatis.datasource.DataSourceFactory` 来使用第三方数据源实现：



```java
public interface DataSourceFactory {
  void setProperties(Properties props);
  DataSource getDataSource();
}
```



`org.apache.ibatis.datasource.unpooled.UnpooledDataSourceFactory` 可被用作父类来构建新的数据源适配器，比如下面这段插入 C3P0 数据源所必需的代码：



```java
import org.apache.ibatis.datasource.unpooled.UnpooledDataSourceFactory;
import com.mchange.v2.c3p0.ComboPooledDataSource;

public class C3P0DataSourceFactory extends UnpooledDataSourceFactory {

  public C3P0DataSourceFactory() {
    this.dataSource = new ComboPooledDataSource();
  }
}
```



为了令其工作，记得在配置文件中为每个希望 MyBatis 调用的 setter 方法增加对应的属性。 下面是一个可以连接至 PostgreSQL 数据库的例子：



```xml
<dataSource type="org.myproject.C3P0DataSourceFactory">
  <property name="driver" value="org.postgresql.Driver"/>
  <property name="url" value="jdbc:postgresql:mydb"/>
  <property name="username" value="postgres"/>
  <property name="password" value="root"/>
</dataSource>
```







##### 8、databaseIdProvider（数据库厂商标识）

***



MyBatis 可以根据不同的数据库厂商执行不同的语句，这种多厂商的支持是基于映射语句中的 `databaseId` 属性。 MyBatis 会加载带有匹配当前数据库 `databaseId` 属性和所有不带 `databaseId` 属性的语句。 如果同时找到带有 `databaseId` 和不带 `databaseId` 的相同语句，则后者会被舍弃。 为支持多厂商特性，只要像下面这样在 mybatis-config.xml 文件中加入 `databaseIdProvider` 即可：



```xml
<databaseIdProvider type="DB_VENDOR" />
```



databaseIdProvider 对应的 DB_VENDOR 实现会将 databaseId 设置为 `DatabaseMetaData#getDatabaseProductName()` 返回的字符串。 由于通常情况下这些字符串都非常长，而且相同产品的不同版本会返回不同的值，你可能想通过设置属性别名来使其变短：



```xml
<databaseIdProvider type="DB_VENDOR">
  <property name="SQL Server" value="sqlserver"/>
  <property name="DB2" value="db2"/>
  <property name="Oracle" value="oracle" />
</databaseIdProvider>
```



在提供了属性别名时，databaseIdProvider 的 DB_VENDOR 实现会将 databaseId 设置为数据库产品名与属性中的名称第一个相匹配的值，如果没有匹配的属性，将会设置为 “null”。 在这个例子中，如果 `getDatabaseProductName()` 返回“Oracle (DataDirect)”，databaseId 将被设置为“oracle”。

你可以通过实现接口 `org.apache.ibatis.mapping.DatabaseIdProvider` 并在 mybatis-config.xml 中注册来构建自己的 DatabaseIdProvider：



```java
public interface DatabaseIdProvider {
  default void setProperties(Properties p) { // 从 3.5.2 开始，该方法为默认方法
    // 空实现
  }
  String getDatabaseId(DataSource dataSource) throws SQLException;
}
```







##### 9、mappers（映射器）

***



既然 MyBatis 的行为已经由上述元素配置完了，我们现在就要来定义 SQL 映射语句了。 但首先，我们需要告诉 MyBatis 到哪里去找到这些语句。 在自动查找资源方面，Java 并没有提供一个很好的解决方案，所以最好的办法是直接告诉 MyBatis 到哪里去找映射文件。 你可以使用相对于类路径的资源引用，或完全限定资源定位符（包括 `file:///` 形式的 URL），或类名和包名等。例如：



```xml
<!-- 使用相对于类路径的资源引用 -->
<mappers>
  <mapper resource="org/mybatis/builder/AuthorMapper.xml"/>
  <mapper resource="org/mybatis/builder/BlogMapper.xml"/>
  <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>
```



```xml
<!-- 使用完全限定资源定位符（URL） -->
<mappers>
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  <mapper url="file:///var/mappers/BlogMapper.xml"/>
  <mapper url="file:///var/mappers/PostMapper.xml"/>
</mappers>
```



```xml
<!-- 使用映射器接口实现类的完全限定类名 -->
<mappers>
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  <mapper class="org.mybatis.builder.BlogMapper"/>
  <mapper class="org.mybatis.builder.PostMapper"/>
</mappers>
```



```xml
<!-- 将包内的映射器接口实现全部注册为映射器 -->
<mappers>
  <package name="org.mybatis.builder"/>
</mappers>
```





![](https://img-blog.csdnimg.cn/img_convert/db1dd6c6d47744407d30070e099b1a64.png)

#### XML 映射文件

在 XML 核心配置文件介绍中，我们介绍了映射文件 mapper.xml 的引入。



> 对于 Mapper 具体的映射配置文件，是 Mybatis 最复杂、最核心的组件，其中的标签内容体系也是特别详实，包括它的参数类型、动态SQL、定义SQL、缓存信息等等，我们在下一篇文章中再进行梳理讨论，这里我们简单引出。



![](https://img-blog.csdnimg.cn/img_convert/f6653ac0bbfb5aa6693964f5dfb2e334.png)
#### 总结


原本我计划把核心配置文件和映射器 mapper 文件放一块讲，但是发现内容太多太多了，基本核心配置文件就已经讲得有点拖堂了，虽然这几大顶级标签使用起来已经毫不费力。SQL 映射器配置文件，我们后续更新，这块基本是和我们日常打交道最高频的操作。




>本篇完，本系列下一篇我们讲《 **Mybatis系列全解（五）：全网最全！详解Mybatis的Mapper映射文件** 》。



![](https://img-blog.csdnimg.cn/img_convert/5bec8b162fd54efe4aa59af1a52f82be.png)