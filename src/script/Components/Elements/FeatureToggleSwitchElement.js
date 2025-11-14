/**
 * A Feature Toggle Switch element
 *
 * @param {HTMLDivElement|Node} HTMLElement
 * @param {String} featureName
 * @param {{state: boolean, label: string, storageKey: string}} toggleOptions
 * @returns {*}
 */
const FeatureToggleSwitchElement = function (HTMLElement, featureName, toggleOptions)
{
    /** @instance CookieStorage|DataStorage */
    let storage = globalThis.Components.get('dataStorage')
    /** @instance Logger */
    let logger = new Logger('Feature Toggle Switch Element', 'DarkOrange');
    // Wipe out any dirt
    HTMLElement.innerHTML = '';

    let state = storage.get(toggleOptions.storageKey) === 'On'
        ? true
        : toggleOptions.state;

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', HTMLElement.id + '-' + featureName);
    checkbox.checked = state;
    checkbox.addEventListener('change', function () {
        state = !HTMLElement.checked
        setState(state)
    });

    const label = document.createElement('label');
    label.setAttribute('for', HTMLElement.id + '-' + featureName);
    const labelText = document.createElement('span');
    labelText.innerHTML =  toggleOptions.label;
    const labelSwitch = document.createElement('span');
    label.appendChild(labelText);
    label.appendChild(labelSwitch);

    HTMLElement.appendChild(checkbox);
    HTMLElement.appendChild(label);

    /**
     *
     * @param {Boolean} state
     */
    const setState = function(state) {
        HTMLElement.checked = state;
        logger.actionTriggered('Set state', (state ? 'On' : 'Off'))
        storage.set(toggleOptions.storageKey, (state ? 'On' : 'Off'));

    };

    setState(state);

    logger.componentElementInitSuccess(HTMLElement.getAttribute('id'))

    return {
        /**
         * Returns the element ID.
         *
         * @returns {string}
         */
        getId: function () {
            return HTMLElement.id;
        },

        /**
         * Returns the feature name.
         *
         * @returns {String}
         */
        getName : function() {
            return featureName;
        },

        /**
         * Returns the HTML element
         *
         * @returns {HTMLDivElement|Node}
         */
        getHTMLElement: function () {
            return HTMLElement;
        },

        /**
         * Returns the current state.
         *
         * @returns {String}
         */
        getState : function () {
            return state ? 'on' : 'off';
        },

        /**
         * Toggles the switch on.
         */
        on : function() {
            setState(true);
        },

        /**
         * Toggles the switch off.
         */
        off : function () {
            setState(false);
        }
    }
};

