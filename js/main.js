document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 700,
            once: true,
            offset: 120,
            easing: 'ease-in-out',
        });
    }

    // Hamburger Menu Logic
    const headerHamburgerButton = document.getElementById('hamburger-button');
    const mainNavLinks = document.getElementById('main-nav-links');
    const mobileMenuToggleButton = document.getElementById('mobile-menu-toggle');

    function toggleMainMenu() {
        if (mainNavLinks) {
            const isActive = mainNavLinks.classList.toggle('is-active');
            mainNavLinks.setAttribute('aria-hidden', !isActive);
            if (headerHamburgerButton) {
                headerHamburgerButton.classList.toggle('is-active', isActive);
                headerHamburgerButton.setAttribute('aria-expanded', isActive);
            }
            if (mobileMenuToggleButton) {
                mobileMenuToggleButton.classList.toggle('is-active', isActive);
                mobileMenuToggleButton.setAttribute('aria-expanded', isActive);
            }
        }
    }

    if (mainNavLinks) {
        if (headerHamburgerButton) {
            headerHamburgerButton.addEventListener('click', toggleMainMenu);
        }
        if (mobileMenuToggleButton) {
            mobileMenuToggleButton.addEventListener('click', toggleMainMenu);
        }
        mainNavLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNavLinks.classList.contains('is-active')) {
                    toggleMainMenu();
                }
            });
        });
    }

    // Testimonial Carousel Logic
    const simplifiedCarouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
    const simplifiedCarouselTrack = document.getElementById('testimonial-carousel');
    const simplifiedSlides = simplifiedCarouselTrack ? Array.from(simplifiedCarouselTrack.children).filter(child => child.classList.contains('testimonial-slide')) : [];
    const simplifiedPrevButton = document.getElementById('testimonial-prev');
    const simplifiedNextButton = document.getElementById('testimonial-next');
    const simplifiedNavButtonsContainer = document.querySelector('.testimonial-nav-buttons');
    let simplifiedCurrentSlide = 0;
    let simplifiedSlideWidth = 0;
    let isSimplifiedCarouselActive = false;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function setupSimplifiedCarousel() {
        if (!simplifiedCarouselWrapper || !simplifiedCarouselTrack || simplifiedSlides.length === 0) {
            if(simplifiedNavButtonsContainer) simplifiedNavButtonsContainer.style.display = 'none';
            return;
        }
        isSimplifiedCarouselActive = true;
        simplifiedCarouselWrapper.classList.add('js-simplified-carousel-active');
        simplifiedCarouselTrack.classList.add('js-simplified-carousel-active');
        simplifiedSlideWidth = simplifiedCarouselWrapper.offsetWidth;
        if (simplifiedSlideWidth === 0) {
            setTimeout(() => {
                simplifiedSlideWidth = simplifiedCarouselWrapper.offsetWidth;
                if (simplifiedSlideWidth === 0) {
                    if(simplifiedNavButtonsContainer) simplifiedNavButtonsContainer.style.display = 'none';
                    isSimplifiedCarouselActive = false;
                    simplifiedCarouselWrapper.classList.remove('js-simplified-carousel-active');
                    simplifiedCarouselTrack.classList.remove('js-simplified-carousel-active');
                    return;
                }
                simplifiedCarouselTrack.style.width = `${simplifiedSlides.length * simplifiedSlideWidth}px`;
                simplifiedSlides.forEach(slide => { slide.style.width = `${simplifiedSlideWidth}px`; });
                goToSimplifiedSlide(simplifiedCurrentSlide);
            }, 150);
        } else {
            simplifiedCarouselTrack.style.width = `${simplifiedSlides.length * simplifiedSlideWidth}px`;
            simplifiedSlides.forEach(slide => { slide.style.width = `${simplifiedSlideWidth}px`; });
            goToSimplifiedSlide(0);
        }
    }

    function dismantleSimplifiedCarousel() {
        isSimplifiedCarouselActive = false;
        if (simplifiedCarouselWrapper) simplifiedCarouselWrapper.classList.remove('js-simplified-carousel-active');
        if (simplifiedCarouselTrack) {
            simplifiedCarouselTrack.classList.remove('js-simplified-carousel-active');
            simplifiedCarouselTrack.style.transform = '';
            simplifiedCarouselTrack.style.width = '';
        }
        if (simplifiedSlides.length > 0) {
            simplifiedSlides.forEach(slide => { slide.style.width = ''; });
        }
    }

    function goToSimplifiedSlide(slideIndex) {
        if (!isSimplifiedCarouselActive || !simplifiedCarouselTrack ) return;
        simplifiedSlideWidth = simplifiedCarouselWrapper.offsetWidth;
        if (simplifiedSlideWidth === 0) return;
        const expectedTrackWidth = simplifiedSlides.length * simplifiedSlideWidth;
        if (simplifiedCarouselTrack.style.width !== `${expectedTrackWidth}px`) {
            simplifiedCarouselTrack.style.width = `${expectedTrackWidth}px`;
            simplifiedSlides.forEach(slide => slide.style.width = `${simplifiedSlideWidth}px`);
        }
        simplifiedCarouselTrack.style.transform = `translateX(-${slideIndex * simplifiedSlideWidth}px)`;
        simplifiedCurrentSlide = slideIndex;
        if (simplifiedPrevButton) simplifiedPrevButton.disabled = slideIndex === 0;
        if (simplifiedNextButton) simplifiedNextButton.disabled = slideIndex === simplifiedSlides.length - 1;
    }

    function checkSimplifiedCarouselMode() {
        if (!simplifiedCarouselWrapper || !simplifiedCarouselTrack || !simplifiedSlides || simplifiedSlides.length === 0) {
            if(simplifiedNavButtonsContainer) simplifiedNavButtonsContainer.style.display = 'none';
            return;
        }
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        if (isMobile) {
            if (!isSimplifiedCarouselActive) setupSimplifiedCarousel();
            else {
                simplifiedSlideWidth = simplifiedCarouselWrapper.offsetWidth;
                if (simplifiedSlideWidth === 0) return;
                simplifiedCarouselTrack.style.width = `${simplifiedSlides.length * simplifiedSlideWidth}px`;
                simplifiedSlides.forEach(slide => slide.style.width = `${simplifiedSlideWidth}px`);
                goToSimplifiedSlide(simplifiedCurrentSlide);
            }
        } else {
            if (isSimplifiedCarouselActive) dismantleSimplifiedCarousel();
        }
    }

    if (simplifiedCarouselTrack && simplifiedSlides.length > 0 && simplifiedPrevButton && simplifiedNextButton && simplifiedNavButtonsContainer && simplifiedCarouselWrapper) {
        simplifiedNextButton.addEventListener('click', () => {
            if (simplifiedCurrentSlide < simplifiedSlides.length - 1) goToSimplifiedSlide(simplifiedCurrentSlide + 1);
        });
        simplifiedPrevButton.addEventListener('click', () => {
            if (simplifiedCurrentSlide > 0) goToSimplifiedSlide(simplifiedCurrentSlide - 1);
        });
        window.addEventListener('resize', debounce(checkSimplifiedCarouselMode, 250));
        setTimeout(checkSimplifiedCarouselMode, 50);
    } else {
        if(simplifiedNavButtonsContainer) simplifiedNavButtonsContainer.style.display = 'none';
    }

    // Scroll-activated shadow for sticky header
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('header-scrolled', window.scrollY > 50);
        });
    }

    // Product Filtering Logic
    const productFiltersForm = document.getElementById('product-filters-form');

    if (productFiltersForm) {
        let allProductsData = [];
        const productGrid = document.querySelector('#all-products .product-grid');

        const filterWidthSelect = document.getElementById('filter-width');
        const filterRatioSelect = document.getElementById('filter-ratio');
        const filterDiameterSelect = document.getElementById('filter-diameter');
        const filterBrandSelect = document.getElementById('filter-brand');
        const filterTypeSelect = document.getElementById('filter-type');
        const filterRunflatCheckbox = document.getElementById('filter-runflat'); // New
        const filterReinforcedCheckbox = document.getElementById('filter-reinforced'); // New
        const resetFiltersButton = document.getElementById('reset-filters-button');

        function parseProductCard(cardElement) {
            const nameElement = cardElement.querySelector('.product-name');
            const brandElement = cardElement.querySelector('.product-brand');
            const specsElement = cardElement.querySelector('.product-specs');
            const priceElement = cardElement.querySelector('.product-price');

            const name = nameElement ? nameElement.textContent.trim() : 'N/A';
            const brandText = brandElement ? brandElement.textContent.trim() : '';
            const specsText = specsElement ? specsElement.textContent.trim() : '';
            const priceText = priceElement ? priceElement.textContent.trim() : '';

            const brand = brandText ? brandText.replace('Marque:', '').trim() : '';

            let width = '', ratio = '', diameter = '', type = '';
            if (specsText) {
                const parts = specsText.split('|');
                const sizePart = parts[0] ? parts[0].replace('Taille:', '').trim() : '';
                type = parts[1] ? parts[1].trim() : '';
                const sizeMatch = sizePart.match(/(\d+)\/(\d+)R(\d+)/);
                if (sizeMatch && sizeMatch.length === 4) {
                    width = sizeMatch[1];
                    ratio = sizeMatch[2];
                    diameter = sizeMatch[3];
                }
            }
            const price = priceText ? parseFloat(priceText.replace('€', '')) : 0;

            const runflatAttr = cardElement.dataset.runflat;
            const reinforcedAttr = cardElement.dataset.reinforced;
            const runflat = runflatAttr === 'true';
            const reinforced = reinforcedAttr === 'true';

            return { name, brand, width, ratio, diameter, type, price, runflat, reinforced, domElement: cardElement };
        }

        function extractProductData() {
            if (!productGrid) {
                // console.warn("Product grid not found for filtering.");
                return [];
            }
            const cards = productGrid.querySelectorAll('.product-card');
            return Array.from(cards).map(card => parseProductCard(card));
        }

        function populateSelectWithOptions(selectElement, values, displayPrefix = '', valuePrefix = '') {
            if (!selectElement) return;
            const fragment = document.createDocumentFragment();
            const existingOptions = new Set(Array.from(selectElement.options).map(opt => opt.value));
            if (selectElement.options.length > 0 && selectElement.options[0].value === "") {
                 existingOptions.delete("");
            }
            values.forEach(value => {
                const stringValue = String(value);
                if (value && !existingOptions.has(valuePrefix + stringValue)) {
                    const option = document.createElement('option');
                    option.value = valuePrefix + stringValue;
                    option.textContent = displayPrefix + stringValue;
                    fragment.appendChild(option);
                    existingOptions.add(valuePrefix + stringValue);
                }
            });
            if (fragment.childNodes.length > 0) {
                 selectElement.appendChild(fragment);
            }
        }

        function populateFilterOptions(products) {
            const widths = [...new Set(products.map(p => p.width).filter(Boolean))].sort((a,b) => Number(a) - Number(b));
            const ratios = [...new Set(products.map(p => p.ratio).filter(Boolean))].sort((a,b) => Number(a) - Number(b));
            const diameters = [...new Set(products.map(p => p.diameter).filter(Boolean))].sort((a,b) => Number(a) - Number(b));
            const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();

            populateSelectWithOptions(filterWidthSelect, widths);
            populateSelectWithOptions(filterRatioSelect, ratios);
            if (filterDiameterSelect) {
                 const fragment = document.createDocumentFragment();
                 const existingDiameterOptions = new Set(Array.from(filterDiameterSelect.options).map(opt => opt.value));
                 if (filterDiameterSelect.options.length > 0 && filterDiameterSelect.options[0].value === "") {
                    existingDiameterOptions.delete("");
                 }
                 diameters.forEach(value => {
                     const stringValue = String(value);
                     if (value && !existingDiameterOptions.has(stringValue)) {
                         const option = document.createElement('option');
                         option.value = stringValue;
                         option.textContent = "R" + stringValue;
                         fragment.appendChild(option);
                         existingDiameterOptions.add(stringValue);
                     }
                 });
                 if (fragment.childNodes.length > 0) {
                    filterDiameterSelect.appendChild(fragment);
                 }
            }
            populateSelectWithOptions(filterBrandSelect, brands);
        }

        function applyFilters() {
            if (!allProductsData || allProductsData.length === 0) return;

            const selectedWidth = filterWidthSelect ? filterWidthSelect.value : "";
            const selectedRatio = filterRatioSelect ? filterRatioSelect.value : "";
            const selectedDiameter = filterDiameterSelect ? filterDiameterSelect.value : "";
            const selectedBrand = filterBrandSelect ? filterBrandSelect.value : "";
            const selectedType = filterTypeSelect ? filterTypeSelect.value : "";
            const isRunflatSelected = filterRunflatCheckbox ? filterRunflatCheckbox.checked : false;
            const isReinforcedSelected = filterReinforcedCheckbox ? filterReinforcedCheckbox.checked : false;

            allProductsData.forEach(product => {
                let matches = true;
                if (selectedWidth && product.width !== selectedWidth) matches = false;
                if (selectedRatio && product.ratio !== selectedRatio) matches = false;
                if (selectedDiameter && product.diameter !== selectedDiameter) matches = false;
                if (selectedBrand && product.brand !== selectedBrand) matches = false;
                if (selectedType && product.type !== selectedType) matches = false;

                if (isRunflatSelected && !product.runflat) matches = false;
                if (isReinforcedSelected && !product.reinforced) matches = false;

                product.domElement.classList.toggle('product-hidden', !matches);
            });

            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }

        allProductsData = extractProductData();

        if (allProductsData.length > 0) {
            populateFilterOptions(allProductsData);

            const filterInputs = [
                filterWidthSelect, filterRatioSelect, filterDiameterSelect,
                filterBrandSelect, filterTypeSelect,
                filterRunflatCheckbox, filterReinforcedCheckbox // Add checkboxes to the list of inputs
            ];
            filterInputs.forEach(input => {
                if (input) input.addEventListener('change', applyFilters);
            });

            if (resetFiltersButton) {
                resetFiltersButton.addEventListener('click', () => {
                    filterInputs.forEach(input => {
                        if (input) {
                            if (input.type === 'checkbox') {
                                input.checked = false;
                            } else {
                                input.value = "";
                            }
                        }
                    });
                    applyFilters();
                });
            }
        } else {
            // console.warn("Product filtering not initialized: No product data or essential elements missing.");
        }
    }
});
