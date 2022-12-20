"use strict";

var result = document.getElementById("result");
var address = document.getElementById("jsAddress");
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
  var moveLatLng = new daum.maps.LatLng(lat, lng);
  map.setCenter(moveLatLng);
  marker.setPosition(moveLatLng);
};

var paintInitMap = function paintInitMap() {
  if (address) {
    geocoder.addressSearch(address.innerText, handleGeocoder);
  }
};

var handleGeocoder = function handleGeocoder(results, status) {
  var result = results[0];
  var lat = result.y;
  var lng = result.x;
  paintMap(lat, lng);
};

var init = function init() {
  paintInitMap();
};

init();