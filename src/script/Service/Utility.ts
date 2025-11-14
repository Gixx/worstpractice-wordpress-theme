// filepath: src/script/Model/Utility.ts
import {Logger} from './Logger';

export class Utility {
    private readonly logger: Logger;

    constructor(loggerInstance: Logger) {
        this.logger = loggerInstance;
        this.logger.serviceLoaded();
        this.initialize();
    }

    private initialize(): void {
        setTimeout(() => { this.triggerEvent(document, 'Service.Utility.Ready', null); }, 1);
    }

    private triggerEventInternal(element: EventTarget, eventName: string, customData?: unknown): void {
        let event: Event;

        if (customData !== undefined && customData !== null) {
            event = new CustomEvent(eventName, { detail: customData });
        } else {
            event = new Event(eventName);
        }

        this.logger.actionTriggered('Triggering event', eventName);

        // EventTarget doesn't guarantee dispatchEvent in typings, narrow it for dispatch
        (element as EventTarget & { dispatchEvent(e: Event): boolean }).dispatchEvent(event);
    }

    public triggerEvent(element: EventTarget, eventName: string, customData: unknown = null, delay = 0): void {
        if (delay === 0) {
            this.triggerEventInternal(element, eventName, customData);
        } else {
            setTimeout(() => { this.triggerEventInternal(element, eventName, customData); }, delay);
        }
    }

    public formDataToObject<T extends Record<string, FormDataEntryValue | FormDataEntryValue[]>>(formData: FormData): T {
        const object: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

        formData.forEach((value, key) => {
            const existing = object[key];
            if (existing === undefined) {
                object[key] = value;
            } else if (Array.isArray(existing)) {
                (existing as FormDataEntryValue[]).push(value);
            } else {
                object[key] = [existing as FormDataEntryValue, value];
            }
        });

        return object as unknown as T;
    }

    public objectToFormData<T extends Record<string, unknown>>(object: T): FormData {
        const formData = new FormData();

        for (const attribute in object) {
            if (Object.prototype.hasOwnProperty.call(object, attribute)) {
                const value = object[attribute];

                if (value instanceof Blob) {
                    formData.append(attribute, value as Blob);
                } else {
                    if (Array.isArray(value)) {
                        for (const v of value) {
                            formData.append(attribute, v instanceof Blob ? v : String(v));
                        }
                    } else if (value === undefined || value === null) {
                        formData.append(attribute, '');
                    } else {
                        formData.append(attribute, String(value));
                    }
                }
            }
        }

        return formData;
    }

    public getEventPath(event: Event): EventTarget[] {
        const maybePath = (event as any).composedPath ? (event as any).composedPath() as EventTarget[] : (event as any).path as EventTarget[] | undefined;
        const target = event.target as EventTarget;

        if (typeof maybePath !== 'undefined') {
            return maybePath.indexOf(window) < 0 ? maybePath.concat([window]) : maybePath;
        }

        if (target === (window as unknown as EventTarget)) {
            return [window];
        }

        function getParents(node: Node | null, memo: EventTarget[] = []): EventTarget[] {
            const parentNode = node?.parentNode ?? null;
            if (!parentNode) return memo;
            return getParents(parentNode, memo.concat([parentNode]));
        }

        return [target].concat(getParents(target as Node)).concat([window]);
    }

