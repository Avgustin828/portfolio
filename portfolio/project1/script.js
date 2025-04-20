let winCount = 0
let lossCount = 0
let drawCount = 0
let currentLanguage = 'en'
const historyList = document.getElementById('history-list')

const translations = {
	en: {
		youChose: 'You chose',
		computerChose: 'computer chose',
		resultWin: 'Win',
		resultLose: 'Lose',
		resultDraw: 'Draw',
		resetScore: 'Reset Score',
		gameHistory: 'Game History:',
		wins: 'Wins',
		losses: 'Losses',
		draws: 'Draws',
	},
	ru: {
		youChose: 'Вы выбрали',
		computerChose: 'компьютер выбрал',
		resultWin: 'Победа',
		resultLose: 'Поражение',
		resultDraw: 'Ничья',
		resetScore: 'Сбросить счет',
		gameHistory: 'История игры:',
		wins: 'Победы',
		losses: 'Поражения',
		draws: 'Ничьи',
	},
}

function loadStats() {
	const stats = JSON.parse(localStorage.getItem('rpsStats')) || {
		wins: 0,
		losses: 0,
		draws: 0,
	}
	winCount = stats.wins
	lossCount = stats.losses
	drawCount = stats.draws
	updateScore()
}

function saveStats() {
	const stats = {
		wins: winCount,
		losses: lossCount,
		draws: drawCount,
	}
	localStorage.setItem('rpsStats', JSON.stringify(stats))
}

function startPlayerVsPlayer() {
	isPlayerVsPlayer = true
	resetGame()
	alert('Player vs Player mode activated! Player 1 goes first.')
}

function startPlayerVsComputer() {
	isPlayerVsPlayer = false
	resetGame()
	alert('Player vs Computer mode activated!')
}

function playGame(playerChoice) {
	const choices = ['rock', 'paper', 'scissors']
	const computerChoice = choices[Math.floor(Math.random() * choices.length)]
	const resultDiv = document.getElementById('result')

	let result = ''
	let resultClass = ''

	if (playerChoice === computerChoice) {
		result = 'resultDraw'
		resultClass = 'draw'
		drawCount++
	} else if (
		(playerChoice === 'rock' && computerChoice === 'scissors') ||
		(playerChoice === 'scissors' && computerChoice === 'paper') ||
		(playerChoice === 'paper' && computerChoice === 'rock')
	) {
		result = 'resultWin'
		resultClass = 'win'
		winCount++
	} else {
		result = 'resultLose'
		resultClass = 'lose'
		lossCount++
	}

	const playerEmoji = getEmoji(playerChoice)
	const computerEmoji = getEmoji(computerChoice)

	resultDiv.innerHTML = `${translations[currentLanguage].youChose} ${playerEmoji}, ${translations[currentLanguage].computerChose} ${computerEmoji}. <span class="${resultClass}">${translations[currentLanguage][result]}</span>`
	resultDiv.className = resultClass

	const historyItem = document.createElement('li')
	historyItem.innerHTML = `${translations[currentLanguage].youChose} ${playerEmoji}, ${translations[currentLanguage].computerChose} ${computerEmoji}. <span class="${resultClass}">${translations[currentLanguage][result]}</span>`
	historyItem.className = resultClass
	historyList.appendChild(historyItem)

	updateScore()
	saveStats()
}

function handlePlayerVsPlayer(playerChoice) {
	if (currentPlayer === 1) {
		player1Choice = playerChoice
		currentPlayer = 2
		alert("Player 2, it's your turn!")
	} else {
		const player2Choice = playerChoice
		determineWinnerPvP(player1Choice, player2Choice)
		currentPlayer = 1
		player1Choice = null
	}
}

