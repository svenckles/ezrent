# ezrent
CLI tool for processing tenant and property CSVs.

## How to run it

1. **Install the package**

    You can install the package globally using the command below.
    ```
    npm i -g ezrent
    ```

2. **Start using it!**

    Run the command below to see the capabilities of the CLI.

    ```
    ezrent help
    ```

## Development
To run this project, follow these steps:

### Prerequisites

* **pnpm:** This project uses pnpm as its package manager. If you don't have pnpm installed, you can install it using the following command:

    ```bash
    npm install -g pnpm
    ```

### Installation

1.  Clone this repository to your local machine:

    ```bash
    git clone git@github.com:svenckles/ezrent.git
    cd ezrent
    ```

2.  Install the project dependencies using pnpm:

    ```bash
    pnpm install
    ```

    * **Note:** During the installation process, you might be prompted to upgrade your Node.js version. If you encounter such a prompt, it's recommended to follow the instructions and upgrade to a compatible Node.js version.

3.  Build the `ezrent` CLI tool:

    ```bash
    pnpm run build
    ```

    This command will produce the necessary build artifacts, typically in a `dist` or `build` directory.

4.  Link the `ezrent` CLI tool globally using `npm link`:

    ```bash
    npm link
    ```

    This command makes the `ezrent` CLI tool available globally on your system, allowing you to run it from any directory.

5.  Run the `ezrent` CLI tool:

    ```bash
    ezrent [arguments]
    ```

    Replace `[arguments]` with any required arguments for the `ezrent` command.

### Unlinking the ezrent CLI Tool

If you want to remove the global link to the `ezrent` CLI tool, use the following command:

```bash
npm unlink ezrent
```
