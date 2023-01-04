const pageContainer = document.querySelector(".jsPageContainer");
const params = new URLSearchParams(window.location.search);

const PAGE_TYPE = window.location.href.split("?")[0].split("/").pop();
const PAGE = Number(params.get("page")) || 1;

const TOTAL_PAGE = Number(pageContainer.id);
const PAGE_CONTAINER_SIZE = 5;
const CURRENT_PAGE_CONTAINER = Math.ceil(PAGE / PAGE_CONTAINER_SIZE);
const TOTAL_PAGE_CONTAINER = Math.ceil(TOTAL_PAGE / PAGE_CONTAINER_SIZE);

const setHref = (aEle, pageNum) => {
  let queryString = `?page=${pageNum}`;
  const searchTerm = params.get("searchTerm");
  const yearRound = params.get("yearRound");
  const oneday = params.get("oneday");
  if (searchTerm) queryString += `&searchTerm=${searchTerm}`;
  if (yearRound) queryString += `&yearRound=${yearRound}`;
  if (oneday) queryString += `&oneday=${oneday}`;
  aEle.href = `/${PAGE_TYPE}${queryString}`;
};

const paintPage = (page) => {
  const pageLink = document.createElement("a");
  const pageText = document.createElement("div");
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

const paintPagination = (TOTAL_PAGE) => {
  if (1 < CURRENT_PAGE_CONTAINER) {
    const prevLink = document.createElement("a");
    // prevLink.href = `/gym?page=${
    //   (CURRENT_PAGE_CONTAINER - 1) * PAGE_CONTAINER_SIZE
    // }`;
    setHref(prevLink, (CURRENT_PAGE_CONTAINER - 1) * PAGE_CONTAINER_SIZE);
    prevLink.innerHTML = "Prev";
    pageContainer.appendChild(prevLink);
  }

  for (let i = 1; i <= TOTAL_PAGE; i++) {
    const iPageContainer = Math.ceil(i / PAGE_CONTAINER_SIZE);
    if (CURRENT_PAGE_CONTAINER === iPageContainer) {
      paintPage(i);
    }

    if (
      i === TOTAL_PAGE &&
      TOTAL_PAGE > PAGE_CONTAINER_SIZE &&
      CURRENT_PAGE_CONTAINER !== TOTAL_PAGE_CONTAINER
    ) {
      const nextLink = document.createElement("a");
      // nextLink.href = `/gym?page=${
      //   CURRENT_PAGE_CONTAINER * PAGE_CONTAINER_SIZE + 1
      // }`;
      setHref(nextLink, CURRENT_PAGE_CONTAINER * PAGE_CONTAINER_SIZE + 1);
      nextLink.innerHTML = "Next";
      pageContainer.appendChild(nextLink);
    }
  }
};

const init = () => {
  if (PAGE > TOTAL_PAGE) {
    window.location.href = `/gym?page=${TOTAL_PAGE}`;
  }

  paintPagination(TOTAL_PAGE);
};

init();
