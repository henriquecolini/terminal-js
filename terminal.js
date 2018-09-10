function Terminal() {

	this.term = document.getElementById("terminal");
	this.inside = this.term;
	this.caret = null;
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

			let regex = /(?<!@)\@\{((([a-z]*|[A-Z]*|[0-9]*|\-))*)\}/gm;
			let values = [];
			let colorMatches = [];

			while ((match = regex.exec(str)) != null) {
				colorMatches.push(match);
			}

			for (let i = 0; i < str.length; i++) {
				for (let j = 0; j < colorMatches.length; j++) {
					if(colorMatches[j].index == i){
						i+= colorMatches[j][0].length;

						let obj = {color:colorMatches[j][0].replace('@{','').replace('}','')};

						values.push(obj);
						// if ((j < colorMatches.length - 1 && colorMatches[j+1].index != i) && i < str.length) {
						// 	values.push('');
						// }
					}
				}
				let c = str.charAt(i);
				if (values.length > 0 && typeof values[values.length-1] === 'string') {
					values[values.length-1] += c;
				}
				else {
					if (c !== '') {
						values.push(c);
					}
				}
			}

			console.log(values);

			for (let i = 0; i < values.length; i++) {
				if (typeof values[i] === 'string') {
					values[i] = values[i].replace('@@{','@{');
					this.inside.textContent += values[i];
				}
				else {
					this.setColor(values[i].color);
				}
			}

		}
	}

	this.println = function(str) {
		this.print(str+'\n');
	}

	this.setColor = function(color){

		let sanatized = color.trim().toLowerCase().replace("_","-");

		if(this.colorList.indexOf(sanatized) != -1) {

			this.color = sanatized;

			if (this.inside != this.term && this.inside.textContent === "") {
				this.inside.className = sanatized;
			}
			else {
				let span = document.createElement("SPAN");
				span.classList.add(sanatized);

				this.term.insertBefore(span,this.caret);
				this.inside = span;
			}

		}

	}

	this.clear = function(){
		while (this.term.lastChild) {
			this.term.removeChild(this.term.lastChild);
		}
		this.inside = this.term;
		this.term.appendChild(this.caret);
	}

	this.caret = document.createElement("SPAN");
	this.caret.id = "caret";
	this.caret.textContent = '█';
	this.term.appendChild(this.caret);

	this.caretState = false;
	setInterval(function(){
		this.caretState = !this.caretState;
		this.caret.textContent = this.caretState ? ' ' : '█';
	},500);

}

let t = new Terminal();

t.setColor("light-yellow");
t.println("╔═════════════════════╗");
t.println("║ @{light-cyan}☺ Henrique Colini ☺ @{light-yellow}║")
t.setColor("light-yellow");
t.println("╚═════════════════════╝\n");

t.print("@{light-green}Welcome to my home page!\n\n");
t.setColor("light-gray");
t.println("You can print in this terminal!\n");
t.println("1. Open the browser terminal");
t.println('2. t.print(message) will print a message');
t.println('3. t.println(message) will print a message and include a \\n');
t.println('4. t.setColor() will change the current color');
t.println('5. Additionally, you can include @@{color-codes} on your prints\n');

for (let i = 0; i < t.colorList.length; i++) {
	t.println('@{'+t.colorList[i]+'}'+t.colorList[i]);
}
