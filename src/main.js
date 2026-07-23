import { initCaseStudies } from "./interactions/case-studies.js";
import { initMobileNav } from "./interactions/mobile-nav.js";
import { initMotion } from "./interactions/motion.js";

document.documentElement.classList.add("js");
initCaseStudies(document);
initMobileNav(document);
initMotion(document);
