const createdTexts = document.querySelectorAll(".postCreatedAt");

function dateFormat(createdEl) {
  const rawText = createdEl.innerText;

  const createdDate = new Date(rawText);
  let createdYear = createdDate.getFullYear();
  let createdMonth = createdDate.getMonth() + 1;
  let createdDay = createdDate.getDate();

  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth() + 1;
  let currentDay = currentDate.getDate();

  if (
    createdYear === currentYear &&
    createdMonth === currentMonth &&
    createdDay === currentDay
  ) {
    const createdHour = createdDate.getHours();
    const currentHour = currentDate.getHours();
    const subtractHour = currentHour - createdHour;
    if (createdHour === currentHour) {
      const createdMin = createdDate.getMinutes();
      const currentMin = currentDate.getMinutes();
      const subtractMin = currentMin - createdMin;
      if (createdMin === currentMin) {
        const createdSec = createdDate.getSeconds();
        const currentSec = currentDate.getSeconds();
        const subtractSec = currentSec - createdSec;
        createdEl.innerText = `${subtractSec}초전`;
        return;
      }
      createdEl.innerText = `${subtractMin}분전`;
      return;
    }
    createdEl.innerText = `${subtractHour}시간전`;
    return;
  }

  createdEl.innerText = `${createdYear}.${createdMonth}.${createdDay}`;
}

for (let i = 0; i < createdTexts.length; i++) {
  dateFormat(createdTexts[i]);
}
