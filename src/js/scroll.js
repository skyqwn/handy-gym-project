const scrollPoint = document.getElementById("jsScrollPoint");

const handleLoad = () => {
  scrollPoint.scrollIntoView({ behavior: "smooth" });
};

window.addEventListener("load", handleLoad);
