// filepath: src/script/Components/Elements/CollapsibleElement.ts
import type { IComponentElement } from './IComponentElement';
import { Logger } from '../../Service/Logger';

/**
 * CollapsibleElement class
 */
export class CollapsibleElement<T extends HTMLElement = HTMLButtonElement> implements IComponentElement<T> {
    public readonly element: T;
    public readonly id: string | number;
    public readonly name: string;
    private readonly logger: Logger;
    private readonly initialized: boolean = false;

    constructor(element: T, logger: Logger) {
        this.element = element;
        this.id = element.id || '';
        this.name = element.getAttribute('name') || element.id || '';
        this.logger = logger;

        this.initialized = this.checkStructure();

        if (this.initialized) {
            this.bindEvents();
            this.logger.componentElementInitSuccess(this.id);
        } else {
            this.logger.componentElementsNotFound();
        }
    }

    // Public API required by IComponentElement
    public getId(): string | number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getHTMLElement(): T {
        return this.element;
    }

    // Toggle this instance
    public toggle(): void {
        this.toggleCollapsible(this.element);
    }

    // Static helper to initialize many elements safely (fixes brittle forEach usage)
    public static initAll<El extends HTMLElement = HTMLDivElement>(selector: string, logger: Logger): CollapsibleElement<El>[] {
        const nodeList = document.querySelectorAll<El>(selector);
        if (!nodeList || nodeList.length === 0) {
            logger.componentElementsNotFound();
            return [];
        }

        const instances: CollapsibleElement<El>[] = [];
        // Use Array.from to ensure we have a real array before using forEach
        Array.from(nodeList).forEach((el) => {
            try {
                const instance = new CollapsibleElement<El>(el, logger);
                if (instance.initialized) {
                    instances.push(instance);
                }
            } catch (err) {
                logger.warn('Failed to initialize CollapsibleElement for element: ' + (el.id || el.tagName), err);
            }
        });

        return instances;
    }

    // --- Private helpers ---
    private checkStructure(): boolean {
        const content = this.element.parentNode?.querySelector('.Collapsible__content');

        if (!content || !(content instanceof HTMLDivElement)) {
            this.logger.warn('CollapsibleElement structure invalid for ' + (this.element.id || this.element.tagName));
            return false;
        }
        return true;
    }

    private bindEvents(): void {
        // Use the element itself as the toggle target to avoid event.target pitfalls
        this.element.addEventListener('click', () => this.toggleCollapsible(this.element));
    }

    private toggleCollapsible(target: T): void {
        if (!target) {
            return;
        }

        const rawContent = target.parentNode?.querySelector('.Collapsible__content');;

        if (!rawContent || !(rawContent instanceof HTMLDivElement)) {
            this.logger.warn('No content element found for ' + target.id);
            return;
        }

        target.classList.toggle('active');

        const isActive = target.classList.contains('active');
        this.logger.actionTriggered('Element ' + (isActive ? 'opened' : 'closed'), target.id);

        const content = rawContent as HTMLElement & { style: CSSStyleDeclaration; scrollHeight: number };

        if (content.style.maxHeight && content.style.maxHeight !== '') {
            content.style.maxHeight = '';
        } else {
            // Ensure scrollHeight is read to calculate
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }
}

