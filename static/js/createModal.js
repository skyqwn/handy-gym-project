"use strict";var body=document.querySelector("body"),modalBtn=document.getElementById("modalBtn"),modalContainer=document.querySelector(".modalContainer"),modalWrapper=document.querySelector(".modalWrapper"),openModal=function(){modalContainer.style.transform="translateY(0)",modalWrapper.style.top=window.scrollY+"px",body.style.overflowY="hidden"},closeModal=function(o){o.target!==modalContainer&&o.target!==modalWrapper||(modalContainer.style.transform="translateY(-100%)",body.style.overflowY="scroll")},init=function(){modalBtn.addEventListener("click",openModal),modalContainer.addEventListener("click",closeModal)};modalBtn&&init();