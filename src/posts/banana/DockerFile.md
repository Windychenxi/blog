---
title: Dockerfile 自动构建 Docker 镜像
abbrlink: 2
top_img: >-
  https://butterfly-1316798368.cos.ap-nanjing.myqcloud.com/images/hd-wallpaper-g8573635f7_1920.jpg
cover: >-
  https://butterfly-1316798368.cos.ap-nanjing.myqcloud.com/images/hd-wallpaper-g8573635f7_1920.jpg
tag:
  - Dockerfile
  - Docker
categories:
  - Docker
---

### 前言



### 推荐阅读



### Dockerfile自动构建 Docker 镜像

### 环境介绍

`DockerFile` 中所用所有文件一定要和 `Dockerfile` 文件在同一级父目录下，可以为 `Dockerfile` 父目录的子目录

`Dockerfile` 中相对路径默认都是 `Dockerfile` 所在目录

`Dockerfile` 中一定要惜字如金，能写到一行的指令，一定要写到一行，原因是分层构建，联合挂在这一特性

`Dockerfile` 中每一条指令视为一层

`Dockerfile` 中指明大写（约定俗成）



### DockerFile 指令集

#### FROM

指定基础镜像，并且必须是第一条指令。如果不以任何镜像为基础，那么写法为：`FROM scratch`。

同时意味着接下来缩写的指令将作为镜像的第一次开始。

**语法：**

```dockerfile
FROM <image>
FROM <image>:<tag>
FROM <image>:<digest>
```

> **说明**
>
> 三种写法，其中 `<tag>` 和 `<digest>` 是可选，如果没有选择，那么默认值为 `latest`



#### MASINTAINER

指定维护者信息（可选）

**语法：**

```cpp
MAINTAINER <name>
```

> **说明**
>
> 新版本 `Docker` 使用 `LABEL` 指明

------

#### LABEL	

为镜像指明标签，一个 `Dockerfile` 可以有多个 `LABEL`

**语法：**

```dockerfile
LABEL <key>=<value> <key>=<value> <key>=<value> ...
 一个Dockerfile种可以有多个LABEL，如下：

LABEL "com.example.vendor"="ACME Incorporated"
LABEL com.example.label-with-value="foo"
LABEL version="1.0"
LABEL description="This text illustrates \
that label-values can span multiple lines."
 但是并不建议这样写，最好就写成一行，如太长需要换行的话则使用\符号

如下：

LABEL multi.label1="value1" \
multi.label2="value2" \
other="value3"
```

> **说明**
>
> `LABEL` 会继承基础镜像中的 `LABEL`，如遇到相同的 `key`，则值覆盖

------

#### ADD

复制命令。把文件复制到镜像中，类似于 `SCP` 命令

**语法：**

```dockerfile
ADD <src>... <dest>
ADD ["<src>",... "<dest>"]
```

> **说明**
>
> - `src` 为目录时，会自动把目录下的文件复制过去，目录本身不会被复制
> - `src` 为多文件，`dest` 一定要是一个目录
> - `src` 为 `URL`，那么 `ADD` 就类似于 `wget` 命令

------

#### COPY

复制命令

**语法：**

```dockerfile
COPY <src>... <dest>
COPY ["<src>",... "<dest>"]
```

> **说明**
>
> 与 `ADD` 的区别是，`COPY` 只能复制本地文件，其它用法一致

------

#### EXPOSE

向外暴露容器运行时的监听端口。但是 `EXPOSE` 不会使容器访问主机的端口。

容器与主机建立端口映射，必须在容器启动时加上 `-P` 参数

**语法：**

```dockerfile
EXPOSE <port>/<tcp/udp>
```

------

#### ENV

设置环境变量

**语法：**

```dockerfile
 ENV <key> <value>		    // 一次设置一个
 ENV <key>=<value> ...		// 一次设置多个
```

使用变量方式

```dockerfile
$varName
${varName}			       // 1 和 2 相同
${varName:-default value}   // 当变量 varName 不存在时，使用默认值 value
${varName:+default value}   // 当变量 varName 存在时，使用默认值 value （不存在时，也是用默认值 value）
```

------

#### RUN

