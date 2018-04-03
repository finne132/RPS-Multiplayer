"use strict";

$( document ).ready(function() {
	// Handler for .ready() called.


// -----ID selectors-----ID selectors-----ID selectors-----ID selectors-----ID selectors-----ID selectors-----ID selectors-----

// #maintitle - main title div

// #nameEntry - div containing textbox and submit button for name entry
    // #nameTextBox - text box for name entry 
    // #nameSubmit - submit button for name entry

// #scoreboard - row containing 3 colums: outcome, p1score, and p2score
    // #p1score - player 1's running score display
    // #outcome - outcome of each match display 
    // #p2score - player 2's running score display

// #displaydata - row containing 4 columns for displaying player names and selections
    // #p1choice - player 1's choice display
    // #p2choice - player 2's choice display 
    // #p1name - player 1's name display
    // #p2name - player 2's name display 

// #chat - row containing 2 screen-wide columns for displaying chat and text entry box with submit button
    // #chatdisplay - div where chat is displayed 
    // #chatEntry - div containing textbox and submit button for name entry
        // #chatTextBox - text box for chat entry 
        // #chatSubmit - submit button for chat text

// #foot - selector for the footer

// -----DATABASE STRUCTURE-----DATABASE STRUCTURE-----DATABASE STRUCTURE-----DATABASE STRUCTURE-----DATABASE STRUCTURE-----DATABASE STRUCTURE

// https://rps-multiplayer-cc7bb.firebaseio.com/
    // players >
        // p1 >
            // name
            // win
            // loss
            // tie
        // p2 >
            // name 
            // win
            // loss
            // tie


// logic notes: 
// if outcome is 1 = "player 1 wins"
// if outcome is 2 = "player 2 wins"
// if outcome is 0 = "the result is a tie"

// firebase project configuration settings
var config = {
    apiKey: "AIzaSyClxrsOoB1gRb2q0Cp5moMriuBUd8i9lbY",
    authDomain: "rps-multiplayer-cc7bb.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-cc7bb.firebaseio.com",
    projectId: "rps-multiplayer-cc7bb",
    storageBucket: "rps-multiplayer-cc7bb.appspot.com",
    messagingSenderId: "864869163976"
  };

// Initialize the FireBase Database connection
firebase.initializeApp(config);
console.log("firebase database connection initialized");

const database = firebase.database();
console.log("Local database variable assigned");

// good resource for referencing firebase databases: 
// https://firebase.google.com/docs/reference/js/firebase.database.Reference

// player var objects
let p1 = null;
let p2 = null;

// Store the player names
let p1name = "";
let p2name = "";

// Store the name of the player in the user's browser
let yourPlayerName = "";

// Store the player choices
let p1Choice = "";
let p2Choice = "";

// set the turn variable equal to player 1's turn
let turn = 1;

// listen to the players node of the database to see if anything changes
database.ref("/players/").on("value", function(snapshot) {
    
    // Check to see if player 1 exists in our database - if it does, set variables and display
    // player 1's name and data. If it doesn't exist, display waiting for player 1 
	if (snapshot.child("p1").exists()) {
		console.log("Player 1 exists in the database");

		// set local variables for player 1
		p1 = snapshot.val().p1;
		p1name = p1.name;

		// display player 1's name and score data 
		$("#p1display").text(`${p1name} has ${p1.win} wins ${p1.loss} losses and ${p1.tie} ties`);
    } 

    // what happens if player 1 doesn't exist?
    else {
		console.log("Player 1 does NOT exist in the database");
		p1 = null;
		p1name = "";

		// Display "empty" state for p1 
		$("#p1name").text("Waiting for Player 1...");
		database.ref("/outcome/").remove();
		$("#outcome").html("Rock! Paper! Scissors! Shoot!");
		$("#p2data").html("Wins: 0 Losses: 0 Ties: 0");
    }

    if (snapshot.child("p2").exists()) {
		console.log("Player 2 exists in the database");

		// set local variables for player 1
		p2 = snapshot.val().p2;
		p2name = p2.name;

		// display player 1's name and score data 
		$("#p2display").text(`${p2name} has ${p2.win} wins ${p2.loss} losses and ${p2.tie} ties`);
    } 

    // what happens if player 1 doesn't exist?
    else {
		console.log("Player 2 does NOT exist in the database");
		p2 = null;
		p2name = "";

		// Display "empty" state for p1 
		$("#p2name").text("Waiting for Player 2...");
		database.ref("/outcome/").remove();
		$("#outcome").html("Rock! Paper! Scissors! Shoot!");
		$("#scoreboard").html("Waiting for Players to join");
		$("#p2data").html("Wins: 0 Losses: 0 Ties: 0");
    }
    
    // If both players are now present, it's p1's turn
	if (p1 && p2) {
        console.log("Both players are now present")
		// Update the display with a green border around player 1
		$("#p1display").addClass("yourTurn");

		// Update the center display
		$("#outcome").html("Waiting on " + p1name + " to choose...");
    }

    	// If both players leave the game, empty the chat session
	if (!p1 && !p2) {
		database.ref("/chat/").remove();
		database.ref("/turn/").remove();
		database.ref("/outcome/").remove();
		$("#chatdisplay").empty();
		$("#p1display").removeClass("yourTurn");
		$("#p2display").removeClass("yourTurn");
		$("#outcome").html("Rock! Paper! Scissors! Shoot!");
	}
    
});
// The database is listening for users to disconnect via "child_removed"
// disconnection happens by closing the window or refreshing the page
database.ref("/players/").on("child_removed", function(snapshot) {
	var msg = snapshot.val().name + " has disconnected!";

	// use a unique key for the disconnection chat entry
	var chatKey = database.ref().child("/chat/").push().key;

	// save the disconnection chat entry to the database with the key
	database.ref("/chat/" + chatKey).set(msg);
});

// The database is listening for any new chat messages via "child_added"
// inside of the chat keyvalue pair 
database.ref("/chat/").on("child_added", function(snapshot) {
	// get the new message from the database
	var chatMsg = snapshot.val();
	// make a chat variable to append new chat lines into divs
	var chatEntry = $("<div>").html(chatMsg);

	// if YOU sent the chat message, the name appears in red
	if (chatMsg.startsWith(yourPlayerName)) {
		chatEntry.addClass("p1color");
	// if you DID NOT send the chat message, the name appears in blue
	} else {
		chatEntry.addClass("p2color");
	}

	// append the div stored in chatEntry with its new styling to the DOM
	$("#chatdisplay").append(chatEntry);
	// use ScrollHeight to keep the chat going
	$("#chatdisplay").scrollTop($("#chatdisplay")[0].scrollHeight);
});

// The database is listening for the "turn" variable to change
// it only changes between 1 and 2 depending on whether it is 
// player 1's turn or player 2's turn

database.ref("/turn/").on("value", function(snapshot) {
	// Check if it's p1's turn
	if (snapshot.val() === 1) {
		console.log("turn 1");
		turn = 1;
		// make sure that both players have joined the game
		// then make the p1 display pane green if it is player 1's
		// turn and makes sure players 2 panel is not green
		if (p1 && p2) {
			$("#p1display").addClass("yourTurn");
			$("#p2display").removeClass("yourTurn");
			// show when p1 still has to pick
			$("#outcome").html("Waiting on " + p1name + " to choose...");
		}
		//otherwise, do the opposite for player 2 and make their
		// panel green and p2's panel not green 
	} else if (snapshot.val() === 2) {
		console.log("TURN 2");
		turn = 2;
		if (p1 && p2) {
			$("#p1display").removeClass("yourTurn");
			$("#p2display").addClass("yourTurn");

			// show when p2 still has to pick 
			$("#outcome").html("Waiting on " + p2name + " to choose...");
		}
	}
});

// Attach an event handler to the "Submit" button to add a new user to the database
$("#add-name").on("click", function(event) {
	event.preventDefault();
	// First, make sure that the name field is non-empty and we are still waiting for a player
	if ( ($("#name-input").val().trim() !== "") && !(p1 && p2) ) {
		// Adding p1
		if (p1 === null) {
			console.log("Adding Player 1");

			yourPlayerName = $("#name-input").val().trim();
			p1 = {
				name: yourPlayerName,
				win: 0,
				loss: 0,
				tie: 0,
				choice: ""
			};

			// Add player 1 to the database
			database.ref().child("/players/p1").set(p1);

			// Player 1 is first so turn gets the value of 1
			database.ref().child("/turn").set(1);

            // If this user disconnects, remove them from the database. Refreshing
            // the browser counts as disconnecting too. Could prevent that
            // with localStorage I bet but... eh... priorities
            database.ref("/players/p1").onDisconnect().remove();
            
        } 
        // if player 1 exists and player 2 does not exist...
        else if( (p1 !== null) && (p2 === null) ) {
			// Then add player 2
			console.log("Adding Player 2");
			yourPlayerName = $("#name-input").val().trim();
			p2 = {
				name: yourPlayerName,
				win: 0,
				loss: 0,
				tie: 0,
				choice: ""
			};

			// Add player 2 to the database
			database.ref().child("/players/p2").set(p2);

			// If this user disconnects, remove them from the database. Refreshing
            // the browser counts as disconnecting too. Could prevent that
            // with localStorage I bet but... eh... priorities
			database.ref("/players/p2").onDisconnect().remove();
		}

		// Add a user joining message to the chat
		var msg = yourPlayerName + " has joined!";
		console.log(msg);

		// Get a key for the join chat entry
		var chatKey = database.ref().child("/chat/").push().key;

		// Save the join chat entry
		database.ref("/chat/" + chatKey).set(msg);

		// Reset the name input box
		$("#name-input").val("");	
	}
});

// Attach an event handler to the chat "Send" button to append the new message to the conversation
$("#chat-send").on("click", function(event) {
	event.preventDefault();

	// First, make sure that the player exists and the message box is non-empty
	if ( (yourPlayerName !== "") && ($("#chat-input").val().trim() !== "") ) {
		// Grab the message from the input box and subsequently reset the input box
		var msg = yourPlayerName + ": " + $("#chat-input").val().trim();
		$("#chat-input").val("");

		// Get a key for the new chat entry
		var chatKey = database.ref().child("/chat/").push().key;

		// Save the new chat entry
		database.ref("/chat/" + chatKey).set(msg);
	}
});

// Monitor p1's selection
$("#rock").on("click", function() {
	// Make selections only when both players are in the game
	if (p1 && p2 && (yourPlayerName === p1.name) && (turn === 1) ) {
		// Record p1's choice
		var choice = $(this).text().trim();
		console.log("player selected "+  $(this).text());
		// Record the player choice into the database
		p1Choice = choice;
		database.ref().child("/players/p1/choice").set(choice);

		// Set the turn value to 2, as it is now p2's turn
		turn = 2;
		database.ref().child("/turn").set(2);
	}
});

$("#paper").on("click", function() {
	// Make selections only when both players are in the game
	if (p1 && p2 && (yourPlayerName === p1.name) && (turn === 1) ) {
		// Record p1's choice
		var choice = $(this).text().trim();
		console.log("player selected "+  $(this).text());
		// Record the player choice into the database
		p1Choice = choice;
		database.ref().child("/players/p1/choice").set(choice);

		// Set the turn value to 2, as it is now p2's turn
		turn = 2;
		database.ref().child("/turn").set(2);
	}
});

$("#scissors").on("click", function() {
	// Make selections only when both players are in the game
	if (p1 && p2 && (yourPlayerName === p1.name) && (turn === 1) ) {
		// Record p1's choice
		var choice = $(this).text().trim();
		console.log("player selected "+  $(this).text());
		// Record the player choice into the database
		p1Choice = choice;
		database.ref().child("/players/p1/choice").set(choice);

		// Set the turn value to 2, as it is now p2's turn
		turn = 2;
		database.ref().child("/turn").set(2);
	}
});

// Monitor p2's selection
$("#rock").on("click", function() {
	event.preventDefault();

	// Make selections only when both players are in the game
	if (p1 && p2 && (yourPlayerName === p2.name) && (turn === 2) ) {
		// Record p2's choice
		var choice = $(this).text().trim();

		// Record the player choice into the database
		p2Choice = choice;
		database.ref().child("/players/p2/choice").set(choice);

		// Compare p1 and player 2 choices and record the outcome
		compareChoices();
	}
});

$("#paper").on("click", function() {
	event.preventDefault();

	// Make selections only when both players are in the game
	if (p1 && p2 && (yourPlayerName === p2.name) && (turn === 2) ) {
		// Record p2's choice
		var choice = $(this).text().trim();

		// Record the player choice into the database
		p2Choice = choice;
		database.ref().child("/players/p2/choice").set(choice);

		// Compare p1 and player 2 choices and record the outcome
		compareChoices();
	}
});

$("#scissors").on("click", function() {
	event.preventDefault();

	// Make selections only when both players are in the game
	if (p1 && p2 && (yourPlayerName === p2.name) && (turn === 2) ) {
		// Record p2's choice
		var choice = $(this).text().trim();

		// Record the player choice into the database
		p2Choice = choice;
		database.ref().child("/players/p2/choice").set(choice);

		// Compare p1 and player 2 choices and record the outcome
		compareChoices();
	}
});

// compareChoices is the main rock/paper/scissors logic to see which player wins
function compareChoices() {
	if (p1.choice === "Rock") {
		if (p2.choice === "Rock") {
			// Tie
			console.log("tie");

			database.ref().child("/outcome/").set("Tie game!");
			database.ref().child("/players/p1/tie").set(p1.tie + 1);
			database.ref().child("/players/p2/tie").set(p2.tie + 1);
		} else if (p2.choice === "Paper") {
			// p2 wins
			console.log("paper wins");

			database.ref().child("/outcome/").set("Paper wins!");
			database.ref().child("/players/p1/loss").set(p1.loss + 1);
			database.ref().child("/players/p2/win").set(p2.win + 1);
		} else { // scissors
			// p1 wins
			console.log("rock wins");

			database.ref().child("/outcome/").set("Rock wins!");
			database.ref().child("/players/p1/win").set(p1.win + 1);
			database.ref().child("/players/p2/loss").set(p2.loss + 1);
		}

	} else if (p1.choice === "Paper") {
		if (p2.choice === "Rock") {
			// p1 wins
			console.log("paper wins");

			database.ref().child("/outcome/").set("Paper wins!");
			database.ref().child("/players/p1/win").set(p1.win + 1);
			database.ref().child("/players/p2/loss").set(p2.loss + 1);
		} else if (p2.choice === "Paper") {
			// Tie
			console.log("tie");

			database.ref().child("/outcome/").set("Tie game!");
			database.ref().child("/players/p1/tie").set(p1.tie + 1);
			database.ref().child("/players/p2/tie").set(p2.tie + 1);
		} else { // Scissors
			// p2 wins
			console.log("scissors win");

			database.ref().child("/outcome/").set("Scissors win!");
			database.ref().child("/players/p1/loss").set(p1.loss + 1);
			database.ref().child("/players/p2/win").set(p2.win + 1);
		}

	} else if (p1.choice === "Scissors") {
		if (p2.choice === "Rock") {
			// p2 wins
			console.log("rock wins");

			database.ref().child("/outcome/").set("Rock wins!");
			database.ref().child("/players/p1/loss").set(p1.loss + 1);
			database.ref().child("/players/p2/win").set(p2.win + 1);
		} else if (p2.choice === "Paper") {
			// p1 wins
			console.log("scissors win");

			database.ref().child("/outcome/").set("Scissors win!");
			database.ref().child("/players/p1/win").set(p1.win + 1);
			database.ref().child("/players/p2/loss").set(p2.loss + 1);
		} else {
			// Tie
			console.log("tie");

			database.ref().child("/outcome/").set("Tie game!");
			database.ref().child("/players/p1/tie").set(p1.tie + 1);
			database.ref().child("/players/p2/tie").set(p2.tie + 1);
		}

	}

	// Set the turn value to 1, as it is now p1's turn
	turn = 1;
	database.ref().child("/turn").set(1);
}
});