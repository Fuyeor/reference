# Setup local development environment

This guide is intended for developers who need to perform native development, debugging, and compilation of the Chemistry service on an Ubuntu host machine. The service involves mixed compilation of Rust and C++ (RDKit). Follow the steps below to configure your local development environment.

## Install system dependencies

The core functionality of Chemistry depends on the RDKit cheminformatics library. Before compiling the Rust project, you must install the complete C++ toolchain and the Boost base libraries required by RDKit.

We recommend using **Ubuntu 22.04 LTS / 24.04 LTS**. Run the following commands in a terminal to initialize the base environment:

```bash
# Update the package list
sudo apt-get update

# Install the base build toolchain, pkg-config, SSL development libraries, and Boost development libraries
sudo apt-get install -y build-essential pkg-config libssl-dev libboost-dev libboost-all-dev

# Install the required Boost dynamic library components for runtime
sudo apt-get install -y libboost-serialization1.74.0 libboost-iostreams1.74.0 libboost-system1.74.0 libboost-regex1.74.0
```

## Deploy prebuilt RDKit components

To avoid the lengthy process and potential build errors associated with compiling RDKit from source (using CMake), we recommend using the verified prebuilt binary package directly.

Run the following commands to deploy RDKit to the current user's home directory (`~`):

```bash
# Go to your home directory
cd $HOME

# Download the prebuilt RDKit package for Ubuntu
wget https://github.com/Fuyeor/chemistry/releases/download/v2024.09.1/rdkit_2024_09_1_ubuntu_22_04_amd64.tar.gz

# Create the target directory and extract the archive
mkdir -p rdkit
tar -xzf rdkit_2024_09_1_ubuntu_22_04_amd64.tar.gz -C rdkit --strip-components=1

# Remove the archive and refresh the dynamic linker cache
rm rdkit_2024_09_1_ubuntu_22_04_amd64.tar.gz
sudo ldconfig
```

## Build and run the service

After the system dependencies and RDKit are in place, you can compile and run the Chemistry service.

### Obtain the source code and build

```bash
# Clone the repository
git clone https://github.com/Fuyeor/chemistry.git
cd chemistry

# Compile the project
cargo build

# Start the development mode
./run.sh
```

### Port configuration

When the service starts, it reads environment variables automatically. If the `CHEM_PORT` parameter is configured in the `.env` file in the project root directory, the service listens on that custom port. Otherwise, it defaults to port `30001`.

### Use the launch script

If you have multiple projects locally, use the built-in launch script to avoid conflicts with the RDKit dynamic library path. The script automatically sets the library search path to ensure that the installed RDKit dynamic libraries are loaded first.

```bash
# Make the script executable and start the service
chmod +x ./run.sh
./run.sh
```