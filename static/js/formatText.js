"use strict";

var format = document.getElementById("formattedDescription");
var raw = document.getElementById("rawDescription");

var rawData = raw.innerText;
format.innerHTML = rawData;