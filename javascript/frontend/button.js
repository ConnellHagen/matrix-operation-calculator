class Button {
	//Number, Number, Number, Number, String, Function, Boolean
	constructor(x, y, width, height, color1, color2, text, action, isTogglable, color3) {
		//defining the border of where the button is
		this.x = x;
		this.endX = x + width;
		this.y = y;
		this.endY = y + height
		this.width = width;
		this.height = height;

		this.text = text;

		//action for when the button is pushed
		this.action = action;

		//main color the button displays as
		this.color1 = color1;
		//color the button displays when pushed
		this.color2 = color2;
		//passive display color for when a togglable button is currently active
		this.color3 = color3;

		//which color the button *currently* displays as, will update as mouse presses it
		this.currentColor = this.color1;
		this.isPushed = false;

		this.isTogglable = isTogglable;
		//will only ever be true for togglable settings like USE/EDIT
		this.isActive = false;
	}
	display() {
		push();
		fill(this.currentColor);
		rect(this.x, this.y, this.width, this.height);

		fill(0);
		textSize(HEIGHT / 25);
		textAlign(CENTER, CENTER);
		text(this.text, (this.x + this.endX) / 2, (this.y + this.endY) / 2);
		pop();
	}
	toggleColor() {
		if (this.isPushed)
			this.currentColor = this.color2;
		else
			this.currentColor = this.color1;
		if (this.isActive)
			this.currentColor = this.color3;
	}
	//updates the color schemes for buttons that are togglable
	updateTogglableColors() {
		if (!this.isTogglable)
			return;
		if (this.isActive)
			this.currentColor = this.color3;
		else
			this.currentColor = this.color1;
	}
	setActivity(active) {
		this.isActive = active;
	}
	mousePressed(x, y) {
		if (x > this.x && x < this.endX && y > this.y && y < this.endY) {
			this.isPushed = true;
			this.toggleColor();
		}
	}
	mouseReleased(x, y) {
		if (this.isPushed) {
			this.action();
			this.isPushed = false;
			this.toggleColor();
		}
	}
}