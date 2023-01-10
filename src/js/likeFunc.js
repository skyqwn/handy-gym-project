const href = window.location.href;
const hrefArr = window.location.href.split("/");
// const whereId = hrefArr.pop();
const type = hrefArr[3];

const likeBtns = document.querySelectorAll(".likeBtn");

const handleLike = async (e) => {
  const btn = e.target;
  const id = e.target.id;
  const res = await fetch(`/${type}/${id}/like`);
  if (res.ok) {
    if (btn.classList.contains("like")) {
      btn.classList.remove("fa-solid");
      btn.classList.add("fa-regular");
      btn.classList.remove("like");
    } else {
      btn.classList.remove("fa-regular");
      btn.classList.add("like");
      btn.classList.add("fa-solid");
    }
  } else {
    alert("오류 발생");
  }
};

for (let i = 0; i < likeBtns.length; i++) {
  likeBtns[i].addEventListener("click", handleLike);
}
