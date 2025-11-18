export interface IRepository {
    get(key: string): string;
    set(key: string, value: string, session?: boolean): void;
    delete(key: string): void;
    renew(key: string, session?: boolean): void;
}
