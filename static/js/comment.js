"use strict";

var href = window.location.href;
var hrefArr = href.split("/");
var whereId = hrefArr.pop();
var type = hrefArr[3];

var input = document.querySelector("textarea[name=text]");
var createBtn = document.getElementById("commentBtn");
var commentsWrapper = document.querySelector(".commentsWrapper");
var deleteBtns = document.querySelectorAll(".commentDeleteBtn");

var createComment = async function createComment(e) {
  var text = input.value;

  if (!text) return alert("내용을 작성해주세요");

  var res = await fetch("/comment/" + whereId, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: text,
      type: type
    })
  });
  if (res.ok) {
    var data = await res.json();
    return data;
  } else {
    alert("댓글생성중 에러발생");
    return;
  }
};

var paintComment = function paintComment(_ref) {
  var comment = _ref.comment,
      user = _ref.user;

  var commentContainer = document.createElement("div");
  commentContainer.classList.add("comment");
  var creatorUserContainer = document.createElement("a");
  creatorUserContainer.classList.add("userBlock");
  creatorUserContainer.href = "/user/" + user._id;
  var creatorImg = document.createElement("img");
  if (user.avatarUrl) {
    creatorImg.src = "/" + user.avatarUrl;
  } else {
    creatorImg.src = "/static/images/noUser.webp";
  }
  creatorImg.style.width = "24px";
  creatorImg.style.height = "24px";
  creatorImg.classList.add("avatar");
  var creatorName = document.createElement("div");
  creatorName.innerText = user.nickname;
  var commentText = document.createElement("p");
  commentText.innerText = comment.text;
  var deleteBtn = document.createElement("button");
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

var handleClick = async function handleClick(e) {
  createBtn.disabled = true;
  createBtn.innerText = "생성중...";

  var data = await createComment();
  paintComment(data);

  createBtn.disabled = false;
  createBtn.innerText = "댓글작성";
  input.value = "";
};

var handleDelete = async function handleDelete(e) {
  console.log(1);
  var commentId = e.target.id;
  var ok = confirm("정말 삭제하시겠습니까?");
  if (ok) {
    var res = await fetch("/comment/" + whereId + "/remove/" + commentId + "?type=" + type);
    if (res.ok) {
      var comment = e.target.parentNode;
      comment.remove();
    } else {
      alert("삭제하는데 오류가 발생했습니다");
    }
  }
};

var init = function init() {
  createBtn.addEventListener("click", handleClick);
  if (deleteBtns.length > 0) {
    for (var i = 0; i < deleteBtns.length; i++) {
      deleteBtns[i].addEventListener("click", handleDelete);
    }
  }
};

if (createBtn) {
  init();
}