运行指定命令

**语法：**

```dockerfile
RUN <command>							// 直接跟 shell 命令
RUN ["executable", "param1", "param2"]	  // 函数调用
```

------

#### CMD

容器启动时默认命令或参数

**语法：**

```dockerfile
CMD ["executable","param1","param2"]
CMD ["param1","param2"]
CMD command param1 param2
```

**举例：**

```dockerfile
CMD [ "sh", "-c", "echo $HOME" 
CMD [ "echo", "$HOME" ]
```

> **说明**
>
> 参数一定要用双引号，不得使用单引号。原因：`Docker` 解析是一个 `JSON Array`
>
> 
>
> `RUN` & `CMD`
>
> `RUN` 是构建容器时就运行的命令以及提交运行结果
>
> `CMD` 是容器启动时执行的命令，在构建时并不运行

------

#### ENTRYPOINT

容器启动时运行的启动命令

**语法：**

```dockerfile
 ENTRYPOINT ["executable", "param1", "param2"]   // EXEC调用，可在 docker run 启动时传递参数	
 ENTRYPOINT command param1 param2				// shell 命令
```

> **说明**
>
> `CMD` & `ENTRYPOINT`
>
> 相同点：
>
> ​	只能写一条，多条最后一条生效
>
> ​	容器启动时才运行，运行时机相同
>
> 不同点：
>
> ​	`ENTRYPOINT` 不会被运行的 `command` 覆盖，但 `CMD` 则会被覆盖
>
> ​	如果在 `Dockerfile` 中同时写了 `ENTRYPOINT` 和 `CMD`， 并且 `CMD` 指令不是一个完整的可执行命令，那么`CMD` 指定的内容将会作为 `ENTRYPOINT` 的参数，见`示例1`。
>
> ​	如果在 `Dockerfile` 中同时写了 `ENTRYPOINT` 和 `CMD`，并且 `CMD` 是一个完整的可执行命令，那么 `CMD`会相互覆盖，谁在最后谁生效，见`示例2`。

**示例1：**

```dockerfile
FROM ubuntu
ENTRYPOINT ["top", "-b"]
CMD ["-c"]
```

**实例2：**

```dockerfile
FROM ubuntu
ENTRYPOINT ["top", "-b"]
CMD ls -al
```

------

#### VOLUME

挂载功能，可将宿主机目录挂载到容器中。持久化 `Docker` 容器中的数据

**语法：**

```dockerfile
VOLUME ["/data"]	// ["/data"] 可以是一个 JsonArray，也可以是多个值

VOLUME ["/var/log/"]
VOLUME /var/log
VOLUME /var/log /var/db
```

------

#### USER

设置启动容器的用户。可以使用户名或 `UID`

**语法：**

```dockerfile
USER daemo
USER UID
```

> **注意**
>
> 如果设置了容器以 `daemon` 用户去运行，那么`RUN`、`CMD` 和 `ENTRYPOINT` 都会以这个用户去运行，使用这个命令一定要确认容器中拥有这个用户，并且拥有足够权限

------

#### WORKDIR

设置工作目录。对`RUN`、`CMD`、`ENTRYPOINT`、`COPY`、`ADD` 生效。如果不存在则会创建，也可以设置多次。

**语法：**

```dockerfile
WORKDIR /a
WORKDIR b
WORKDIR c
RUN pwd
// /a/b/c
```

`WORKDIR` 可以解析环境变量

```dockerfile
ENV DIRPATH /path
WORKDIR $DIRPATH/$DIRNAME
RUN pwd
// /path/$DIRNAME
```

------

#### ARG

设置变量命令。`ARG` 命令定义了一个变量，在 `Docker build` 创建镜像的时候，使用 `--build-arg=` 来指定参数。

如果用户在 build 镜像时，制定了一个参数没有定义在 `Dockerfile` 中，那么将会有一个 `Warning`，提示如下：

```verilog
[Warning] One or more build-args [foo] were not consumed.
```

**语法：**

```dockerfile
FROM busybox
ARG user1
ARG buildno

ARG user1=someuser	// 设置默认值
ARG buildno=1
```

------

#### ONBUILD

