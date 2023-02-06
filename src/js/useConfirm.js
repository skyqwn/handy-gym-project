const deleteBtn = document.getElementById("deleteBtn");
const url = new URL(window.location);
const urlArr = url.pathname.split("/");
const type = urlArr[1];
const id = urlArr[2];
// const { pathname } = new URL(window.location);
// const gymId = pathname.split("/")[2];

const handleDelete = () => {
  const ok = confirm("정말 삭제 하시겠습니까?");
  if (ok) {
    window.location = `/${type}/${id}/remove`;
  }
};

const init = () => {
  deleteBtn.addEventListener("click", handleDelete);
};

if (deleteBtn) {
  init();
}
