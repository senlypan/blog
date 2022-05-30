---
title: Mybatis系列全解（三）：Mybatis简单CRUD使用介绍
date: 2020-12-01 08:20:00
tags:
- Mybatis
preview: https://www.panshenlian.com/images/post/java/mybatis/title/03-title.jpg
introduce: |
    上一篇文章《Mybatis系列全解（二）：Mybatis简介与环境搭建》，我们对 Mybatis 做了初步讲解，并搭建了一套基本环境，共同完成了一次查询操作。所以本篇文章我们在此基础上，继续拓展了插入、修改、删除三种操作，把我们的CRUD基础操作进行完善。
---


![](https://www.panshenlian.com/images/post/java/mybatis/title/03-title.jpg)



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/slogan_start.png)

在理解中执行，在执行中理解，学习技术也循此道。

![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/slogan_end.png)





#### 前言



上一篇文章 **《Mybatis系列全解（二）：Mybatis简介与环境搭建》** ，我们对 Mybatis 做了初步讲解，并搭建了一套基本环境，共同完成了一次查询操作。所以本篇文章我们在此基础上，继续拓展了插入、修改、删除三种操作，把我们的CRUD基础操作进行完善。

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



1、Mybatis查询操作回顾

2、插入操作

3、修改操作

4、删除操作

5、总结



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/01.png)
####    Mybatis查询操作回顾



> 默认已安装 Java 开发环境、Mysql数据库、Maven 环境。



Mybatis 的查询分为7个步骤：



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



##### 最终通过 Junit 单元测试，运行结果符合预期：

![Junit单元测试运行结果](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project01/01_db_junit_test.png)



##### 工程结构参考：

![工程结构参考](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project01/01_db_project_org.png)


![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/02.png)
#### 插入操作

Mybatis的插入数据操作，我们一共需要两步：
1. 在映射文件UserMapper.xml中添加插入语句

```xml

    <!-- 插入用户操作 -->
    <insert id="insertUser" 
        parameterType="com.panshenlian.pojo.User" >
        
        insert into user(username,password,birthday) 
        values ( #{username}, #{password},#{birthday})
    
    </insert>

```

2. 编写插入User实体对象的 Java 代码

```java

    @Test
    public void testInsertUser01() throws IOException {

        //加载核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        // 获得sqlSession工厂对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);

        //获得sqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        // 准备插入数据库的对象
        User insertUser = new User();
        insertUser.setBirthday("2020-12-01");
        insertUser.setUsername("panpan");
        insertUser.setPassword("888");

        // 执行sql语句
        int rows = sqlSession.insert("userMapper.insertUser",insertUser);

        // 打印结果
        System.out.println(rows);

        // 提交事务
        sqlSession.commit();

        // 释放资源
        sqlSession.close();
    }

```



**注意：**当 sqlSession 执行插入、更新、删除操作时，需要提交事务，如果 openSession() 的时候使用无参构造函数，那么需要手动调用 commit() 进行事务提交，对应的插入、更新、删除操作才最终执行成功，如果是使用 openSession(true) 来打开session ，那么则表示事务自动提交，无需手工再调用 commit() 。



> 插入操作时，在映射文件中我们没有配置 resultType参数，即返回结果类型我们没有配置，Mybatis 默认返回 int 类型，表示插入操作影响的记录数。



**上例插入操作执行结果为：1 ，表示插入成功，影响记录数量为1条。**



![插入操作执行成功](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project03/add.jpg)



**插入操作注意问题**

1、插入语句使用 insert 标签

2、在映射文件中使用 parameterType 属性指定要插入的数据类型

3、Sql语句中使用#{实体属性名}方式引用实体中的属性值

4、插入操作使用的API是sqlSession.insert(“命名空间.id”,实体对象);

5、插入操作涉及数据库数据变化，所以要使用sqlSession对象显示的提交事务，即sqlSession.commit()



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/03.png)





#### 修改操作

Mybatis的修改数据操作，同插入操作，也是需要两步：
1. 在映射文件UserMapper.xml中添加修改语句

```xml

    <!-- 修改用户操作 -->
    <insert id="updateUser" parameterType="com.panshenlian.pojo.User" >
        
        update  user set username =#{username} where id = #{id}
        
    </insert>

```

2. 编写修改User实体对象的 Java 代码

```java

    @Test
    public void testUpdateUser01() throws IOException {

        //加载核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        // 获得sqlSession工厂对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);

        //获得sqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        User updateUser = new User();
        updateUser.setUsername("新的用户名PanPan");
        updateUser.setId(1); 

        // 执行sql语句
        int rows = sqlSession.update("userMapper.updateUser",updateUser);

        // 打印结果
        System.out.println(rows);

        // 提交事务
        sqlSession.commit();

        // 释放资源
        sqlSession.close();
    }

```



执行结果如下，成功修改 id =1 的数据记录，新用户名为 **新的用户名PanPan**



![修改操作执行成功](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project03/update.jpg)



**修改操作注意问题**

1、修改语句使用update标签

2、修改操作使用的API是sqlSession.update(“命名空间.id”,实体对象);


![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/04.png)
#### 删除操作

Mybatis的删除数据操作，同以上插入与修改操作，也是需要两步：
1. 在映射文件UserMapper.xml中添加删除语句

```xml

    <!-- 删除用户操作 -->
    <insert id="deleteUser" parameterType="com.panshenlian.pojo.User" >
        
        delete from  user where id=#{id} and username = #{username}
        
    </insert>

```

2. 编写删除User实体对象的 Java 代码

```java

    @Test
    public void testDeleteUser01() throws IOException {

        //加载核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("SqlMapConfig.xml");

        // 获得sqlSession工厂对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);

        //获得sqlSession对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        User deleteUser = new User();
        deleteUser.setUsername("新的用户名PanPan");
        deleteUser.setId(1);

        // 执行sql语句
        int rows = sqlSession.delete("userMapper.deleteUser",deleteUser);

        // 打印结果
        System.out.println(rows);

        // 提交事务
        sqlSession.commit();

        // 释放资源
        sqlSession.close();
    }

```



执行结果如下，成功删除 id =1 ，username=**新的用户名PanPan**的数据记录。



![](https://www.panshenlian.com/images/post/00_old_article_images/Mybatis/project03/delete.jpg)



**删除操作注意问题**

1、删除语句使用 delete 标签

2、Sql语句中使用#{实体属性名}引用传递的对象属性

3、删除操作使用的API是sqlSession.delete(“命名空间.id”,Object);



> 删除操作也可以通过执行id的方式进行删除，例如在映射文件中把参数设置为parameterType="java.lang.Integer"，实际 API 是sqlSession.delete("命名空间.id",1);



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/06.png)
#### 总结

我们通过本文介绍，基本掌握了 Mybatis 最基础的 CRUD 操作，后续，我们逐步深入。




>本篇完，本系列下一篇我们讲《 **Mybatis系列全解（四）：XML配置文件与API介绍** 》。



![](https://www.panshenlian.com/images/post/00_old_article_images/sourceMaterial/article_the_end.png)