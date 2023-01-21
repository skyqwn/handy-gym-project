const href = window.location.href;
const hrefArr = href.split("/");
const type = hrefArr[3];

const btns = document.querySelectorAll(".likeBtn");

const handleLike = async (e) => {
  const btn = e.target;
  const id = btn.id;
  const res = await fetch(`/${type}/${id}/like`);
  if (res.ok) {
    if (btn.classList.contains("like")) {
      btn.classList.remove("fa-solid");
      btn.classList.remove("like");
      btn.classList.add("fa-regular");
    } else {
      btn.classList.remove("fa-regular");
      btn.classList.add("fa-solid");
      btn.classList.add("like");
    }
  } else {
    alert("좋아요가 오류났습니다");
  }
};
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", handleLike);
}
