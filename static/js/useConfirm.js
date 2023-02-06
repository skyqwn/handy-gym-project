"use strict";

var deleteBtn = document.getElementById("deleteBtn");
var url = new URL(window.location);
var urlArr = url.pathname.split("/");
var type = urlArr[1];
var id = urlArr[2];
// const { pathname } = new URL(window.location);
// const gymId = pathname.split("/")[2];

var handleDelete = function handleDelete() {
  var ok = confirm("정말 삭제 하시겠습니까?");
  if (ok) {
    window.location = "/" + type + "/" + id + "/remove";
  }
};

var init = function init() {
  deleteBtn.addEventListener("click", handleDelete);
};

if (deleteBtn) {
  init();
}