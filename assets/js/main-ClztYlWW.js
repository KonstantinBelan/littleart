(function polyfill() {
  const relList = document.createElement('link').relList;
  if (relList && relList.supports && relList.supports('modulepreload')) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'childList') continue;
      for (const node of mutation.addedNodes) if (node.tagName === 'LINK' && node.rel === 'modulepreload') processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true,
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === 'use-credentials') fetchOpts.credentials = 'include';
    else if (link.crossOrigin === 'anonymous') fetchOpts.credentials = 'omit';
    else fetchOpts.credentials = 'same-origin';
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
document.addEventListener('DOMContentLoaded', () => {
  const techWrapper = document.querySelector('.technology');
  if (techWrapper) {
    let switchSlide2 = function (index) {
        if (index < 0 || index >= techItems.length) return;
        techItems.forEach((i) => i.classList.remove('technology__item--active'));
        techCards.forEach((card) => card.classList.remove('technology__card--active'));
        techItems[index].classList.add('technology__item--active');
        techCards[index].classList.add('technology__card--active');
        currentIndex = index;
      },
      isElementInViewport2 = function (el) {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight * 0.2 && rect.bottom >= window.innerHeight * 0.2;
      },
      preventDefaultScroll2 = function (e) {
        if (scrollLockEnabled) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      },
      enableScrollLock2 = function () {
        if (scrollLockEnabled) return;
        document.addEventListener('wheel', preventDefaultScroll2, { passive: false });
        document.addEventListener('touchmove', preventDefaultScroll2, { passive: false });
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        scrollLockEnabled = true;
      },
      disableScrollLock2 = function () {
        if (!scrollLockEnabled) return;
        document.removeEventListener('wheel', preventDefaultScroll2);
        document.removeEventListener('touchmove', preventDefaultScroll2);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        scrollLockEnabled = false;
        ignoreNextScroll = true;
        setTimeout(() => {
          ignoreNextScroll = false;
        }, 100);
      },
      handleTechScroll2 = function (delta) {
        if (isScrolling || ignoreNextScroll) return;
        isScrolling = true;
        const prevIndex = currentIndex;
        if (delta > 0 && currentIndex < techItems.length - 1) {
          switchSlide2(currentIndex + 1);
        } else if (delta < 0 && currentIndex > 0) {
          switchSlide2(currentIndex - 1);
        }
        const atLastSlide = currentIndex === techItems.length - 1;
        const atFirstSlide = currentIndex === 0;
        const noSlideChange = currentIndex === prevIndex;
        if ((atLastSlide && delta > 0 && noSlideChange) || (atFirstSlide && delta < 0 && noSlideChange)) {
          disableScrollLock2();
          isScrolling = false;
          return;
        }
        setTimeout(() => {
          isScrolling = false;
        }, 150);
      },
      handleGlobalWheel2 = function (e) {
        if (scrollLockEnabled) {
          handleTechScroll2(e.deltaY);
          return;
        }
        const inViewport = isElementInViewport2(techList);
        if (inViewport && !ignoreNextScroll) {
          enableScrollLock2();
          handleTechScroll2(e.deltaY);
          e.preventDefault();
          e.stopPropagation();
        }
      },
      handleTouchStart2 = function (e) {
        const inViewport = isElementInViewport2(techList);
        if (inViewport) {
          touchStartY = e.touches[0].clientY;
          isTouchInTechSection = true;
          if (!scrollLockEnabled) {
            enableScrollLock2();
          }
        }
      },
      handleTouchMove2 = function (e) {
        if (!isTouchInTechSection || isScrolling) return;
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        if (Math.abs(deltaY) > 5) {
          handleTechScroll2(deltaY);
          e.preventDefault();
        }
      },
      handleTouchEnd2 = function () {
        isTouchInTechSection = false;
      };
    var switchSlide = switchSlide2,
      isElementInViewport = isElementInViewport2,
      preventDefaultScroll = preventDefaultScroll2,
      enableScrollLock = enableScrollLock2,
      disableScrollLock = disableScrollLock2,
      handleTechScroll = handleTechScroll2,
      handleGlobalWheel = handleGlobalWheel2,
      handleTouchStart = handleTouchStart2,
      handleTouchMove = handleTouchMove2,
      handleTouchEnd = handleTouchEnd2;
    const techList = techWrapper.querySelector('.technology__list');
    const techItems = techList.querySelectorAll('.technology__item');
    const techCards = techWrapper.querySelectorAll('.technology__card');
    let currentIndex = 0;
    let isScrolling = false;
    let scrollLockEnabled = false;
    let ignoreNextScroll = false;
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    techItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (!techCards[index]) return;
        switchSlide2(index);
      });
    });
    if (isTouchDevice) return;
    let touchStartY = 0;
    let isTouchInTechSection = false;
    document.addEventListener('wheel', handleGlobalWheel2, { passive: false });
    document.addEventListener('touchstart', handleTouchStart2, { passive: true });
    document.addEventListener('touchmove', handleTouchMove2, { passive: false });
    document.addEventListener('touchend', handleTouchEnd2);
    document.addEventListener('keydown', (e) => {
      const inViewport = isElementInViewport2(techList);
      if (!inViewport) {
        if (scrollLockEnabled) {
          disableScrollLock2();
        }
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!scrollLockEnabled) {
          enableScrollLock2();
        }
        e.preventDefault();
        handleTechScroll2(e.key === 'ArrowDown' ? 1 : -1);
      }
    });
    let scrollCheckTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollCheckTimeout);
      scrollCheckTimeout = setTimeout(() => {
        const inViewport = isElementInViewport2(techList);
        if (!inViewport && scrollLockEnabled) {
          disableScrollLock2();
        }
      }, 100);
    });
    window.addEventListener('beforeunload', disableScrollLock2);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const componentSection = document.querySelector('.component');
  if (!componentSection || !isTouchDevice) return;
  const points = componentSection.querySelectorAll('.component__point');
  const tooltipsWrapper = componentSection.querySelector('.component__tooltips');
  const tooltips = componentSection.querySelectorAll('.component__tooltip:not(.active)');
  points.forEach((point) => {
    point.addEventListener('click', () => {
      const title = point.getAttribute('data-tooltip-title');
      tooltips.forEach((tooltip) => {
        if (tooltip.getAttribute('data-tooltip-title') === title) {
          tooltipsWrapper.querySelector('.component__tooltip.active');
          tooltipsWrapper.classList.add('active');
          tooltip.classList.add('active');
          tooltip.addEventListener('click', () => {
            (void 0).classList.remove('active');
            tooltip.classList.remove('active');
          });
        }
      });
    });
    point.addEventListener('mouseleave', () => {
      tooltips.forEach((tooltip) => {
        tooltip.classList.remove('active');
        tooltipsWrapper.classList.remove('active');
      });
    });
  });
});
$('.slick-slider').slick({
  infinite: false,
  speed: 200,
  slidesToShow: 3,
  slidesToScroll: 3,
  prevArrow: document.querySelector('.reviews__nav-btn--prev'),
  nextArrow: document.querySelector('.reviews__nav-btn--next'),
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ],
});
document.addEventListener('DOMContentLoaded', () => {
  const modalAll = document.querySelectorAll('.modal');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const closeModalButtons = document.querySelectorAll('[data-close-modal]');
  const html = document.querySelector('html');
  const body = document.querySelector('body');
  if (!modalAll) return;
  const openModal = (videoUrl, modalType) => {
    const modal = document.querySelector(`.modal[data-name="${modalType}"]`);
    const modalWrapper = modal ? modal.querySelector('.modal__wrapper') : null;
    if (!modal) return;
    if (videoUrl) {
      const modalVideo = modal.querySelector('.modal__video');
      if (modalVideo) {
        modalVideo.innerHTML = '<iframe src="' + videoUrl + '?autoplay=1" width=auto height=auto title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
      }
    }
    modal.classList.add('active');
    html.classList.add('fixed');
    body.classList.add('fixed');
    modal.addEventListener('click', (event) => {
      if (event.target === modalWrapper || event.target === modal) {
        closeModal();
      }
    });
  };
  const closeModal = () => {
    const modal = document.querySelector('.modal.active');
    if (!modal) return;
    modal.classList.remove('active');
    html.classList.remove('fixed');
    body.classList.remove('fixed');
    const modalVideo = modal.querySelector('.modal__video');
    if (modalVideo) {
      modalVideo.innerHTML = '';
    }
  };
  openModalButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const modalType = button.getAttribute('data-modal-type');
      if (!modalType) return;
      const videoUrl = button.getAttribute('data-video-url');
      if (videoUrl) {
        openModal(videoUrl, modalType);
      } else {
        openModal(null, modalType);
      }
    });
  });
  closeModalButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });
});
function createStickyPlatforms() {
  const platforms = document.querySelector('.shop__platforms');
  const grid = document.querySelector('.shop__grid');
  const wrapper = document.querySelector('.shop__wrapper');
  const scaleContainer = document.querySelector('.scale-container');
  if (!platforms || !grid) return null;
  let scale = 1;
  if (scaleContainer) {
    const scaleFactor = getComputedStyle(scaleContainer).getPropertyValue('--scale-factor');
    scale = parseFloat(scaleFactor) || 1;
  }
  const width = wrapper.getBoundingClientRect().width;
  grid.style.position = 'relative';
  platforms.style.position = 'fixed';
  platforms.style.right = '0';
  platforms.style.width = width + 'px';
  platforms.style.zIndex = '1000';
  const gridRect = grid.getBoundingClientRect();
  const platformsRect = platforms.getBoundingClientRect();
  const scrollY = window.pageYOffset;
  const gridTop = gridRect.top + scrollY;
  const gridBottom = gridTop + gridRect.height;
  const platformsTop = platformsRect.top + scrollY;
  const stickStart = platformsTop / scale;
  const stickEnd = gridBottom - platformsRect.height;
  console.log('Границы:', { stickStart, stickEnd, gridBottom });
  function update() {
    const scrollY2 = window.pageYOffset;
    const gridRect2 = grid.getBoundingClientRect();
    gridRect2.top + scrollY2;
    let translateY = 0;
    if (scrollY2 < stickStart) {
      translateY = 0;
    } else if (scrollY2 > stickEnd) {
      translateY = stickEnd - stickStart;
    } else {
      translateY = scrollY2 - stickStart;
    }
    const maxTranslate = gridRect2.height - platformsRect.height - (platformsTop - gridTop);
    const maxTranslate2 = gridRect2.height - platformsRect.height - (platformsTop - gridTop);
    console.log('maxTranslate:', {
      maxTranslate,
      maxTranslate2,
    });
    translateY = Math.min(translateY, maxTranslate);
    platforms.style.transform = `translateY(${translateY / scale}px)`;
    console.log('Position:', {
      scrollY: scrollY2,
      translateY,
      stickStart,
      stickEnd,
      maxTranslate,
    });
  }
  return { update };
}
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    const controller = createStickyPlatforms();
    if (controller) {
      window.addEventListener(
        'scroll',
        () => {
          requestAnimationFrame(controller.update);
        },
        { passive: true }
      );
      window.addEventListener('resize', () => {
        const platforms = document.querySelector('.shop__platforms');
        const wrapper = document.querySelector('.shop__wrapper');
        const width = wrapper.getBoundingClientRect().width;
        platforms.style.width = width + 'px';
        setTimeout(controller.update, 150);
      });
      setTimeout(controller.update, 150);
    }
  }, 300);
});
console.log('Приложение запущено!');