    public getDeviceOs(): string {
        // Prefer User-Agent Client Hints when available, then fall back to legacy values.
        const nav: any = navigator as any;
        const hintPlatform = nav.userAgentData && nav.userAgentData.platform ? String(nav.userAgentData.platform) : '';
        const legacyPlatform = nav.platform ? String(nav.platform) : '';
        const userAgent = nav.userAgent ? String(nav.userAgent) : '';

        // Combine sources so a single search can catch any available token.
        const source = (hintPlatform + ' ' + legacyPlatform + ' ' + userAgent).trim();

        if (!source) return 'Unknown';

        const rules: Array<{ tokens: string[]; name: string }> = [
            { tokens: ['Win', 'Windows NT', 'Win32', 'Win64'], name: 'Windows' },
            { tokens: ['Mac', 'MacIntel', 'Macintosh'], name: 'MacOS' },
            { tokens: ['X11'], name: 'Unix' },
            { tokens: ['Linux'], name: 'Linux' },
            { tokens: ['iPhone', 'iPad', 'iPod'], name: 'iOS' },
            { tokens: ['Android'], name: 'Android' },
        ];

        for (const rule of rules) {
            for (const t of rule.tokens) {
                if (source.indexOf(t) !== -1) return rule.name;
            }
        }

        return 'Unknown';
    }

    public readStylesheetsByClassName(className: string): Record<string, Record<string, string>> {
        const styles = document.styleSheets || (new (window as any).StyleSheetList());
        const localStyles: Record<string, Record<string, string>> = {};

        const styleSheets = Array.from(styles as StyleSheetList) as CSSStyleSheet[];

        for (const sheet of styleSheets) {
            try {
                if (!sheet.href || !sheet.href.includes(location.hostname)) continue;

                const classes = sheet.cssRules ? Array.from(sheet.cssRules) as CSSRule[] : [] as CSSRule[];

                for (const currentStyle of classes) {
                    if (currentStyle instanceof CSSImportRule || currentStyle instanceof CSSMediaRule) {
                        continue;
                    }

                    const styleRule = currentStyle as CSSStyleRule;

                    if (styleRule.selectorText && styleRule.selectorText.includes('.' + className)) {
                        const selector = styleRule.selectorText;
                        localStyles[selector] = {};

                        const customDefinitions: string[] = [];
                        const styleDecl = styleRule.style;

                        for (let keyIndex = 0; keyIndex < styleDecl.length; keyIndex++) {
                            const key = styleDecl.item(keyIndex);
                            if (!key) continue;
                            const camelKey = key.replace(/-([a-z])/g, (_match, group1: string) => group1.toUpperCase());
                            customDefinitions.push(camelKey);
                        }

                        for (let l = 0; l < customDefinitions.length; l++) {
                            const def = customDefinitions[l];

                            // Skip if def somehow ended up undefined or null
                            if (typeof def === 'undefined' || def === null) continue;

                            // styleDecl[def] is not well-typed on CSSStyleDeclaration, use bracket access and allow undefined
                            const val = (styleDecl as unknown as Record<string, string | undefined>)[def];

                            // Only assign known values (skip undefined)
                            if (typeof val !== 'undefined') {
                                localStyles[selector][def] = val as string;
                            }
                        }
                    }
                }
            } catch (e) {
                // Cross-origin style sheets will throw when accessing cssRules; ignore them.
            }
        }

        return localStyles;
    }

    public endarkenColor(hexOrName: string): string {
        const hex: string = this.colorToHex(hexOrName).replace('#', '');
        const lumen: number = -0.25; // 25% darker

        // convert to decimal and change luminosity
        let rgb: string = "#", i: number;
        for (i = 0; i < 3; i++) {
            const color: string = hex.substring(i*2,(i*2)+2);
            const colorNum: number = parseInt(color, 16);
            const colorDark:string = Math.round(Math.min(Math.max(0, colorNum + (colorNum * lumen)), 255))
                .toString(16)
                .padStart(2, '0');
            rgb += colorDark;
        }

        return rgb;
    }

    private colorToHex(name: string): string {
        const canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        if (!context) {
            this.logger.actionFailed('Unable to create canvas context for color conversion', name);
            return '000000';
        }

        context.fillStyle = name;
        context.fillRect(0,0,1,1);

        const imageData = context.getImageData(0,0,1,1).data;
        const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b]
            .map(x => x.toString(16).padStart(2, '0')).join('');

        return rgbToHex(imageData[0] ?? 0, imageData[1] ?? 0, imageData[2] ?? 0);
    }
}
