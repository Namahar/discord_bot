// discord bot

// used to read environment variables
require('dotenv').config();

// import libraries
const Discord = require('discord.js')
const YTDL = require('ytdl-core')

const client = new Discord.Client()

// get super special secret bot key
var bot_secret_token = process.env.TOKEN

// used to store connection
var voice

// used to store stream
var dispatcher

// connect to server
client.on('ready', () => {
	console.log("Connected as " + client.user.tag)
	var generalChannel = client.channels.get(process.env.SERVER)
})

// reads messages
client.on('message', (receivedMessage) => {
	// bot cannot reply to itself
	if (receivedMessage.author == client.user) {
		return
	}
	
	// marco polo
	if (receivedMessage.content.toLowerCase() == 'marco')
		receivedMessage.reply("polo")
	
	// checks if bot was tagged
	if (receivedMessage.content.includes(client.user.toString()))
		receivedMessage.channel.send("Hello " + receivedMessage.author)
	
	// process commands
	if (receivedMessage.content.startsWith("!"))
		processCommand(receivedMessage)
	
})

function processCommand(message) {	
	// remove exclamation mark
	let fullCommand = message.content.substr(1)
	// separate arguments
	let splitCommand = fullCommand.split(" ")
	
	let primaryCommand = splitCommand[0]
	let argument = splitCommand[1]
	
	// join channel
	if (primaryCommand == 'join')
		joinCommand(message)

	// stop music
	else if (primaryCommand == 'stop')
		dispatcher.end()
	
	// pause music
	else if (primaryCommand == 'pause')
		dispatcher.pause()
	
	// resume music after pause
	else if (primaryCommand == 'resume')
		dispatcher.resume()
	
	// play music
	else if (primaryCommand == 'play')
		musicCommand(argument, message)
	
	// leave voice channel
	else if (primaryCommand == 'leave')
		exitCommand(message)
	
	else if (primaryCommand == 'goodbye') {
		client.destroy()
	}
	
	else if (primaryCommand == 'commands')
		listCommand(message)
}

function listCommand(message) {
	message.channel.send("The commands are:\n!join\n!stop\n!pause\n!resume\n!play\n!leave\n!goodbye\n!commands")
	
}

function joinCommand(message) {
	
	// checks if author calling bot is in channel
	if (!message.member.voiceChannel)
		message.reply("You must be in a voice channel.")

	// join channel
	else 
		if (!message.guild.voiceConnection) 
			message.member.voiceChannel.join()
				.then(connection => {
					voice = connection
				})
}

function exitCommand(message) {
	
	// checks that bot is in voice channel
	// checks that the message author is in the voice channel
	if (client.voiceConnections && message.member.voiceChannel)
		message.member.voiceChannel.leave()
	else
		message.reply("You are not in a voice channel.")
}


function musicCommand(song, message) {
	
	// checks if author calling bot is in channel
	if (!message.member.voiceChannel)
		message.reply("You must be in a voice channel.")
	
	// checks that bot is in voice channel
	if (!client.voiceConnections) {
		message.reply("I must be added to a voice channel first.")
		return
	}
	
	// check if link is input
	if (!song) {
		message.reply("Please enter a link.")
		return
	}
	
	// check that link is from youtube
	if (song.slice(12, 19) != 'youtube') {
		message.reply("Enter a proper link")
		return		
	}
	
	// check that voice connection exists
	if (dispatcher)
		// check if music is currently in queue
		if (dispatcher.paused) {
			message.reply("End the current song")
			return
		}
	
	// start stream
	if (client.voiceConnections) {
		var streamOptions = {volume: 0.1, bitrate: 96000}
		dispatcher = voice.playStream(YTDL(song, {filter: "audioonly"}), streamOptions)
	}
}

client.login(bot_secret_token)