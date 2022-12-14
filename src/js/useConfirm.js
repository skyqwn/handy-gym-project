const deleteBtn = document.getElementById("deleteBtn");
const { pathname } = new URL(window.location);
const gymId = pathname.split("/")[2];

const handleDelete = () => {
  const ok = confirm("정말 삭제 하시겠습니까?");
  if (ok) {
    window.location = `gym/${gymId}/remove`;
  }
};

const init = () => {
  deleteBtn.addEventListener("click", handleDelete);
};

if (deleteBtn) {
  init();
}
