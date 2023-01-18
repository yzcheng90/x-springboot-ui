
#### 🚧 安装 cnpm、yarn

- 复制代码(桌面 cmd 运行) `npm install -g cnpm --registry=https://registry.npm.taobao.org`
- 复制代码(桌面 cmd 运行) `npm install -g yarn`

#### ⚡ 使用说明

建议使用 cnpm，因为 yarn 有时会报错。`npm install` 安装报错的话，请使用 `cnpm install`。

> 注意：`node` 需大于 `12.xxx` 小于等于 `v16.14.0`，否则安装依赖将报错。

```bash
# 克隆项目
git clone https://gitee.com/lyt-top/vue-next-admin.git

# 进入项目
cd vue-next-admin

# 切换分支
git checkout vue-prev-admin

# 安装依赖
cnpm install
cnpm install eslint-webpack-plugin --save-dev
cnpm install core-js --save-dev

# 运行项目
cnpm run dev

# 打包发布
cnpm run build
```

#### 📚 开发文档

- 查看开发文档：<a href="https://lyt-top.gitee.io/vue-next-admin-doc-preview" target="_blank">vue-next-admin-doc</a>
