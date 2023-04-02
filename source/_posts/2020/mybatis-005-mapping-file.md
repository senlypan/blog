---
title: Mybatis系列全解（五）：全网最全！详解Mybatis的Mapper映射文件
date: 2020-12-18 08:20:00
tags:
- Mybatis
preview: https://www.panshenlian.com/images/post/java/mybatis/title/05-title.jpg
introduce: |
    Mybatis 真正强大就在于它的语句映射，这是它的魔力所在，也是基石。由于它异常强大，映射器的 XML 文件就显得相对简单。如果拿它跟具有相同功能的 JDBC 代码进行对比，你会立即发现省掉了将近 95% 的代码（ 95% 是Mybatis 官网的说法 ，我也就引入一下 ），MyBatis 致力于减少使用成本，让用户能更专注于 SQL 代码。
---



![](https://www.panshenlian.com/images/post/java/mybatis/title/05-title.jpg)



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/slogan_start.png)

若不是生活所迫，谁愿意背负一身才华。

![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/slogan_end.png)



#### 前言

上节我们介绍了 《 **Mybatis系列全解（四）：全网最全！Mybatis配置文件 XML 全貌详解** 》，内容很详细（ 也很枯燥），由于篇幅实在过于冗长，我预计大家想看完得花上两段上班地铁公交车的时间 。。。



