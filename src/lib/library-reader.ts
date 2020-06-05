import { readJSON } from 'fs-extra';

// @dynamic
export class Libraries {
    public static read(file: string): Promise<[string, string[]][]> {
        return new Promise((resolve) => {
            readJSON(file).then(
                (json) => resolve(Object.entries(json.libraries)),
                () => resolve([])
            );
        });
    }
}
