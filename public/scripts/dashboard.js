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
        player = result[username]
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
        if (playerInfo.username != username){
            let li = document.createElement("li")
            li.innerHTML = `<div>
                                <label>${playerInfo.username}</label>
                                <label style="color: #a7a7a7">Balance: ${playerInfo.balance}</label>
                            </div>
                            <button class="payBtns" onclick="payPlayer(this)" amount="1">+1</button>
                            <button class="payBtns" onclick="payPlayer(this)" amount="5">+5</button>
                            <button class="payBtns" onclick="payPlayer(this)" amount="50">+50</button>
                            <button class="payBtns" onclick="payPlayer(this)" amount="100">+100</button>
                            <button class="payBtns" onclick="payPlayer(this)" amount="500">+500</button>`
    
            li.id = playerInfo.username
    
            playerList.appendChild(li)
        }
    }
}

const updateBalance = async () =>{
    let balance = await getPlayerBalance(username)
    balanceLabel.innerHTML = `Balance: ${balance}`
}

const closeParentPanel = (button) => {
    button.parentElement.parentElement.style.scale = 0
    button.parentElement.parentElement.style.opacity = 0
    button.parentElement.parentElement.classList.remove("animate")
    actionPanelContainer.classList.remove("disableInput")
}

const payPlayer = (button) =>{
    const receiver = button.parentElement.id
    const amount = button.getAttribute("amount")
    socket.emit("pay player", username, receiver, amount)
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
socket.on("balance changed", async () => {
    console.log("balance changed")
    await updatePlayerList()
    await updateBalance()
})