document.addEventListener("DOMContentLoaded", function () {
  const wheelGroup = document.getElementById("wheel-group");
  const runButton = document.getElementById("run-circle");
  const spinsText = document.getElementById("spins__text");
  const modalBack = document.getElementById("modal-back_first");
  const mainModal = document.querySelector(".main__modal");
  const leftBonus = document.querySelector(".new-wheel__achievements-bet");
  const rightBonus = document.querySelector(".new-wheel__achievements-bonus");

  const sectorsCount = 10;
  const sectorAngle = 360 / sectorsCount;
  const spinDuration = 4000; // 4 секунды

  const sectors = [
    { text: "500€", type: "money", value: 500, color: "yellow" },
    { text: "Réessayez", type: "try", value: 0, color: "white" },
    { text: "200 FS", type: "fs", value: 200, color: "yellow" },
    { text: "5 FS", type: "fs", value: 5, color: "white" },
    { text: "500€", type: "money", value: 500, color: "yellow" },
    { text: "250€", type: "money", value: 250, color: "white" },
    { text: "Réessayez", type: "try", value: 0, color: "yellow" },
    { text: "15 FS", type: "fs", value: 15, color: "white" },
    { text: "20 FS", type: "fs", value: 20, color: "yellow" },
    { text: "350€", type: "money", value: 350, color: "white" },
  ];

  let isSpinning = false;
  let currentRotation = 0;
  let spinCount = 0;

  function initWheel() {
    wheelGroup.style.transformOrigin = "center";
    wheelGroup.style.transformBox = "fill-box";
    wheelGroup.style.transition = "none";
    wheelGroup.style.transform = "rotate(0deg)";

    leftBonus.classList.add("new-hide");
    rightBonus.classList.add("new-hide");

    spinCount = 0;
    spinsText.textContent = "Tourne la roue";
    mainModal.style.display = "none";
    modalBack.style.display = "none";
    document.body.style.overflow = "";
  }

  function spinWheel(targetSector) {
    return new Promise((resolve) => {
      const extraSpins = 5;
      const stopAngle =
        targetSector * sectorAngle + extraSpins * 360 + currentRotation;
      const randomOffset = Math.random() * 15 - 7.5;
      const finalAngle = stopAngle + randomOffset;

      isSpinning = true;
      wheelGroup.style.transition = `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
      wheelGroup.style.transform = `rotate(-${finalAngle}deg)`;

      setTimeout(() => {
        isSpinning = false;
        currentRotation = finalAngle % 360;
        resolve(targetSector);
      }, spinDuration);
    });
  }

  function getRandomSector() {
    return Math.floor(Math.random() * sectorsCount);
  }

  function showBonus(sectorIndex, isLeft) {
    const sector = sectors[sectorIndex];
    const bonusElement = isLeft ? leftBonus : rightBonus;
    const valueElement = bonusElement.querySelector(".lights-content__value");
    const currencyElement = bonusElement.querySelector(".lights-content__currency");

    bonusElement.classList.remove("new-hide");

    if (sector.type === "money") {
      valueElement.textContent = sector.value;
      currencyElement.textContent = "bonus";
    } else if (sector.type === "fs") {
      valueElement.textContent = sector.value;
      currencyElement.textContent = "FS";
    } else {
      valueElement.textContent = "0";
      currencyElement.textContent = "bonus";
    }
  }

  async function handleSpin() {
    if (isSpinning) return; // блокируем повторный клик

    spinsText.textContent = "Tourne la roue...";

    const resultIndex = getRandomSector();
    const result = sectors[resultIndex];

    await spinWheel(resultIndex);

    if (result.type === "try") {
      spinsText.textContent = "Réessayez ! Cliquez encore une fois.";
      // НЕ увеличиваем spinCount — разрешаем повторный спин
      return;
    }

    if (spinCount === 0) {
      showBonus(resultIndex, true); // слева
      spinCount++;
      spinsText.textContent = "Encore un tour";
    } else if (spinCount === 1) {
      showBonus(resultIndex, false); // справа
      spinCount++;

      // Показываем модалку через секунду после второго спина
      setTimeout(() => {
        mainModal.style.display = "flex";
        modalBack.style.display = "block";
        document.body.style.overflow = "hidden";
      }, 1000);
    }
  }

  initWheel();
  runButton.addEventListener("click", handleSpin);
});
