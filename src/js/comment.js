const href = window.location.href;
const hrefArr = window.location.href.split("/");
const whereId = hrefArr.pop();
const type = hrefArr[3];

const input = document.querySelector("input[name=text]");
const createBtn = document.getElementById("commentsBtn");
const deleteBtns = document.querySelectorAll(".deleteBtns");
const commentsWrapper = document.querySelector(".commentsWrapper");

const createComment = async (e) => {
  try {
    const text = input.value;

    if (!text) return alert("에러");

    const res = await fetch(`/comment/${whereId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        type,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("댓글생성중 오류발생");
    console.log(error);
  }
};

const paintComment = ({ comment, user }) => {
  const commentContainer = document.createElement("div");
  commentContainer.classList.add("comment");
  const creatorName = document.createElement("div");
  creatorName.innerText = user.nickname;
  const commentText = document.createElement("div");
  commentText.innerText = comment.text;
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "댓글삭제";
  deleteBtn.id = comment._id;
  deleteBtn.addEventListener("click", handleDelete);
  commentContainer.append(commentText);
  commentContainer.append(creatorName);
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
  try {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (ok) {
      const res = await fetch(`/comment/${whereId}/remove/${commentId}`, {
        method: "GET",
      }); // method default get이라 생략가능
      if (res.ok) {
        const comment = e.target.parentNode;
        comment.remove();
      } else {
        alert("삭제하는데 오류 발생");
      }
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

const init = () => {
  createBtn.addEventListener("click", handleClick);
  for (let i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener("click", handleDelete);
  }
};

if (createBtn) {
  init();
}
