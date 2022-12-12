const searchAddressBtn = document.getElementById("searchAddressBtn");
const result = document.getElementById("result");
const addressInput = document.querySelector("input[name=address]");
const locationInput = document.querySelector("input[name=location]");
const mapContainer = document.getElementById("kakaoMap");
var geocoder = new daum.maps.services.Geocoder();

const mapOption = {
  center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
  level: 5, // 지도의 확대 레벨
};

let map = new daum.maps.Map(mapContainer, mapOption);

let marker = new daum.maps.Marker({
  position: new daum.maps.LatLng(37.537187, 127.005476),
  map: map,
});

const paintMap = (lat, lng) => {
  mapContainer.style.display = "block";
  map.relayout();
  const moveLatLng = new daum.maps.LatLng(lat, lng);
  map.setCenter(moveLatLng);
  marker.setPosition(moveLatLng);
};

const paintInitMap = () => {
  // paintAddress(addressInput.value);
  if (addressInput.value) {
    geocoder.addressSearch(addressInput.value, handleGeocoder);
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      let lng = position.coords.longitude;
      let lat = position.coords.latitude;
      paintMap(lat, lng);
    });
  }
};

const paintAddress = (address) => {
  result.innerHTML = "";
  const div = document.createElement("div");
  div.innerText = `주소: ${address}`;
  div.style.paddingTop = "5px";
  result.appendChild(div);
};

const handleGeocoder = (results, status) => {
  const result = results[0];
  const lat = result.y;
  const lng = result.x;
  paintMap(lat, lng);
};

const show = () => {
  new daum.Postcode({
    oncomplete: function (data) {
      geocoder.addressSearch(data.address, handleGeocoder);

      paintAddress(data.roadAddress);
      addressInput.value = data.roadAddress;
      locationInput.value = `${data.sido} ${data.sigungu} ${data.bname}`;
    },
  }).open();
};

const init = () => {
  paintInitMap();
  searchAddressBtn.addEventListener("click", show);
};

init();
