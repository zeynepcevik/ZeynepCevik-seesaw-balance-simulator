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
    }
    
}

document.addEventListener("DOMContentLoaded", () => {
    new SeesawSimulation();
});
