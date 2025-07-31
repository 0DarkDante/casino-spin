document.addEventListener("DOMContentLoaded", function () {
  // Отримуємо елементи
  const wheelGroup = document.getElementById("wheel-group");
  const runButton = document.getElementById("run-circle");
  const spinsText = document.getElementById("spins__text");
  const modalBack = document.getElementById("modal-back_first");
  const mainModal = document.querySelector(".main__modal");
  const leftBonus = document.querySelector(".new-wheel__achievements-bet");
  const rightBonus = document.querySelector(".new-wheel__achievements-bonus");

  // Налаштування колеса
  const sectorsCount = 10;
  const sectorAngle = 360 / sectorsCount;
  const spinDuration = 4000; // 4 секунди

  // Сектори колеса
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
  let firstSpinResult = null;
  let secondSpinResult = null;

  // Ініціалізуємо колесо
  function initWheel() {
    // Додаємо необхідні стилі для SVG
    wheelGroup.style.transformOrigin = "center";
    wheelGroup.style.transformBox = "fill-box";
    wheelGroup.style.transition = "none";
    wheelGroup.style.transform = "rotate(0deg)";

    // Приховуємо бонуси на початку
    leftBonus.classList.add("new-hide");
    rightBonus.classList.add("new-hide");
  }

  // Функція для обертання колеса
  function spinWheel(targetSector) {
    return new Promise((resolve) => {
      const extraSpins = 5; // Додаткові повні оберти
      const stopAngle =
        targetSector * sectorAngle + extraSpins * 360 + currentRotation;

      // Додаємо невелику випадковість для природнього вигляду
      const randomOffset = Math.random() * 15 - 7.5;
      const finalAngle = stopAngle + randomOffset;

      // Починаємо обертання
      isSpinning = true;
      wheelGroup.style.transition = `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
wheelGroup.style.transform = `rotate(-${finalAngle}deg)`;

      // Після завершення обертання
      setTimeout(() => {
        isSpinning = false;
        currentRotation = finalAngle % 360;
        resolve(targetSector);
      }, spinDuration);
    });
  }

  // Отримуємо випадковий сектор
  function getRandomSector() {
    return Math.floor(Math.random() * sectorsCount);
  }

  // Показуємо бонус у відповідній панелі
  function showBonus(sector, isLeft) {
    const bonusElement = isLeft ? leftBonus : rightBonus;
    const valueElement = bonusElement.querySelector(".lights-content__value");
    const currencyElement = bonusElement.querySelector(
      ".lights-content__currency"
    );

    bonusElement.classList.remove("new-hide");

    if (sectors[sector].type === "money") {
      valueElement.textContent = sectors[sector].value;
      currencyElement.textContent = "bonus";
    } else if (sectors[sector].type === "fs") {
      valueElement.textContent = sectors[sector].value;
      currencyElement.textContent = "FS";
    } else {
      valueElement.textContent = "0";
      currencyElement.textContent = "bonus";
    }
  }

  // Основний обробник обертання
  async function handleSpin() {
    if (isSpinning) return;

    // Перший спін
    spinsText.textContent = "Tourne la roue...";
    firstSpinResult = getRandomSector();
    await spinWheel(firstSpinResult);
    showBonus(firstSpinResult, true);

    // Другий спін через 1 секунду
    setTimeout(async () => {
      spinsText.textContent = "Tourne la roue...";
      secondSpinResult = getRandomSector();
      await spinWheel(secondSpinResult);
      showBonus(secondSpinResult, false);

      // Показуємо модалку через 1 секунду
      setTimeout(() => {
        mainModal.style.display = "flex";
        modalBack.style.display = "block";
        document.body.style.overflow = "hidden";
      }, 1000);
    }, 1000);
  }

  // Ініціалізація
  initWheel();
  spinsText.textContent = "Tourne la roue";
  runButton.addEventListener("click", handleSpin);

  // Автоматичний запуск через 1 секунду
  // setTimeout(handleSpin, 1000);
});
