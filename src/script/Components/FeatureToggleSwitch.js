/**
 * Feature Toggle component.
 *
 * @param {object} options
 * @returns {*}
 */
const FeatureToggleSwitch = function(options)
{
    /** @instance Utility */
    let utility = globalThis.Components.get('utility')
    /** @instance Logger */
    let logger = new Logger('Feature Toggle Switch', 'Orange');
    /** @type {NodeList} */
    let featureToggleSwitches;
    /** @type {number} */
    let idCounter = 1;

    let featureToggleElements = [];

    /**
     * Initialize the component handler.
     */
    const initialize = function(reScan = false)
    {
        !reScan && logger.seekComponentElements();

        featureToggleSwitches = document.querySelectorAll('.FeatureToggle[data-feature]');

        if (featureToggleSwitches.length === 0) {
            logger.componentElementsNotFound();
            return;
        }

        featureToggleSwitches.forEach(function (HTMLElement) {
            if (!HTMLElement.hasAttribute('id')) {
                HTMLElement.setAttribute('id', 'FeatureToggle-' + (idCounter++));
            }

            const featureName = HTMLElement.dataset.feature;
            const featureValue = 'value' in HTMLElement.dataset ? HTMLElement.dataset.value : 'off';
            const state = featureValue !== 'off';
            const toggleOptions = (typeof options[featureName] !== 'undefined')
                ? options[featureName]
                : {state: state, label: 'Toggle feature "'+featureName+'" On or Off', storageKey: 'feature_'+featureName};

            featureToggleElements.push(new FeatureToggleSwitchElement(HTMLElement, featureName, toggleOptions));
        });

        !reScan && utility.triggerEvent(document, 'Component.FeatureToggleSwitch.Ready', null, 1);
    };

    logger.componentLoaded();
    initialize();

    return {
        reScan: function() {
            initialize();
        },

        /**
         * Returns the collection of feature toggle elements
         *
         * @returns {*[]}
         */
        getElements: function () {
            return featureToggleElements;
        },

        /**
         * Get all FeatureToggle elements by name.
         *
         * @param {String} featureToggleName The non-unique name of the FeatureToggle element.
         * @returns {[]}
         */
        getElementsByName : function(featureToggleName) {
            const components = [];

            featureToggleElements.forEach(function (element) {
                if (element.getName() === featureToggleName) {
                    components.push(element.component);
                }

            });

            return components;
        },

        /**
         * Toggle FeatureToggle element(s) by the given name.
         *
         * @param {String} featureToggleName The non-unique name of the FeatureToggle element.
         * @return {Array}
         */
        toggleSwitch : function(featureToggleName) {
            featureToggleElements.forEach(function (element) {
                if (element.getName() === featureToggleName) {
                    if (element.getState() === 'on') {
                        element.off();
                    } else {
                        element.on();
                    }
                }
            });
        },

        /**
         * Toggle on/off all FeatureToggle elements.
         *
         * @param {String} newState The new status: 'on' or 'off'.
         */
        toggleAll : function (newState = 'on') {
            if (['on', 'off'].indexOf(newState) === -1) {
                newState = 'on';
            }

            featureToggleElements.forEach(function (element) {
                if (newState === 'on') {
                    element.component.on();
                } else {
                    element.component.off();
                }
            });
        }
    };
};

window['FeatureToggleSwitch'] = FeatureToggleSwitch;