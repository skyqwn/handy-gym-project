"use strict";var onedayRadios=document.querySelectorAll("input[name=oneday]"),jsOnedayPay=document.getElementById("jsOnedayPay"),onedayPayInput=document.querySelector("input[name=onedayPay]"),onedayPayCheckBox=document.getElementById("onedayPayCheckBox"),handleRadio=function(e){var e=e.target,a=e.checked,e=e.value;a&&("가능"===e&&(jsOnedayPay.style.display="flex"),"불가능"!==e&&"모름"!==e||(jsOnedayPay.style.display="none"))},handleCheckBox=function(e){if(e.target.checked)return onedayPayInput.value="모름";onedayPayInput.value=""},onlyNumber=function(e){onedayPayCheckBox.checked?e.target.value="모름":e.target.value=e.target.value.replace(/[^0-9]/g,"")},init=function(){jsOnedayPay.style.display="none";for(var e=0;e<onedayRadios.length;e++)onedayRadios[e].addEventListener("change",handleRadio);onedayPayInput.addEventListener("input",onlyNumber),onedayPayCheckBox.addEventListener("change",handleCheckBox)};init();