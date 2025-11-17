import type { IComponentElement } from './IComponentElement';
import { Logger } from '../../Service/Logger';
import { Utility } from '../../Service/Utility';
import type { IRepository } from '../../Repository/IRepository';

export interface IFeatureOptions {
    state: boolean;
    label: string;
    name: string;
    key: string;
}

export class FeatureToggleSwitchElement<T extends HTMLElement = HTMLDivElement> implements IComponentElement<T>
{
    private readonly element: T;
    private readonly options: IFeatureOptions;
    private readonly utility: Utility;
    private readonly logger: Logger;
    private readonly repository: IRepository;
    private state: boolean = false;

    constructor(
        element: T,
        featureOptions: IFeatureOptions,
        utilityInstance: Utility,
        loggerInstance: Logger,
        repositoryInstance: IRepository
    ) {
        this.element = element;
        this.options = featureOptions;
        this.utility = utilityInstance;
        this.logger = loggerInstance;
        this.repository = repositoryInstance;

        this.init();
    }

    // Initialize markup and bind events
    private init(): void {
        // clear existing content
        this.element.innerHTML = '';

        // determine initial state from repository if present
        const stored = this.repository.get(this.options.key);
        this.state = stored === 'On' ? true : this.options.state || false;
        const labelCaption = this.options.label || 'Toggle Feature "'+this.options.name+'" On or Off';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${this.element.id}-${this.options.key}`;
        checkbox.checked = this.state;

        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);

        const labelText = document.createElement('span');
        label.innerHTML = labelCaption;

        const labelSwitch = document.createElement('span');

        label.appendChild(labelText);
        label.appendChild(labelSwitch);

        this.element.appendChild(checkbox);
        this.element.appendChild(label);

        // Bind event - ensure we reference the checkbox, not the container element
        checkbox.addEventListener('change', () => {
            const newState = checkbox.checked;
            this.setState(newState);
        });

        // ensure repository is in sync
        this.setState(this.state);

        this.logger.componentElementInitSuccess(this.element.id);
    }

    private setState(state: boolean): void
    {
        this.logger.actionTriggered('Set state [' + (state ? 'ON' : 'OFF') + '] for FeatureToggleSwitchElement', this.getName());
        this.state = state;

        const checkbox = this.element.querySelector<HTMLInputElement>('input[type="checkbox"]');

        if (!checkbox) {
            this.logger.actionFailed('Checkbox input not found in FeatureToggleSwitchElement', this.getId());
            return;
        }

        checkbox.checked = state;

        try {
            this.repository.set(this.options.key, state ? 'On' : 'Off');
        } catch (err) {
            this.logger.warn('Failed to persist feature toggle state', err as unknown);
        }
    }

    // Public API (IComponentElement)
    public getId(): string | number {
        return this.element.id
    }

    public getName(): string {
        return this.options.name;
    }

    public getHTMLElement(): T {
        return this.element as T;
    }

    public getState(): 'On' | 'Off' {
        return this.state ? 'On' : 'Off';
    }

    public on(): void {
        this.setState(true);
    }

    public off(): void {
        this.setState(false);
    }
}