可以理解为声明周期钩子。这个命令只对当前镜像的子镜像生效。

例如：在子镜像中的 `Dockerfile` 中添加：

```dockerfile
ONBUILD RUN ls -al
```

`ls -al` 命令不会在子镜像构建或启动时执行

而其父镜像基于该子镜像构建时，那么 `ls -al` 命令将会被执行

**语法：**

```dockerfile
ONBUILD [INSTRUCTION]
```

------

#### STOPSIGNAL

当容器停止时，给系统发送指令，默认 `15`

**语法：**

```dockerfile
STOPSIGNAL signal
```

------

#### HEALTHCHECK

容器健康状况检查命令

**语法：**

```dockerfile
 HEALTHCHECK [OPTIONS] CMD command		// 在容器内部运行一个命令来检查容器的健康状况
 HEALTHCHECK NONE					   // 在基础镜像中取消健康检查命令
```

> **说明**
>
> - `–interval=DURATION` 两次检查默认的时间间隔为`30秒`
>
> - `–timeout=DURATION` 健康检查命令运行超时时长，默认`30秒`
>
> - `–retries=N` 当连续失败指定次数后，则容器被认为是不健康的，状态为`unhealthy`，默认次数是`3`
>
>   
>
> `HEALTHCHECK` 命令只能出现一次，如果出现了多次，只有最后一个生效。
>
> `CMD` 后边的命令的返回值决定了本次健康检查是否成功，具体的返回值如下：
>
> - `0`  `success` - 表示容器是健康的
>
> - `1`  `unhealthy` - 表示容器已经不能工作了
>
> - `2`  `reserved` - 保留值

**示例**

```dockerfile
HEALTHCHECK --interval=5m --timeout=3s \		// 两次检查间隔5分钟，超时时间3秒
CMD curl -f http://localhost/ || exit 1			// 健康检查命令
```

### 单阶段构建镜像

现在都是前后端分离，这里也是进行前后端分开构建镜像说明。

#### 前端

构建一个镜像，需要寻找合适的基底镜像。前端使用 `Vue`，那么就要了解 `Vue` 运行所需要的环境。

`Vue` 需要使用 `Node.js` 进行解析，那么就需要安装 `Node.js` 的环境。安装 `Node.js` 很慢，而且安装不一定安装得完全。考虑到最终上线，还是要使用容器进行创建，所以去下载一个 `Node.js` 的环境。这里使用的是`node:16.15.0` 版本。

##### 准备环境

将 `Node.js` 镜像下载到本地

```cpp
docker pull node：16.15.0
```

下载完毕后，运行一个 `Node.js` 的环境。

```cpp
docker run -itd --name webserver-vue -p 8080:8080 node:16.15.0
```

##### 下载代码

查看容器

```cpp
docker container ls
```

进入到容器内

```cpp
docker exec -id webserver-vue bash
```

需要在容器里运行 `Vue` 的代码，由研发提供代码，怎么去获取代码？到 `Gitlab` 管理仓库下载

在容器里使用 `Git` 进行下载到本地

```cpp
git clone https://github.com/hloins/webserver-vue.git
```

##### 安装依赖

可以得到一个 `webserver-vue` 的目录，进入到 `webserver-vue` 目录

要运行 `Vue` 项目，首先需要安装依赖，将依赖包安装到本地

```cpp
npm install
```

##### 启动项目

启动 `Vue` 项目

```cpp
npm run serve
```

##### 访问项目

启动成功后，浏览器访问 `8080` 端口，可以看到  `Vue` 项目已经启动成功。

##### Dockerfile 构建

首先清空容器

```cpp
docker rm -f `docker ps -a -q`	// 清空容器
    
docker ps -a	// 查看已清空
```

创建工作目录

```cpp
mkdir -p /opt/docker-images/webserver-vue
```

在该目录编写 `Dockerfile` （**注意首字母大写，且没有后缀**）

所有的 `Dockerfile` 都叫 `Dockerfile`。区分不同镜像的 `Dockerfile`，按上级目录名称进行区分

