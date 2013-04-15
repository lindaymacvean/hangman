//note: this whole thing could be redefined as a module with a single object footprint.


var hangman = function() {
	//4 variables defined at beginning block
	var theWord = prompt("Please enter your word, or just hit return for a random word").toUpperCase(); //chained functions which passes the object
	var currentImage = 1;
	var word;
	var remainingLettres;
	var secret;
	
	
	//an internal method that gets the word from words array defined in words.js
	var getWord = function(len) {
		while (true) {
			var theWord = words[Math.floor(Math.random() * words.length)];
			if (theWord.length === len) {
				return theWord;
			}
		}
	};
	
	//a variable set to user input which is then used as argument an argument in theWord function which invokes the above getWord function. note: it is best practice to define all variables at the top of the scope within which it will be operating
	if (!theWord) {
		var i = 0;
		for (each in words) { each.length > i ? i+=1 : i = i ; };
		i = Math.floor(Math.random() * i);
		theWord = getWord(i);//theWord length is randomly set
	}
	
	return {
		//setup method which can be fed theWord
		setup: function(theWord) {
			remainingLettres = theWord;
			secret = word.replace(/./g, '_'); //secret is set to blanks
			$('#secret').text(secret); //set the contents of #secret node to secret string.
		},
		
		//modify the global String object with a method to be able to replace a character at an index position. Kind of like a splice method. Note: NEEDS COLLISION PROTECTION from other libraries!
		if(!String.prototype.replaceAt) {
			String.prototype.replaceAt = function(index, character) {
				return this.substr(0, index) + character + this.substr(index+character.length);
			} 
		}
		
		//a long function which processes the user input and compares it to theWord
		function processLettre(lettre) {
			var found = false; //this variable is reset everytime it is invoked by a click event
			
			//loops through remainingLettres (defined in setup as string of theWord)
			for (var i = 0 ; i < remainingLettres.length ; i++) {
				if (remainingLettres.charAt(i) === lettre) { //if we find the letter then...
					remainingLettres = remainingLettres.replaceAt(i, '_'); //replace the lettre in theWord at index i with '_'
					secret = secret.replaceAt(i, lettre); //replace the lettre in secret at index i with the lettre.
					found = true; 
				}
			}
			
			if (found) {
				$('#secret').text(secret);
				if (secret.indexOf('_') === -1) { //if there are no more '_' in secret then user has won
					alert('You won!');
					location.reload(); //note: there could be a delay here
				}
			} else { //else increment the hangman image
				currentImage++;
				var imageId = '#hangman_' + currentImage;
				$(imageId).fadeTo(300, 1.0, function() {
					if (currentImage === 7) { //if full hangman then the user has lost. note: this could also be completed with a var to count the number of '_' in secret
						$('#secret').text(word);
						alert('You lost!');
						location.reload();
					}
				});
			}
		}
		
		//Next we need to capture which letter is being clicked/tapped
		//jquery selector for the lettres class, attaching an event to each of the nodes
		$('.lettres span').click(function(event) {
			var lettre = event.target.innerText; //capture the letter clicked in a var
			$(event.target).addClass('disabled'); //disable the letter just clicked
			$(event.target).unbind('click'); //once event captured unbind the click event
			processLettre(this.innerText); //invoke processLettre above
		});
		
		setup(theWord); //initialises the function by invoking setup.
	};

}

$(document).ready(hangman()); //note: this whole function could be self invoking instead of the instantiation type invocation