export class Graph {
    private debug = false;
    private libraries = new Map();

    public register(library: string, dependencies: string[] = []): void {
        this.libraries.set(library, dependencies);
    }

    public get(library: string): string[] {
        this.log(`get ${library} dependencies.`);
        return this.tree(library, library);
    }

    private tree(library: string, parent: string): string[] {
        const deps = [...this.libraries.get(library)];
        if (!deps) {
            this.error(`Package '${library}' was not registered.`);
        }
        const found = deps.reduce((acc, element) => {
            if (element === parent) {
                this.error(`Cyclic dependency detected on package '${library}'.`);
                throw new Error(`Cyclic dependency detected on package '${library}'.`);
            }
            acc = [...acc, element, ...this.tree(element, parent)];
            return acc;
        }, []);

        return found;
    }

    private error(message: string) {
        console.error('\x1b[31m%s\x1b[0m', `[Priva Dependency Graph] ${message}`);
    }
    private warning(message: string) {
        console.log('\x1b[33m%s\x1b[0m', `[Priva Dependency Builder] ${message}`);
    }
    private log(message: string) {
        if (this.debug) {
            console.log('\x1b[34m%s\x1b[0m', `[Priva Dependency Graph] ${message}`);
        }
    }
}
