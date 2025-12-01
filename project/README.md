# Seesaw Simulation

This project is a browser-based interactive seesaw physics simulation built using **pure JavaScript, HTML, and CSS**. Users can drop objects of varying weights onto the seesaw, and the system dynamically calculates torque, updates the seesaw angle, shows object previews, tracks history, and visually animates the entire interaction.

---

## Project Purpose

The goal of this project is to simulate real-world physics—specifically torque, weight distribution, and angle changes—when users interact with a seesaw. Each dropped object influences the balance, and the seesaw tilts accordingly based on:

**Torque = Weight × Distance from center**


This project aims to be:

- Accurate in physics calculations  
- Lightweight and library-free  
- Visually interactive  
- Accessible and intuitive  
- Real-time and animation-supported  

---

## Technologies Used

| Technology                      | Purpose                                           |
| ------------------------------- | ------------------------------------------------- |
| **HTML**                       | Semantic structure, ARIA accessibility            |
| **CSS**                        | Layout, animations, responsive design             |
| **JavaScript**           | Physics logic, DOM manipulation, state management |
| **LocalStorage**            | Persisting simulation state                       |
| **CSS Transforms & Animations** | Plank rotation, drop animations                   |

---

## Core Features

### 1-Object Drop Mechanism  
Clicking on the plank drops a randomly generated weight (1–10 kg) at the clicked position.

### 2-Real-Time Torque Calculation  
Both sides of the seesaw maintain:
- Total weight  
- Total torque  
- Tilt angle based on torque difference  

### 3- Dynamic Plank Rotation  
The plank rotates smoothly within **±30°** depending on torque imbalance.

### 4- Visual Object Preview  
Shows a semi-transparent preview of the next object under the mouse cursor.

### 5- Drop History Tracking  
Each drop is logged, for example:

**4kg dropped on left side at 8px from center**


### 6- Persistent State  
Objects, history, and angle remain even after page refresh (LocalStorage).

### 7- Reset Button  
Restores the simulation to its initial state.

---

## Key Methods (Architecture Overview)

### **handleDrop(event)**
Main controller for drop logic:
- Detects click position  
- Determines side (left/right)  
- Drops the object  
- Updates physics & DOM  
- Saves state  

### **updateSeesawBalance()**
Handles:
- Total torque calculation  
- Final angle calculation  
- Plank rotation update  

### **createObjectElement()**
Builds and animates dropped objects visually.

### **addToHistory()**
Saves readable logs for each interaction.

### **saveState() / loadState()**
Manages LocalStorage persistence.

### **createPreview() / updatePreview()**
Controls the moving “ghost object” preview.

### **resetSimulation()**
Clears objects, state, history, and resets angle.

---

## Thought Process & Design Decisions

While building the project, the following steps were followed:

1. Created the foundational HTML structure (plank, fulcrum, ground).  
2. Implemented the click-to-drop system using event listeners.  
3. Built the physics engine for torque and angle calculations.  
4. Added animations and transitions for better user experience.  
5. Implemented drop history tracking for clarity and usability.  
6. Added LocalStorage persistence to maintain state after reload.  
7. Developed a preview system to show the next droppable object.  
8. Improved accessibility via ARIA roles, labels, and keyboard support.  

---

## Trade-offs & Limitations

- Sound effects were not added due to time constraints.(extra feature)
---

## AI Assistance

Some parts of the project were assisted using AI tools including:
 
- Text formatting and README structuring  
- Clarifying physical formulas and calculation logic  
- Error handling

## Extras

- Weight indicator and visual scale under the plank

- Reset and Pause buttons for user control

- Smooth animations for a more realistic and fluid experience
---

