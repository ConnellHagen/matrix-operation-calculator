var WIDTH;
var HEIGHT;
//input-display
var currentScene;
var matrixMode;
var mainButtons;
var matrixButtons;
var mathButtons;
var editButtons;

//calc-display
var displayScene;
var overlayButtons;
var lastEquation;
var lastAnswer;

//calculations
var mainOpList = new OperationList();
var matrices = new Array(12);
//for creating new / editing matrices
var currentEditMatrix = new Matrix([[0]]);
var currentlyEditing;
var currentEditPos;
var currentSize;
//tempeditlist stores all of the numbers until Enter is pushed in which they will be assigned to the cell they belong to
var tempEditList;
var editMode;


function preload() {
	HEIGHT = windowHeight;
	WIDTH = windowHeight;
}
function setup() {
	noStroke();
	var canvas = createCanvas(2 * WIDTH, HEIGHT);
	canvas.parent('display');

	displayScene = 'main';
	currentScene = 'main';
	matrixMode = 'use';
	mainButtons = [
		new Button(WIDTH, 0, WIDTH / 2, HEIGHT / 5, color(137, 193, 189), color(124, 161, 158), 'Matrix', function () { return [changeScene('matrix'), matrixButtons[0].setActivity(true), matrixButtons[1].setActivity(false), matrixButtons[0].updateTogglableColors(), matrixButtons[1].updateTogglableColors()]; }, false),
		new Button(WIDTH + WIDTH / 2, 0, WIDTH / 2, HEIGHT / 5, color(137, 193, 189), color(124, 161, 158), 'Math', function () { return changeScene('math'); }, false),
		new Button(WIDTH, HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), '1', function () { return pushMainOpList(new OpListChar(1, 'num')); }, false),
		new Button(WIDTH + WIDTH / 5, HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), '2', function () { return pushMainOpList(new OpListChar(2, 'num')); }, false),
		new Button(WIDTH + 2 * WIDTH / 5, HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), '3', function () { return pushMainOpList(new OpListChar(3, 'num')); }, false),
		new Button(WIDTH + 3 * WIDTH / 5, HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), '+', function () { return pushMainOpList(new OpListChar('+', 'operation')); }, false),
		new Button(WIDTH + 4 * WIDTH / 5, HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), '-', function () { return pushMainOpList(new OpListChar('-', 'operation')); }, false),
		new Button(WIDTH, 2 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), '4', function () { return pushMainOpList(new OpListChar(4, 'num')); }, false),
		new Button(WIDTH + WIDTH / 5, 2 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), '5', function () { return pushMainOpList(new OpListChar(5, 'num')); }, false),
		new Button(WIDTH + 2 * WIDTH / 5, 2 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), '6', function () { return pushMainOpList(new OpListChar(6, 'num')); }, false),
		new Button(WIDTH + 3 * WIDTH / 5, 2 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), 'x', function () { return pushMainOpList(new OpListChar('x', 'operation')); }, false),
		new Button(WIDTH + 4 * WIDTH / 5, 2 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), '÷', function () { return pushMainOpList(new OpListChar('/', 'operation')); }, false),
		new Button(WIDTH, 3 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), '7', function () { return pushMainOpList(new OpListChar(7, 'num')); }, false),
		new Button(WIDTH + WIDTH / 5, 3 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), '8', function () { return pushMainOpList(new OpListChar(8, 'num')); }, false),
		new Button(WIDTH + 2 * WIDTH / 5, 3 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), '9', function () { return pushMainOpList(new OpListChar(9, 'num')); }, false),
		new Button(WIDTH + 3 * WIDTH / 5, 3 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), '(', function () { return pushMainOpList(new OpListChar('(', 'symbol')); }, false),
		new Button(WIDTH + 4 * WIDTH / 5, 3 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), ')', function () { return pushMainOpList(new OpListChar(')', 'symbol')); }, false),
		new Button(WIDTH, 4 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(198, 137, 137), color(160, 120, 120), 'BS', function () { popMainOpList(); }, false),
		new Button(WIDTH + WIDTH / 5, 4 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), '0', function () { return pushMainOpList(new OpListChar(0, 'num')); }, false),
		new Button(WIDTH + 2 * WIDTH / 5, 4 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(150, 173, 171), color(135, 153, 150), '.', function () { return pushMainOpList(new OpListChar('.', 'symbol')); }, false),
		new Button(WIDTH + 3 * WIDTH / 5, 4 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), '∨', function () { return pushMainOpList(new OpListChar('v', 'symbol')); }, false),
		new Button(WIDTH + 4 * WIDTH / 5, 4 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), '∧', function () { return pushMainOpList(new OpListChar('^', 'symbol')); }, false)
	];
	matrixButtons = [
		new Button(WIDTH, 0, WIDTH / 3, HEIGHT / 5, color(137, 193, 189), color(124, 161, 158), 'Use', function () { return [changeMatrixMode('use'), this.setActivity(true), matrixButtons[1].setActivity(false), this.updateTogglableColors(), matrixButtons[1].updateTogglableColors()]; }, true, color(187, 193, 131)),
		new Button(WIDTH + WIDTH / 3, 0, WIDTH / 3, HEIGHT / 5, color(137, 193, 189), color(124, 161, 158), 'Edit', function () { return [changeMatrixMode('edit'), this.setActivity(true), matrixButtons[0].setActivity(false), this.updateTogglableColors(), matrixButtons[0].updateTogglableColors()]; }, true, color(187, 193, 131)),
		new Button(WIDTH + 2 * WIDTH / 3, 0, WIDTH / 3, HEIGHT / 5, color(137, 193, 189), color(124, 161, 158), 'Back', function () { return [changeScene('main'), changeMatrixMode('use')]; }, false),
		new Button(WIDTH, HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'A', function () { return matrixPressed('A'); }, false),
		new Button(WIDTH + WIDTH / 3, HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'B', function () { return matrixPressed('B'); }, false),
		new Button(WIDTH + 2 * WIDTH / 3, HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'C', function () { return matrixPressed('C'); }, false),
		new Button(WIDTH, 2 * HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'D', function () { return matrixPressed('D'); }, false),
		new Button(WIDTH + WIDTH / 3, 2 * HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'E', function () { return matrixPressed('E'); }, false),
		new Button(WIDTH + 2 * WIDTH / 3, 2 * HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'F', function () { return matrixPressed('F'); }, false),
		new Button(WIDTH, 3 * HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'G', function () { return matrixPressed('G'); }, false),
		new Button(WIDTH + WIDTH / 3, 3 * HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'H', function () { return matrixPressed('H'); }, false),
		new Button(WIDTH + 2 * WIDTH / 3, 3 * HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'I', function () { return matrixPressed('I'); }, false),
		new Button(WIDTH, 4 * HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'J', function () { return matrixPressed('J'); }, false),
		new Button(WIDTH + WIDTH / 3, 4 * HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'K', function () { return matrixPressed('K'); }, false),
		new Button(WIDTH + 2 * WIDTH / 3, 4 * HEIGHT / 5, WIDTH / 3, HEIGHT / 5, color(168, 193, 191), color(146, 162, 161), 'L', function () { return matrixPressed('L'); }, false)
	];
	mathButtons = [
		new Button(WIDTH, 0, WIDTH, HEIGHT / 5, color(137, 193, 189), color(124, 161, 158), 'Back', function () { return changeScene('main'); }, false),
		new Button(WIDTH, HEIGHT / 5, WIDTH, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), 'Determinant', function () { return functionPressed('Determinant'); }, false),
		new Button(WIDTH, 2 * HEIGHT / 5, WIDTH / 2, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), 'Inverse', function () { return functionPressed('Inverse'); }, false),
		new Button(WIDTH + WIDTH / 2, 2 * HEIGHT / 5, WIDTH / 2, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), 'Transpose', function () { return functionPressed('Transpose'); }, false),
		new Button(WIDTH, 3 * HEIGHT / 5, WIDTH / 2, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), 'Row Reduce', function () { return functionPressed('RowRed'); }, false),
		new Button(WIDTH + WIDTH / 2, 3 * HEIGHT / 5, WIDTH / 2, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), 'RREF', function () { return functionPressed('RREF'); }, false),
		new Button(WIDTH, 4 * HEIGHT / 5, WIDTH / 2, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), 'LFactor', function () { return functionPressed('LFactor'); }, false),
		new Button(WIDTH + WIDTH / 2, 4 * HEIGHT / 5, WIDTH / 2, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), 'UFactor', function () { return functionPressed('UFactor'); }, false)
	];
	editButtons = [
		new Button(WIDTH, 0, WIDTH / 2, HEIGHT / 5, color(137, 193, 189), color(124, 161, 158), 'Back', function () { return [changeScene('matrix'), changeDisplayScene('main'), changeMatrixMode('edit')]; }, false),
		new Button(WIDTH + WIDTH / 2, 0, WIDTH / 2, HEIGHT / 5, color(137, 193, 189), color(124, 161, 158), 'Done', function () { return [changeScene('main'), changeDisplayScene('main'), changeMatrixMode('use')]; }, false),
		new Button(WIDTH, HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(135, 153, 150), '1', function () { return pushTempList(1); }, false),
		new Button(WIDTH + WIDTH / 5, HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(135, 153, 150), '2', function () { return pushTempList(2); }, false),
		new Button(WIDTH + 2 * WIDTH / 5, HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(135, 153, 150), '3', function () { return pushTempList(3); }, false),
		new Button(WIDTH + 3 * WIDTH / 5, HEIGHT / 5, 2 * WIDTH / 5, HEIGHT / 5, color(198, 137, 137), color(160, 120, 120), 'Backspace', function () { return popTempList(); }, false),
		new Button(WIDTH, 2 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(135, 153, 150), '4', function () { return pushTempList(4); }, false),
		new Button(WIDTH + WIDTH / 5, 2 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(135, 153, 150), '5', function () { return pushTempList(5); }, false),
		new Button(WIDTH + 2 * WIDTH / 5, 2 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(135, 153, 150), '6', function () { return pushTempList(6); }, false),
		new Button(WIDTH + 3 * WIDTH / 5, 2 * HEIGHT / 5, 2 * WIDTH / 5, HEIGHT / 5, color(135, 191, 140), color(120, 176, 125), 'Enter', function () { return submitTempList(); }, false),
		new Button(WIDTH, 3 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(135, 153, 150), '7', function () { return pushTempList(7); }, false),
		new Button(WIDTH + WIDTH / 5, 3 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(135, 153, 150), '8', function () { return pushTempList(8); }, false),
		new Button(WIDTH + 2 * WIDTH / 5, 3 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(135, 153, 150), '9', function () { return pushTempList(9); }, false),
		new Button(WIDTH + 3 * WIDTH / 5, 3 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), '↑', function () { return navigateEditMatrix("up"); }, false),
		new Button(WIDTH, 4 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(150, 173, 171), color(135, 153, 150), '.', function () { return pushTempList('.'); }, false),
		new Button(WIDTH + WIDTH / 5, 4 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(168, 193, 191), color(135, 153, 150), '0', function () { return pushTempList(0); }, false),
		new Button(WIDTH + 2 * WIDTH / 5, 4 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), '←', function () { return navigateEditMatrix("left"); }, false),
		new Button(WIDTH + 3 * WIDTH / 5, 4 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), '↓', function () { return navigateEditMatrix("down"); }, false),
		new Button(WIDTH + 4 * WIDTH / 5, 4 * HEIGHT / 5, WIDTH / 5, HEIGHT / 5, color(187, 193, 131), color(158, 162, 122), '→', function () { return navigateEditMatrix("right"); }, false)

	];
	//calc-display
	overlayButtons = [
		new Button(0, 5 * HEIGHT / 6, WIDTH / 2, HEIGHT / 6, color(168, 193, 191), color(146, 162, 161), 'Clear', function () { return clearScreen(); }, false),
		new Button(WIDTH / 2, 5 * HEIGHT / 6, WIDTH / 2, HEIGHT / 6, color(135, 191, 140), color(120, 176, 125), 'Enter', function () { return evaluateMainOpList(); }, false)
	];
	matrices = [
		new Matrix([[0, 2, 3, 7], [7, 6, 5, 44], [8, 6, 5, 6], [42, 5, 6, 3], [3, 4, 63, 2]]),
		new Matrix([
		[1, 4, 7, 5, 5],
		[3, 4, 1, 2, 5],
		[3, 6, 8, 9, 7],
		[3, 3, 2, 8, 2]
	]),
		new Matrix([[0]]),
		new Matrix([[0]]),
		new Matrix([[0]]),
		new Matrix([[0]]),
		new Matrix([[0]]),
		new Matrix([[0]]),
		new Matrix([[0]]),
		new Matrix([[0]]),
		new Matrix([[0]]),
		new Matrix([[0]])
	];

	currentSize = [1, 1];
	currentEditPos = [0, 0];
	tempEditList = "";
	//dimension or matrix
	editMode = "dimension";

}
function draw() {
	background(40);
	//input-display
	switch (currentScene) {
		case "main":
			for (let i = 0; i < mainButtons.length; i++) {
				mainButtons[i].display();
			}
			break;
		case "matrix":
			for (let i = 0; i < matrixButtons.length; i++) {
				matrixButtons[i].display();
			}
			break;
		case "math":
			for (let i = 0; i < mathButtons.length; i++) {
				mathButtons[i].display();
			}
			break;
		case "edit":
			for (let i = 0; i < editButtons.length; i++) {
				editButtons[i].display();
			}
			break;
	}
	//calc-display
	switch (displayScene) {
		case "main":
			push();
			fill(80);
			rect(0, 0, WIDTH, HEIGHT / 6);
			pop();
			for (let i = 0; i < overlayButtons.length; i++) {
				overlayButtons[i].display();
			}
			drawCalcText();
			break;
		case "edit":
			push();
			fill(80);
			rect(0, 0, WIDTH, HEIGHT / 6);
			drawEditMatrix();
			pop();
			break;
	}

}
function matrixPressed(item) {
	if (matrixMode === 'use') {
		pushMainOpList(new OpListChar(item, 'matrix'));
		currentScene = 'main';
	} else if (matrixMode === 'edit') {
		currentScene = 'edit';
		displayScene = 'edit';
		currentSize = [getLetterMatrix(item).getRows(), getLetterMatrix(item).getColumns()];
		currentlyEditing = item;
		switch (currentlyEditing) {
			case "A": case "B": case "C": case "D": case "E": case "F": case "G": case "H": case "I": case "J": case "K": case "L":
				currentEditMatrix = getLetterMatrix(currentlyEditing);
				break;
			default:
				currentEditMatrix = currentlyEditing;
				break;
		}
	}
}
function functionPressed(item) {
	pushMainOpList(new OpListChar(item, 'operation'));
	pushMainOpList(new OpListChar('(', 'symbol'));
	currentScene = "main";
	displayScene = "main";
}
//main, matrix, edit or math
function changeScene(scene) {
	currentScene = scene;
}
function changeDisplayScene(scene) {
	displayScene = scene;
}
//use or edit
function changeMatrixMode(mode) {
	matrixMode = mode;
}
function clearAnswers() {
	lastAnswer = undefined;
	lastEquation = undefined;
}
function setLastEquation(list) {
	let tempString = "";
	for (let i = 0; i < list.getOpListLength(); i++) {
		tempString += list.getValue(i);
	}
	lastEquation = tempString;
}
function setLastAnswer(list) {
	if (list.getType(0) === "num") {
		lastAnswer = new Matrix([[list.getValue(0)]]);
	} else lastAnswer = list.getValue(0);
}
function mousePressed() {
	//input-display
	switch (currentScene) {
		case "main":
			for (let i = 0; i < mainButtons.length; i++) {
				mainButtons[i].mousePressed(mouseX, mouseY);
			}
			break;
		case "matrix":
			for (let i = 0; i < matrixButtons.length; i++) {
				matrixButtons[i].mousePressed(mouseX, mouseY);
			}
			break;
		case "math":
			for (let i = 0; i < mathButtons.length; i++) {
				mathButtons[i].mousePressed(mouseX, mouseY);
			}
			break;
		case "edit":
			for (let i = 0; i < editButtons.length; i++) {
				editButtons[i].mousePressed(mouseX, mouseY);
			}
			break;
	}
	//calc-display
	for (let i = 0; i < overlayButtons.length; i++) {
		overlayButtons[i].mousePressed(mouseX, mouseY);
	}
}
function mouseReleased() {
	//input-display
	switch (currentScene) {
		case "main":
			for (let i = 0; i < mainButtons.length; i++) {
				mainButtons[i].mouseReleased(mouseX, mouseY);
			}
			break;
		case "matrix":
			for (let i = 0; i < matrixButtons.length; i++) {
				matrixButtons[i].mouseReleased(mouseX, mouseY);
			}
			break;
		case "math":
			for (let i = 0; i < mathButtons.length; i++) {
				mathButtons[i].mouseReleased(mouseX, mouseY);
			}
			break;
		case "edit":
			for (let i = 0; i < editButtons.length; i++) {
				editButtons[i].mouseReleased(mouseX, mouseY);
			}
			break;
	}
	//calc-display
	for (let i = 0; i < overlayButtons.length; i++) {
		overlayButtons[i].mouseReleased(mouseX, mouseY);
	}
}
//calc-display
function drawCalcText() {

	//top light gray box
	push();
	fill(255);
	textSize(HEIGHT / 15);
	textAlign(RIGHT, CENTER);
	text(getWindowText(), WIDTH - WIDTH / 40, HEIGHT / 12);
	pop();

	//the main dark gray box
	push();
	fill(50);
	rect(0, HEIGHT / 6, WIDTH, 4 * HEIGHT / 6);
	pop();

	push();
	fill(255);
	textSize(HEIGHT / 25);

	//loops through and puts together all of the parts of the answer matrix for display as the answer to the calculation
	try {
		textAlign(LEFT, TOP);
		text(lastEquation, HEIGHT / 40, HEIGHT / 6 + HEIGHT / 40);
		textAlign(RIGHT, TOP);
		for (let i = 0; i < lastAnswer.getRows(); i++) {
			let tempRow = "";
			for (let j = 0; j < lastAnswer.getColumns(); j++) {
				if (i === 0 && j === 0)
					tempRow += "「";
				tempRow += (Math.trunc(100 * lastAnswer.getElement(i, j))/100).toString();
				if (j !== lastAnswer.getColumns() - 1)
					tempRow += ", ";
				if (i === lastAnswer.getRows() - 1 && j === lastAnswer.getColumns() - 1)
					tempRow += "」";
			}
			if (i === lastAnswer.getRows() - 1)
				text(tempRow, WIDTH - HEIGHT / 40, 1.5 * HEIGHT / 6 + HEIGHT / 40 + i * HEIGHT / 30);
			else
				text(tempRow, WIDTH - HEIGHT / 15, 1.5 * HEIGHT / 6 + HEIGHT / 40 + i * HEIGHT / 30);
		}
		//when there is nothing to display, this will make sure that the program doesn't crash
	} catch (TypeError) {
		return;
	}
	//IGNORE UNLESS ALL GOES WRONG LMAOOO this was the location before any matrix stuff was implemented
	//text(lastAnswer, WIDTH-HEIGHT/40, 1.5 * HEIGHT/6 + HEIGHT/40);
	pop();
}
function drawEditMatrix() {
	push();
	fill(255);
	textSize(HEIGHT / 15);
	textAlign(LEFT, CENTER);
	text(currentlyEditing, WIDTH / 40, HEIGHT / 12)
	textAlign(RIGHT, CENTER);
	text(tempEditList, WIDTH - WIDTH / 40, HEIGHT / 12);
	text(currentSize[0] + "x" + currentSize[1], WIDTH - WIDTH / 40, 14 * HEIGHT / 60);
	pop();
	//in progress
	textAlign(RIGHT, TOP);
	fill(255);
	/* saving for later for the setting of the currentEditMatrix
	let tempMatrix;
	switch(currentlyEditing){
		case "A": case "B": case "C": case "D": case "E": case "F": case "G": case "H": case "I": case "J": case "K": case "L":
			tempMatrix = getLetterMatrix(currentlyEditing);
			break;
		default:
			tempMatrix = currentlyEditing;
			break;
	}
	*/
	for (let i = 0; i < currentEditMatrix.getRows(); i++) {
		let tempRow = "";
		for (let j = 0; j < currentEditMatrix.getColumns(); j++) {
			if (i === 0 && j === 0)
				tempRow += "「";
			tempRow += currentEditMatrix.getElement(i, j).toString();
			if (j !== currentEditMatrix.getColumns() - 1)
				tempRow += ", ";
			if (i === currentEditMatrix.getRows() - 1 && j === currentEditMatrix.getColumns() - 1)
				tempRow += "」";
		}
		if (i === currentEditMatrix.getRows() - 1)
			text(tempRow, WIDTH - HEIGHT / 40, 1.5 * HEIGHT / 6 + HEIGHT / 15 + i * HEIGHT / 30);
		else
			text(tempRow, WIDTH - HEIGHT / 15, 1.5 * HEIGHT / 6 + HEIGHT / 15 + i * HEIGHT / 30);
	}
}
function getWindowText() {

	let tempString = "";
	for (let i = 0; i < mainOpList.getOpListLength(); i++) {
		let tempType = mainOpList.getType(i);
		let tempVal = mainOpList.getValue(i);
		switch (tempType) {
			case "matrix":
				tempString += "[" + tempVal + "]";
				break;
			case "symbol":
				tempString += tempVal;
				break;
			case "operation":
				switch (tempVal) {
					case "+": case "-": case "x": case "/":
						tempString += tempVal;
						break;
					case "Transpose":
						tempString += "TRSP";
						break;
					case "Inverse":
						tempString += "INV";
						break;
					case "Transform":
						tempString += "TRSF";
						break;
					case "Determinant":
						tempString += "DET";
						break;
					case "RowRed":
						tempString += "RowR";
						break;
					case "RREF":
						tempString += "RREF";
						break;
					case "LFactor":
						tempString += "LF";
						break;
					case "UFactor":
						tempString += "UF";
						break;
				}
				break;
			case "num":
				tempString += tempVal.toString();
				break;
		}

	}
	return tempString;
}
function navigateEditMatrix(movement) {
	//when the matrix is being altered
	if (editMode === "matrix") {
		switch (movement) {
			case "up":
				if (currentEditPos[0] = 1) {
					currentEditPos = [0, 0];
					editMode = "dimension";
					clearTempList();
				}
				if (currentEditPos[0] > 1) {
					currentEditPos = [currentEditPos[0] - 1, currentEditPos[1]];
					clearTempList();
				}
				break;
			case "left":
				if (currentEditPos[1] > 0) {
					currentEditPos = [currentEditPos[0], currentEditPos[1] - 1];
					clearTempList();
				}
				break;
			case "down":
				if (currentEditPos[0] < currentSize[0] - 1) {
					currentEditPos = [currentEditPos[0] + 1, currentEditPos[1]];
					clearTempList();
				}
				break;
			case "right":
				if (currentEditPos[1] < currentSize[1] - 1) {
					currentEditPos = [currentEditPos[0], currentEditPos[1] + 1];
					clearTempList();
				}
				break;
		}
	} else if (editMode === "dimension") {
		switch (movement) {
			case "up":
				break;
			case "left":
				if (currentEditPos[1] === 1) {
					currentEditPos[1] = 0;
					clearTempList();
				}
				break;
			case "down":
				editMode = "matrix";
				currentEditPos = [0, 0];
				clearTempList();
				break;
			case "right":
				if (currentEditPos[1] === 0) {
					currentEditPos[1] = 1;
					clearTempList();
				}
				break;
		}
	}

}
function evaluateMainOpList() {
	setLastEquation(mainOpList);
	mainOpList.evaluateList();
	setLastAnswer(mainOpList);
	clearWindow();
}
function clearScreen() {
	mainOpList = new OperationList();
	clearAnswers();
}
function clearWindow() {
	mainOpList = new OperationList();
}
function pushMainOpList(item) {
	mainOpList.pushItem(item);
}
function popMainOpList() {
	mainOpList.popItem();
}
function getLetterMatrix(letter) {
	switch (letter) {
		case "A":
			return matrices[0];
			break;
		case "B":
			return matrices[1];
			break;
		case "C":
			return matrices[2];
			break;
		case "D":
			return matrices[3];
			break;
		case "E":
			return matrices[4];
			break;
		case "F":
			return matrices[5];
			break;
		case "G":
			return matrices[6];
			break;
		case "H":
			return matrices[7];
			break;
		case "I":
			return matrices[8];
			break;
		case "J":
			return matrices[9];
			break;
		case "K":
			return matrices[10];
			break;
		case "L":
			return matrices[11];
			break;
	}
}
function saveMatrix() {
	switch (currentlyEditing) {
		case "A":
			matrices[0] = currentEditMatrix;
			break;
		case "B":
			matrices[1] = currentEditMatrix;
			break;
		case "C":
			matrices[2] = currentEditMatrix;
			break;
		case "D":
			matrices[3] = currentEditMatrix;
			break;
		case "E":
			matrices[4] = currentEditMatrix;
			break;
		case "F":
			matrices[5] = currentEditMatrix;
			break;
		case "G":
			matrices[6] = currentEditMatrix;
			break;
		case "H":
			matrices[7] = currentEditMatrix;
			break;
		case "I":
			matrices[8] = currentEditMatrix;
			break;
		case "J":
			matrices[9] = currentEditMatrix;
			break;
		case "K":
			matrices[10] = currentEditMatrix;
			break;
		case "L":
			matrices[11] = currentEditMatrix;
			break;
	}
	editMode = "dimension";
	currentScene = "matrix";
	displayScene = "main";
}
function pushTempList(item) {
	tempEditList += item.toString();
}
function popTempList() {
	tempEditList = tempEditList.substring(0, tempEditList.length - 1);
}
function submitTempList() {
	if (editMode === "dimension") {
		if (currentEditPos[1] === 0) {
			currentEditMatrix.setRows(Number(tempEditList));
			currentEditPos = [0, 1];
		}
		else if (currentEditPos[1] === 1) {
			currentEditMatrix.setColumns(Number(tempEditList));
			currentEditPos = [0, 0];
			editMode = "matrix";
		}
	}
	else if (editMode === "matrix") {
		currentEditMatrix.setElement(currentEditPos[0], currentEditPos[1], Number(tempEditList));
		if (currentEditPos[0] === currentEditMatrix.getRows() - 1 && currentEditPos[1] === currentEditMatrix.getColumns() - 1) {
			currentEditPos = [0, 0];
			editMode = "dimension";
		}
		else if (currentEditPos[1] === currentEditMatrix.getColumns() - 1)
			currentEditPos = [currentEditPos[0] + 1, 0];
		else
			currentEditPos = [currentEditPos[0], currentEditPos[1] + 1];
	}
	clearTempList();
	updateCurrentSize();

	//will place the templist item in the spot in editlistcoords it coresponds to. also will refer to if the current box being edited is the dimension or the matrix
}
function clearTempList() {
	tempEditList = "";
}
function updateCurrentSize() {
	currentSize = [currentEditMatrix.getRows(), currentEditMatrix.getColumns()];
}