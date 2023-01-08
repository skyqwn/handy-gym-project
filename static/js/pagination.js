"use strict";

var pageContainer = document.querySelector(".jsPageContainer");
var params = new URLSearchParams(window.location.search);

var PAGE_TYPE = window.location.href.split("?")[0].split("/").pop();

var PAGE = Number(params.get("page")) || 1;

var TOTAL_PAGE = Number(pageContainer.id);
var PAGE_CONTAINER_SIZE = 2;

var CURRENT_PAGE_CONTAINER = Math.ceil(PAGE / PAGE_CONTAINER_SIZE);
var TOTAL_PAGE_CONTAINER = Math.ceil(TOTAL_PAGE / PAGE_CONTAINER_SIZE);

var searchQueryString = "";

if (PAGE_TYPE === "gym") {
  var searchTerm = params.get("searchTerm");
  var yearRound = params.get("yearRound");
  var oneday = params.get("oneday");
  if (searchTerm) searchQueryString += "&searchTerm=" + searchTerm;
  if (yearRound) searchQueryString += "&yearRound=" + yearRound;
  if (oneday) searchQueryString += "&oneday=" + oneday;
}

if (PAGE_TYPE === "post") {
  var _searchTerm = params.get("searchTerm");
  var category = params.get("category");
  if (_searchTerm) searchQueryString += "&searchTerm=" + _searchTerm;
  if (category) searchQueryString += "&category=" + category;
}

if (PAGE_TYPE === "gallery") {
  var _searchTerm2 = params.get("searchTerm");
}

var setHref = function setHref(aEle, pageNum) {
  aEle.href = "/" + PAGE_TYPE + "?page=" + pageNum + searchQueryString;
};

var paintPage = function paintPage(page) {
  var pageLink = document.createElement("a");
  var pageText = document.createElement("div");
  // pageLink.href = `/gym?page=${page}`;
  setHref(pageLink, page);
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
    var prevLink = document.createElement("a");
    // prevLink.href = `/gym?page=${
    //   (CURRENT_PAGE_CONTAINER - 1) * PAGE_CONTAINER_SIZE
    // }`;
    setHref(prevLink, (CURRENT_PAGE_CONTAINER - 1) * PAGE_CONTAINER_SIZE);
    prevLink.innerHTML = "Prev";
    pageContainer.appendChild(prevLink);
  }

  for (var i = 1; i <= TOTAL_PAGE; i++) {
    var iPageContainer = Math.ceil(i / PAGE_CONTAINER_SIZE);
    if (CURRENT_PAGE_CONTAINER === iPageContainer) {
      paintPage(i);
    }

    if (i === TOTAL_PAGE && TOTAL_PAGE > PAGE_CONTAINER_SIZE && CURRENT_PAGE_CONTAINER !== TOTAL_PAGE_CONTAINER) {
      var nextLink = document.createElement("a");
      // nextLink.href = `/gym?page=${
      //   CURRENT_PAGE_CONTAINER * PAGE_CONTAINER_SIZE + 1
      // }`;
      setHref(nextLink, CURRENT_PAGE_CONTAINER * PAGE_CONTAINER_SIZE + 1);
      nextLink.innerHTML = "Next";
      pageContainer.appendChild(nextLink);
    }
  }
};

var init = function init() {
  paintPagination(TOTAL_PAGE);
};

init();