import * as yargs from 'yargs';

const librarySource: yargs.Options = {
    alias: 'ls',
    default: 'library.json',
    describe: 'Source of the library index file.',
    type: 'string',
};

const library: yargs.Options = {
    alias: 'l',
    default: '',
    describe: 'Name of the library to be built.',
    type: 'string',
};

const all: yargs.Options = {
    alias: 'a',
    default: false,
    describe: 'Build all libraries.',
    type: 'boolean',
};

const incremental: yargs.Options = {
    alias: 'i',
    default: false,
    describe: 'Incremental build: skip build of dependencies.',
    type: 'boolean',
};

export const args: any = yargs
    .option('libraries', librarySource)
    .option('library', library)
    .option('incremental', incremental)
    .option('all', all).argv;
