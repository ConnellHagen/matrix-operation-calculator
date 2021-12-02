class Matrix {

  constructor(matrix) {
    let mostCol = 0;
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i].length > mostCol) {
        mostCol = matrix[i].length;
      }
    }
    this.matrix = new Array(matrix.length);
    for (let i = 0; i < this.matrix.length; i++) {
      this.matrix[i] = new Array(mostCol);
    }
    //fills up the this.matrix array with the matrix values. if an incomplete array is sent in, the rest will be 0s
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        this.matrix[i][j] = matrix[i][j];
      }
    }
    //add matrix vals to this.matrix
    this.rows = this.matrix.length;
    this.columns = this.matrix[0].length;
  }

  //setters, getters, and simple properties
  getRows() {
    this.updateRC();
    return this.rows;
  }
  getColumns() {
    this.updateRC();
    return this.columns;
  }
  getElement(r, c) {
    return this.matrix[r][c];
  }
	setElement(r, c, num) {
		this.matrix[r][c] = num;
	}
  static getIdentityMatrix(size) {
    let idMatrix = new Array(size);
    for (let i = 0; i < size; i++) {
      idMatrix[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        if (i === j)
          idMatrix[i][j] = 1;
        else
          idMatrix[i][j] = 0;
      }
    }
    return idMatrix;
  }
  static getIdentityMatrixTimes(size, num) {
    let idMatrix = new Array(size);
    for (let i = 0; i < size; i++) {
      idMatrix[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        if (i === j)
          idMatrix[i][j] = num;
        else
          idMatrix[i][j] = 0;
      }
    }
    return idMatrix;
  }
  getNumPivots() {
    return this.getPivotRows().length;
  }
  getPivotColumns() {
    let tempArray = new Array(this.rows);
    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i] = new Array(this.columns);
    }
    let tempMatrix = new Matrix(tempArray);
    let pivots = new Array(0);
    for (let i = 0; i < tempMatrix.getColumns(); i++) {
      let itemCount = 0;
      for (let j = 0; j < tempMatrix.getRows(); j++) {
        if (tempMatrix.getElement(j, i) === 0)
          itemCount++;
      }
      if (itemCount === 1)
        pivots.push(i);
    }
    return pivots;
  }
  getPivotRows() {
    let tempArray = this.getRowReduce();
    let tempMatrix = new Matrix(tempArray);
    let pivots = new Array(0);
    for (let i = 0; i < tempMatrix.getRows(); i++) {
      for (let j = 0; j < tempMatrix.getColumns(); j++) {
        if (tempMatrix.getElement(i, j) !== 0) {
          pivots.push(i);
          j = 1000000;
        }
      }
    }
    return pivots;
  }
  updateRC() {
    this.rows = this.matrix.length;
    this.columns = this.matrix[0].length;
  }
  isSquare() {
    return this.rows === this.columns;
  }
  sameDimensions(matrixB) {
    return this.rows === matrixB.getRows() && this.columns === matrixB.getColumns();
  }
  canMultiply(matrixB) {
    return this.columns === matrixB.getRows();
  }
  isInvertible() {
    if (!this.isSquare())
      return false;
    if (this.getNumPivots() === this.columns)
      return true;
    return false;
  }

  //operations
  removeColumn(index) {
    this.matrix = this.getRemoveColumn(index);
    this.updateRC();
  }
  getRemoveColumn(index) {
    let tempMatrix = new Array(this.rows);
    for (let i = 0; i < tempMatrix.length; i++) {
      tempMatrix[i] = new Array(this.columns - 1);
    }
    for (let i = 0; i < tempMatrix.length; i++) {
      for (let j = 0; j < tempMatrix[i].length; j++) {
        if (j < index)
          tempMatrix[i][j] = this.getElement(i, j);
        else
          tempMatrix[i][j] = this.getElement(i, j + 1);
      }
    }
    return tempMatrix;
  }
  removeRow(index) {
    this.matrix = this.getRemoveRow(index);
    this.updateRC();
  }
  getRemoveRow(index) {
    let tempMatrix = new Array(this.rows - 1);
    for (let i = 0; i < tempMatrix.length; i++) {
      tempMatrix[i] = new Array(this.columns);
    }
    for (let i = 0; i < tempMatrix.length; i++) {
      for (let j = 0; j < tempMatrix[i].length; j++) {
        if (i < index)
          tempMatrix[i][j] = this.getElement(i, j);
        else
          tempMatrix[i][j] = this.getElement(i + 1, j);
      }
    }
    return tempMatrix;
  }
  getDeterminant() {
    if (!this.isSquare())
      return null;
    if (this.rows === 1) {
      return this.getElement(0, 0);
    }
    if (this.rows === 2) {
			console.log(this.getElement(0, 0) * this.getElement(1, 1) - this.getElement(1, 0) * this.getElement(0, 1));
      return this.getElement(0, 0) * this.getElement(1, 1) - this.getElement(1, 0) * this.getElement(0, 1);
    } else {
      let detMultipliers = new Array(this.getRows());
      for (let i = 0; i < detMultipliers.length; i++) {
        if (i % 2 === 0)
          detMultipliers[i] = this.getElement(0, i);
        else
          detMultipliers[i] = this.getElement(0, i) * -1;
      }
      let detArrays = new Array(this.getRows());
      for (let i = 0; i < detArrays.length; i++) {
        detArrays[i] = new Matrix((new Matrix(this.getRemoveRow(0))).getRemoveColumn(i));
      }
      let tempTotal = 0;
      for (let i = 0; i < detMultipliers.length; i++) {
        tempTotal += detMultipliers[i] * detArrays[i].getDeterminant();
      }
      return tempTotal;
    }
  }
  multiply(matrixB) {
    this.matrix = this.getProduct(matrixB);
    this.updateRC();
  }
  getProduct(matrixB) {
    if (!this.canMultiply(matrixB))
      return null;
    let tempMatrix = new Array(this.rows);
    for (let i = 0; i < tempMatrix.length; i++) {
      tempMatrix[i] = new Array(matrixB.getColumns());
    }
    for (let i = 0; i < tempMatrix.length; i++) {
      for (let j = 0; j < tempMatrix[i].length; j++) {
        let tempTotal = 0;
        for (let k = 0; k < matrixB.getRows(); k++) {
          tempTotal += this.getElement(i, k) * matrixB.getElement(k, j);
        }
        tempMatrix[i][j] = tempTotal;
      }
    }
    return tempMatrix;
  }
  add(matrixB) {
    this.matrix = this.getAdd(matrixB);
  }
  getAdd(matrixB) {
    if (!this.sameDimensions(matrixB))
      return null;
    let tempMatrix = new Array(this.rows)
    for (let i = 0; i < tempMatrix.length; i++) {
      tempMatrix[i] = new Array(this.columns);
    }
    for (let i = 0; i < tempMatrix.length; i++) {
      for (let j = 0; j < tempMatrix[i].length; j++) {
        tempMatrix[i][j] = this.getElement(i, j) + matrixB.getElement(i, j);
      }
    }
    return tempMatrix;
  }
  subtract(matrixB) {
    this.matrix = this.getSubtract(matrixB);
  }
  getSubtract(matrixB) {
    if (!this.sameDimensions(matrixB))
      return null;
    let tempMatrix = new Array(this.rows)
    for (let i = 0; i < tempMatrix.length; i++) {
      tempMatrix[i] = new Array(this.columns);
    }
    for (let i = 0; i < tempMatrix.length; i++) {
      for (let j = 0; j < tempMatrix[i].length; j++) {
        tempMatrix[i][j] = this.getElement(i, j) - matrixB.getElement(i, j);
      }
    }
    return tempMatrix;
  }
  transform(tMatrix) {
    this.matrix = this.getTransformation(tMatrix);
  }
  getTransformation(tMatrix) {
    return this.getProduct(tMatrix);
  }
  transpose() {
    this.matrix = this.getTranspose();
    this.updateRC();
  }
  getTranspose() {
    let tempMatrix = new Array(this.columns);
    for (let i = 0; i < tempMatrix.length; i++) {
      tempMatrix[i] = new Array(this.rows);
    }
    for (let i = 0; i < tempMatrix.length; i++) {
      for (let j = 0; j < tempMatrix[i].length; j++) {
        tempMatrix[i][j] = this.matrix[j][i];
      }
    }
    return tempMatrix;
  }
  invert() {
    this.matrix = this.getInverse();
  }
  getInverse() {
    if (!this.isInvertible())
      return null;
    let tempArray = new Array(this.getRows());
    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i] = new Array(this.getColumns());
      for (let j = 0; j < tempArray[i].length; j++) {
        tempArray[i][j] = this.getElement(i, j);
      }
    }
    let tempMatrix = new Matrix(tempArray);
    tempMatrix.augment(new Matrix(Matrix.getIdentityMatrix(this.getRows())));
    tempMatrix.rref();
    let tempArray2 = new Array(this.getRows());
    for (let i = 0; i < tempArray2.length; i++) {
      tempArray2[i] = new Array(this.getColumns());
      for (let j = 0; j < tempArray2.length; j++) {
        tempArray2[i][j] = tempMatrix.getElement(i, j + this.getRows());
      }
    }
    return tempArray2;
  }
  swapRows(r1, r2) {
    let tempRow = this.matrix[r1];
    this.matrix[r1] = this.matrix[r2];
    this.matrix[r2] = tempRow;
  }
  scaleRow(row, scalar) {
    for (let i = 0; i < this.columns; i++) {
      this.matrix[row][i] *= scalar;
    }
  }
  getScale(scalar) {
    let tempArray = new Array(this.rows);
    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i] = new Array(this.columns);
      for (let j = 0; j < tempArray[i].length; j++) {
        tempArray[i][j] = this.getElement(i, j) * scalar;
      }
    }
    return getScale;
  }
  scale(scalar) {
    this.matrix = this.getScale(scalar);
  }
  //row 1 is added to row 2. row 1 stays intact
  addRows(r1, r2) {
    for (let i = 0; i < this.columns; i++) {
      this.matrix[r2][i] += this.matrix[r1][i];
    }
  }
  addRowsWithScalar(r1, r2, r1scalar) {
    for (let i = 0; i < this.columns; i++) {
      this.matrix[r2][i] += r1scalar * this.matrix[r1][i];
    }
  }
  rowReduce() {
    this.matrix = this.getRowReduce();
  }
  getRowReduce() {
    let tempArray = new Array(this.rows);
    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i] = new Array(this.columns);
      for (let j = 0; j < tempArray[i].length; j++) {
        tempArray[i][j] = this.getElement(i, j);
      }
    }
    let tempMatrix = new Matrix(tempArray);
    //`noPivot` will keep track of the rows that can still be modified because there is not a guarenteed pivot in them yet. As rows are reduced, they will be removed from this array.
    let noPivot = new Array(tempMatrix.getRows());
    for (let i = 0; i < noPivot.length; i++) {
      noPivot[i] = i;
    }
    //loops top to bottom through each column looking for leading non 0s in a row that is still in noPivot
    for (let i = 0; i < tempMatrix.getColumns(); i++) {
      for (let j = 0; j < tempMatrix.getRows(); j++) {
        //does a row reduction operation for all non pivot rows, then exits the j-loop
        if (tempMatrix.getElement(j, i) !== 0 && noPivot.indexOf(j) !== -1) {
          tempMatrix.scaleRow(j, 1 / (tempMatrix.getElement(j, i)));
          for (let k = 0; k < tempMatrix.getRows(); k++) {
            //adding rows is wonky
            if (k !== j && noPivot.indexOf(k) != -1) {
              //scales and adds the new pivot row to all other rows that arent pivots
              tempMatrix.addRowsWithScalar(j, k, -1 * tempMatrix.getElement(k, i));
            }
          }
          //removes row j from the noPivot array
          noPivot.splice(noPivot.indexOf(j), 1);
          j = 1000000;
        }

      }
    }
    //creating the return array because the matrix is not being updated in this method
    let tempArray2 = new Array(tempMatrix.getRows());
    for (let i = 0; i < tempArray2.length; i++) {
      tempArray2[i] = new Array(tempMatrix.getColumns());
      for (let j = 0; j < tempArray2[i].length; j++) {
        tempArray2[i][j] = tempMatrix.getElement(i, j);
        //this if statement is the only way to get rid of the -0's
        if (tempMatrix.getElement(i, j) === 0)
          tempArray2[i][j] = 0;
      }
    }
    return tempArray2;
  }
  rref() {
    this.matrix = this.getRREF();
  }
  getRREF() {
    let tempArray = this.getRowReduce();
    let tempMatrix = new Matrix(tempArray);
    //swap rows into the correct order
    let pivots = tempMatrix.getPivotRows();
    let leadingZeros = new Array(tempMatrix.getRows());
    for (let i = 0; i < leadingZeros.length; i++) {
      let zeroCount = 0;
      for (let j = 0; j < tempMatrix.getColumns(); j++) {
        if (tempMatrix.getElement(i, j) === 0)
          zeroCount++;
        else
          j = 1000000;
      }
      leadingZeros[i] = zeroCount;
    }
    let alreadyUsed = new Array(leadingZeros.length);
    for (let i = 0; i < tempMatrix.getRows(); i++) {
      let lowestZeros = leadingZeros[i];
      let lowestIndex = i;
      for (let j = 0; j < leadingZeros.length; j++) {
        if (leadingZeros[j] < lowestZeros && alreadyUsed.indexOf(j) === -1) {
          lowestZeros = leadingZeros[j];
          lowestIndex = j;
        }
      }
      alreadyUsed.push(i);
      tempMatrix.swapRows(i, lowestIndex);
    }
    //reduces down to rref form
    for (let i = tempMatrix.getRows() - 1; i >= 0; i--) {
      for (let j = 0; j < tempMatrix.getColumns(); j++) {
        if (tempMatrix.getElement(i, j) !== 0) {
          for (let k = i - 1; k >= 0; k--) {
            tempMatrix.addRowsWithScalar(j, k, -1 * tempMatrix.getElement(k, j) / tempMatrix.getElement(i, j));
          }
          j = 1000000;
        }
      }
    }
    //returner array
    let tempArray2 = new Array(tempMatrix.getRows());
    for (let i = 0; i < tempArray2.length; i++) {
      tempArray2[i] = new Array(tempMatrix.getColumns());
      for (let j = 0; j < tempArray2[i].length; j++) {
        tempArray2[i][j] = tempMatrix.getElement(i, j);
      }
    }
    return tempArray2;
  }
  augment(matrixB) {
    this.matrix = this.getAugment(matrixB);
    this.updateRC();
  }
  getAugment(matrixB) {
    if (this.getRows() !== matrixB.getRows())
      return null;
    let tempArray = new Array(this.getRows());
    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i] = new Array(this.getColumns() + matrixB.getColumns());
    }
    for (let i = 0; i < tempArray.length; i++) {
      for (let j = 0; j < tempArray[i].length; j++) {
        if (j < this.getColumns())
          tempArray[i][j] = this.getElement(i, j);
        else
          tempArray[i][j] = matrixB.getElement(i, j - this.getRows());
      }
    }
    return tempArray;
  }
  pow(power) {
    this.matrix = this.getPow(power);
  }
  getPow(power) {
    if (this.isSquare() === false)
      return null;
    let number = power;
    let tempArray = new Array(this.getRows());
    for (let i = 0; i < this.getRows(); i++) {
      tempArray[i] = new Array(this.getColumns());
      for (let j = 0; j < this.getColumns(); j++) {
        tempArray[i][j] = this.getElement(i, j);
      }
    }
    let tempMatrix = new Matrix(tempArray);
    if (number === 0)
      return Matrix.getIdentityMatrix(this.getRows());
    while (number > 1) {
      tempMatrix.multiply(this);
      number--;
    }
    let tempArray2 = new Array(this.getRows());
    for (let i = 0; i < tempArray2.length; i++) {
      tempArray2[i] = new Array(this.getColumns());
      for (let j = 0; j < tempArray2[i].length; j++) {
        tempArray2[i][j] = tempMatrix.getElement(i, j);
      }
    }
    return tempArray2;
  }
	getLFactor(){
		let ops= this.getOperations();
    let opsSpot=0;
    let tempArray = new Array(this.rows);
    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i] = new Array(this.rows);
    }
    
    for (let b = 0; b < tempArray.length; b++) {
      for (let c = 0; c < tempArray[b].length; c++) {
        if(c==b){
          tempArray[b][c]=1;
        } else if(c>b) {
          tempArray[b][c] = 0;
        } else {
          tempArray[b][c] = ops[opsSpot];
          opsSpot++;
        }
      }
    }
    return tempArray;
	}
	getUFactor(){
    
  if (this.getRows() > this.getColumns()) {
      return null;
    }
    for (let x= 0; x<this.columns-1; x++){
      if (this.getElement(0,x)==0){
        return null;
      }
    }
    let opLength = 0;
    //finds the amount of values needed to change to 0
    for (let x = this.rows; x >= 1; x--) {
      opLength += (x - 1);
    }
    let operations = new Array(opLength); //used to get L

    //declares the matrix U
    let tempArray = new Array(this.rows);
    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i] = new Array(this.columns);
      for (let j = 0; j < tempArray[i].length; j++) {
        tempArray[i][j] = this.getElement(i, j);
      }    
    }
    //reduction 
    let col = 0;
    let tempCol = 0;
    let op = 0;
    let opSpot = 0;

    for (let i = 0; i< this.columns; i++){

      for (let j = col+1; j<this.rows; j++){
        op = tempArray[j][i]/tempArray[i][i];
        operations[opSpot]=op;

        for (let k = 0; k<tempArray[j].length; k++){
          
          tempArray[j][k]=tempArray[j][k]-(op*tempArray[i][k]);
          tempCol++
        }
        tempCol=0;
        opSpot++
      }
      col++;
      tempCol=0;
    }
    return tempArray;
	}
	getOperations(){
		if (this.getRows() > this.getColumns()) {
      return null;
    }
    for (let x= 0; x<this.columns-1; x++){
      if (this.getElement(0,x)==0){
        return null;
      }
    }
    let opLength = 0;
    //finds the amount of values needed to change to 0
    for (let x = this.rows; x >= 1; x--) {
      opLength += (x - 1);
    }
    let operations = new Array(opLength); //used to get L

    //declares the matrix U
    let tempArray = new Array(this.rows);
    for (let i = 0; i < tempArray.length; i++) {
      tempArray[i] = new Array(this.columns);
      for (let j = 0; j < tempArray[i].length; j++) {
        tempArray[i][j] = this.getElement(i, j);
      }
    }
    //reduction 
    let col = 0;
    let tempCol = 0;
    let op = 0;
    let opSpot = 0;

    for (let i = 0; i< this.columns; i++){

      for (let j = col+1; j<this.rows; j++){
        op = tempArray[j][i]/tempArray[i][i];
        operations[opSpot]=op;

        for (let k = 0; k<tempArray[j].length; k++){
          
          tempArray[j][k]=tempArray[j][k]-(op*tempArray[i][k]);
          tempCol++
        }
        tempCol=0;
        opSpot++
      }
      col++;
      tempCol=0;
    }
    return operations;
	}
	setMatrix(newMatrix){
		//newMatrix is a 2d array
		this.matrix = newMatrix;
		this.updateRC();
	}
	setColumns(numCols){
		let tempArray = new Array(this.getRows());
		for(let i=0; i<tempArray.length; i++){
			tempArray[i] = new Array(numCols);
			for(let j=0; j<tempArray[i].length; j++){
				if(j >= this.getColumns()) tempArray[i][j] = 0;
				else tempArray[i][j] = this.getElement(i,j);
			}
		}
		this.matrix = tempArray;
		this.updateRC();
	}
	setRows(numRows){
		let tempArray = new Array(numRows);
		for(let i=0; i<tempArray.length; i++){
			tempArray[i] = new Array(this.getColumns());
			for(let j=0; j<tempArray[i].length; j++){
				if(i >= this.getRows()) tempArray[i][j] = 0;
				else tempArray[i][j] = this.getElement(i,j);
			}
		}
		this.matrix = tempArray;
		this.updateRC();
	}
}