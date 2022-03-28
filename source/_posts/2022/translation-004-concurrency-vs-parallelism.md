---
title: 译文《Java并发编程之并发与并行》
date: 2022-03-28 17:08:11
tags:
- 译文集
- Java
- 并发编程
- 多线程
- 并行
preview: http://www.panshenlian.com/images/post/java/concurrency/concurrency-vs-parallelism/title.jpg
introduce: |
    并发性和并行性通常用于与多线程程序相关的，最早并发性和并行性似乎指的是相同的概念，但其实并发和并行实际上有不同的含义。在这个并发与并行教程中，我将解释这些概念的含义。
---

![translation-004-concurrency-vs-parallelism.md#title.jpg](http://www.panshenlian.com/images/post/java/concurrency/concurrency-vs-parallelism/title.jpg)

> 作者: 雅各布·詹科夫
> 原文: http://tutorials.jenkov.com/java-concurrency/concurrency-vs-parallelism.html
> 翻译: [潘深练的个人网站](http://www.panshenlian.com) 如您有更好的翻译版本，欢迎 ❤️ 提交 [issue](https://github.com/senlypan/concurrent-programming-docs/issues) 或投稿哦~
> 更新: 2022-02-23

并发性和并行性通常用于与多线程程序相关的，最早并发性和并行性似乎指的是相同的概念，但其实并发和并行实际上有不同的含义。在这个并发与并行教程中，我将解释这些概念的含义。

为了清楚起见，在本文中，我讨论在单个应用程序（单个进程）中的并发性和并行性。不在多个应用程序、进程或计算机之间。

## 并发与并行教程视频

如果您喜欢视频，这里有本教程对应的视频版本: [并发与并行教程视频](https://www.youtube.com/watch?v=Y1pgpn2gOSg&list=PLL8woMHwr36EDxjUoCzboZjedsnhLP1j4&index=9)

![01-Concurrency-vs-Parallelism#concurrency-vs-parallelism-video-screenshot.png](http://www.panshenlian.com/images/post/java/concurrency/concurrency-vs-parallelism/concurrency-vs-parallelism-video-screenshot.png)

## 什么是并发

并发是指在一个应用程序中同时存在多个任务在执行，同时刻或者说看起来是同一时刻（并发）。

如果计算机只有一个CPU，应用程序可能不会在同一时间完成多个任务，但在应用程序内部一次完成多个任务。要同时在多个任务上取得进展，CPU会在执行期间在不同的任务之间切换。如下图所示：

![01-Concurrency-vs-Parallelism#concurrency-vs-parallelism-1.png](http://www.panshenlian.com/images/post/java/concurrency/concurrency-vs-parallelism/concurrency-vs-parallelism-1.png)

## 什么是并行执行

并行执行是指计算机具有多个 CPU 或 CPU 内核，并同时在多个任务上取得进展。但是，并行执行并不是指与并行性相同的现象 。稍后我将回到并行性。并行执行如下图所示：

![01-Concurrency-vs-Parallelism#concurrency-vs-parallelism-2.png](http://www.panshenlian.com/images/post/java/concurrency/concurrency-vs-parallelism/concurrency-vs-parallelism-2.png)

## 并行并发执行

可以进行并行并发执行，其中线程分布在多个 CPU 中。因此，在同一个 CPU 上执行的线程是并发执行的，而在不同 CPU 上执行的线程是并行执行的。下图说明了并行并发执行。

![01-Concurrency-vs-Parallelism#concurrency-vs-parallelism-3.png](http://www.panshenlian.com/images/post/java/concurrency/concurrency-vs-parallelism/concurrency-vs-parallelism-3.png)

## 理解并行性

并行性意味着一个应用程序将其任务拆分成更小的子任务，这些子任务可以并行处理，例如在多个CPU上同时处理。因此，并行性并不是指与并行执行相同的执行模型，即使它们表面上看起来很相似。

为了实现真正的并行性，您的应用程序必须运行多个线程，每个线程必须在单独的 CPU/CPU 内核/显卡 GPU 内核或类似内核上运行。

下图显示了一个更大的任务，它被分为4个子任务。这4个子任务由4个不同的线程执行，它们运行在2个不同的CPU上。这意味着，这些子任务的部分是并行执行的（在同一CPU上执行的），而部分是并行执行的（在不同CPU上执行的）。

![01-Concurrency-vs-Parallelism#concurrency-vs-parallelism-4.png](http://www.panshenlian.com/images/post/java/concurrency/concurrency-vs-parallelism/concurrency-vs-parallelism-4.png)

如果这4个子任务由4个线程在各自的CPU上执行（总共4个CPU），那么任务的执行将是完全并行的。然而，要将一个任务分解成与可用CPU数量一样多的子任务并不总是那么容易。通常，将一个任务分解为多个子任务更容易，这些子任务与手头的任务自然匹配，然后让线程调度器负责在可用CPU之间分配线程。

## 并发和并行组合

综上所述，并发性指的是多个任务在单个CPU上看似同时取得进展。

另一方面，并行性与应用程序如何并行执行单个任务有关，通常是通过将任务拆分为可以并行完成的子任务。

这两种执行方式可以在同一个应用程序中组合。我将在下面介绍其中一些组合。

### 并发，非并行

应用程序可以是并发的，但不能是并行的。这意味着它似乎同时（同时）在多个任务上取得进展，但应用程序会在每个任务上取得进展之间切换，直到任务完成。在并行线程/CPU中没有真正的任务并行执行。

### 并行，不并发

应用程序也可以是并行的，但不能是并发的。这意味着应用程序一次只能处理一个任务，而这个任务被分解成可以并行处理的子任务。但是，每个任务（+子任务）都是在下一个任务被拆分并并行执行之前完成的。

### 既不并发也不并行

此外，应用程序既不能是并发的，也不能是并行的。这意味着它一次只能处理一个任务，而且任务永远不会分解为并行执行的子任务。小型命令行应用程序可能就是这种情况，因为它只有一个作业，太小了，无法并行化。

### 并发且并行

最后，应用程序还可以通过两种方式同时并发和并行：

第一种是简单的并行执行。如果应用程序启动多个线程，然后在多个CPU上执行，就会发生这种情况。

第二种方式是应用程序同时处理多个任务，并将每个任务分解为子任务，同时以并行的方式执行。但是在这种情况下，并发和并行的一些性能优势可能会丢失，因为计算机中的 CPU 基于在频繁于并发或并行处理。所以并发且并行，可能只会带来微小的性能提升甚至可能是性能损失。因此，除非有特殊目的并且已经提前进行了充分分析和测量，否则不建议采用并发并行模型。

（本篇完）

> 作者: 雅各布·詹科夫  
> 原文: http://tutorials.jenkov.com/java-concurrency/concurrency-vs-parallelism.html
> 翻译: [潘深练的个人网站](http://www.panshenlian.com) 如您有更好的翻译版本，欢迎 ❤️ 提交 [issue](https://github.com/senlypan/concurrent-programming-docs/issues) 或投稿哦~
> 更新: 2022-02-23