```dockerfile
FROM node:16.15.0											# 基底镜像

RUN git clone https://gitee.com/mirschao/webserver-vue.git	    # 下载代码

WORKDIR webserver-vue                                           # 工作目录

RUN npm install                                                 # 安装依赖

EXPOSE 8080                                                     # 暴露端口

CMD ["npm", "run", "serve"]                                     # 启动指令(容器启动时运行)
```

触发构建

```cpp
$ cd /opt/docker-images/webserver
$ docker build -t webserver:v1.0 .     // 指定自定义镜像的名称 和 tag，使用当前目录下的 Dockerfile 进行构建
```

运行镜像

```cpp
docker run -itd --name webserver-vue-porject -p 8080:8080 webserver-vue:v1.0
```

查看容器

```cpp
docker ps -a
```

访问项目

浏览器访问`8080`端口，访问运行的项目



#### 后端

这里以 `Python` 为例。以下有两个版本的 `Python`，正式版（921M）包含 `Python` 的所有功能，`alpine`简版包含`Python` 运行的基础功能。

```verilog
[root@localhost ~]# docker images
REPOSITORY   TAG       IMAGE ID       CREATED      SIZE
python       alpine    7bc17fb245bd   4 days ago   51.7MB
python       latest    a8405b7e74cf   4 days ago   921MB
```

在构建项目时，所使用的基底镜像越大，那么构建出来的项目包也就越大。所以通常使用简版的 `alpine` 的基底。需要哪些功能，在自行安装即可。



##### 准备环境

加载 `Python` 运行环境，启动容器并向外暴露 `8000` 端口

```cpp
[root@localhost ~]# docker run -itd --name webserver-backend -p 8000:8000 python:alpine
79b53ab8eae25c4fbff70e87b97c0e83ae05c8cc1d1f5957a05083b7ac8ee921
```

##### 下载代码

进入容器。使用 `alpine` 版本，进入容器需要使用 `sh` 命令

```cpp
[root@localhost ~]# docker exec -it webserver-backend sh
/ #
```

> **注意**
>
> 使用 `bash` 命令，会提示没有该命令，如下报错
>
> ```cpp
> [root@localhost ~]# docker exec -it webserver-backend bash
> OCI runtime exec failed: exec failed: unable to start container process: exec: "bash": executable file not found in $PATH: unknown
> ```



使用 `Git` 下载代码

需要在容器外下载好代码，再拷贝进容器

```cpp
[root@localhost ~]# git clone https://gitee.com/mirschao/webserver-backend.git

# 拷贝至容器 webserver-backend 根目录
[root@localhost soft]# docker cp webserver-backend webserver-backend:/
Preparing to copy...
Copying to container - 32.77kB
Copying to container - 65.54kB
Copying to container - 98.3kB
Copying to container - 111.1kB
Successfully copied 111.1kB to webserver-backend:/
```

进入容器查看拷贝的代码

```cpp
[root@localhost soft]# docker exec -it webserver-backend sh
/ # cd webserver-backend
/webserver-backend # ls -l
total 28
-rw-r--r--    1 root     root           231 Mar 19 01:13 Dockerfile
-rw-r--r--    1 root     root         11357 Mar 19 01:13 LICENSE
-rw-r--r--    1 root     root            35 Mar 19 01:13 README.md
-rwxr-xr-x    1 root     root           672 Mar 19 01:13 manage.py
-rw-r--r--    1 root     root            14 Mar 19 01:13 requirements.txt
drwxr-xr-x    2 root     root            89 Mar 19 01:13 webserverbackend
```

主要关注 `requirements.txt` 文件，这里存储了一些需要的依赖包

```cpp
/webserver-backend # cat requirements.txt
Django==4.0.4
```

> **注意**
>
> 项目如果需要其它的依赖包，可以写入到 `requirements.txt` 文件里，然后在这里安装。



##### 安装依赖

`python` 安装工具 `pip` 

（`java` 的安装命令是 `mvn`， `go` 安装命令是 `go install`， `vue` 是 `npm install`）

```cpp
# -i 使用哪个加速镜像	-r 指定使用哪个文件安装里面的依赖
pip install -i https://mirrors.ustc.edu.cn/pypi/web/simple -r requirements.txt
```

安装如下

