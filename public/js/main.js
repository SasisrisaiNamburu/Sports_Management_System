const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputs = registerForm.querySelectorAll("input");

        const userData = {
            username: inputs[0].value,
            password: inputs[1].value
        };

        const res = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const data = await res.text();
        alert(data);
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.text();

        if (data === "Login Successful") {
            window.location.href = "/pages/dashboard.html";
        } else {
            alert(data);
        }
    });
}

const playerForm = document.getElementById("playerForm");

if (playerForm) {
    playerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputs = playerForm.querySelectorAll("input, select");

        const playerData = {
            name: inputs[0].value,
            age: inputs[1].value,
            sport: inputs[2].value,
            team: inputs[3].value,
            position: inputs[4].value
        };

        const res = await fetch("http://localhost:3000/players/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(playerData)
        });

        const data = await res.text();
        if (res.ok) {
    alert("Player Added Successfully");
} else {
    alert(data); // show error if something goes wrong
}

        playerForm.reset();
    });
}

const playerTable = document.getElementById("playerTable");

if (playerTable) {
    fetch("http://localhost:3000/players")
    .then(res => res.json())
    .then(players => {
        playerTable.innerHTML = "";

        players.forEach(player => {
            const row = `
                <tr>
                    <td>${player.name}</td>
		    <td>${player.age}</td>
                    <td>${player.sport}</td>
                    <td>${player.team}</td>
		    <td>${player.position}</td>
                    <td>
    <button class="btn btn-warning btn-sm me-2" onclick="editPlayer('${player._id}')">Update</button>
    <button class="btn btn-danger btn-sm" onclick="deletePlayer('${player._id}')">Delete</button>
</td>
                </tr>
            `;
            playerTable.innerHTML += row;
        });
    });
}

async function deletePlayer(id) {
    const confirmDelete = confirm("Are you sure you want to delete this player?");
    
    if (!confirmDelete) return;

    const res = await fetch(`http://localhost:3000/players/delete/${id}`, {
        method: "DELETE"
    });

    const data = await res.text();
    if (res.ok) {
    alert("Player Deleted Successfully");
} else {
    alert("Error deleting player");
}

    location.reload();
}

function editPlayer(id) {
    window.location.href = `/pages/edit_player.html?id=${id}`;
}

async function loadPlayerData() {
    const form = document.getElementById("editPlayerForm");
    if (!form) return; // run only on edit page

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return;

    const res = await fetch("http://localhost:3000/players");
    const players = await res.json();

    const player = players.find(p => p._id == id);

    console.log("ID:", id);
    console.log("Found Player:", player);

    if (player) {
        document.getElementById("name").value = player.name || "";
        document.getElementById("age").value = player.age || "";
        document.getElementById("sport").value = player.sport || "";
        document.getElementById("team").value = player.team || "";
        document.getElementById("position").value = player.position || "";
    } else {
        alert("Player not found");
    }
}

document.getElementById("editPlayerForm")?.addEventListener("submit", async function (e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const updatedPlayer = {
        name: document.getElementById("name").value,
	age: document.getElementById("age").value,
        sport: document.getElementById("sport").value,
	team: document.getElementById("team").value,
        position: document.getElementById("position").value
    };

    const res = await fetch(`http://localhost:3000/players/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedPlayer)
    });

    if (res.ok) {
        alert("Player Updated Successfully");
        window.location.href = "/pages/players.html";
    } else {
        alert("Error updating player");
    }
});

function goToDashboard() {
    window.location.replace("/pages/dashboard.html");
}

function goToPlayers() {
    window.location.replace("/pages/players.html");
}

function goToAddPlayer() {
    window.location.replace("/pages/add_player.html");
}

document.getElementById("searchInput")?.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll("tbody tr");

    let visible = 0;

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();

        if (text.includes(value)) {
            row.style.display = "";
            visible++;
        } else {
            row.style.display = "none";
        }
    });

    if (visible === 0) {
        console.log("No players found");
    }
});

async function loadDashboardCount() {
    const res = await fetch("http://localhost:3000/players");
    const players = await res.json();

    const countElement = document.getElementById("dashboardCount");
    if (countElement) {
        countElement.innerText = players.length;
    }
}
loadDashboardCount();

document.addEventListener("DOMContentLoaded", () => {
    loadPlayerData();
});

function highlightActivePage() {
    const path = window.location.pathname;

    const buttons = document.querySelectorAll(".navbar .btn");

    buttons.forEach(btn => btn.classList.remove("active-nav"));

    if (path.includes("dashboard")) buttons[0]?.classList.add("active-nav");
    if (path.includes("players")) buttons[1]?.classList.add("active-nav");
    if (path.includes("add_player")) buttons[2]?.classList.add("active-nav");
}

highlightActivePage();

function logout() {
    window.location.replace("/pages/login.html");
}