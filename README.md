# MingJIng
A Dapp for Ming Jing community.

## 介绍 Introduction

**明镜** 是以重开研究指导的一个社区解决方案，采用重开逻辑为基础的交流方式。用户在交流时可以对彼此的意见提出质询，构成 意象 - 推断 - 驳斥的方式，弥合人与人的割裂，更有效地统合不同人的意见。

## 技术选型 Tools

本项目是一个智能合约程序，位于 Solana 公链上。相较于 Ethereum，Solana 的性能更好，Gas Fee 更低廉。项目的数据库存储在 Solana 公链上，但受制于比较高昂的 Storage Rent，所以在开发测试初期每一条进展被设计为只能携带 280 字符的内容。但在未来会考虑使用 Arweave 存储技术，以更低廉的价格提供更多的存储空间，使得图片、视频上传成为可能。

本项目使用了 Anchor 框架开发 Solana Program。

## 参考 Reference

本项目参考 [solana-twitter](https://lorisleiva.com/create-a-solana-dapp-from-scratch) 编写。