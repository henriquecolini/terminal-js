function Terminal(printDelay=5,printStep=5) {

	this.term = document.getElementById("terminal");
	this.inside = this.term;
	this.caret = null;
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
	this.commandQueue = [];
	this.printDelay = printDelay>=0?printDelay:0;
	this.printStep = printStep>=1?printStep:1;
	this.boxStyles = [];

	this.boxStyles['template'] = ['A','B','Q','W','C','D'];
	this.boxStyles['line'] = ['┌','┐','├','┤','└','┘'];

	this.runQueue = async function(cmd) {

		if (cmd) {

			if (cmd.type === 'print') {
				str = cmd.str;
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

					let cleared = false;

					for (let i = 0; !cleared && i < values.length; i++) {
						if (typeof values[i] === 'string') {
							values[i] = values[i].replace('@@{','@{');
							for (let j = 0; !cleared && j < values[i].length; j++) {
								if (this.printDelay > 0 && j%this.printStep==0) {
									await new Promise(resolve => setTimeout(resolve, this.printDelay));
								}
								if (this.commandQueue.length > 0) {
									this.inside.innerText += values[i].charAt(j);
								}
								else {
									cleared = true;
								}
							}
						}
						else {
							this.asyncSetColor(values[i].color);
						}
					}

				}

				window.scrollTo(0,document.body.scrollHeight);
			}

			else if (cmd.type === 'color') {
				this.asyncSetColor(cmd.color);
			}

			else if (cmd.type === 'clear') {
				this.asyncClear();
			}

			this.commandQueue.shift();

			if (this.commandQueue.length > 0) {
				this.runQueue(this.commandQueue[0]);
			}

		}

	}

	this.addToQueue = function(cmd){
		this.commandQueue.push(cmd);
		if (this.commandQueue.length == 1) {
			this.runQueue(cmd);
		}
	}

	this.print = function(str) {
		this.addToQueue({type:'print',str:str});
	}

	this.println = function(str) {
		this.print(str+'\n');
	}

	this.asyncSetColor = function(color){

		let sanatized;

		if (!isNaN(color)) {
			sanatized = this.colorList[Number(color)];
		}
		else {
			sanatized = color.trim().toLowerCase().replace("_","-");
		}

		if(this.colorList.indexOf(sanatized) != -1) {

			if (this.inside !== this.term && this.inside.textContent === "") {
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

	this.setColor = function(color){
		this.addToQueue({type:'color',color:color});
	}

	this.asyncClear = function(){
		while(this.term.lastChild){
			this.term.removeChild(this.term.lastChild);
		}
		this.createCaret();
		this.setColor("light-gray");
	}

	this.clearAll = function(){
		this.commandQueue = [];
		this.asyncClear();
	}

	this.clear = function(){
		this.addToQueue({type:'clear'});
	}

	this.createCaret = function() {
		this.caret = document.createElement("SPAN");
		this.caret.id = "caret";
		this.caret.textContent = '█';
		this.term.appendChild(this.caret);
	}

	this.printBox = function(strings,boxColor,boxStyle){
		if (strings) {

			if (typeof strings === 'string') {
				strings = [strings];
			}

			if (typeof boxStyle === 'string') {
				boxStyle = this.boxStyles[boxStyle];
			}

			let str = '';
			let biggest = 0;

			for (let i = 0; i < strings.length; i++) {
				let len = strings[i].replace(/(?<!@)\@\{((([a-z]*|[A-Z]*|[0-9]*|\-))*)\}/gm,'').length
				biggest = len > biggest ? len : biggest;
			}

			str+='\n@{'+boxColor+'}';

			str+=boxStyle[0];

			for (let i = 0; i < biggest; i++) {
				str+='-';
			}

			str+=boxStyle[1]+'\n';

			for (let i = 0; i < strings.length; i++) {
				str+='|';

				for (var j = 0; j < Math.ceil((biggest-strings[i].length)/2); j++) {
					str+=' ';
				}

				str+='@{light-gray}'+strings[i];

				for (var j = 0; j < Math.floor((biggest-strings[i].length)/2); j++) {
					str+=' ';
				}

				str+='@{'+boxColor+'}|\n';
				if (i!=strings.length-1) {
					str+=boxStyle[2];
					for (let i = 0; i < biggest; i++) {
						str+='-';
					}
					str+=boxStyle[3]+'\n';
				}
			}

			str+=boxStyle[4];

			for (let i = 0; i < biggest; i++) {
				str+='-';
			}

			str+=boxStyle[5]+'\n';

			this.print(str);

		}
	}

	this.setColor("light-gray");
	this.createCaret();
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
t.println("1. Open the developer console");
t.println('2. t.print(message) will print a message');
t.println('3. t.println(message) will print a message and include a \\n');
t.println('4. t.setColor() will change the current color');
t.println('5. Additionally, you can include @@{color-codes} on your prints (works with numbers too)\n');

for (let i = 0; i < t.colorList.length; i++) {
	t.println('@{'+t.colorList[i]+'}' + i + ' - '+t.colorList[i]);
}