![](https://www.panshenlian.com/images/post/00_old_article_images/emoji/time.png)



不过应该有让大家了解到 Mybatis 的核心配置文件 **config.xml** 全貌，其中的 <mappers></mappers> 元素即是我们本节准备登场介绍的 SQL 映射器，上节有介绍了三种引入 SQL 映射器的方式，本节我们就主要聊聊它的几个顶级元素用法。



>  Mybatis 真正强大就在于它的语句映射，这是它的魔力所在，也是基石。由于它异常强大，映射器的 XML 文件就显得相对简单。如果拿它跟具有相同功能的 JDBC 代码进行对比，你会立即发现省掉了将近 **95%** 的代码（ 95% 是Mybatis 官网的说法 ，我也就引入一下 ），MyBatis 致力于减少使用成本，让用户能更专注于 **SQL** 代码。



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

***

**1、mapper 映射器顶级元素全貌**

**2、namespace 命名空间**

**3、select 查询**

**4、insert / update / delete 增删改**

**5、cache 缓存**

**6、cache-ref 缓存引用**

**7、sql 语句块**

**8、parameterMap 参数映射**

**9、总结**





![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/01.png)

#### mapper 映射器顶级元素全貌 



与其它 ORM 框架如 Hibernate 不同，Mybatis 的框架思想希望开发者能够直接操作数据库编写 SQL，而不是隐藏起来，让开发者独自面对 Java 对象，为此 Mybatis 设计了 SQL 映射器，任你五招十二式。



![](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project03/Mapper.png)



**映射器有九大顶级元素 ，基本技能介绍**

- select : 用于查询，支持传参，返回指定结果集；
- insert : 用于新增，支持传参，返回指定结果集；
- update : 用于更新，支持传参，返回指定结果集；
- delete : 用于删除，支持传参，返回指定结果集；
- sql : 被其它语句引用的 **可复用** 语句块；
- cache : 当前命名空间缓存配置；
- cache-ref : 引用其它命名空间的缓存配置；
- parameterMap : 参数映射，已弃用，是它不够好；
- resultMap : 结果集映射，它就很好；



> 其中，增删改查操作拼接 SQL 时使用到的 **动态SQL**（ if、where、foreach啥的），以及封装结果集时使用到的 **复杂映射** （1对1 ，1对多，多对多啥的），这两部分我们后面单立文章再详细介绍，本文中我们简单点过。



**九大顶级元素 ，功能归类：** 

其中顶一元素 parameterMap 已建议弃用了 。 



![](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project03/mapper01.png)





> 无论你有多么复杂的 SQL 操作，最根本的思路都逃不出以上 4 部分。






![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/02.png)

#### namespace 命名空间 

**一个完整的 Mapper 映射文件，需要有约束头 xml 与 !DOCTYPE ，其次才是 mapper 根元素，最后再是顶级元素，而其中，namespace 属性作为 mapper 的唯一标识，试回忆：**



- 上学时，6年级一班23号，能代表唯一的你。
- 编写 Java 类时，包名 + 类名，能代表唯一的类。
- 而如今，我们在 Mybatis 中写的每一段 SQL 语句，同样有唯一的代表方式，那就是「 **命名空间标识 + 语句id** 」，无论是为了区分业务也好，还是为了拆分服务也好，反正 Mybatis 让每一个 mapper.xml 配备一个唯一命名空间标识。 



![](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project03/namespace01.png)



每一段 SQL 语句都是唯一定义的，我们在 Mybatis 中用「 命名空间标识 + 语句块 ID 」作为唯一的标识，组合之后在 Mybatis 二级缓存中可以作为本地 map 集合 **缓存** 的唯一Key ，也可以用于 Dao 接口的 **映射** 绑定，还能作为唯一 **代理** 标识。总之，我们希望避免命名冲突和重复定义，所以，拥有这么一个唯一标识 ，它就至少有一亿个利好。




![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/03.png)

#### select 查询 

select 查询语句，几乎是我们最高频的使用元素，所以 Mybatis 在这块没少下功夫，目的就是通过提供尽可能多的便利，让我们的查询操作变得简单。 一个查询用户 User 的查询语句可以这么编写：



```xml
<select id="selectUser" parameterType="int" resultType="hashmap">
  select * from t_user where id = #{id}
</select>
```



- **id属性**：在当前 mapper.xml 命名空间下，它的 id 值是唯一的（ 不过如果在不同的 mapper.xml 命名空间下，则允许有相同的的 id 值 ）
- **parameterType 属性**：代表传入的参数类型，这里是 int （或 Integer）类型
- **resultType属性**：代表返回结果类型，这里指定返回一个 hashMap 类型的对象，mybatis 会把查询出来的数据表记录对应的 ' **字段列名 - 字段值** '，自动映射为 map 集合的 **key - value** 。 



> 当然如果你不希望通过 hashmap 来接收查询结果，允许你自由指定返回类型。Mybatis 是支持自动绑定 JavaBean 的，我们只要让查询返回的字段名和 JavaBean 的属性名保持一致（或者采用驼峰式命名），便可以自动映射结果集，例如你创建一个 Java 类 User.java ，包含两个属性 id 和 name , 那么结果集可以指定为 com.vo.User ，就完成了。



```xml
<select id="selectUser" 
    parameterType="int" resultType="com.vo.User">
  select * from t_user where id = #{id}
</select>
```



**注意参数符号：**

``` xml
#{id}
```



#{} 告诉 MyBatis 创建一个预编译语句（PreparedStatement）参数，在 JDBC 中，这样的一个参数在 SQL 中会由一个 “ ? ” 来标识，并被传递到一个新的预编译语句中，就像这样：



``` java
// 近似的 JDBC 代码，非 MyBatis 代码...
String selectUser = " select * from t_user where id = ? ";
PreparedStatement ps = conn.prepareStatement(selectUser);
ps.setInt(1,id);
```



#{} 作为占位符，${} 作为替换符，两者没有孰轻孰重，只不过应用场景不同，适当取舍即可。



![](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project03/sql01.png)



我们希望完成类似 JDBC 中的 PrepareStatement  预编译处理 ，可以使用 #{} ，它会在替换占位符时首尾添加上单引号 '' ，能有效防止 **SQL 注入** 风险。



例如使用 ${} 操作删除 （ 就很有问题！）

```java
// 1、使用 ${} 有注入风险
delete from t_user where id = ${id}

// 2、正常传值，id 传入 1  
delete from t_user where id = 1
// 结果删除了id=1 的记录
    
// 3、注入风险，id 传入 1 or 1=1 
delete from t_user where id = 1 or 1=1
// 全表删除了
```



再看看 #{} 是如何规避 **SQL 注入** 的：



```java
// 1、使用 #{} 有效防止注入风险
delete from t_user where id = #{id}

// 2、正常传值，id 传入 1   
delete from t_user where id = '1'
// 结果删除了id=1 的记录
    
// 3、注入风险，id 传入 1 or 1=1 
delete from t_user where id = '1 or 1=1'
// SQL 语句报错，表数据安全
```



虽然在防止 SQL 注入方面，${} 确实无能为力，不过我们 ${} 在其它方面可不容小觑，例如它允许你灵活地进行 **动态表和动态列名的替换** 操作，例如：



```java
// 1、灵活查询指定表数据
select * from ${tableName} 

// 传入 tableName参数 = t_user , 结果
select * from t_user  

// 2、灵活查询不同列条件数据
select * from t_user where ${colunmName} = ${value}

// 传入 colunmName参数 = name , value参数 = '潘潘', 结果
select * from t_user where name = '潘潘'

// 传入 colunmName参数 = id , value参数 = 1, 结果
select * from t_user where id = 1
```



> 以上的 ${} 替换列名与表名的方式非常灵活，不过确实存在 SQL 注入风险，所以在考虑使用 #{} 或 ${} 前，需要评估风险，避免风险，允许的情况下，我建议使用 #{} 。



**当然，select 元素允许你配置很多属性来配置每条语句的行为细节。 **



```xml
<select     
  id="selectUser" 
  parameterType="int"
  parameterMap="deprecated"
  resultType="hashmap"
  resultMap="personResultMap"
  flushCache="false"
  useCache="true"
  timeout="10"
  fetchSize="256"
  statementType="PREPARED"
  resultSetType="FORWARD_ONLY"
  databaseId="mysql"
  resultOrdered="false"
  resultSets="rs1,rs2,rs3">
  select * from t_user
</select>
```



![](https://www.panshenlian.com/images/post/00_old_article_images/emoji/goods.png)





**下面详细介绍一下，略微冗长，一口气看完吧：**



- **id**		必填项，在命名空间下的唯一标识，可被 Mybatis 引用，如果存在相同的 “ 命名空间 + 语句id ” 组合，Mybatis 将抛出异常；



- **parameterType**	可选项，传入语句的参数的类全限定名或别名，可以是基本类型、map 或 JavaBean 等复杂的参数类型传递给 SQL；



- **parameterMap**	用于引用外部 parameterMap 的属性块，目前已被废弃。以后请使用行内参数映射和 parameterType 属性。



- **resultType**	可选项，定义类的全路径，在允许自动匹配的情况下，结果集将通过 Javaben 的规范映射，或定义为 int 、double、float 等参数；也可以使用别名，但是要符合别名规范和定义。 resultType 和 resultMap 之间只能同时使用一个。（日常中，比如我们统计结果总条数的时候可以设置为 int ）；



- **resultMap**	可选项，对外部 resultMap 的命名引用。结果映射是 MyBatis 最强大的特性，如果你对其理解透彻，许多复杂的映射问题都能迎刃而解，后面一对一、一对多、多对多我们会有一篇文章单独讲解。 resultType 和 resultMap 之间只能同时使用一个。



- **flushCache**	可选项，清空缓存，将其设置为 true 后，只要语句被调用，都会导致本地缓存和二级缓存被清空，默认值：false。



- **useCache**	可选项，使用缓存，将其设置为 true 后，将会导致本条语句的结果被二级缓存缓存起来，默认值：对 select 元素为 true。



- **timeout**	可选项，这个设置是在抛出异常之前，驱动程序等待数据库返回请求结果的秒数。默认值为未设置（unset）（依赖数据库驱动）。



- **fetchSize**	可选项，获取记录的总条数设定。这是一个给驱动的建议值，尝试让驱动程序每次批量返回的结果行数等于这个设置值。 默认值为未设置（unset）（依赖驱动）。由于性能问题，建议在 sql 做分页处理。



- **statementType**	可选项，可选 STATEMENT，PREPARED 或 CALLABLE。这会让 MyBatis 分别使用 Statement，PreparedStatement 或 CallableStatement，默认值：PREPARED。



- **resultSetType**	可选项，FORWARD_ONLY，SCROLL_SENSITIVE, SCROLL_INSENSITIVE 或 DEFAULT（等价于 unset） 中的一个，默认值为 unset （依赖数据库驱动）。
	
	
	
	- FORWARD_ONLY，只允许游标向前访问；
	- SCROLL_SENSITIVE，允许游标双向滚动，但不会及时更新数据，也就是说如果数据库中的数据被修改过，并不会在resultSet中及时更新出来；
	- SCROLL_INSENSITIVE ，允许游标双向滚动，如果数据库中的数据被修改过，会及时更新到resultSet；
	
	

> 我们知道 JDBC 通过 ResultSet 来对查询结果进行封装，ResultSet 对象本身包含了一个由查询语句返回的一个结果集合。例如你经常在 JDBC 见过的结果集读取：




```java
// 允许滚动游标索引结果集
while( rs.next() ){
    rs.getString("name");
}
// 当然也支持游标定位到最后一个位置
rs.last();
// 向后滚动
rs.previous();
```



- **databaseId**	可选项，如果配置了数据库厂商标识（databaseIdProvider），MyBatis 会加载所有不带 databaseId 或匹配当前 databaseId 的语句；如果带和不带的语句都有，则不带的会被忽略。



- **resultOrdered**	可选项，这个设置仅针对嵌套结果 select 语句：如果为 true，将会假设包含了嵌套结果集或是分组，当返回一个主结果行时，就不会产生对前面结果集的引用。 这就使得在获取嵌套结果集的时候不至于内存不够用。默认值：false。



- **resultSets**	这个设置仅适用于多结果集的情况。它将列出语句执行后返回的结果集并赋予每个结果集一个名称，多个名称之间以逗号分隔。



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/04.png)

#### insert / update / delete 增删改 

数据变更语句 insert，update 和 delete 的实现非常接近，而且相对于 select 元素而言要简单许多。

``` java
<insert
  id="insertUser"
  parameterType="domain.vo.User"
  flushCache="true"
  statementType="PREPARED"
  keyProperty=""
  keyColumn=""
  useGeneratedKeys=""
  timeout="20">

<update
  id="updateUser"
  parameterType="domain.vo.User"
  flushCache="true"
  statementType="PREPARED"
  timeout="20">

<delete
  id="deleteUser"
  parameterType="domain.vo.User"
  flushCache="true"
  statementType="PREPARED"
  timeout="20">
```



其中大部分属性和 select 元素相同，我们介绍 3 个不同的属性：



- **useGeneratedKeys** : （仅适用于 insert 和 update）这会令 MyBatis 使用 JDBC 的 getGeneratedKeys 方法来取出由数据库内部生成的主键（比如：像 MySQL 和 SQL Server 这样的关系型数据库管理系统的自动递增字段），默认值：false。



- **keyProperty** :  （仅适用于 insert 和 update）指定能够唯一识别对象的属性，MyBatis 会使用 getGeneratedKeys 的返回值或 insert 语句的 selectKey 子元素设置它的值，默认值：未设置（`unset`）。如果生成列不止一个，可以用逗号分隔多个属性名称。



- **keyColumn** :  （仅适用于 insert 和 update）设置生成键值在表中的列名，在某些数据库（像 PostgreSQL）中，当主键列不是表中的第一列的时候，是必须设置的。如果生成列不止一个，可以用逗号分隔多个属性名称。



我们先看看 insert，update 和 delete 语句的示例：



```xml
<insert id="insertUser">
  insert into t_user (id,name) 
  values (#{id},#{name})
</insert>

<update id="updateUser">
  update t_user set name = #{name} where id = #{id}
</update>

<delete id="deleteUser">
  delete from t_user where id = #{id}
</delete>
```



如前所述，插入语句的配置规则更加丰富，在插入语句里面有一些额外的属性和子元素用来处理主键的生成，并且提供了多种生成方式。



首先，如果你的数据库支持 **自动生成主键** 的字段（比如 MySQL 和 SQL Server），那么你可以设置 useGeneratedKeys=”true”，然后再把 keyProperty 设置为目标属性就 OK 了。例如，如果上面的 t_user 表已经在 id 列上使用了自动生成，那么语句可以修改为：



```xml
<insert id="insertUser" useGeneratedKeys="true"
    keyProperty="id">
  insert into t_user (name) values (#{name})
</insert>
```



如果你的数据库还支持多行插入, 你也可以传入一个 User 数组或集合，并返回自动生成的主键。



```xml
<insert id="insertUser" useGeneratedKeys="true"
    keyProperty="id">
  
  insert into t_user (name) values  
    
  <foreach item="item" collection="list" separator=",">
    (#{item.name})
  </foreach>
</insert>
```



对于不支持自动生成主键列的数据库和可能不支持自动生成主键的 JDBC 驱动，MyBatis 有另外一种方法来**生成主键**。



这里有一个简单（也很傻）的示例，它可以生成一个随机 ID（不建议实际使用，这里只是为了展示 MyBatis 处理问题的灵活性和宽容度）：

```xml
<insert id="insertUser">
 
  <selectKey keyProperty="id" resultType="int" order="BEFORE">
    select CAST(RANDOM()*1000000 as INTEGER) a from SYSIBM.SYSDUMMY1
  </selectKey>
    
  insert into t_user (id, name)
  values  (#{id}, #{name})
</insert>
```



在上面的示例中，首先会运行 selectKey 元素中的语句，并设置 User 的 id，然后才会调用插入语句。这样就实现了数据库自动生成主键类似的行为，同时保持了 Java 代码的简洁。

selectKey 元素描述如下：



```xml
<selectKey
  keyProperty="id"
  resultType="int"
  order="BEFORE"
  statementType="PREPARED">
```



selectKey 中的 order 属性有2个选择：BEFORE 和 AFTER 。

- BEFORE：表示先执行selectKey的语句，然后将查询到的值设置到 JavaBean 对应属性上，然后再执行 insert 语句。
- AFTER：表示先执行 AFTER 语句，然后再执行 selectKey 语句，并将 selectKey 得到的值设置到 JavaBean 中的属性。上面示例中如果改成 AFTER，那么插入的 id 就会是空值，但是返回的 JavaBean 属性内会有值。




![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/05.png)

#### cache 缓存 

缓存对于互联网系统来说特别常见，其特点就是将数据保存在内存中。MyBatis 内置了一个强大的事务性查询缓存机制，它可以非常方便地配置和定制。 为了使它更加强大而且易于配置，我们对 MyBatis 3 中的缓存实现进行了许多改进。

默认情况下，只启用了本地的会话缓存（即一级缓存，sqlSession级别 ），它仅仅对一个会话中的数据进行缓存。 要启用全局的二级缓存，首先在全局配置文件config.xml文件中加入如下代码:



```xml
<!--开启二级缓存--> 
<settings> 
    <setting name="cacheEnabled" value="true"/> </settings>
```



其次在UserMapper.xml文件中开启缓存：



```xml
<!--开启二级缓存--> 
<cache></cache>
```



基本上就是这样。这个简单语句的效果如下:

- 映射语句文件中的所有 select 语句的结果将会被缓存。
- 映射语句文件中的所有 insert、update 和 delete 语句会刷新缓存。
- 缓存会使用最近最少使用算法（LRU, Least Recently Used）算法来清除不需要的缓存。
- 缓存不会定时进行刷新（也就是说，没有刷新间隔）。
- 缓存会保存列表或对象（无论查询方法返回哪种）的 1024 个引用。
- 缓存会被视为读/写缓存，这意味着获取到的对象并不是共享的，可以安全地被调用者修改，而不干扰其他调用者或线程所做的潜在修改。



> 缓存只作用于 cache 标签所在的映射文件中的语句。如果你混合使用 Java API 和 XML 映射文件，在共用接口中的语句将不会被默认缓存。你需要使用 @CacheNamespaceRef 注解指定缓存作用域。



这些属性可以通过 cache 元素的属性来修改。比如：



```xml
<cache
  eviction="FIFO"
  flushInterval="60000"
  size="512"
  readOnly="true"/>
```



上面表示了一套更高级的缓存配置，首先创建了一个 FIFO 缓存，每隔 60 秒刷新，最多可以存储结果对象或列表的 512 个引用，然后返回的对象被设置成只读的，因此对它们进行修改可能会在不同线程中的调用者产生冲突。



**缓存可用的清除策略有：**

- **LRU **– 最近最少使用：移除最长时间不被使用的对象。
- **FIFO **– 先进先出：按对象进入缓存的顺序来移除它们。
- **SOFT **– 软引用：基于垃圾回收器状态和软引用规则移除对象。
- **WEAK **– 弱引用：更积极地基于垃圾收集器状态和弱引用规则移除对象。



> 默认的清除策略是 LRU



**flushInterval**（刷新间隔）属性可以被设置为任意的正整数，设置的值应该是一个以毫秒为单位的合理时间量。 默认情况是不设置，也就是没有刷新间隔，缓存仅仅会在调用语句时刷新。



**size**（引用数目）属性可以被设置为任意正整数，要注意欲缓存对象的大小和运行环境中可用的内存资源。默认值是 1024。



**readOnly**（只读）属性可以被设置为 true 或 false。只读的缓存会给所有调用者返回缓存对象的相同实例。 因此这些对象不能被修改。这就提供了可观的性能提升。而可读写的缓存会（通过序列化）返回缓存对象的拷贝。 速度上会慢一些，但是更安全，因此默认值是 false。



> 二级缓存是事务性的。这意味着，当 SqlSession 完成并提交 ( commit ) 时，或是完成并回滚 ( close ) 时，二级缓存都会被刷新。不管是否配置了 flushCache=true 。



![](https://www.panshenlian.com/images/post/00_old_article_images/emoji/huazhongdian2.png)



Mybatis 的缓存包括一级缓存（sqlSession 级别）和二级缓存（mapper 级别），所以 mapper 映射器中配置的是二级缓存，我们先大概知道有这个概念，因为后续我们会针对这两种缓存进行详细介绍，而且还会讲解如何自定义缓存，因为 Mybatis 的缓存默认都是以 map 的数据结构存储在本地，所以自定义缓存可以把存储介质拓展到磁盘或数据库redis等；而且一级缓存是默认开启的，二级缓存需要我们手工开启，这些后续都会详细讲解，提前预告。



> 缓存获取顺序：二级缓存 > 一级缓存 > 数据库



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/06.png)

#### cache-ref 引用缓存 

回想一下 cache 的内容，对某一命名空间的语句，只会使用该命名空间的缓存进行缓存或刷新。 但你可能会想要在多个命名空间中共享相同的缓存配置和实例。要实现这种需求，你可以使用 cache-ref 元素来引用另一个缓存。



```xml
<cache-ref namespace="com.vo.UserMapper"/>
```




![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/07.png)

#### sql 语句块 

这个元素可以用来定义可重用的 SQL 代码片段，以便在其它语句中使用。 参数可以静态地（在加载的时候）确定下来，并且可以在不同的 include 元素中定义不同的参数值。比如：



![](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project03/sql05.png)



```xml
<sql id="userColumns"> 
    ${alias}.id,${alias}.name 
</sql>
```



这个 SQL 片段可以在其它语句中使用，例如：



```xml
<select id="selectUsers" resultType="map">
  select
    <include refid="userColumns">
        <property name="alias" value="t1"/>
    </include>,
    <include refid="userColumns">
        <property name="alias" value="t2"/>
    </include>
  from t_user t1 cross join t_user t2
</select>
```



也可以在 include 元素的 refid 属性或多层内部语句中使用属性值，例如：



![](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project03/sql06.png)



```xml
<sql id="sql1">
  ${prefix}_user
</sql>

<sql id="sql2">
  from
    <include refid="${include_target}"/>
</sql>

<select id="select" resultType="map">
  select
    id, name
  <include refid="sql2">
    <property name="prefix" value="t"/>
    <property name="include_target" value="sql1"/>
  </include>
</select>
```




![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/08.png)

#### parameterMap 参数映射

parameterMap 元素官方已经不建议使用，并且再后续版本会退出舞台。首先对于我们 Java 来说，特别不希望在代码中通过传递 map 来传参，这样对于后续维护或者参数查找都是极不负责任的，我们推荐使用 JavaBean 来传值参数，这是 parameterMap 被抛弃的其中一个原因；另外也由于 parameterType 属性的诞生就能很好的代替 parameterMap ，并且还能自定义 JavaBean 类型的传参，所以 parameterMap  退出舞台，实属正常。



![](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project03/parameterMap.png)




![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/09.png)

#### 总结

我一直来都希望自己只输出观点，而不是输出字典，但其中有些知识点又是极其冗杂，知识输出真是个难搞的差事，如何既能把知识脉络梳理的完整，又能讲得浅显易懂，言简意赅，确实是后续文章分解输出的研究方向。




>本篇完，本系列下一篇我们讲《 **Mybatis系列全解（六）：Mybatis最硬核的API你知道几个？** 》。



![](https://www.panshenlian.com/images/post/00_old_article_images/emoji/next.png)



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/article_the_end.png)







![](https://img-blog.csdnimg.cn/20201210112606613.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01yUmlnaHRfc2VubHlwYW4=,size_16,color_FFFFFF,t_70#pic_center)




> **BIU ~** 文章持续更新，微信搜索「**潘大晚**」第一时间阅读，随时有惊喜。本文会在 **GitHub** [https://github.com/JavaWord](https://github.com/senlypan/JavaWord) 收录，热腾腾的技术、框架、面经、解决方案，我们都会以最美的姿势第一时间送达，欢迎 Star ~ 我们未来 **不止文章**！想进读者群的伙伴欢迎撩我个人号：panshenlian，备注「**加群**」我们群里欢聊吧 ~