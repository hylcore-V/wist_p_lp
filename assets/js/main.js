// Components
const carouselContainer = document.querySelector(".carousel");
const slideWrapper = document.querySelector(".carousel__slides");
const slides = document.querySelectorAll(".carousel__slide");
const navdotWrapper = document.querySelector(".carousel__navdots");
const navdots = document.querySelectorAll(".carousel__navdots button");

// Parameters
const n_slides = slides.length;
const n_slidesCloned = 1;
let slideWidth = slides[0].offsetWidth;
let spaceBtwSlides = Number(
  window
    .getComputedStyle(slideWrapper)
    .getPropertyValue("grid-column-gap")
    .slice(0, -2)
); // drop px at the end
function index_slideCurrent() {
  return Math.round(
    slideWrapper.scrollLeft / (slideWidth + spaceBtwSlides) - n_slidesCloned
  );
}

// Nav dot click handler
function goto(index) {
  slideWrapper.scrollTo(
    (slideWidth + spaceBtwSlides) * (index + n_slidesCloned),
    0
  );
}
for (let i = 0; i < n_slides; i++) {
  navdots[i].addEventListener("click", () => goto(i));
}

// Marking nav dots
function markNavdot(index) {
  navdots[index].classList.add("is-active");
  navdots[index].setAttribute("aria-disabled", "true");
}
function updateNavdot() {
  const c = index_slideCurrent();
  if (c < 0 || c >= n_slides) return; // in these cases, forward() and rewind() will be executed soon
  markNavdot(c);
}
let scrollTimer;
slideWrapper.addEventListener("scroll", () => {
  // reset
  navdots.forEach((navdot) => {
    navdot.classList.remove("is-active");
    navdot.setAttribute("aria-disabled", "false");
  });
  // handle infinite scrolling
  if (scrollTimer) clearTimeout(scrollTimer); // to cancel if scroll continues
  scrollTimer = setTimeout(() => {
    if (
      slideWrapper.scrollLeft <
      (slideWidth + spaceBtwSlides) * (n_slidesCloned - 1 / 2)
    ) {
      forward();
    }
    if (
      slideWrapper.scrollLeft >
      (slideWidth + spaceBtwSlides) * (n_slides - 1 + n_slidesCloned + 1 / 2)
    ) {
      rewind();
    }
  }, 100);
  // mark the navdot
  updateNavdot();
});

// Handle window resizing
let resizeTimer;
window.addEventListener("resize", () => {
  // update parameters
  slideWidth = slides[0].offsetWidth;
  spaceBtwSlides = Number(
    window
      .getComputedStyle(slideWrapper)
      .getPropertyValue("grid-column-gap")
      .slice(0, -2)
  ); // drop px at the end
  // for autoplay
  if (resizeTimer) clearTimeout(resizeTimer);
  stop();
  resizeTimer = setTimeout(() => {
    play();
  }, 400);
});

// Infinite scrolling
const firstSlideClone = slides[0].cloneNode(true);
firstSlideClone.setAttribute("aria-hidden", "true");
slideWrapper.append(firstSlideClone);

const lastSlideClone = slides[n_slides - 1].cloneNode(true);
lastSlideClone.setAttribute("aria-hidden", "true");
slideWrapper.prepend(lastSlideClone);

function rewind() {
  slideWrapper.classList.remove("smooth-scroll");
  setTimeout(() => {
    // wait for smooth scroll to be disabled
    slideWrapper.scrollTo((slideWidth + spaceBtwSlides) * n_slidesCloned, 0);
    slideWrapper.classList.add("smooth-scroll");
  }, 100);
}

function forward() {
  slideWrapper.classList.remove("smooth-scroll");
  setTimeout(() => {
    // wait for smooth scroll to be disabled
    slideWrapper.scrollTo(
      (slideWidth + spaceBtwSlides) * (n_slides - 1 + n_slidesCloned),
      0
    );
    slideWrapper.classList.add("smooth-scroll");
  }, 100);
}

// Autoplay
function next() {
  goto(index_slideCurrent() + 1);
}
const pause = 2200;
let itv;
function play() {
  // early return if the user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  clearInterval(itv);
  slideWrapper.setAttribute("aria-live", "off");
  itv = setInterval(next, pause);
}
function stop() {
  clearInterval(itv);
  slideWrapper.setAttribute("aria-live", "polite");
}
const observer = new IntersectionObserver(callback, { threshold: 0.99 });
observer.observe(carouselContainer);
function callback(entries, observer) {
  entries.forEach((entry) => {
    console.log(`entry.intersectionRatio: ${entry.intersectionRatio}`);
    if (entry.isIntersecting) {
      console.log(`entry.isIntersecting is true.`);
      play();
    } else {
      console.log(`entry.isIntersecting is false.`);
      stop();
    }
  });
}
// for mouse users
// carouselContainer.addEventListener("pointerenter", () => stop());
carouselContainer.addEventListener("pointerleave", () => play());
// for keyboard users
// carouselContainer.addEventListener("focus", () => stop(), true);
carouselContainer.addEventListener(
  "blur",
  () => {
    if (carouselContainer.matches(":hover")) return;
    play();
  },
  true
);
// for touch device users
carouselContainer.addEventListener("touchstart", () => stop());

// Initialization
goto(0);
markNavdot(0);
slideWrapper.classList.add("smooth-scroll");


// ------------------------------
// Get the slider container
const sliderContainer = document.querySelector('.slider-container');

// Add event listeners to stop/resume the animation on hover
sliderContainer.addEventListener('mouseenter', function() {
    sliderContainer.style.animationPlayState = 'paused';
});

sliderContainer.addEventListener('mouseleave', function() {
    sliderContainer.style.animationPlayState = 'running';
});

