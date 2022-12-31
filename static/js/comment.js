"use strict";

var gymId = window.location.href.split("/").pop();

var input = document.querySelector("input[name=text]");
var createBtn = document.getElementById("commentsBtn");
var deleteBtns = document.querySelectorAll(".deleteBtns");
var commentsWrapper = document.querySelector(".commentsWrapper");

var createComment = async function createComment(e) {
  try {
    var text = input.value;

    if (!text) return alert("에러");

    var res = await fetch("/comment/" + gymId, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text
      })
    });
    var data = await res.json();
    return data;
  } catch (error) {
    console.log("댓글생성중 오류발생");
    console.log(error);
  }
};

var paintComment = function paintComment(_ref) {
  var comment = _ref.comment,
      user = _ref.user;

  var commentContainer = document.createElement("div");
  commentContainer.classList.add("comment");
  var creatorName = document.createElement("div");
  creatorName.innerText = user.nickname;
  var commentText = document.createElement("div");
  commentText.innerText = comment.text;
  var deleteBtn = document.createElement("button");
  deleteBtn.innerText = "댓글삭제";
  deleteBtn.id = comment._id;
  deleteBtn.addEventListener("click", handleDelete);
  commentContainer.append(commentText);
  commentContainer.append(creatorName);
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
  var commentId = e.target.id;
  try {
    var ok = confirm("정말 삭제하시겠습니까?");
    if (ok) {
      var res = await fetch("/comment/" + gymId + "/remove/" + commentId, {
        method: "GET"
      }); // method default get이라 생략가능
      if (res.ok) {
        var comment = e.target.parentNode;
        comment.remove();
      } else {
        alert("삭제하는데 오류 발생");
      }
      var data = await res.json();
      console.log(data);
      return data;
    }
  } catch (error) {}
};

var init = function init() {
  createBtn.addEventListener("click", handleClick);
  for (var i = 0; i < deleteBtns.length; i++) {
    deleteBtns[i].addEventListener("click", handleDelete);
  }
};

if (createBtn) {
  init();
}