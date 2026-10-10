// ====================================
// RAFIQ ABOUT PAGE
// ====================================


// ------------------------------------
// Sticky navbar state
// ------------------------------------

const siteHeader = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }
});



// ------------------------------------
// Mobile Menu
// ------------------------------------

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
});



// ------------------------------------
// Scroll Reveal
// ------------------------------------

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }

    });
  },
  {
    threshold: 0.13
  }
);

revealElements.forEach(el => {
  revealObserver.observe(el);
});



// ------------------------------------
// Child growth storyline
// ------------------------------------

const stages = [
  {
    emoji: "👶",
    age: "0–3 years",
    subtitle: "First milestones",
    background: "#D2EDFF"
  },

  {
    emoji: "🧒",
    age: "4–6 years",
    subtitle: "Understanding behavior",
    background: "#FFDCCB"
  },

  {
    emoji: "🎒",
    age: "7–12 years",
    subtitle: "Growing beyond home",
    background: "#CDF3E4"
  },

  {
    emoji: "🧑",
    age: "13–18 years",
    subtitle: "Navigating adolescence",
    background: "#E7DFFF"
  }
];


const stageElements =
  document.querySelectorAll(".age-stage");

const timelinePoints =
  document.querySelectorAll(".timeline-point");

const timelineProgress =
  document.getElementById("timelineProgress");

const childVisual =
  document.getElementById("childVisual");

const childEmoji =
  document.getElementById("childEmoji");

const childAgeTitle =
  document.getElementById("childAgeTitle");

const childAgeSubtitle =
  document.getElementById("childAgeSubtitle");


function setStage(index) {

  stageElements.forEach(stage => {
    stage.classList.remove("active-age-stage");
  });

  timelinePoints.forEach(point => {
    point.classList.remove("active");
  });


  stageElements[index]
    .classList.add("active-age-stage");

  timelinePoints[index]
    .classList.add("active");


  // Animate child
  childEmoji.classList.add("changing");


  setTimeout(() => {

    childEmoji.textContent =
      stages[index].emoji;

    childAgeTitle.textContent =
      stages[index].age;

    childAgeSubtitle.textContent =
      stages[index].subtitle;

    childVisual.style.background =
      stages[index].background;

    childEmoji.classList.remove("changing");

  }, 220);


  const progress =
    index / (stages.length - 1);

  if (window.innerWidth <= 720) {

    timelineProgress.style.width =
      `${progress * 100}%`;

    timelineProgress.style.height =
      "100%";

  } else {

    timelineProgress.style.height =
      `${progress * 100}%`;

    timelineProgress.style.width =
      "100%";

  }

}



// Manual timeline click

timelinePoints.forEach((point, index) => {

  point.addEventListener("click", () => {
    setStage(index);
  });

});



// Auto stage based on scroll through Growth section

const growthStory =
  document.getElementById("growthStory");


function updateGrowthStage() {

  const rect =
    growthStory.getBoundingClientRect();

  const viewportHeight =
    window.innerHeight;

  const scrollableDistance =
    rect.height - viewportHeight;

  let progress =
    -rect.top / scrollableDistance;

  progress =
    Math.max(0, Math.min(1, progress));


  let index =
    Math.floor(progress * stages.length);

  index =
    Math.min(stages.length - 1, index);


  setStage(index);

}


let growthTicking = false;

window.addEventListener("scroll", () => {

  if (!growthTicking) {

    requestAnimationFrame(() => {

      const rect =
        growthStory.getBoundingClientRect();

      if (
        rect.top < window.innerHeight &&
        rect.bottom > 0
      ) {
        updateGrowthStage();
      }

      growthTicking = false;

    });

    growthTicking = true;

  }

});



// ------------------------------------
// Journey animated line
// ------------------------------------

const journeySection =
  document.querySelector(".journey-section");

const journeyFill =
  document.getElementById("journeyFill");


const journeyObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          setTimeout(() => {

            journeyFill.style.width =
              "100%";

          }, 300);

        }

      });

    },
    {
      threshold: 0.25
    }
  );


journeyObserver.observe(journeySection);



// ------------------------------------
// Soft parallax Hero shapes
// ------------------------------------

const heroShapes =
  document.querySelectorAll(".hero-shape");


window.addEventListener("mousemove", event => {

  if (window.innerWidth < 900) {
    return;
  }

  const x =
    event.clientX / window.innerWidth - 0.5;

  const y =
    event.clientY / window.innerHeight - 0.5;


  heroShapes.forEach(
    (shape, index) => {

      const strength =
        10 + index * 7;

      shape.style.transform =
        `translate(
          ${x * strength}px,
          ${y * strength}px
        )`;

    }
  );

});



// ------------------------------------
// Smooth local anchor scroll
// ------------------------------------

document
  .querySelectorAll('a[href^="#"]')
  .forEach(anchor => {

    anchor.addEventListener(
      "click",
      function(event) {

        const href =
          this.getAttribute("href");

        if (href === "#") {
          return;
        }

        const target =
          document.querySelector(href);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });



// ------------------------------------
// Reduced motion accessibility
// ------------------------------------

const reduceMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );


if (reduceMotion.matches) {

  document
    .querySelectorAll(".reveal")
    .forEach(el => {

      el.style.opacity = "1";
      el.style.transform = "none";

    });

}