$(document).ready(function(){
	// Initialize FireBase

	var config = {
		apiKey: "AIzaSyCaNlu5KGR5_deX5lk0_fE1I2UjXdl9oxM",
		authDomain: "train-scheduler-75871.firebaseapp.com",
		databaseURL: "https://train-scheduler-75871.firebaseio.com",
		projectId: "train-scheduler-75871",
		storageBucket: "train-scheduler-75871.appspot.com",
		messagingSenderId: "270716444850"
	  };

	firebase.initializeApp(config);
	

	// Get a reference to the database service
	var database = firebase.database();
	
	// Button for adding Trains
	$("#addTrainBtn").on("click", function(){
	event.preventDefault();

		// Retrieves user input
		var trainName = $("#trainNameInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var trainTimeInput = moment($("#trainTimeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");;
		var frequencyInput = $("#frequencyInput").val().trim();

		console.log(newTrain) 
		// create local "temporary" object to hold train data
		var newTrain = {
			name: trainName,
			destination: destination,
			trainTime: trainTimeInput,
			frequency: frequencyInput,
		};

		// pushing trainInfo to Firebase
		database.ref().push(newTrain);;

		// Console.log train variables
		console.log(newTrain.name);
		console.log(newTrain.destination);
		console.log(newTrain.trainTime);
		console.log(newTrain.frequency);

		  // Alert
		  alert("Train successfully added");

		// clear input-boxes
		$("#train-name-input").val("");
		$("#destination-input").val("");
		$("#train-time-input").val("");
		$("#frequency-input").val("");

	});

	database.ref().on("child_added", function(childSnapshot, prevChildKey){

		console.log(childSnapshot.val());
		var train = childSnapshot.val()
	
		// First Train (subtracted one year to ensure current time)
		var startTimeConverted = moment(train.name, "hh:mm").subtract(1, "years");

		// Current Time
		var currentTime = moment();
	
		// Difference between the times
		var diffTime = moment().diff(moment(startTimeConverted), "minutes");
	
		// Time apart (remainder)
		var tRemainder = diffTime % frequencyInput;
	
		// Minute(s) Until Train
		var tMinutesTillTrain = frequencyInput - tRemainder;
	
		// Next Train
		var nextTrain = moment().add(tMinutesTillTrain, "minutes");
		var catchTrain = moment(nextTrain).format("HH:mm");
	
		// Clear input fields
		$("#trainName, #destination, #trainTimeInput, #frequency").val("");
		

		// Append train info to table on page
		$("#trainTable > tbody").append("<tr><td>" + train.name + "</td><td>" + 
		train.destination + "</td><td>" + 
		train.frequency + " mins" + "</td><td>" + train.trainTimeInput + "</td><td>" );

		return false;
	},
	 
		// Handle the errors
		function (errorObject) {
		  console.log("Errors handled: " + errorObject.code);

	});
});