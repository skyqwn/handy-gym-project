"use strict";

var href = window.location.href;
var hrefArr = window.location.href.split("/");
// const whereId = hrefArr.pop();
var type = hrefArr[3];

var likeBtns = document.querySelectorAll(".likeBtn");

var handleLike = async function handleLike(e) {
  var btn = e.target;
  var id = e.target.id;
  var res = await fetch("/" + type + "/" + id + "/like");
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

for (var i = 0; i < likeBtns.length; i++) {
  likeBtns[i].addEventListener("click", handleLike);
}