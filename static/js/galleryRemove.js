"use strict";

var deleteBtn = document.getElementById("deleteBtn");
var galleryId = window.location.href.split("/")[4];

var handleDelete = function handleDelete() {
  var ok = confirm("정말 삭제하시겠습니가?");
  if (ok) {
    window.location = "/gallery/" + galleryId + "/remove";
  }
};

var init = function init() {
  deleteBtn.addEventListener("click", handleDelete);
};

if (deleteBtn) {
  init();
}