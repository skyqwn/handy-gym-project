const href = window.location.href;
const hrefArr = href.split("/");
const secondUrl = hrefArr[3];
const secondUrlArr = secondUrl.split("?");
const type = secondUrlArr[0];

const btns = document.querySelectorAll(".likeBtn");

const handleLike = async (e) => {
  const btn = e.target;
  const id = btn.id;
  let res;
  if (type === "like") {
    res = await fetch(`/gym/${id}/like`);
  } else {
    res = await fetch(`/${type}/${id}/like`);
  }
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
    alert("서버 오류가 발생했습니다");
  }
};
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", handleLike);
}
