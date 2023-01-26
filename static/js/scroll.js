"use strict";

var scrollPoint = document.getElementById("jsScrollPoint");

var handleLoad = function handleLoad() {
  scrollPoint.scrollIntoView({ behavior: "smooth" });
};

window.addEventListener("load", handleLoad);