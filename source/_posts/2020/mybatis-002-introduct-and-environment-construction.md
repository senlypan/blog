---
title: Mybatis系列全解（二）：Mybatis简介与环境搭建
date: 2020-11-28 09:05:09
tags:
- Mybatis
preview: https://www.panshenlian.com/images/post/java/mybatis/title/02-title.jpg
introduce: |
    Mybatis系列全解，我们预计准备10+篇文章，让我们了解到 Mybatis 的基本全貌，真正从入门到上手，从上手到精通，本文为首篇，我们开始。
---





![](https://www.panshenlian.com/images/post/java/mybatis/title/02-title.jpg)





![前言start](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/slogan_start.png)

Mybatis 是一套持久层框架，灵活易用，特别流行。

![前言start](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/slogan_end.png)





#### 前言



Mybatis系列全解，我们预计准备10+篇文章，让我们了解到 Mybatis 的基本全貌，真正从入门到上手，从上手到精通，本文为首篇，我们开始。

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



1、Mybatis是什么

2、Mybatis的前世今生

3、Mybatis的优势

4、Mybatis整体架构图

5、环境搭建

6、总结





![第一](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/01.png)


####    Mybatis是什么



我们先看一下官网简介，Mybatis 官网：https://mybatis.org/mybatis-3/



> MyBatis is a first class persistence framework with support for custom SQL, stored procedures and advanced mappings. MyBatis eliminates almost all of the JDBC code and manual setting of parameters and retrieval of results. MyBatis can use simple XML or Annotations for configuration and map primitives, Map interfaces and Java POJOs (Plain Old Java Objects) to database records.
> 



大致翻译为：



> MyBatis是一款优秀的持久层框架，它支持定制化SQL、存储过程以及高级映射。MyBatis避免了几乎所有的JDBC代码和手动设置参数以及获取结果集。MyBatis可以使用简单的XML或注解来配置和映射原生类型、集合接口以及Java的POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录。



##### 我目前的理解是，Mybatis 本身抽象了大量的 JDBC 冗余代码，同时基于对象关系映射模型，向外提供了一套灵活易用的 API 和数据库做交互。





![02](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/02.png)

####   Mybatis的前世今生





凡事皆有过往，之前我们讲过一篇 **JDBC** 的介绍与实际应用，并分析对比了 JDBC 与持久层框架的差异，由于 JDBC 需要开发人员编写过多的代码，操作所有对象，既麻烦还特别容易出错，所以在我们实际开发中很少直接使用 JDBC 进行编程，于是 **ORM** 的登台显得尤为重要，ORM 全称是 Object/Relation Mapping：表示 **对象-关系映射** 的缩写。





![ORM映射模型](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/02_01_mybatis_orm.png)





>  **ORM模型** ，简单来说，就是数据库的表和简单 Java 对象的映射关系模型。采用ORM框架后，应用程序不再直接访问底层数据库，而是以 **面向对象** 的方式来操作持久化对象，而ORM框架则将这些面向对象的操作转换成底层SQL操作。ORM框架实现的效果：把对持久化对象的保存、修改、删除 等操作，转换为对数据库的操作。 





![Hibernate模型开发过程](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/02_01_hiberbate_orm.png)





最初 SUN 公司推出了 Java EE 服务器端组件模型（**EJB**），不过由于EJB 配置过于复杂，且适应范围小于是很快就被淘汰。后来封装度极高、开发效率极高、全表映射的 ORM 持久层框架**Hibernate** 出现，成为了当时首选的 Java ORM 模型框架。但是随着互联网的极速发展、复杂业务场景的不断涌现，Hibernate 在许多方面慢慢暴露出了缺点：灵活性不够、无法根据不同条件组装不同SQL、对多表关联和复杂SQL查询支持较差、SQL优化和性能差、全表映射带来的不便等等。





![MybatisLogo](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/mybatis_logo.png)





于是 **Mybatis** 框架应运而生，弥补了Hibernate的不足，不仅简单易用，而且具有高度灵活、可优化、易维护等特点，成为如今大型互联网项目的首选框架。



> Mybatis 野史：Mybatis 前身是 iBATIS，2001年由Clinton Begin发起的一个开源项目，最初侧重于密码软件的开发，后来发展成为一款基于Java的持久层框架，2004年，Clinton 将 iBATIS 的名字和源码捐赠给 Apache 软件基金会，接下来的6年中，开源软件世界发生了巨大的变化，一切开发实践、基础设施、许可，甚至数据库技术都彻底改变了。在2010年6月，核心开发团队把这个项目由 apache software foundation 迁移到了google code，随着开发团队转投 Google Code 旗下，ibatis3.x 正式更名为 Mybatis ，代码于2013年11月迁移到 Github 。





![03](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/03.png)

####    Mybatis的优势





Mybatis 是一个半自动化的持久层框架，对开发人员开说，核心 sql 还是需要自己进行优化，sql 和 java 编码进行分离，功能边界清晰，一个专注业务，一个专注数据。



##### 蓝色区域是 Mybatis 框架功能支持，红色区域是应用了Mybatis 框架的工程项目实际需要操作的2个步骤：





![Mybatis框架应用实例](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/02_01_mybatis_dev.png)





##### 当前有很多 Java 实现的持久化框架，而 MyBatis 流行起来有以下原因：

1、它消除了大量的 JDBC 冗余代码

2、它有低的学习曲线

3、它能很好地与传统数据库协同工作

4、它可以接受 SQL 语句

5、它提供了与 Spring 和 Guice 框架的集成支持

6、它提供了与第三方缓存类库的集成支持

7、它引入了更好的性能



![04](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/04.png)

####    Mybatis整体架构图





![Mybatis整体架构图](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/02_01_mybatis_org.png)





![05](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/05.png)

####    环境搭建



> 默认已安装 Java 开发环境、Mysql数据库、Maven 环境。



Mybatis 开发与环境搭建，我们先入门体验，步骤如下：



1、创建 maven 工程

2、添加 MyBatis 仓库坐标（非maven项目则引入jar包）

3、创建user数据表

4、编写User实体类

5、编写映射文件UserMapper.xml

6、编写核心文件SqlMapConfig.xml

7、编写测试类



**1、创建 maven 工程**



![创建maven工程](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project01/01_new_maven_project.png)





**2、添加 MyBatis 仓库坐标**



``` xml

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.encoding>UTF-8</maven.compiler.encoding>
        <java.version>1.8</java.version>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <dependencies>

        <!--mybatis坐标-->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.4.5</version>
        </dependency>

        <!--mysql驱动坐标-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.6</version>
            <scope>runtime</scope>
        </dependency>

        <!--单元测试坐标-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>

        <!--日志坐标-->
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.12</version>
        </dependency>

    </dependencies>

```





**3、创建user数据表**



``` sql

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `birthday` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

```



![User表数据](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project01/01_db_data.png)



**4、编写User实体类**



``` java

package com.panshenlian.pojo;

/**
 * @Author: panshenlian
 * @Description: 用户实体
 * @Date: Create in 2:08 2020/11/28
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





**5、编写映射文件UserMapper.xml**



```xml

<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="userMapper">

    <select id="findAll" resultType="com.panshenlian.pojo.User">
        select * from User
    </select>

</mapper>

```





**6、编写核心文件SqlMapConfig.xml**



```xml

<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC" />
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver" />
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis" />
                <property name="username" value="root" />
                <property name="password" value="123456" />
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <mapper resource="/UserMapper.xml" />
    </mappers>
</configuration>

```





**7、编写测试类**



``` java

package com.panshenlian.service;

import com.panshenlian.pojo.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @Author: panshenlian
 * @Description: 体验测试类
 * @Date: Create in 2:21 2020/11/28
 */
public class MybatisTest {

    @Test
    public void testQueryUser01() throws IOException {

        //加载核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        // 获得sqlSession工厂对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);

        //获得sqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        // 执行sql语句
        List<User> userList = sqlSession.selectList("userMapper.findAll");

        // 打印结果
        for (User user : userList) {
            System.out.println(user);
        }

        // 释放资源
        sqlSession.close();
    }


}


```







![Junit 单元测试](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/article_start.png)

##### 最终通过 Junit 单元测试，运行结果符合预期：



![Junit单元测试运行结果](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project01/01_db_junit_test.png)





![工程结构参考](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/article_start.png)

##### 工程结构参考：



![工程结构参考](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project01/01_db_project_org.png)





![06](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/06.png)

#### 总结

我们通过本文介绍，也动手做了一个入门体验的测试工程，基本对 Mybatis 有了初步认识，同时对比了 JDBC 与 Hibernate ，明晰了 Mybatis 诞生的使命，和与生俱来的优势能力。后续我们会继续深入讲解 ，对于 Mybatis 各个知识脉络进行梳理和解析。



>本篇完，下一篇我们讲《 **Mybatis简单CRUD使用介绍** 》。



![the end](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/article_the_end.png)