```cpp
/webserver-backend # pip install -i https://mirrors.ustc.edu.cn/pypi/web/simple -r requirements.txt
Looking in indexes: https://mirrors.ustc.edu.cn/pypi/web/simple
Collecting Django==4.0.4
  Downloading https://mirrors.bfsu.edu.cn/pypi/web/packages/66/90/bce00eb942fbc47b0774ac78910ee4e6f719572aad56dc238823e5d0ee54/Django-4.0.4-py3-none-any.whl (8.0 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 8.0/8.0 MB 1.8 MB/s eta 0:00:00
Collecting asgiref<4,>=3.4.1
  Downloading https://mirrors.bfsu.edu.cn/pypi/web/packages/8f/29/38d10a47b322a77b2d12c2b79c789f52956f733cb701d4d5157c76b5f238/asgiref-3.6.0-py3-none-any.whl (23 kB)
Collecting sqlparse>=0.2.2
  Downloading https://mirrors.bfsu.edu.cn/pypi/web/packages/97/d3/31dd2c3e48fc2060819f4acb0686248250a0f2326356306b38a42e059144/sqlparse-0.4.3-py3-none-any.whl (42 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 42.8/42.8 kB 3.2 MB/s eta 0:00:00
Installing collected packages: sqlparse, asgiref, Django
Successfully installed Django-4.0.4 asgiref-3.6.0 sqlparse-0.4.3
WARNING: Running pip as the 'root' user can result in broken permissions and conflicting behaviour with the system package manager. It is recommended to use a virtual environment instead: https://pip.pypa.io/warnings/venv

[notice] A new release of pip available: 22.3.1 -> 23.0.1
[notice] To update, run: pip install --upgrade pip
/webserver-backend #
```

##### 启动项目

```cpp
/webserver-backend # python manage.py runserver 0.0.0.0:8000
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).

You have 18 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.
March 19, 2023 - 01:48:02
Django version 4.0.4, using settings 'webserverbackend.settings'
Starting development server at http://0.0.0.0:8000/
Quit the server with CONTROL-C.
```

##### 访问项目

浏览器访问地址 `192.168.10.165:8000`，可以看到如下页面，项目启动成功。

