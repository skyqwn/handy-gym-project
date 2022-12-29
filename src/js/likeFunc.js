const likeBtns = document.querySelectorAll(".likeBtn");

const handleLike = async (e) => {
  const btn = e.target;
  const gymId = e.target.id;
  const res = await fetch(`/gym/${gymId}/like`);
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
