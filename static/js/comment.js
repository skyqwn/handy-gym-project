"use strict";var href=window.location.href,hrefArr=href.split("/"),whereId=hrefArr.pop(),type=hrefArr[3],input=document.querySelector("textarea[name=text]"),createBtn=document.getElementById("commentBtn"),commentsWrapper=document.querySelector(".commentsWrapper"),deleteBtns=document.querySelectorAll(".commentDeleteBtn"),createComment=async function(e){var t=input.value;return t?(t=await fetch("/comment/"+whereId,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:t,type:type})})).ok?await t.json():void alert("댓글생성중 에러발생"):alert("내용을 작성해주세요")},paintComment=function(e){var t=e.comment,e=e.user,n=document.createElement("div"),a=(n.classList.add("comment"),document.createElement("a")),r=(a.classList.add("userBlock"),a.href="/user/"+e._id,document.createElement("img")),c=(e.avatarUrl?r.src="/"+e.avatarUrl:r.src="/static/images/noUser.webp",r.style.width="24px",r.style.height="24px",r.classList.add("avatar"),document.createElement("div")),e=(c.innerText=e.nickname,document.createElement("p")),i=(e.innerText=t.text,document.createElement("button"));i.id=t._id,i.innerText="삭제",i.addEventListener("click",handleDelete),a.append(r),a.append(c),n.append(a),n.append(e),n.append(i),commentsWrapper.append(n)},handleClick=async function(e){createBtn.disabled=!0,createBtn.innerText="생성중...";var t=await createComment();paintComment(t),createBtn.disabled=!1,createBtn.innerText="댓글작성",input.value=""},handleDelete=async function(e){console.log(1);var t=e.target.id;confirm("정말 삭제하시겠습니까?")&&((await fetch("/comment/"+whereId+"/remove/"+t+"?type="+type)).ok?e.target.parentNode.remove():alert("삭제하는데 오류가 발생했습니다"))},init=function(){if(createBtn.addEventListener("click",handleClick),0<deleteBtns.length)for(var e=0;e<deleteBtns.length;e++)deleteBtns[e].addEventListener("click",handleDelete)};createBtn&&init();