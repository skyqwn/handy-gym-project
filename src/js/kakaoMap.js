const result = document.getElementById("result");
const address = document.getElementById("jsAddress");
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
  const moveLatLng = new daum.maps.LatLng(lat, lng);
  map.setCenter(moveLatLng);
  marker.setPosition(moveLatLng);
};

const paintInitMap = () => {
  if (address) {
    geocoder.addressSearch(address.innerText, handleGeocoder);
  }
};

const handleGeocoder = (results, status) => {
  const result = results[0];
  const lat = result.y;
  const lng = result.x;
  paintMap(lat, lng);
};

const init = () => {
  paintInitMap();
};

init();
