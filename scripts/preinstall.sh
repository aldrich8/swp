#! /bin/bash

# 检验项目包管理工具
npx only-allow yarn

# 增强workspace .gitconfig配置, 支持自定义脚本
git config --local include.path ../.workspace/.gitconfig
