import { series } from 'async';
import { spawn } from 'child_process';
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

    private spawnProcess(params: string): (cb) => void {
        return (cb) => {
            if (this.didBuild(params)) {
                this.warning(`Skipping build of '${params}'; package was already built.`);
                cb();
            } else {
                const npm = spawn(this.command(), ['build', params], { stdio: 'inherit' });
                npm.addListener('exit', () => {
                    this.haveBuilt(params);
                    cb();
                });
            }
        };
    }

    public build() {
        series(this.processQueue, (err) => {
            if (err) {
                throw err;
            }
        });
    }

    private command() {
        return process.platform === 'win32' ? 'ng.cmd' : 'ng';
    }

    private haveBuilt(library: string) {
        this.builtList.push(library);
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
