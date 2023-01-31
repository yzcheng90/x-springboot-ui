<h1> x-springboot-ui </h1>

#### 📚 后台地址  https://github.com/yzcheng90/X-SpringBoot

#### 🚧 安装 cnpm、yarn

- 复制代码(桌面 cmd 运行) `npm install -g cnpm --registry=https://registry.npm.taobao.org`
- 复制代码(桌面 cmd 运行) `npm install -g yarn`

#### ⚡ 使用说明

建议使用 cnpm，因为 yarn 有时会报错。`npm install` 安装报错的话，请使用 `cnpm install`。

> 注意：`node` 需大于 `12.xxx` 小于等于 `v16.14.0`，否则安装依赖将报错。

```bash
# 克隆项目
git clone https://github.com/yzcheng90/x-springboot-ui.git

# 进入项目
cd x-springboot-ui

# 安装依赖
cnpm install
cnpm install eslint-webpack-plugin --save-dev
cnpm install core-js --save-dev
npm install element-plus --save-dev
npm install --save @vue/composition-api
npm install --save @vue/shared 
npm install --save @vue/reactivity



# 运行项目
cnpm run dev

# 打包发布
cnpm run build
```

#### 部署说明

nginx 配置
```yaml
    server {
        listen 80;
        server_name localhost;
        client_max_body_size    100m; 
  
        location / {
            # UI目录
            root  i:/ui;
            #动态页面
            proxy_set_header X-forwarded-for $proxy_add_x_forwarded_for;
            proxy_set_header X-Real-IP $remote_addr;
            if ( !-e $request_filename ){
                proxy_pass    http://127.0.0.1:8080;
            }
        }

        location ^~// {
            proxy_set_header X-forwarded-for $proxy_add_x_forwarded_for;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_pass    http://127.0.0.1:8080;
        }
    }
```
访问：http://localhost


#### 📚 开发文档
- 前台UI框架地址：https://gitee.com/lyt-top/vue-next-admin.git
- 查看开发文档：<a href="https://lyt-top.gitee.io/vue-next-admin-doc-preview" target="_blank">vue-next-admin-doc</a>
