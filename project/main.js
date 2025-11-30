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
    const objectData = {
        position: position,
        weight: weight,
        element: null
    };

    objectData.element = this.createObjectElement(position, weight);

    this.plank.appendChild(objectData.element);

    this.objects.push(objectData);

    setTimeout(() => {
        objectData.element.classList.remove("dropping");
        objectData.element.style.top = `-35px`;
    }, 600);
    }
    
}

document.addEventListener("DOMContentLoaded", () => {
    new SeesawSimulation();
});
