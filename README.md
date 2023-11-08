
# Clipboard Sync Client

Clipboard Sync Client 是用于连接到 Clipboard Sync Server 的客户端应用程序，允许您在多个设备之间同步剪贴板内容。您可以通过以下方式构建和安装客户端：

## 构建方式(NodeJs v16.17.1)

### 克隆项目并安装依赖

1. 首先，使用Git工具克隆 Clipboard Sync Client 项目：

   ```shell
   git clone https://github.com/liuzhenghang/clipboard-sync-client.git
   ```

2. 进入项目目录：

   ```shell
   cd clipboard-sync-client
   ```

3. 安装项目依赖项：

   ```shell
   npm install
   ```

### 构建客户端应用程序

4. 在项目目录中，执行以下命令以构建客户端应用程序。请注意，`npm make` 命令只能构建当前设备的运行程序，因此您需要在每个设备上分别构建客户端。

   ```shell
   npm make
   ```

## 使用

一旦客户端应用程序构建完成，您可以在不同设备上安装和运行客户端。使用客户端应用程序时，请确保配置客户端以连接到正确的 Clipboard Sync Server。

### 下载预构建的客户端

如果您不想手动构建客户端应用程序，您也可以直接下载预构建的 Release 版本。这些版本通常包含适用于不同操作系统和架构的可执行文件。在[客户端项目的发布页面](https://github.com/liuzhenghang/clipboard-sync-client/releases)中，您可以找到适用于您的设备的预构建客户端。下载并运行客户端即可开始同步剪贴板内容。

## 支持

如果您遇到任何问题或需要帮助，请随时在GitHub上提交问题或请求帮助。我们将尽力为您提供支持。

## 许可

Clipboard Sync Client 使用 MIT 许可证。有关更多信息，请参阅[LICENSE文件](LICENSE)。

---

请注意，这是一个示例README，您应根据实际项目的需求和特点进行调整和扩展。此外，您还可以添加有关如何配置客户端以连接到服务器的详细信息，以帮助用户正确使用客户端应用程序。
