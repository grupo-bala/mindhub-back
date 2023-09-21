export class GenericError<T extends string> extends Error {
    name: T;

    constructor(name: T) {
        super();
        this.name = name;
    }
}