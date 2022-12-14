"use strict";

var deleteBtn = document.getElementById("deleteBtn");

var _ref = new URL(window.location),
    pathname = _ref.pathname;

var gymId = pathname.split("/")[2];

var handleDelete = function handleDelete() {
  var ok = confirm("정말 삭제 하시겠습니까?");
  if (ok) {
    window.location = "gym/" + gymId + "/remove";
  }
};

var init = function init() {
  deleteBtn.addEventListener("click", handleDelete);
};

if (deleteBtn) {
  init();
}