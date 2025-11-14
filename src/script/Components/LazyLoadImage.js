/**
 * Lazy Load Image component.
 *
 * @returns {*}
 */
const LazyLoadImage = function ()
{
    /** @instance Utility */
    let utility = globalThis.Components.get('utility')
    /** @instance Logger */
    let logger = new Logger('Lazy Load Image', 'PowderBlue');
    /** @type {NodeList} */
    let lazyLoadImages;
    /** @type {number} */
    let idCounter = 1;
    /** @type {IntersectionObserver|IntersectionObserverFallback} */
    let imageObserver;

    let LazyLoadImageElements = [];

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    const IntersectionObserverFallback = function() {
        logger.actionFailed('the IntersectionObserver function is not supported. Loading images in normal mode.', '');

        return {
            observe: function (element) {
                element.src = element.dataset.src;
                logger.actionTriggered('An image element loaded', element.getAttribute('id'))
            }
        }
    };

    const intersectionObserverClass = typeof IntersectionObserver !== 'undefined'
        ? IntersectionObserver
        : IntersectionObserverFallback;

    /**
     * Finds a lazy-load image element by its ID.
     *
     * @param {string} id
     * @returns {*}
     */
    const getLazyLoadImageById = function(id)
    {
        for(let i = 0; i < LazyLoadImageElements.length; i++) {
            if(LazyLoadImageElements[i].getId() === id) {
                return LazyLoadImageElements[i];
            }
        }
    }

    /**
     * Initializes the loader and collects the elements.
     */
    const initialize = function()
    {
        logger.seekComponentElements();
        lazyLoadImages = document.querySelectorAll('img[data-src]');

        if (lazyLoadImages.length === 0) {
            logger.componentElementsNotFound();
            return;
        }

        imageObserver = new intersectionObserverClass((entries, imgObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    /** @type LazyLoadImageElement lazyLoadImageElement */
                    let lazyLoadImageElement = getLazyLoadImageById(entry.target.id);
                    lazyLoadImageElement.loadImage();
                }
            })
        });

        lazyLoadImages.forEach(function (HTMLElement) {
            if (!HTMLElement.hasAttribute('id')) {
                HTMLElement.setAttribute('id', 'LazyLoadImage-' + (idCounter++));
            }

            LazyLoadImageElements.push(new LazyLoadImageElement(HTMLElement));
            imageObserver.observe(HTMLElement);
        });

        utility.triggerEvent(document, 'Component.LazyLoadImage.Ready', null, 1);
    };

    logger.componentLoaded();

    initialize();

    return {
        /**
         * Returns the collection of lazy-loaded images.
         *
         * @returns {*[]}
         */
        getLazyLoadImages: function () {
            return LazyLoadImageElements;
        },


        getLazyLoadImageById: function(id) {
            return getLazyLoadImageById(id);
        }
    };
};

window['LazyLoadImage'] = LazyLoadImage;