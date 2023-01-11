const menuBar = document.querySelector(".menubar");
const menuModal = document.querySelector(".menuModal");
const navLinks = document.querySelectorAll(".navLink");

const closeHandler = (e) => {
  let isModalClick = menuModal.contains(e.target) || menuBar.contains(e.target);
  if (!isModalClick) {
    if (!menuModal.classList.contains("hidden")) {
      menuModal.classList.add("hidden");
    }
  }
};

const openHandler = () => {
  menuModal.classList.toggle("hidden");
};

const init = () => {
  menuBar.addEventListener("click", openHandler);
  document.addEventListener("click", closeHandler);
};

for (let i = 0; i < navLinks.length; i++) {
  const href = window.location.href;
  const aTag = navLinks[i];
  const aHref = aTag.href;
  if (href === aHref) {
    aTag.style.color = "blue";
    aTag.style.fontWeight = "700";
    aTag.style.textDecoration = "underline";
  }
}

init();
