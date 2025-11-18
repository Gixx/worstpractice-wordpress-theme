// filepath: src/script/Model/Logger.ts
/**
 * Logger component converted from JS to TypeScript class.
 */
export class Logger {
    private readonly consoleLabelTextColorId: string = '#599bd6';
    private readonly verbose: boolean = false;
    public readonly componentName: string;
    public readonly colorId: string;

    constructor(componentName: string, colorId: string) {
        this.componentName = componentName;
        this.colorId = colorId;
        this.loggerInitialized();
    }

    private loggerInitialized(): void {
        if (this.verbose) {
            console.info(
                '%c[Logger]%c ✔%c A new instance is created for %o %c.',
                'background:Indigo;color:white;font-weight:bold;',
                'color:green; font-weight:bold;',
                'color:' + this.consoleLabelTextColorId + '; font-weight:bold;',
                this.componentName,
                'color:' + this.consoleLabelTextColorId + '; font-weight:bold;'
            );
        }
    }

    public warn(message: string, exception?: unknown): void {
        console.warn(message, exception);
    }

    public error(message: string, exception?: unknown): void {
        console.error(message, exception);
    }

    public actionTriggered(message: string, subject: string): void {
        console.info(
            '%c[' + this.componentName + ']%c ⚡%c ' + message + ': %o',
            'background:' + this.colorId + ';color:black;font-weight:bold;',
            'color:orange;font-weight:bold',
            'color:' + this.consoleLabelTextColorId + ';font-style:italic',
            subject
        );
    }

    public actionSuccess(message: string, data: any = ''): void {
        console.info(
            '%c[' + this.componentName + ']%c ✔%c ' + message + '. %o',
            'background:' + this.colorId + ';color:black;font-weight:bold;',
            'color:green;font-weight:bold',
            'color:' + this.consoleLabelTextColorId + ';font-style:italic',
            data
        );
    }

    public actionFailed(message: string, error: any = 'null'): void {
        console.info(
            '%c[' + this.componentName + ']%c ✖%c ' + message + ': %o',
            'background:' + this.colorId + ';color:black;font-weight:bold;',
            'color:red',
            'color:' + this.consoleLabelTextColorId + ';font-style:italic',
            error
        );
    }

    public repositoryLoaded(): void {
        this.toolLoaded('repository');
    }

    public serviceLoaded(): void {
        this.toolLoaded('service');
    }

    public componentLoaded(): void {
        this.toolLoaded('component');
    }

    private toolLoaded(type: string): void {
        console.info(
            '%c[' + this.componentName + ']%c ✔%c The ' + this.componentName + ' ' + type + ' loaded.',
            'background:' + this.colorId + ';color:black;font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:' + this.consoleLabelTextColorId + '; font-weight:bold;'
        );
    }

    public seekComponentElements(): void {
        console.info(
            '%c[' + this.componentName + ']%c ೱ%c looking for ' + this.componentName + ' elements.',
            'background:' + this.colorId + ';color:black;font-weight:bold;',
            'color:lightBlue; font-weight:bold;',
            'color:' + this.consoleLabelTextColorId + ';font-style:italic'
        );
    }

    public componentElementsNotFound(): void {
        console.info(
            '%c[' + this.componentName + ']%c ✖%c No component elements found for ' + this.componentName + '.',
            'background:' + this.colorId + ';color:black;font-weight:bold;',
            'color:red; font-weight:bold;',
            'color:' + this.consoleLabelTextColorId + ';font-style:italic'
        );
    }

    public componentElementInitSuccess(elementId: string | number): void {
        console.info(
            '%c[' + this.componentName + ']%c ✚%c a ' + this.componentName + ' element initialized %o',
            'background:' + this.colorId + ';color:black;font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:' + this.consoleLabelTextColorId + ';font-style:italic',
            '#' + elementId
        );
    }
}

