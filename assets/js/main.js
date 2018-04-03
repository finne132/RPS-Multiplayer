"use strict";

// -----ID selectors-----ID selectors-----ID selectors-----ID selectors-----ID selectors-----ID selectors-----ID selectors-----

// maintitle - main title div

// nameEntry - div containing textbox and submit button for name entry
    // nameTextBox - text box for name entry 
    // nameSubmit - submit button for name entry

// scoreboard - row containing 3 colums: outcome, p1score, and p2score
    // p1score - player 1's running score display
    // outcome - outcome of each match display 
    // p2score - player 2's running score display

// displaydata - row containing 4 columns for displaying player names and selections
    // p1choice - player 1's choice display
    // p2choice - player 2's choice display 
    // p1name - player 1's name display
    // p2name - player 2's name display 

// chat - row containing 2 screen-wide columns for displaying chat and text entry box with submit button
    // chatDisplay - div where chat is displayed 
    // chatEntry - div containing textbox and submit button for name entry
        // chatTextBox - text box for chat entry 
        // chatSubmit - submit button for chat text

// foot - selector for the footer

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

var database = firebase.database();

// good resource for referencing firebase databases: 
// https://firebase.google.com/docs/reference/js/firebase.database.Reference

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
		$("#p1name").text(p1name);
		$("#p2data").html("Wins: " + p1.win + ", Losses: " + p1.loss + ", Tie: " + p1.tie);
    } 

    // what happens if player 1 doesn't exist?
    else {
		console.log("Player 1 does NOT exist in the database");
		p1 = null;
		p1name = "";

		// Display "empty" state for p1 
		$("#p1name").text("Waiting for Player 1...");
		database.ref("/outcome/").remove();
		$("#outcome").html("Rock! Paper! Scissors.... Shoot!");
		$("#scoreboard").html("Waiting for Players to join");
		$("#player1Stats").html("Win: 0, Loss: 0, Tie: 0");
    }
});
