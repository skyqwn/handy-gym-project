"use strict";

var pageContainer = document.querySelector(".jsPageContainer");
var params = new URLSearchParams(window.location.search);

var PAGE = Number(params.get("page")) || 1;
var TOTAL_PAGE = Number(pageContainer.id);
var PAGE_CONTAINER_SIZE = 5;
var CURRENT_PAGE_CONTAINER = Math.ceil(PAGE / PAGE_CONTAINER_SIZE);
var TOTAL_PAGE_CONTAINER = Math.ceil(TOTAL_PAGE / PAGE_CONTAINER_SIZE);

var paintPage = function paintPage(page) {
  var pageLink = document.createElement("a");
  var pageText = document.createElement("div");
  pageLink.href = "/gym?page=" + page;
  pageLink.innerHTML = page;
  pageText.classList.add("page");
  if (PAGE === +page) {
    pageText.classList.add("currentPage");
  }
  pageContainer.appendChild(pageLink);
  pageContainer.appendChild(pageLink);
};

var paintPagination = function paintPagination(TOTAL_PAGE) {
  if (1 < CURRENT_PAGE_CONTAINER) {
    var nextLink = document.createElement("a");
    nextLink.href = "/gym?page=" + (CURRENT_PAGE_CONTAINER - 1) * PAGE_CONTAINER_SIZE;
    nextLink.innerHTML = "Prev";
    pageContainer.appendChild(nextLink);
  }

  for (var i = 1; i <= TOTAL_PAGE; i++) {
    var iPageContainer = Math.ceil(i / PAGE_CONTAINER_SIZE);
    if (CURRENT_PAGE_CONTAINER === iPageContainer) {
      paintPage(i);
    }

    if (i === TOTAL_PAGE && TOTAL_PAGE > PAGE_CONTAINER_SIZE && CURRENT_PAGE_CONTAINER !== TOTAL_PAGE_CONTAINER) {
      var pageLink = document.createElement("a");
      pageLink.href = "/gym?page=" + (CURRENT_PAGE_CONTAINER * PAGE_CONTAINER_SIZE + 1);
      pageLink.innerHTML = "Next";
      pageContainer.appendChild(pageLink);
    }
  }
};

var init = function init() {
  if (PAGE > TOTAL_PAGE) {
    window.location.href = "/gym?page=" + TOTAL_PAGE;
  }
  paintPagination(TOTAL_PAGE);
};

init();