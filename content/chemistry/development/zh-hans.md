# 本地开发环境配置指南

本指南适用于需要在 Ubuntu 宿主机上对 chemistry 服务进行原生开发、调试与编译的开发者。该服务涉及 Rust 与 C++（RDKit）混合编译，请按照以下步骤配置本地开发环境。

## 安装系统依赖

chemistry 的核心功能依赖于 RDKit 化学信息学库。在编译 Rust 项目之前，必须安装完整的 C++ 工具链以及 RDKit 所需的 Boost 基础库。

推荐使用 **Ubuntu 22.04 LTS / 24.04 LTS** 操作系统，在终端中执行以下命令完成基础环境初始化：

```bash
# 更新软件包列表
sudo apt-get update

# 安装基础构建工具链、pkg-config、SSL 开发库及 Boost 开发库
sudo apt-get install -y build-essential pkg-config libssl-dev libboost-dev libboost-all-dev

# 安装运行时所需的 Boost 动态库组件
sudo apt-get install -y libboost-serialization1.74.0 libboost-iostreams1.74.0 libboost-system1.74.0 libboost-regex1.74.0
```

## 部署预编译的 RDKit 组件

为避免从源代码编译 RDKit（使用 CMake）导致的耗时过长与潜在构建错误，建议直接使用经过验证的预编译二进制包。

执行以下命令，将 RDKit 部署到当前用户的主目录（`~`）中：

```bash
# 进入用户主目录
cd $HOME

# 下载 Ubuntu 对应的 RDKit 预编译包
wget https://github.com/Fuyeor/chemistry/releases/download/v2024.09.1/rdkit_2024_09_1_ubuntu_22_04_amd64.tar.gz

# 创建目标目录并解压
mkdir -p rdkit
tar -xzf rdkit_2024_09_1_ubuntu_22_04_amd64.tar.gz -C rdkit --strip-components=1

# 删除压缩包并刷新动态链接库缓存
rm rdkit_2024_09_1_ubuntu_22_04_amd64.tar.gz
sudo ldconfig
```

## 编译并运行服务

系统依赖与 RDKit 部署完成后，即可开始编译与运行 chemistry 服务。

### 获取源代码并构建

```bash
# 克隆项目仓库
git clone https://github.com/Fuyeor/chemistry.git
cd chemistry

# 编译项目
cargo build

# 启动开发模式
./run.sh
```

### 端口配置规范

服务启动时将自动读取环境变量。如果项目根目录下的 `.env` 文件中已配置 `CHEM_PORT` 参数，服务会监听该自定义端口；若未配置，则默认使用 `30001` 端口。

### 使用启动脚本运行

若本地同时存在多个项目，为避免 RDKit 动态库路径发生冲突，建议使用项目内置的启动脚本。该脚本会自动设置库搜索路径，确保优先加载已安装的 RDKit 动态库。

```bash
# 赋予脚本可执行权限并启动服务
chmod +x ./run.sh
./run.sh
```