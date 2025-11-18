import { Logger } from '../Service/Logger';
import {Utility} from "../Service/Utility";
import { FeatureToggleSwitchElement } from './Elements/FeatureToggleSwitchElement';
import type { IComponent } from './Icomponent';
import type { IComponentElement } from './Elements/IComponentElement';
import type {IRepository} from "../Repository/IRepository";

export class FeatureToggleSwitch implements IComponent<HTMLDivElement>
{
    private readonly logger: Logger;
    private readonly utility: Utility;
    private readonly elements: IComponentElement<HTMLDivElement>[];
    private readonly repository: IRepository;
    private idCounter: number = 1;

    constructor(utilityInstance: Utility, loggerInstance: Logger, repositoryInstance: IRepository)
    {
        this.utility = utilityInstance;
        this.logger = loggerInstance;
        this.repository = repositoryInstance;
        this.elements = [];
        this.init();
    }

    private init(): void
    {
        this.logger.componentLoaded();
        this.logger.seekComponentElements();

        const featureToggleSwitches = document.querySelectorAll('.FeatureToggle[data-feature]');

        if (featureToggleSwitches.length ===0) {
            this.logger.componentElementsNotFound();
            return;
        }

        const elementLogTitle = this.logger.componentName + ' Element';
        const elementLogColor = this.utility.endarkenColor(this.logger.colorId);

        featureToggleSwitches.forEach((node): void => {
            if (!(node instanceof HTMLDivElement)) {
                return;
            }

            if (!node.hasAttribute('id')) {
                node.setAttribute('id', `FeatureToggleSwitch-${this.idCounter++}`);
            }

            const featureName: string = node.dataset.feature ?? 'General';
            const featureLabel: string = node.dataset.label ?? featureName.toLowerCase().substring(0,1).toUpperCase() + featureName.toLowerCase().slice(1);
            const featureState: boolean = node.dataset.state === 'on';
            const featureKey: string = node.dataset.key ?? `feature_${featureName.toLowerCase()}`;

            const toggleOptions = {
                name: featureName,
                label: featureLabel,
                state: featureState,
                key: featureKey,
            };
            this.elements.push(
                new FeatureToggleSwitchElement(
                    node,
                    toggleOptions,
                    this.utility,
                    new Logger(elementLogTitle, elementLogColor),
                    this.repository,
                )
            );
        });

        this.utility.triggerEvent(document, 'Component.FeatureToggleSwitch.Ready', null,  1);
    }

    public getElements(): IComponentElement<HTMLDivElement>[] {
        return this.elements;
    }
}