function determineWinnerPvP(choice1, choice2) {
	const resultDiv = document.getElementById('result')
	let result = ''
	if (choice1 === choice2) {
		result = 'Draw'
		drawCount++
	} else if (
		(choice1 === 'rock' && choice2 === 'scissors') ||
		(choice1 === 'scissors' && choice2 === 'paper') ||
		(choice1 === 'paper' && choice2 === 'rock')
	) {
		result = 'Player 1 Wins'
		winCount++
	} else {
		result = 'Player 2 Wins'
		lossCount++
	}

	roundCount++
	resultDiv.innerHTML = `Player 1 chose <b>${choice1}</b>, Player 2 chose <b>${choice2}</b>. <span class="${result
		.toLowerCase()
		.replace(' ', '-')}">${result}</span>`
	updateScore()
	addToHistory(`Player 1: ${choice1}, Player 2: ${choice2}, Result: ${result}`)
}

function getEmoji(choice) {
	if (choice === 'rock') return '🪨'
	if (choice === 'paper') return '📄'
	if (choice === 'scissors') return '✂️'
}

function getAction(winner, loser) {
	if (winner === 'rock' && loser === 'scissors') return 'Rock crushes Scissors'
	if (winner === 'scissors' && loser === 'paper') return 'Scissors cut Paper'
	if (winner === 'paper' && loser === 'rock') return 'Paper covers Rock'
}

function showVisualization(playerChoice, computerChoice, message) {
	const visualizationDiv = document.getElementById('visualization')
	visualizationDiv.innerHTML = `
        <div class="visualization">
            <span class="choice">${getEmoji(playerChoice)}</span>
            <span class="action">${message}</span>
            <span class="choice">${getEmoji(computerChoice)}</span>
        </div>
    `
}

function updateScore() {
	const scoreDiv = document.getElementById('score')
	scoreDiv.textContent = `${translations[currentLanguage].wins}: ${winCount} | ${translations[currentLanguage].losses}: ${lossCount} | ${translations[currentLanguage].draws}: ${drawCount}`
}

function addToHistory(entry) {
	const historyItem = document.createElement('li')
	historyItem.textContent = entry
	historyList.appendChild(historyItem)
}

function resetGame() {
	winCount = 0
	lossCount = 0
	drawCount = 0
	document.getElementById('result').textContent = ''
	document.getElementById('history-list').innerHTML = ''
	updateScore()
	saveStats()
}

function toggleLanguage() {
	const languageButton = document.getElementById('language-button')
	const elementsToTranslate = document.querySelectorAll('[data-en][data-ru]')

	currentLanguage = currentLanguage === 'en' ? 'ru' : 'en'

	elementsToTranslate.forEach(element => {
		element.textContent = element.getAttribute(`data-${currentLanguage}`)
	})

	languageButton.innerHTML = currentLanguage === 'en' ? 'EN' : 'RU'
}

function updateHistory() {
	const historyList = document.getElementById('history-list').children
	Array.from(historyList).forEach(item => {
		const text = item.textContent
		if (text.includes(translations.en.youChose)) {
			item.innerHTML = text
				.replace(
					translations.en.youChose,
					translations[currentLanguage].youChose
				)
				.replace(
					translations.en.computerChose,
					translations[currentLanguage].computerChose
				)
				.replace(
					translations.en.resultWin,
					translations[currentLanguage].resultWin
				)
				.replace(
					translations.en.resultLose,
					translations[currentLanguage].resultLose
				)
				.replace(
					translations.en.resultDraw,
					translations[currentLanguage].resultDraw
				)
		}
	})
}

function toggleTheme() {
	const body = document.body
	const themeButton = document.getElementById('theme-button')
	const isDarkTheme = body.classList.toggle('dark-theme')

	themeButton.textContent = isDarkTheme ? '🌙' : '🌞'

	localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light')
}

function loadTheme() {
	const savedTheme = localStorage.getItem('theme')
	const body = document.body
	const themeButton = document.getElementById('theme-button')

	if (savedTheme === 'dark') {
		body.classList.add('dark-theme')
		themeButton.textContent = '🌙'
	} else {
		body.classList.remove('dark-theme')
		themeButton.textContent = '🌞'
	}
}

loadStats()
loadTheme()
