"use strict";

var searchAddressBtn = document.getElementById("searchAddressBtn");
var result = document.getElementById("result");
var layer = document.getElementById("postcodeLayer");
var cancelBtn = document.getElementById("postcodeCancelBtn");
var addressInput = document.querySelector("input[name=address]");
var locationInput = document.querySelector("input[name=location]");
var mapContainer = document.getElementById("kakaoMap");
var geocoder = new daum.maps.services.Geocoder();

var mapOption = {
  center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
  level: 5 // 지도의 확대 레벨
};

var map = new daum.maps.Map(mapContainer, mapOption);

var marker = new daum.maps.Marker({
  position: new daum.maps.LatLng(37.537187, 127.005476),
  map: map
});

var paintMap = function paintMap(lat, lng) {
  mapContainer.style.display = "block";
  map.relayout();
  var moveLatLng = new daum.maps.LatLng(lat, lng);
  map.setCenter(moveLatLng);
  marker.setPosition(moveLatLng);
};

var paintInitMap = function paintInitMap() {
  paintAddress(addressInput.value);
  if (addressInput.value) {
    geocoder.addressSearch(addressInput.value, handleGeocoder);
  } else {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lng = position.coords.longitude;
      var lat = position.coords.latitude;
      paintMap(lat, lng);
    });
  }
};

var paintAddress = function paintAddress(address) {
  result.innerHTML = "";
  var div = document.createElement("div");
  div.innerText = address;
  result.appendChild(div);
};

var cancel = function cancel() {
  layer.style.display = "none";
};

var handleGeocoder = function handleGeocoder(results, status) {
  var result = results[0];
  var lat = result.y;
  var lng = result.x;
  paintMap(lat, lng);
};

var show = function show() {
  new daum.Postcode({
    oncomplete: function oncomplete(data) {
      geocoder.addressSearch(data.address, handleGeocoder);

      paintAddress(data.roadAddress);
      addressInput.value = data.roadAddress;
      locationInput.value = data.sido + " " + data.sigungu + " " + data.bname;
    }
  }).embed(layer);
  layer.style.display = "block";
};

var init = function init() {
  paintInitMap();
  searchAddressBtn.addEventListener("click", show);
  cancelBtn.addEventListener("click", cancel);
};

init();