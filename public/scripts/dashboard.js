const usernameLabel = document.getElementById("username")
const balanceLabel = document.getElementById("balance")
const playerList = document.getElementById("playerList")

const actionPanelContainer = document.getElementById("actionPanelContainer")

const payPlayerBtn = document.getElementById("payPlayerBtn")
const payPlayerPanel = document.getElementById("payPlayerPanel")

const searchParams = new URLSearchParams(window.location.search)
const username = searchParams.get("q")

usernameLabel.innerHTML = username

const socket = io()

const getPlayerBalance = async (username) => {
    try{
        const response = await fetch("/api/players")
        const result = await response.json()
        console.log("getPlayerBalance ~ result:", result)
        player = result[username]
        console.log("getPlayerBalance ~ player:", player)
        console.log("getPlayerBalance ~ balance:", player.balance)
        return player.balance
    }
    catch (error) {
        console.error('Error getting balance:', error)
    }
}

const updatePlayerList = async () => {
    const response = await fetch("/api/players")
    const result = await response.json()

    playerList.innerHTML = ""
    for (const [player, playerInfo] of Object.entries(result)) {
        let li = document.createElement("li")
        li.innerHTML = playerInfo.username
        playerList.appendChild(li)
    }
}

const updateBalance = async () =>{
    let balance = await getPlayerBalance(username)
    balanceLabel.innerHTML = `Balance: ${balance}`
}

const closeParentPanel = (button) => {
    button.parentElement.style.scale = 0
    button.parentElement.style.opacity = 0
    payPlayerPanel.classList.remove("animate")
    actionPanelContainer.classList.remove("disableInput")
}

payPlayerBtn.addEventListener("click", () => {
    payPlayerPanel.classList.add("animate")
    actionPanelContainer.classList.add("disableInput")
    updatePlayerList()
})

updateBalance()

socket.on("player joined", () => {
    updatePlayerList()
})