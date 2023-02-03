const href = window.location.href;
const hrefArr = href.split("/");
const whereId = hrefArr.pop();
const type = hrefArr[3];

const input = document.querySelector("textarea[name=text]");
const createBtn = document.getElementById("commentBtn");
const commentsWrapper = document.querySelector(".commentsWrapper");
const deleteBtns = document.querySelectorAll(".commentDeleteBtn");

const createComment = async (e) => {
  const text = input.value;

  if (!text) return alert("내용을 작성해주세요");

  const res = await fetch(`/comment/${whereId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      type,
    }),
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  } else {
    alert("댓글생성중 에러발생");
    return;
  }
};

const paintComment = ({ comment, user }) => {
  const commentContainer = document.createElement("div");
  commentContainer.classList.add("comment");
  const creatorUserContainer = document.createElement("a");
  creatorUserContainer.classList.add("userBlock");
  creatorUserContainer.href = `/user/${user._id}`;
  const creatorImg = document.createElement("img");
  if (user.avatarUrl) {
    creatorImg.src = `/${user.avatarUrl}`;
  } else {
    creatorImg.src = "/static/images/noUser.png";
  }
  creatorImg.style.width = "40px";
  creatorImg.style.height = "40px";
  creatorImg.classList.add("avatar");
  const creatorName = document.createElement("div");
  creatorName.innerText = user.nickname;
  const commentText = document.createElement("p");
  commentText.innerText = comment.text;
  const deleteBtn = document.createElement("button");
  deleteBtn.id = comment._id;
  deleteBtn.innerText = "삭제";
  deleteBtn.addEventListener("click", handleDelete);

  creatorUserContainer.append(creatorImg);
  creatorUserContainer.append(creatorName);
  commentContainer.append(creatorUserContainer);
  commentContainer.append(commentText);
  commentContainer.append(deleteBtn);

  commentsWrapper.append(commentContainer);
};

const handleClick = async (e) => {
  createBtn.disabled = true;
  createBtn.innerText = "생성중...";

  const data = await createComment();
  paintComment(data);

  createBtn.disabled = false;
  createBtn.innerText = "댓글작성";
  input.value = "";
};

const handleDelete = async (e) => {
  const commentId = e.target.id;
  const ok = confirm("정말 삭제하시겠습니까?");
  if (ok) {
    const res = await fetch(
      `/comment/${whereId}/remove/${commentId}?type=${type}`
    );
    if (res.ok) {
      const comment = e.target.parentNode;
      comment.remove();
    } else {
      alert("삭제하는데 오류가 발생했습니다");
    }
  }
};

const init = () => {
  createBtn.addEventListener("click", handleClick);
  if (deleteBtns.length > 0) {
    for (let i = 0; i < deleteBtns.length; i++) {
      deleteBtns[i].addEventListener("click", handleDelete);
    }
  }
};

if (createBtn) {
  init();
}
