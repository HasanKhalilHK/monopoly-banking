const joinGameBtn = document.getElementById("joinGame")
const usernameInput = document.getElementById("username")

const socket = io()

joinGameBtn.addEventListener("click", () => {
    username = usernameInput.value
    joinGame(username)
})

const joinGame = async (username) => {
    let players = await getPlayers();
    // console.log(players);

    if(players[username]){
        //redirect to existing dashboard page
        console.log("player already exists")
    }

    else{
        const player = new Player(username)
        await addPlayer(player)
        console.log(player)

        socket.emit("player joined", username)
        //redirect to dashboard
    }
};

const getPlayers = async () => {
    try {
        const response = await fetch("/api/players");
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching players:', error);
        return {};
    }
};

const addPlayer = async (player) => {
    try {
        const response = await fetch("/api/players", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player)
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error adding player:', error);
    }
};