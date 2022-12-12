window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
  event.returnValue = "나가면 다시써야댐";
});
