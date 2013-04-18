if(typeof Ehangman === 'undefined') { //stop collisions
	try {
		window.Ehangman = function() {
			//4 variables defined at beginning block
			var theWord;
			var currentImage = 1;
			var word;
			var remainingLettres;
			var secret;
			var that = this;
			
			//modify the global String object with a method to be able to replace a character at an index position. Kind of like a splice method.
			if(!String.prototype.replaceAt) {
				String.prototype.replaceAt = function(index, character) {
					return this.substr(0, index) + character + this.substr(index+character.length);
				} 
			}
			
			//a long function which processes the user input and compares it to theWord
			function processLettre(lettre) {
				var found = false; //this variable is reset everytime it is invoked by a click event
				
				//loops through remainingLettres (defined in setup as string of theWord)
				for (var i = 0 ; i < remainingLettres.length ; i+=1) {
					if (remainingLettres.charAt(i) === lettre) { //if we find the letter then...
						remainingLettres = remainingLettres.replaceAt(i, '_'); //replace the lettre in theWord at index i with '_'
						secret = secret.replaceAt(i, lettre); //replace the lettre in secret at index i with the lettre.
						found = true; 
					}
				}
				
				if (found) { //if the letter was found then update #secret onscreen
					$('#secret').text(secret);
					if (secret.indexOf('_') === -1) { //if there are no more '_' in secret then user has won
						alert('You won!');
						setup(); //note: there could be a delay here
					}
				} else { //else increment the hangman image
					currentImage += 1;
					var imageId = '#hangman_' + currentImage;
					$(imageId).fadeTo(300, 1.0, function() {
						if (currentImage === 7) { //if full hangman then the user has lost. note: this could also be completed with a var to count the number of '_' in secret
							$('#secret').text(word);
							alert('You lost!');
							setup();
						}
					}); //end of for-loop
				}
			}
			 
			function setup() { //written as a method which can be reused
			
				//1. SET theWord, remainingLettres, secret and onscreen text #secret
				//if the words array is available offer the user a prompt, if prompt is not set.
				theWord = prompt("Please enter your word, or just hit return for a random word");
				if (words) {
					if(typeof theWord !== 'string') { 
					//if theWord has not been set by prompt then get the word from words array
						theWord = function() {
							var a = 0;
							var i = 0
							for (each in words) { 
								words[each].length > i ? i=words[each].length : i = i; 
							} 
							//shorthand form of conditional, in a loop to find the length of longest word.
							i = Math.floor(Math.random() * i); //set random length no larger than the longest word in words
							while(true) {
								a = Math.floor(Math.random() * words.length);
								if (words[a].length === i) { //if the word length is correct then return the word, else loop
									return words[a];
								}
							}
						}();
					}
				} 
				else { 
					throw { 
						name:'You Don\'t have a word', 
						message:'the Words array is missing' 
					} 
				};
				
				theWord = theWord.toUpperCase(); //set the word to upper case
			
				remainingLettres = theWord;
				secret = theWord.replace(/./g, '_'); //secret is set to blanks
				$('#secret').text(secret); //set the contents of #secret node to secret string.
				
				//2. CAPTURE clicks
				//Next we need to capture which letter is being clicked/tapped
				//jquery selector for the lettres css class, attaching an event to each of the nodes
				$('.lettres span').click(function(event) {
					var lettre = event.target.innerText; //capture the letter clicked in a var
					$(event.target).addClass('disabled'); //disable the letter just clicked
					$(event.target).unbind('click'); //once event captured unbind the click event
					processLettre(this.innerText); //invoke processLettre above
				});
			}
			
			setup(); //invoke the setup immediately
				
			//now return a pointer to processLettre making it a publically accessible function
			return {
				setup: setup,
				processLettre : processLettre
			};
			
		}(); //self invoke Ehangman and return setupr & processLettre as a method
		
	} catch(e) {
		alert(e.name+': '+e.message);
	}
}

