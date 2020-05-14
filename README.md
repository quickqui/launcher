# @quick-qui/launcher

实现的一部分，负责将运行时运行起来。


## 如何工作

1. [@quick-qui/builder](http://github.com/quickqui/builder) 会负责准备好运行时需要的所有材料。体现为一个目录，称为“成品目录”。
2. 根据成品目录中的配置（./.env 和./implementationModel.json)运行一个[@quick-qui/model-server](https://github.com/quickqui/model-server) 实例。
3. 从 model-server 得到模型。
4. 根据模型（主要是其中的 implementations 部分）启动各个实现。
5. 目前支持的运行时类型是 -
   1. command - 本地可执行命令运行。
   2. docker - docker container 运行。
   3. 🏃🏻npm - 类似于command，只不过不是直接的路径配置，而是通过npm的依赖机制寻找实现的运行路径。


## 如何运行

作为npm依赖，被引入到“成品目录”中，被成品目录中的脚本（一般是node脚本）调用。不会直接运行。