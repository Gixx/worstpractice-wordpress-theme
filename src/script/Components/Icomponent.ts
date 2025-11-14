import type { IComponentElement } from './Elements/IComponentElement';

export interface IComponent<T extends HTMLElement = HTMLElement> {
    getElements(): IComponentElement<T>[];
}