![image-20230319095123365](https://butterfly-1316798368.cos.ap-nanjing.myqcloud.com/images/image-20230319095123365.png)



##### Dockerfile 构建

后端需要将 `Dockerfile` 一起提交至 `Gitlab` 仓库，和前端不同。

下载好代码

```cpp
[root@localhost ~]# git clone https://gitee.com/mirschao/webserver-backend.git
```

查看代码文件

```cpp
[root@localhost webserver-backend]# ll
total 28
-rw-r--r--. 1 root root   231 Mar 18 18:13 Dockerfile
-rw-r--r--. 1 root root 11357 Mar 18 18:13 LICENSE
-rwxr-xr-x. 1 root root   672 Mar 18 18:13 manage.py
-rw-r--r--. 1 root root    35 Mar 18 18:13 README.md
-rw-r--r--. 1 root root    14 Mar 18 18:13 requirements.txt
drwxr-xr-x. 2 root root    89 Mar 18 18:13 webserverbackend
```

`Dockerfile` 是以当前父级目录为根目录

```dockerfile
FROM python:alpine3.15							# 基底镜像

WORKDIR webserverbackend						# 工作目录

COPY . ./webserverbackend						# 拷贝代码

RUN pip install -i https://mirrors.ustc.edu.cn/pypi/web/simple -r requirements.txt		# 安装依赖

EXPOSE 8000									   # 暴露端口

CMD ["python", "manager.py", "runserver", "0.0.0.0:8000"]		# 启动指令
```

触发构建

```cpp
docker build -t webserver-backend:v1.0 .
```

运行镜像

```cpp
docker run -itd --name test-webserver-backend-1.1 -p 8082:8000 webserver0backend:v1.0
```

##### 查看日志

```cpp
docker log -f webserver-backend
```



### 多阶段构建镜像

主要应用在编程语言在编译过程中，会产生中间产物，而产物作为上线的依据。

以前端 `Vue` 项目为例

![多阶段构建-导出](https://butterfly-1316798368.cos.ap-nanjing.myqcloud.com/images/%E5%A4%9A%E9%98%B6%E6%AE%B5%E6%9E%84%E5%BB%BA-%E5%AF%BC%E5%87%BA.png)



制作 `Vue` 项目的镜像，`Vue` 项目编译阶段需要使用 `Node.js`，生成的是静态文件。而在生产环境运行时，只需将静态文件放入 `Nginx` 中即可，并不需要 `Node.js`。那么在制作镜像时就没有必要以 `Node.js` 为基底镜像，而是使用的是 `Nginx` 作为基底镜像。这样可以缩小制作出来的镜像大小，**符合制作出来的镜像尽量小的原则**。

```cpp
[root@localhost soft]# docker image ls
REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
python       alpine    7bc17fb245bd   5 days ago     51.7MB
python       latest    a8405b7e74cf   5 days ago     921MB
nginx        latest    904b8cb13b93   2 weeks ago    142MB
node         16.15.0   9d200cd667d5   9 months ago   907MB
```

#### 下载代码

```cpp
[root@localhost soft]# git clone https://gitee.com/mirschao/webserver-vue.git
Cloning into 'webserver-vue'...
remote: Enumerating objects: 38, done.
remote: Counting objects: 100% (38/38), done.
remote: Compressing objects: 100% (32/32), done.
remote: Total 38 (delta 6), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (38/38), done.
```

#### Dockerfile

```cpp
FROM node:16.15.0
# FROM node:16.15.0 AS basic
COPY ./ /app
WORKDIR /app
RUN npm install && npm run build

FROM nginx:1.21
RUN mkdir /app
COPY --from=0 /app/dist /app			# 0 代表第一个基底镜像(推荐)【从之前的镜像拷贝产物】
# COPY basic:/app/dist /app				# 别名为 basic 的基底镜像
COPY nginx.conf /etc/nginx/nginx.conf
```

#### Nginx 配置

nginx.conf

```cpp
user nginx;
worker_process 1;
error_log     /var/log/nginx/error.log warn;
pid           /var/run/nginx.pid;
events {
    worker_connections 1024;
}
http {
    include          /etc/nginx/mime.types;
    default_type     application/octet-strean;
    log_format    main   '$remote_addr - $remote_user [$time_local] "$request" '
                         '$status $body_bytes_sent "$http_referer" '
                         '"$http_user_agent" "$http_x_forwarded_for" ';
    acess_log        /var/log/nginx/access.log main;
    sendfile             on;
    keepalive_timeout    65;
    server {
        listen           80;
        server_name      localhost;
        location / {                                // 使用的是 location 根
            root         /app;                      // java 根设置在了根目录下的 /app
            index        index.html;                // 主页文件
            try_files    $uri $uri/ /index.html;    // 尝试使用用户的uri地址访问主页，try_files
                                                    // Vue中经常使用，从根目录下开始匹配用户的 uri
        }
        error_page       500 502 503 504 /50x.html; // 错误页面
        location = /50x.html {
            root         /usr/share/nginx/html;
        }
    }
}
```

#### 制作镜像

将 `Dockerfile` 放入下载的代码目录下，进行镜像制作

```cpp
[root@localhost webserver-vue]# docker build -t vue-project:v1.0 .
```

#### 启动项目

```cpp
docker run -itd --name vue-project -p 80:80 vue-project:v1.0
```

在自定义 `Dockerfile` 时，并未对外暴露 `80` 端口，但这边使用了 `80` 端口，是因为在基底镜像 `Nginx` 中已经暴露了该端口。

在[dockerhub](https://hub.docker.com/)上查找 `Nginx-1.21`镜像版本

![image-20230319114515520](https://butterfly-1316798368.cos.ap-nanjing.myqcloud.com/images/image-20230319114515520.png)



找到 `1.21` 版本，查看它的 `Dockerfile` 文件，可以看到已经暴露了 `80` 端口

![image-20230319114737663](https://butterfly-1316798368.cos.ap-nanjing.myqcloud.com/images/image-20230319114737663.png)



在更改基底镜像时，基底镜像原有的配置是不会被更改的。除非使用相同的 `EXPOSE` 去覆盖它。

------

