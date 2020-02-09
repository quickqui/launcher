# quick-qui/launcher

实现的一部分，负责将各个[implementation]()的运行时运行起来。

模型相关概念请参照 - （TODO）



## 如何工作 -

1. 自己运行起来。
2. 根据配置找到model-server，从model-server得到模型。
3. 根据模型（主要是其中的implementations部分）启动各个implementation。
4. 目前支持的运行时类型是 -
    1. command - 本地可执行命令运行。
    2. docker - docker container运行。 （TODO）