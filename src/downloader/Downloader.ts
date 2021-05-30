import child_process from "child_process";
class Downloader {
    process: child_process.ChildProcess;
    constructor(process: child_process.ChildProcess) {
        this.process = process;
    }

    static async launch(execPath: string): Promise<Downloader> {
        return new Promise((resolve, reject) => {
            const process = child_process.execFile(execPath, (error, stdout, stderr) => {
                if (error) reject(new Error("error:" + error));
                if (stderr) console.log(stderr);
            });
            process.stdout?.on('data', data => console.log(data));
            process.stderr?.on('data', data => console.warn(data));
            resolve(new this(process));
        })
    }

    writeCommand(command: string) {
        const splitted = command.split(/\n+/);
        if (splitted[1]) {
            throw new Error("Command can only contain linebreak at the end");
        }
        if (command[command.length - 1] !== '\n') command += '\n';
        this.process.stdin?.write(command);
    }
}

export default Downloader;