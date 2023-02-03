"use strict";

var href = window.location.href;
var hrefArr = href.split("/");
var secondUrl = hrefArr[3];
var secondUrlArr = secondUrl.split("?");
var type = secondUrlArr[0];

var btns = document.querySelectorAll(".likeBtn");

var handleLike = async function handleLike(e) {
  var btn = e.target;
  var id = btn.id;
  var res = void 0;
  if (type === "like") {
    res = await fetch("/gym/" + id + "/like");
  } else {
    res = await fetch("/" + type + "/" + id + "/like");
  }
  if (res.ok) {
    if (btn.classList.contains("like")) {
      btn.classList.remove("fa-solid");
      btn.classList.remove("like");
      btn.classList.add("fa-regular");
    } else {
      btn.classList.remove("fa-regular");
      btn.classList.add("fa-solid");
      btn.classList.add("like");
    }
  } else {
    alert("서버 오류가 발생했습니다");
  }
};
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", handleLike);
}