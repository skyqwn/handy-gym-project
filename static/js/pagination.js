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
  pageLink.href = "/gym?page=" + page;
  pageLink.innerHTML = page;
  pageContainer.appendChild(pageLink);
};

var paintPagination = function paintPagination(TOTAL_PAGE) {
  if (1 < CURRENT_PAGE_CONTAINER) {
    var pageLink = document.createElement("a");
    pageLink.href = "/gym?page=" + (CURRENT_PAGE_CONTAINER - 1) * PAGE_CONTAINER_SIZE;
    pageLink.innerHTML = "Prev";
    pageContainer.appendChild(pageLink);
  }

  for (var i = 1; i <= TOTAL_PAGE; i++) {
    var iPageContainer = Math.ceil(i / PAGE_CONTAINER_SIZE);
    if (CURRENT_PAGE_CONTAINER === iPageContainer) {
      paintPage(i);
    }
    console.log(i);
    console.log(TOTAL_PAGE);

    if (i === TOTAL_PAGE && TOTAL_PAGE > PAGE_CONTAINER_SIZE && CURRENT_PAGE_CONTAINER !== TOTAL_PAGE_CONTAINER) {
      var _pageLink = document.createElement("a");
      _pageLink.href = "/gym?page=" + (CURRENT_PAGE_CONTAINER * PAGE_CONTAINER_SIZE + 1);
      _pageLink.innerHTML = "Next";
      pageContainer.appendChild(_pageLink);
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