"use strict";

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
    // #chatDisplay - div where chat is displayed 
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
let p1choice = "";
let p2choice = "";

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
		$("#p1name").text(p1name);
		$("#p1data").html("Wins: " + p1.win + ", Losses: " + p1.loss + ", Tie: " + p1.tie);
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
		$("#p2data").html("Win: 0, Loss: 0, Tie: 0");
    }

    if (snapshot.child("p2").exists()) {
		console.log("Player 2 exists in the database");

		// set local variables for player 1
		p1 = snapshot.val().p2;
		p2name = p2.name;

		// display player 1's name and score data 
		$("#p2name").text(p2name);
		$("#p2data").html("Wins: " + p2.win + ", Losses: " + p2.loss + ", Tie: " + p2.tie);
    } 

    // what happens if player 1 doesn't exist?
    else {
		console.log("Player 2 does NOT exist in the database");
		p2 = null;
		p2name = "";

		// Display "empty" state for p1 
		$("#p2name").text("Waiting for Player 2...");
		database.ref("/outcome/").remove();
		$("#outcome").html("Rock! Paper! Scissors.... Shoot!");
		$("#scoreboard").html("Waiting for Players to join");
		$("#p2data").html("Win: 0, Loss: 0, Tie: 0");
    }
    
    // If both players are now present, it's player1's turn
	if (p1 && p2) {

		// Update the display with a green border around player 1
		$("#playerPanel1").addClass("yourTurn");

		// Update the center display
		$("#outcome").html("Waiting on " + p1name + " to choose...");
    }
    
});