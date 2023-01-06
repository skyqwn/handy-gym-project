const deleteBtn = document.getElementById("deleteBtn");
const galleryId = window.location.href.split("/")[4];

const handleDelete = () => {
  const ok = confirm("정말 삭제하시겠습니가?");
  if (ok) {
    window.location = `/gallery/${galleryId}/remove`;
  }
};

const init = () => {
  deleteBtn.addEventListener("click", handleDelete);
};

if (deleteBtn) {
  init();
}
