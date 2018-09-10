function Terminal() {

	this.term = document.getElementById("terminal");
	this.inside = null;
	this.color = "light-gray";
	this.colorList = ["black",
					"dark-gray",
					"light-gray",
					"white",
					"red",
					"green",
					"yellow",
					"blue",
					"magenta",
					"cyan",
					"light-red",
					"light-green",
					"light-yellow",
					"light-blue",
					"light-magenta",
					"light-cyan"];

	this.print = function(str) {
		str = String(str);
		if (str) {
			for (let i = 0; i < str.length; i++) {
				let c = str.charAt(i);
				if (c === '\n') {
					this.newLine();
				}
				else {
					this.inside.textContent += c;
				}
			}
		}
	}

	this.println = function(str) {
		this.print(str);
		this.newLine();
	}

	this.newLine = function() {

		if (this.inside != null && this.inside.textContent === "") {
			this.inside.textContent = "\n";
		}

		let span = document.createElement("SPAN");
		span.classList.add("l");
		span.classList.add(this.color);

		this.term.appendChild(span);
		this.inside = span;
	}

	this.setColor = function(color){

		let sanatized = color.trim().toLowerCase().replace("_","-");

		if(this.colorList.indexOf(sanatized) != -1) {

			this.color = sanatized;

			if (this.inside.textContent === "") {
				if(this.inside.classList.contains("l")){
					this.inside.className = "";
					this.inside.classList.add("l");
					this.inside.classList.add(sanatized);
				}
				else {
					let parent = this.inside.parentNode;
					this.inside.remove();
					this.inside = parent;
				}
			}
			else {
				let span = document.createElement("SPAN");
				span.classList.add(this.color);

				this.inside.appendChild(span);
				this.inside = span;
			}

		}

	}


	this.newLine();
}

let t = new Terminal();

t.setColor("light-yellow");
t.print("╔═════════════════════╗\n║");
t.setColor("light-cyan");
t.print(" ☺ Henrique Colini ☺ ")
t.setColor("light-yellow");
t.print("║\n╚═════════════════════╝\n\n");

t.setColor("light-green");
t.print("Welcome to my home page!\n\n");
t.setColor("light-gray");
t.println("You can print in this terminal.\n");
t.println("1. Open the browser terminal (F12,CTRL+i)");
t.println('2. t.print(message) will print a message');
t.println('3. t.println(message) will print a message and include a \\n');
t.println('4. t.newLine() will print a \\n');
t.println('5. t.setColor() will change the current color');
