import { series } from 'async';
import { spawn, ChildProcess } from 'child_process';
import { Graph } from './dependency-graph';

export class Builder {
    private debug = false;
    private builtList = [];
    private processQueue = [];

    constructor(private graph: Graph) {}

    public queue(library: string): void {
        if (!library) {
            this.error(`No package was specified.`);
            return;
        }

        const processes = this.graph.get(library).reduceRight((acc, element) => {
            acc.push(this.spawnProcess(element));
            return acc;
        }, []);
        this.processQueue = [...this.processQueue, ...processes, this.spawnProcess(library)];
    }

    private spawnProcess(library: string): (cb: any) => void {
        return (cb) => {
            if (this.didBuild(library)) {
                this.warning(`Skipping build of '${library}'; package was already built.`);
                cb();
            } else {
                const ng = () => spawn(this.command('ng'), ['build', library], { stdio: 'inherit' });
                const npm = () =>
                    spawn(this.command('npm'), ['run','postbuild', '--if-present'], {
                        stdio: 'inherit',
                        cwd: `projects/${library}`,
                    });
                const queue = [ng, npm];

                this.processSpawnQueue(queue, () => {
                    this.haveBuilt(library);
                    cb();
                });
            }
        };
    }

    private processSpawnQueue(queue: (() => ChildProcess)[], cb: any, index: number = 0) {
        index < queue.length
            ? queue[index]().addListener('exit', () => this.processSpawnQueue(queue, cb, ++index))
            : cb();
    }

    public build() {
        series(this.processQueue, (err) => {
            if (err) {
                throw err;
            }
        });
    }

    private command(command: string) {
        return process.platform === 'win32' ? `${command}.cmd` : command;
    }

    private haveBuilt(library: string): number {
        return this.builtList.push(library);
    }
    private didBuild(library: string): boolean {
        return this.builtList.some((build) => build === library);
    }

    private error(message: string): void {
        console.error('\n\x1b[31m%s\x1b[0m', `[Priva Dependency Graph] ${message}`);
    }
    private warning(message: string): void {
        console.log('\n\x1b[33m%s\x1b[0m', `[Priva Dependency Builder] ${message}`);
    }
    private log(message: string): void {
        if (this.debug) {
            console.log(`[Priva Dependency Builder] ${message}`);
        }
    }
}
