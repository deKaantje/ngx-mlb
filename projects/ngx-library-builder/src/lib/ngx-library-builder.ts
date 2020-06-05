import { Builder } from './builder';
import { Graph } from './dependency-graph';
import { Libraries } from './library-reader';
import { args } from './arguments';

export class NgxLibraryBuilder {
    private graph: Graph;
    private builder: Builder;
    private libraries: [string, string[]][];

    public async init() {
        this.graph = new Graph();
        this.builder = new Builder(this.graph);
        this.libraries = await Libraries.read(args.libraries);

        this.register();
        this.queue();
        this.build();
    }

    private register() {
        for (const [key, value] of this.libraries) {
            this.graph.register(key, value);
        }
    }

    private queue() {
        if (args.all) {
            for (const [key] of this.libraries) {
                this.builder.queue(key);
            }
        } else {
            this.builder.queue(args.library);
        }
    }

    private build() {
        this.builder.build();
    }
}
