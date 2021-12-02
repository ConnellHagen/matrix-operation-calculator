class OperationList{
	constructor(){
		this.opList = new Array(0);
	}
	pushItem(item){
		this.opList.push(item);
	}
	popItem(){
		this.opList.pop();
	}
	getType(i){
		return this.opList[i].getType();
	}
	getValue(i){
		return this.opList[i].getValue();
	}
	evaluateList(){
		this.combineDigits();
		//continues to go through the opList performing parenthesi reduction until it cannot anymore
		
		let isF = true;
		while(isF){
			for(let i=0; i<=this.getOpListLength(); i++){
				if(i === this.getOpListLength()){
					isF = false;
				}
				else{
					let tempVal = this.opList[i].getValue();
					if((tempVal === "Transpose" || tempVal === "Invert" || tempVal === "Transform" || tempVal === "Determinant" || tempVal === "RowRed" || tempVal === "RREF" || tempVal === "LFactor" || tempVal === "UFactor") && this.opList[i+1].getValue() === "(")
						i+=1000;
				}
			}
			this.evaluateF();
		}

		let isP = true;
		while(isP){
			for(let i=0; i<=this.getOpListLength(); i++){
				if(i === 0){
					if(this.opList[i].getValue() === "(")
						i+=1000;
				}
				else{
					let tempVal = this.opList[i-1].getValue();
					if(i === this.getOpListLength()){
						isP = false;
					}
					else{
						if(this.opList[i].getValue() === "(" && !(tempVal === "Transpose" || tempVal === "Invert" || tempVal === "Transform" || tempVal === "Determinant" || tempVal === "RowRed" || tempVal === "RREF" || tempVal === "LFactor" || tempVal === "UFactor"))
							i+=1000;
					}
				}
				
			}
			this.evaluateP();
		}
		
		let isE = true;
		while(isE){
			for(let i=0; i<=this.getOpListLength(); i++){
				if(i === this.getOpListLength()){
					isE = false;
				}
				else{
					if(this.opList[i].getValue() === "^")
						i+=1000;
				}
			}
			this.evaluateE();
		}
		//continues to go through the opList performing multiplication and division until it cannot anymore
		let isMD = true;
		while(isMD){
			for(let i=0; i<=this.getOpListLength(); i++){
				if(i === this.getOpListLength()){
					isMD = false;
				}
				else{
					if(this.opList[i].getValue() === "x" || this.opList[i].getValue() === "/")
						i+=1000;
				}
			}
			this.evaluateMD();
		}

		//continues to go through the opList performing addition and subtracting until it cannot anymore
		let isAS = true;
		while(isAS){
			for(let i=0; i<=this.getOpListLength(); i++){
				if(i === this.getOpListLength()){
					isAS = false;
				}
				else{
					if(this.opList[i].getValue() === "+" || this.opList[i].getValue() === "-")
						i+=1000;
				}
			}
			this.evaluateAS();
		}

		switch(this.getValue(0)){
			case "A": case "B": case "C": case "D": case "E": case "F": case "G": case "H": case "I": case "J": case "K": case "L":
			this.pushItem(new OpListChar(getLetterMatrix(this.getValue(0)), "matrix"));
			this.opList.shift();
			break;
		}

	}
	combineDigits(){
		for(let i=0; i<this.getOpListLength()-1; i++){
			if(this.opList[i].getType() === "num" && this.opList[i+1].getType() === "num" || this.opList[i].getType() === "num" && this.opList[i+1].getValue() === "." || this.opList[i].getValue() === "." && this.opList[i].getType() === "num"){
				this.opList.splice(i, 2, new OpListChar(this.opList[i].getValue().toString() + this.opList[i+1].getValue().toString(),"num"));
				i--;
			}
		}
	}
	//P[F]EMDAS
	evaluateP(){
		for(let i=0; i<this.getOpListLength(); i++){
			let parenth = new OperationList();
			if(this.getValue(i) === "("){
				let layersDeep = 0;
				for(let j=i+1; j<this.getOpListLength(); j++){
					if(this.getValue(j) === "(") layersDeep++;
					if(this.getValue(j) === ")"){
						if(layersDeep === 0) j+= 100000;
						else{
							layersDeep--;
							parenth.pushItem(new OpListChar(this.getValue(j), this.getType(j)));
						} 
					} 
					else parenth.pushItem(new OpListChar(this.getValue(j), this.getType(j)));
				}

				let tempVal = parenth.getOpListLength();
				parenth.evaluateList();
				this.opList.splice(i, 2 + tempVal, new OpListChar(parenth.getValue(0), parenth.getType(0)));
				
			}
		}
	}
	evaluateF(){
		//evaluate the parenthesis without removing them
		for(let i=0; i<this.opList.length; i++){
			if(this.getValue(i) === "("){
				let layersDeep = 0;
				let evalList = new OperationList();
				for(let j=i+1; j<this.opList.length; j++){
					if(this.getValue(j) === "("){
						layersDeep++;
						evalList.pushItem(new OpListChar(this.getValue(j), this.getType(j)));
					}
					else if(this.getValue(j) === ")"){
						if(layersDeep === 0) j += 100000;
						else{
							layersDeep--;
							evalList.pushItem(new OpListChar(this.getValue(j), this.getType(j)));
						}
					}
					else{
						evalList.pushItem(new OpListChar(this.getValue(j), this.getType(j)));
					}
				}
				let tempLength = evalList.getOpListLength();
				evalList.evaluateList();
				this.opList.splice(i+1, tempLength, new OpListChar(evalList.getValue(0), evalList.getType(0)));
			}
		}
		//evaluate function 
		for(let i=0; i<this.opList.length; i++){
			if(this.getValue(i) === "("){
				let tempMatrix = this.getValue(i+1);
				switch(this.getValue(i-1)){

					case "Transpose":
						this.opList.splice(i-1, 4, new OpListChar(new Matrix(tempMatrix.getTranspose()), "matrix"));
					break;
					case "Inverse":
						console.log(tempMatrix);
						this.opList.splice(i-1, 4, new OpListChar(new Matrix(tempMatrix.getInverse()), "matrix"));
					break;
					/*case "Transform":
					break;*/
					case "Determinant":
						this.opList.splice(i-1, 4, new OpListChar(new Matrix([[tempMatrix.getDeterminant()]]), "matrix"));
					break;
					case "RowRed":
						this.opList.splice(i-1, 4, new OpListChar(new Matrix(tempMatrix.getRowReduce()), "matrix"));
					break;
					case "RREF":
						this.opList.splice(i-1, 4, new OpListChar(new Matrix(tempMatrix.getRREF()), "matrix"));
					break;
					case "LFactor":
						this.opList.splice(i-1, 4, new OpListChar(new Matrix(tempMatrix.getLFactor()), "matrix"));
					break;
					case "UFactor":
						this.opList.splice(i-1, 4, new OpListChar(new Matrix(tempMatrix.getUFactor()), "matrix"));
					break;
					
				}
			}
		}
	}
	evaluateE(){
		for(let i=0; i<this.opList.length; i++){
			//discover what the string being used as an exponent is
			let exponent = "";
			if(this.getValue(i) === "^"){
				//no putting exponents on things that shouldnt have exponents
				if(this.getType(i-1) === "operation" || this.getType(i-i) === "symbol") return null;

				for(let j=i+1; j<this.opList.length; j++){
					//no stuff in the exponents that shouldnt be there
					if(this.getType(j) === "matrix" || (this.getType(j) === "operation" && this.getValue(j) !== "+" && this.getValue(j) !== "-" && this.getValue(j) !== "*" && this.getValue(j) !== "/")) return null;
					//stop adding to the exponent string if there is a stop character
					if(this.getValue(j) === "v") j += 100000;
					else exponent += this.getValue(j).toString();
				}

				let tempVal;
				if(this.getType(i-1) === "num"){
					//probably will need to evaluate exponent like a parenthesi here
					tempVal = Math.pow(this.getValue(i-1), Number(exponent));
					this.opList.splice(i-1, 3 + exponent.length, new OpListChar(tempVal, "num"));
				}

				if(this.getType(i-1) === "matrix"){
					//probably will need to evaluate exponent like a parenthesi here
					tempVal = this.getValue(i-1).getPower(Number(exponent));
					this.opList.splice(i-1, 3 + exponent.length, new OpListChar(tempVal, "matrix"));
				}
			}

		}
	}
	evaluateMD(){
		for(let i=0; i<this.getOpListLength(); i++){
			//seeing where there is multiplication or division
			if(this.getValue(i) === 'x' || this.getValue(i) === '/'){
				//The operator cannot be located on either side.
				if(i === 0) return null;
				if(i === this.getOpListLength() - 1) return null;

				let val1;
				let val2;
				if(this.getType(i-1) === "matrix"){
					switch(this.getValue(i-1)){
						case "A": case "B": case "C": case "D": case "E": case "F": case "G": case "H": case "I": case "J": case "K": case "L":
						val1 = getLetterMatrix(this.getValue(i-1));
						break;
						default:
						val1 = this.getValue(i-1);
						break;
					}
				}
				if(this.getType(i+1) === "matrix"){
					switch(this.getValue(i+1)){
						case "A": case "B": case "C": case "D": case "E": case "F": case "G": case "H": case "I": case "J": case "K": case "L":
						val2 = getLetterMatrix(this.getValue(i+1));
						break;
						default:
						val2 = this.getValue(i+1);
						break;
					}
				}
				console.log(val1, val2);
				let tempVal;
				//if multiplication
				if(this.getValue(i) === "x"){

					if(this.getType(i-1) === "num" && this.getType(i+1) === "num"){
						tempVal = this.getValue(i-1) * this.getValue(i+1);
						this.opList.splice(i-1, 3, new OpListChar(tempVal, "num"));		
					}

					else if(this.getType(i-1) === "num" && this.getType(i+1) === "matrix"){
						tempVal = new Matrix(val2.getScale(i-1));
						this.opList.splice(i-1, 3, new OpListChar(tempVal, "matrix"));
					}

					else if(this.getType(i-1) === "matrix" && this.getType(i+1) === "num"){
						tempVal = new Matrix(val1.getScale(i+1));
						this.opList.splice(i-1, 3, new OpListChar(tempVal, "matrix"));
					}

					else if(this.getType(i-1) === "matrix" && this.getType(i+1) === "matrix"){
						tempVal = new Matrix(val1.getProduct(val2));
						this.opList.splice(i-1, 3, new OpListChar(tempVal, "matrix"));		
					}

				}
				//if division
				else if(this.getValue(i) === "/"){

					if(this.getType(i-1) === "num" && this.getType(i+1) === "num"){
						tempVal = this.getValue(i-1) / this.getValue(i+1);
						this.opList.splice(i-1, 3, new OpListChar(tempVal, "num"));		
					}

					else if(this.getType(i-1) === "matrix" && this.getType(i+1) === "num"){
						tempVal = new Matrix(this.getValue(i-1).getScale(this.getValue(i+1)));
						this.opList.splice(i-1, 3, new OpListChar(tempVal, "matrix"));
					}

					else return null;
					
				}
				
			}

		}
	}
	evaluateAS(){
		for(let i=0; i<this.getOpListLength(); i++){
			//seeing where there is multiplication or division
			if(this.getValue(i) === '+' || this.getValue(i) === '-'){
				//The operator cannot be located on either side.
				if(i === 0) return null;
				if(i === this.getOpListLength() - 1) return null;
				
				//need to account for the possibility of letter represented matrices
				let val1;
				let val2;
				if(this.getType(i-1) === "matrix"){
					switch(this.getValue(i-1)){
						case "A": case "B": case "C": case "D": case "E": case "F": case "G": case "H": case "I": case "J": case "K": case "L":
						val1 = getLetterMatrix(this.getValue(i-1));
						break;
						default:
						val1 = this.getValue(i-1);
						break;
					}
				}
				if(this.getType(i-1) === "matrix"){
					switch(this.getValue(i+1)){
						case "A": case "B": case "C": case "D": case "E": case "F": case "G": case "H": case "I": case "J": case "K": case "L":
						val2 = getLetterMatrix(this.getValue(i+1));
						break;
						default:
						val2 = this.getValue(i+1);
						break;
					}
				}
				let tempVal;
				//if addition
				if(this.getValue(i) === "+"){

					if(this.getType(i-1) === "num" && this.getType(i+1) === "num"){
						tempVal = Number(this.getValue(i-1)) + Number(this.getValue(i+1));
						this.opList.splice(i-1, 3, new OpListChar(tempVal, "num"));		
					}

					else if(this.getType(i-1) === "matrix" && this.getType(i+1) === "matrix"){
						tempVal = new Matrix(val1.getAdd(val2));
						//console.log(tempVal);
						this.opList.splice(i-1, 3, new OpListChar(tempVal, "matrix"));		
					}

					else return null;

				}
				//if subtraction
				else if(this.getValue(i) === "-"){

					if(this.getType(i-1) === "num" && this.getType(i+1) === "num"){
						tempVal = val1 - val2;
						this.opList.splice(i-1, 3, new OpListChar(tempVal, "num"));		
					}

					else if(this.getType(i-1) === "matrix" && this.getType(i+1) === "matrix"){
						tempVal = new Matrix(val1.getSubtract(val2));
						this.opList.splice(i-1, 3, new OpListChar(tempVal, "matrix"));
					}
					
					else return null;
					
				}
				
			}

		}
	}
	getOpListLength(){
		return this.opList.length;
	}
}

//characters for usage as parameters
class OpListChar {
	constructor(value, type) {
		this.value = value;
		//types: num{0,1,2,3,4,5,6,7,8,9,}, operation{+,-,x,/,Transpose,Invert,Transform,Determinant,RowRed,RREF,LFactor,UFactor}, symbol{(,),v,^,.} matrix{A,B,C,D,E,F,G,H,I,J,K,L}
		this.type = type;
	}
	getType() {
		return this.type;
	}
	getValue() {
		return this.value;
	}
}