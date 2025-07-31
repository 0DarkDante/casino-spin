document.addEventListener("DOMContentLoaded", function () {
  const wheelGroup = document.getElementById("wheel-group");
  const runButton = document.getElementById("run-circle");
  const spinsText = document.getElementById("spins__text");
  const modalBack = document.getElementById("modal-back_first");
  const mainModal = document.querySelector(".main__modal");
  const modalWrapper = document.querySelector(".modal__wrapper");
  const leftBonus = document.querySelector(".new-wheel__achievements-bet");
  const rightBonus = document.querySelector(".new-wheel__achievements-bonus");

  const sectorsCount = 10;
  const sectorAngle = 360 / sectorsCount;
  const spinDuration = 4000;

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
  let spinCount = 0;
  let firstSpinResult = null;
  let secondSpinResult = null;
  let timerInterval = null;

  function initWheel() {
    wheelGroup.style.transformOrigin = "center";
    wheelGroup.style.transition = "none";
    wheelGroup.style.transform = "rotate(0deg)";

    leftBonus.classList.add("new-hide");
    rightBonus.classList.add("new-hide");

    spinCount = 0;
    firstSpinResult = null;
    secondSpinResult = null;
    spinsText.textContent = "Tourne la roue";

    mainModal.classList.remove("main__modal_show");
    modalBack.classList.remove("active-first");
    modalWrapper.classList.remove("modal__wrapper_show");

    document.body.style.overflow = "";
    clearTimer();
    clearTimerDisplay();
  }

  function spinWheel(targetSector) {
    return new Promise((resolve) => {
      const extraSpins = 5;
      const stopAngle = targetSector * sectorAngle + extraSpins * 360;
      const randomOffset = Math.random() * 15 - 7.5;
      const finalAngle = stopAngle + randomOffset;

      isSpinning = true;
      wheelGroup.style.transition = `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
      wheelGroup.style.transform = `rotate(-${finalAngle}deg)`;

      setTimeout(() => {
        isSpinning = false;
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

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function startTimer(durationSeconds, displayElement, onComplete) {
    let time = durationSeconds;
    displayElement.textContent = formatTime(time);

    timerInterval = setInterval(() => {
      time--;
      displayElement.textContent = formatTime(time);
      if (time <= 0) {
        clearTimer();
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  function clearTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function clearTimerDisplay() {
    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.textContent = "";
  }

  async function handleSpin() {
    if (isSpinning) return;

    spinsText.textContent = "Tourne la roue...";
    const resultIndex = getRandomSector();
    const result = sectors[resultIndex];
    await spinWheel(resultIndex);

    if (result.type === "try") {
      spinsText.textContent = "Réessayez ! Cliquez encore une fois.";
      return;
    }

    if (spinCount === 0) {
      firstSpinResult = resultIndex;
      showBonus(firstSpinResult, true);
      spinCount++;
      spinsText.textContent = "Encore un tour";

      const firstBonus = sectors[firstSpinResult];
      const b2_1 = document.getElementById("b2-1");
      if (b2_1) {
        if (firstBonus.type === "money") {
          b2_1.textContent = `Bonus ${firstBonus.value}€`;
        } else if (firstBonus.type === "fs") {
          b2_1.textContent = `Bonus ${firstBonus.value} FS`;
        } else {
          b2_1.textContent = "Réessayez !";
        }
      }

      // Показуємо першу модалку з новим класом
      if (modalBack) {
        modalBack.classList.add("active-first");
        setTimeout(() => {
          modalBack.classList.remove("active-first");
        }, 2000);
      }

    } else if (spinCount === 1) {
      secondSpinResult = resultIndex;
      showBonus(secondSpinResult, false);
      spinCount++;

      setTimeout(() => {
        const firstBonus = sectors[firstSpinResult];
        const secondBonus = sectors[secondSpinResult];

        const formatBonus = (bonus) => {
          if (bonus.type === "money") return `${bonus.value}€`;
          if (bonus.type === "fs") return `${bonus.value} FS`;
          return "Réessayez";
        };

        const bonusText =
          firstBonus.type === "try" && secondBonus.type === "try"
            ? "Réessayez"
            : `${formatBonus(firstBonus)} + ${formatBonus(secondBonus)}`;

        const bonusDisplay = document.querySelector(".comp-title__bonus_second.white");
        if (bonusDisplay) {
          bonusDisplay.textContent = bonusText;
        }

        mainModal.classList.add("main__modal_show");
        modalBack.classList.add("popup__show");
        modalWrapper.classList.add("modal__wrapper_show");
        document.body.style.overflow = "hidden";

        const timerEl = document.getElementById("timer");
        startTimer(30, timerEl, () => {
          mainModal.classList.remove("main__modal_show");
          modalBack.classList.remove("popup__show");
          modalWrapper.classList.remove("modal__wrapper_show");
          document.body.style.overflow = "";
          clearTimerDisplay();
        });
      }, 1000);
    }
  }

  initWheel();
  runButton.addEventListener("click", handleSpin);
});
