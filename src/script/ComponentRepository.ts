// filepath: src/script/ComponentRepository.ts

export class ComponentRepository {
    private components: Record<string, unknown> = {};

    public register(name: string, component: unknown): void {
        this.components[name] = component;
    }

    public get(name: string): unknown | undefined {
        return this.components[name];
    }

    public getAll(): Readonly<Record<string, unknown>> {
        return this.components;
    }
}
