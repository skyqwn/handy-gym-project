"use strict";var deleteBtn=document.getElementById("deleteBtn"),galleryId=window.location.href.split("/")[4],handleDelete=function(){confirm("정말 삭제하시겠습니가?")&&(window.location="/gallery/"+galleryId+"/remove")},init=function(){deleteBtn.addEventListener("click",handleDelete)};deleteBtn&&init();