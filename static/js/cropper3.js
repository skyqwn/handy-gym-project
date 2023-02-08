"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var n=0,t=Array(e.length);n<e.length;n++)t[n]=e[n];return t}return Array.from(e)}var body=document.querySelector("body"),modalContainer=document.querySelector(".modalContainer"),modalWrapper=document.querySelector(".modalWrapper"),cropperContainer=document.querySelector(".cropperContainer"),originalPreviews=document.querySelectorAll(".originalPreview"),originalCaptions=document.querySelectorAll(".originalCaption"),realFileInput=document.getElementById("realFileInput"),fakeFileInput=document.getElementById("fakeFileInput"),galleryPreview=document.getElementById("galleryPreview"),closeBtn=document.getElementById("closeBtn"),cropper=void 0,dataTransfer=new DataTransfer,generateRandomId=function(){return Math.random().toString(16).slice(2)},compressFile=async function(e){var n;try{if(!(6<=dataTransfer.files.length))return(n=await imageCompression(e,{maxSizeMB:1,maxWidthOrHeight:1280,initalQuality:.8,useWebWorker:!1})).name=e.name+"_compressed",convertBlobToFile(n)}catch(e){return console.log(e),alert("이미지 압축중 오류")}},convertBlobToFile=function(e){return new File([e],e.name||"previews",{type:"images/*"})},cropImgToData=function(e,n,t){var r=new File([e],e.name||"cropedImg",{type:"images/*"}),a=(r.id=t,Array.from(dataTransfer.files).map(function(e){return e.id===n?r:e}));dataTransfer.items.clear();for(var o=0;o<a.length;o++)dataTransfer.items.add(a[o]);realFileInput.files=dataTransfer.files},cropSave=function(e,a){e.preventDefault(),cropper.getCroppedCanvas({minWidth:256,minHeight:256,maxWidth:4096,maxHeight:4096}).toBlob(function(e){var n=generateRandomId(),t=document.getElementById(a),r=t.querySelector("textarea").value;t.innerHTML="",t.id=n,paintPreview(t,e,n,r),cropImgToData(e,a,n),closeModal()})},openCrop=function(e,n){modalContainer.style.transform="translateY(0)",modalWrapper.style.top=window.scrollY+"px",body.style.overflowY="hidden",cropperContainer.innerHTML="";var t=document.createElement("img"),e=(t.src=e,cropper=new Cropper(t,{aspectRatio:.75,zoomable:!1}),document.createElement("div"));e.innerText="수정",e.addEventListener("click",function(e){return cropSave(e,n)}),cropperContainer.append(t),cropperContainer.append(e)},closeModal=function(){modalContainer.style.transform="translateY(-100%)",modalWrapper.style.top="0",body.style.overflowY="scroll"},handleContainer=function(e){e.target!==modalContainer&&e.target!==cropperContainer||closeModal()},handleChange=async function(e){var e=e.target.files[0],n=Math.random().toString(16).slice(2),e=await compressFile(e),t=document.createElement("div");t.id=n,t.classList.add("previewContainer"),paintPreview(t,e,n,""),galleryPreview.append(t),newImgToData(e,n)},paintPreview=function(e,n,t,r){var a=window.URL.createObjectURL(n),n=document.createElement("img"),o=(n.classList.add("previewImg"),n.src=a,document.createElement("div")),i=(o.innerText="삭제",o.classList.add("deleteBtn"),o.addEventListener("click",function(e){return deletePreview(t)}),document.createElement("div")),l=(i.innerText="수정",i.classList.add("cropBtn"),i.addEventListener("click",function(e){return openCrop(a,t)}),document.createElement("div")),d=(l.classList.add("buttonContainer"),document.createElement("textarea"));d.name="captions",d.placeholder="사진에 대한 설명을 해주세요",r&&(d.value=r),l.append(i),l.append(o),e.append(n),e.append(l),e.append(d)},newImgToData=function(e,n){e.id=n,dataTransfer.items.add(e),realFileInput.files=dataTransfer.files},deletePreview=function(e){confirm("정말 삭제하시겠습니가?")&&(document.getElementById(e).remove(),deleteImgDate(e))},deleteImgDate=function(n){var e=[].concat(_toConsumableArray(dataTransfer.files)).findIndex(function(e){return e.id===n});dataTransfer.items.remove(e),realFileInput.files=dataTransfer.files},init=function(){fakeFileInput.addEventListener("change",handleChange),0<originalPreviews.length&&window.addEventListener("load",async function(){for(var e=0;originalPreviews.length>e;e++)await async function(e,n){var t=document.createElement("canvas");t.width=e.naturalWidth,t.height=e.naturalHeight;t.getContext("2d").drawImage(e,0,0);var e=await new Promise(function(n){return t.toBlob(function(e){return n(e)})}),e=convertBlobToFile(e),n=n.value,r=generateRandomId(),a=(console.log(e),newImgToData(e,r),document.createElement("div"));a.id=r,a.classList.add("previewContainer"),paintPreview(a,e,r,n),galleryPreview.append(a)}(originalPreviews[e],originalCaptions[e])})};init();