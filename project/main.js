class SeesawSimulation {
  constructor() {
    this.plank = document.getElementById("plank");
    this.seesawArea = document.querySelector(".seesaw-area");
    this.leftWeightDisplay = document.getElementById("leftWeight");
    this.rightWeightDisplay = document.getElementById("rightWeight");
    this.tiltAngleDisplay = document.getElementById("tiltAngle");
    this.nextWeightDisplay = document.getElementById("nextWeight");
    this.historyList = document.getElementById("historyList");
    this.resetBtn = document.getElementById("resetBtn");

    this.PLANK_WIDTH = 400;
    this.MAX_ANGLE = 30;
    this.PIVOT_CENTER = this.PLANK_WIDTH / 2;

    this.objects = [];
    this.history = [];
    this.currentAngle = 0;
    this.nextWeight = this.generateRandomWeight();
    this.previewElement = null;

    this.setupEventListeners();
    this.updateNextWeightDisplay();
    this.createPreview();
    this.loadState();
  }

  generateRandomWeight() {
    return Math.floor(Math.random() * 10) + 1;
  }

  setupEventListeners() {
    this.seesawArea.addEventListener("click", (e) => this.handleDrop(e));
    document.addEventListener("mousemove", (e) => this.updatePreview(e));
    this.resetBtn.addEventListener("click", () => this.resetSimulation());
  }

  handleDrop(event) {
    const plankRect = this.plank.getBoundingClientRect();
    const mouseX = event.clientX;
    if (mouseX < plankRect.left || mouseX > plankRect.right) return;

    const relativeX = mouseX - plankRect.left;
    const weight = this.nextWeight;
    const distanceFromCenter = Math.round(
      Math.abs(relativeX - this.PIVOT_CENTER)
    );
    const side = relativeX < this.PIVOT_CENTER ? "left" : "right";

    this.addToHistory(weight, side, distanceFromCenter);
    this.addObject(relativeX, weight);

    this.nextWeight = this.generateRandomWeight();
    this.updateNextWeightDisplay();

    this.removePreview();
    this.createPreview();
    this.updatePreview(event);

    this.updateSeesawBalance();
    this.saveState();
  }

  addObject(position, weight) {
    const obj = { position, weight, element: null };
    obj.element = this.createObjectElement(position, weight);
    this.plank.appendChild(obj.element);
    this.objects.push(obj);

    setTimeout(() => {
      obj.element.classList.remove("dropping");
      obj.element.style.top = "-35px";
    }, 600);
  }

  createObjectElement(position, weight) {
    const el = document.createElement("div");
    el.className = "weight-object dropping";
    const hue = 120 - (weight - 1) * 12;
    el.style.background = `linear-gradient(135deg,hsl(${hue},70%,55%),hsl(${hue},70%,40%))`;
    el.style.left = `${position - 17.5}px`;
    el.style.top = "-120px";
    el.textContent = `${weight}kg`;
    return el;
  }

  createPreview() {
    if (!this.previewElement) {
      this.previewElement = document.createElement("div");
      this.previewElement.className = "weight-preview";
      const hue = 120 - (this.nextWeight - 1) * 12;
      this.previewElement.style.background = `linear-gradient(135deg,hsl(${hue},70%,55%),hsl(${hue},70%,40%))`;
      this.previewElement.textContent = `${this.nextWeight}kg`;
      document.body.appendChild(this.previewElement);
    }
  }

  updatePreview(event) {
    if (!this.previewElement) return;
    const rect = this.plank.getBoundingClientRect();
    const mouseX = event.clientX;
    this.previewElement.style.opacity =
      mouseX < rect.left || mouseX > rect.right ? 0 : 0.5;
    this.previewElement.style.left = `${mouseX}px`;
    this.previewElement.style.top = `${event.clientY}px`;
  }

  removePreview() {
    if (this.previewElement) {
      this.previewElement.remove();
      this.previewElement = null;
    }
  }

  updateSeesawBalance() {
    let leftTorque = 0,
      rightTorque = 0,
      leftTotalWeight = 0,
      rightTotalWeight = 0;
    this.objects.forEach((obj) => {
      const dist = Math.abs(obj.position - this.PIVOT_CENTER);
      const torque = obj.weight * dist;
      if (obj.position < this.PIVOT_CENTER) {
        leftTorque += torque;
        leftTotalWeight += obj.weight;
      } else {
        rightTorque += torque;
        rightTotalWeight += obj.weight;
      }
    });

    this.leftWeightDisplay.textContent = `${leftTotalWeight} kg`;
    this.rightWeightDisplay.textContent = `${rightTotalWeight} kg`;
    const angle = Math.max(
      -this.MAX_ANGLE,
      Math.min(this.MAX_ANGLE, (rightTorque - leftTorque) / 10)
    );
    this.currentAngle = angle;
    this.tiltAngleDisplay.textContent = `${angle.toFixed(1)}°`;
    this.plank.style.transform = `rotate(${angle}deg)`;
  }

  addToHistory(weight, side, distance) {
    this.history.push({ weight, side, distance, timestamp: Date.now() });
    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    if (!this.history.length) {
      this.historyList.innerHTML = `<div style="text-align:center;color:#95a5a6;padding:20px;">No objects dropped yet. Click on the seesaw to start!</div>`;
      return;
    }

    const recent = this.history.slice(-10).reverse();
    this.historyList.innerHTML = recent
      .map((entry) => {
        const hue = 120 - (entry.weight - 1) * 12;
        return `<div class="history-item">
        <div class="history-icon" style="background: linear-gradient(135deg,hsl(${hue},70%,55%),hsl(${hue},70%,40%))"></div>
        <div class="history-text">
          <span class="history-weight">${entry.weight}kg</span> on <strong>${entry.side}</strong> side / <strong>${entry.distance}px</strong> from center
        </div>
      </div>`;
      })
      .join("");
  }

  saveState() {
    localStorage.setItem(
      "seesawState",
      JSON.stringify({
        objects: this.objects.map((o) => ({
          position: o.position,
          weight: o.weight,
        })),
        history: this.history,
        nextWeight: this.nextWeight,
      })
    );
  }

  loadState() {
    const saved = localStorage.getItem("seesawState");
    if (!saved) return;
    try {
      const state = JSON.parse(saved);
      if (state.nextWeight) {
        this.nextWeight = state.nextWeight;
        this.updateNextWeightDisplay();
      }
      if (state.history) {
        this.history = state.history;
        this.updateHistoryDisplay();
      }
      if (state.objects) {
        state.objects.forEach((o) => this.addObject(o.position, o.weight));
        this.updateSeesawBalance();
      }
    } catch (err) {
      console.error("Could not load state", err);
    }
  }

  updateNextWeightDisplay() {
    this.nextWeightDisplay.textContent = `${this.nextWeight} kg`;
  }

  resetSimulation() {
    this.objects.forEach((o) => {
      if (o.element?.parentNode) o.element.remove();
    });
    this.objects = [];
    this.history = [];
    this.currentAngle = 0;
    this.plank.style.transform = "rotate(0deg)";
    this.leftWeightDisplay.textContent = "0 kg";
    this.rightWeightDisplay.textContent = "0 kg";
    this.tiltAngleDisplay.textContent = "0°";
    this.nextWeight = this.generateRandomWeight();
    this.updateNextWeightDisplay();
    this.updateHistoryDisplay();
    localStorage.removeItem("seesawState");
    this.removePreview();
    this.createPreview();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new SeesawSimulation();
});
