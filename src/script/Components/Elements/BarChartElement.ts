import { Logger } from '../../Service/Logger';
import type { IComponentElement } from './IComponentElement';

type ChartStyles = Record<string, { paddingBottom?: string; height?: string }>;

export class BarChartElement<T extends HTMLElement = HTMLDivElement> implements IComponentElement<T> {
    private readonly logger: Logger;
    private readonly element: T;
    private readonly chartStyles: ChartStyles;
    private readonly currentYear: number;
    private readonly currentQuarter: number;

    constructor(element: T, chartStyles: ChartStyles, loggerInstance: Logger) {
        this.element = element;
        this.chartStyles = chartStyles;
        this.logger = loggerInstance;
        this.currentYear = new Date().getFullYear();
        this.currentQuarter = Math.ceil((new Date().getMonth() + 1) / 4);

        this.init();
    }

    // Initialize and render the chart grid and bars
    private init(): void {
        const chartDataset = this.element.querySelector('dl.chart-dataset') as HTMLDListElement | null;
        if (!chartDataset) {
            this.logger.warn('Chart dataset not found for element', this.element.id);
            return;
        }

        const rangeFrom = parseInt(chartDataset.dataset.rangefrom ?? '0', 10);
        const rangeTo = new Date().getFullYear() + 1;

        const labels = Array.from(chartDataset.querySelectorAll('dt')) as Element[];
        const bars = Array.from(chartDataset.querySelectorAll('dd')) as HTMLElement[];

        let grid = '';

        for (let i = rangeTo; i >= rangeFrom; i--) {
            for (let j = 4; j > 0; j--) {
                const label = j === 1 ? `<span>${i}</span>` : '';
                let style = 'gridRow';

                if (j === 1) {
                    style += ' year';
                }

                if (j === this.currentQuarter && i === this.currentYear) {
                    style += ' thisQuarter';
                }

                grid += `<div class="${style}">${label}</div>`;
            }
        }

        grid += '<div class="labels">';
        for (const lbl of labels) {
            const labelText = (lbl as HTMLElement).innerText ?? '';
            grid += `<div>${labelText}</div>`;
        }
        grid += '</div>';

        // Render bars
        for (let index = 0; index < bars.length; index++) {
            const bar = bars[index];
            if (!bar) continue; // guard for possible undefined entries

            const fromData = bar.dataset.from ?? '';
            const toData = bar.dataset.to ?? '';
            const skill = bar.dataset.skill ?? '';
            const counter = index + 1;

            const offsetBottom = this.getOffset(fromData, rangeFrom);
            const offsetTop = this.getOffset(toData, rangeFrom);

            // Ensure integer and non-negative pixel values for CSS
            const bottomPx = `${Math.max(0, Math.round(offsetBottom))}px`;
            const heightPx = `${Math.max(0, Math.round(offsetTop - offsetBottom))}px`;

            grid += `<div class="skill ${skill} col${counter}" style="bottom: ${bottomPx}; height: ${heightPx};"></div>`;
        }

        this.element.innerHTML = grid;

        this.logger.componentElementInitSuccess(this.element.id);
    }

    // Counts the offset from the date info
    private getOffset(dateInfo: string, rangeFrom: number): number {
        let startOffset = this.chartStyles['.BarChart .grid']?.paddingBottom ?? '0px';

        if (startOffset.indexOf('px') !== -1) {
            startOffset = `${parseInt(startOffset.replace(/px/, ''), 10)}`;
        } else {
            // assume rem units when not px
            startOffset = `${parseInt((parseFloat(startOffset.replace(/rem/, '')) * 10.0).toString(), 10)}`;
        }

        let rowHeight = this.chartStyles['.BarChart .gridRow']?.height ?? '0px';

        if (rowHeight.indexOf('px') !== -1) {
            rowHeight = `${parseInt(rowHeight.replace(/px/, ''), 10)}`;
        } else {
            rowHeight = `${parseInt((parseFloat(rowHeight.replace(/rem/, '')) * 10.0).toString(), 10)}`;
        }

        if (dateInfo === 'today') {
            dateInfo = `${this.currentYear}/Q${this.currentQuarter}`;
        }

        const yearQuarter = dateInfo.split('/Q');
        const yearPart = yearQuarter[0] ?? '0';
        const quarterPart = yearQuarter[1] ?? '1';
        const year = parseInt(yearPart, 10) || 0;
        const quarter = parseInt(quarterPart, 10) || 1;

        const startOffsetNum = parseInt(startOffset, 10);
        const rowHeightNum = parseInt(rowHeight, 10);

        // ((((year - rangeFrom) * 4) + (quarter - 1)) * rowHeight) + startOffset;
        return ((((year - rangeFrom) * 4) + (quarter - 1)) * rowHeightNum) + startOffsetNum;
    }

    // Public API (IComponentElement)
    public getId(): string | number {
        return this.element.id;
    }

    public getName(): string {
        return this.element.id;
    }

    public getHTMLElement(): T {
        return this.element as T;
    }
}
