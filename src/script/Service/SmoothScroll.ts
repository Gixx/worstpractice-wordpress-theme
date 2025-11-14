// filepath: src/script/Model/SmoothScroll.ts
import { Utility } from './Utility';
import { Logger } from './Logger';

export class SmoothScroll {
    private readonly utility: Utility;
    private readonly logger: Logger;

    constructor(utilityInstance: Utility, loggerInstance: Logger) {
        this.utility = utilityInstance;
        this.logger = loggerInstance;
        this.logger.serviceLoaded();
        this.initialize();
    }

    // Return the actual scroll position in pixels.
    private getScrollPositionInternal(): number {
        return window.scrollY || window.pageYOffset || 0;
    }

    private getClientHeight(): number {
        return document.documentElement.clientHeight;
    }

    private getDocumentHeight(): number {
        return document.body.offsetHeight;
    }

    private getMaxScrollTop(): number {
        return this.getDocumentHeight() - this.getClientHeight();
    }

    private getElementPositionInternal(elementId: string): number {
        const element = document.getElementById(elementId);
        if (!element) return 0;
        const boundingBox = element.getBoundingClientRect();
        return boundingBox.top;
    }

    // Smoothly scroll from -> to
    private smoothScrollInternal = (from: number, to: number): void => {
        const stepBy = 0.2;
        const snapDistance = 1;
        const speed = 30; // ms
        const diff = to - from;

        if (Math.abs(diff) <= snapDistance) {
            window.scrollTo(0, Math.round(to));
            this.logger.actionSuccess('Scroll end', to + 'px');
            return;
        }

        const nextPosition = (from * (1.0 - stepBy)) + (to * stepBy);
        window.scrollTo(0, Math.round(nextPosition));

        window.setTimeout(() => this.smoothScrollInternal(nextPosition, to), speed);
    };

    private initialize(): void {
        // trigger a ready event so other components can react
        this.utility.triggerEvent(document, 'Service.SmoothScroll.Ready', null, 1);
    }

    // --- Public API ---

    public getScrollPosition(): number {
        return this.getScrollPositionInternal();
    }

    public getElementPositionById(elementId: string): number {
        return this.getElementPositionInternal(elementId);
    }

    public scrollToElementById(elementId: string, gap = 0): boolean {
        const element = document.getElementById(elementId);
        if (!element) return false;

        const targetPosition = Math.min(
            (this.getScrollPositionInternal() + this.getElementPositionInternal(elementId) - gap),
            this.getMaxScrollTop()
        );

        this.logger.actionTriggered('Start scroll', this.getScrollPositionInternal() + 'px');
        this.smoothScrollInternal(this.getScrollPositionInternal(), targetPosition);

        return true;
    }
}

