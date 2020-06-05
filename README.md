# NGX MONOREPO LIBRARY BUILDER: ngx-mlb
## Why?
Angular 8+ with its 'projects' folder structure supports building libraries individually. When this library uses another library from the same monorepo as a dependency, it will fail.
This builder accepts a ```libraries.json``` containing all the monorepo libraries with their dependencies on other monorepo libraries. This dependency graph is used to build libraries and their dependencies in the correct order. If a library is a dependency for multiple libraries, it will only be built once.

## Usage
### Create a libraries.json
Create a ```libraries.json``` file and place it next to your root ```package.json```. The contents of your libraries.json file should be as follows:
```json
{
    "libraries": {
        "my-library-1": [],
        "my-library-2": ["my-library-1"],
        "my-library-3": ["my-library-1", "my-library-2"]
    }
}
```
The **keys** should contain the names of your projects as they exist in the ```projects``` folder.

The **value** should be an array containing the dependencies that exist inside the monorepo.

### Build a library
Calling ```ngx-mlb``` from the command line allows you to add a specific library to build.

Build using explicit call usage on command line:
```
ngx-mlb --libraries libraries.json --library my-library-1
```

Build using ```package.json``` script call usage on command line:

```json
{
    "scripts": {
        "build:library": "ngx-mlb --libraries libraries.json",
        "build:libraries": "ngx-mlb --libraries libraries.json -all",
    }
}
```

```
npm run build:library -- --library my-library-1

npm run build:libraries
```
> note the ```--``` to signal npm to pass the params down to ngx-mlb.

## Options
You can either specify a single library, or flag it to build all libraries.

```
--libraries     // library resource file containing all monorepo libraries with dependencies
--library       // build a specific
--all           // build all
```

### Examples
```
ngx-mlb --libraries libraries.json --library my-library-1

ngx-mlb --libraries libraries.json --library @namespace/my-library-4

ngx-mlb --libraries libraries.json --all
```

