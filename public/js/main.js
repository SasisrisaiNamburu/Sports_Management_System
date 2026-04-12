// ================= GLOBAL STORAGE =================
let allPlayers = [];

// ================= AUTH =================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputs = registerForm.querySelectorAll("input");

        const userData = {
            username: inputs[0].value,
            password: inputs[1].value
        };

        const res = await fetch("https://sports-management-system-4dj7.onrender.com/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

        const res = await fetch("https://sports-management-system-4dj7.onrender.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

// ================= ADD PLAYER =================

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

        const res = await fetch("https://sports-management-system-4dj7.onrender.com/players/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerData)
        });

        if (res.ok) {
            alert("Player Added Successfully");
            window.location.href = "/pages/players.html";
        } else {
            const err = await res.text();
            alert(err);
        }

        playerForm.reset();
    });
}

// ================= LOAD + DISPLAY PLAYERS =================

const playerTable = document.getElementById("playerTable");

if (playerTable) {
    fetch("https://sports-management-system-4dj7.onrender.com/players")
        .then(res => res.json())
        .then(players => {
            allPlayers = players;
            displayPlayers(players);
        });
}

function displayPlayers(players) {
    if (!playerTable) return;

    playerTable.innerHTML = "";

    if (players.length === 0) {
        playerTable.innerHTML = `<tr><td colspan="6" class="text-center">No players found</td></tr>`;
        return;
    }

    players.forEach(player => {
        const row = `
            <tr>
                <td>${player.name || ""}</td>
                <td>${player.age || ""}</td>
                <td>${player.sport || ""}</td>
                <td>${player.team || ""}</td>
                <td>${player.position || ""}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2" onclick="editPlayer('${player._id}')">Update</button>
                    <button class="btn btn-danger btn-sm" onclick="deletePlayer('${player._id}')">Delete</button>
                </td>
            </tr>
        `;
        playerTable.innerHTML += row;
    });
}

// ================= SEARCH =================

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase();

        const filtered = allPlayers.filter(p =>
            (p.name || "").toLowerCase().includes(value) ||
            (p.sport || "").toLowerCase().includes(value) ||
            (p.team || "").toLowerCase().includes(value) ||
            (p.position || "").toLowerCase().includes(value)
        );

        displayPlayers(filtered);
    });
}

// ================= DELETE =================

async function deletePlayer(id) {
    if (!confirm("Delete this player?")) return;

    const res = await fetch(`https://sports-management-system-4dj7.onrender.com/players/delete/${id}`, {
        method: "DELETE"
    });

    if (res.ok) {
        alert("Player Deleted");
        location.reload();
    } else {
        alert("Delete failed");
    }
}

// ================= EDIT =================

function editPlayer(id) {
    window.location.href = `/pages/edit_player.html?id=${id}`;
}

async function loadPlayerData() {
    const form = document.getElementById("editPlayerForm");
    if (!form) return;

    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;

    const res = await fetch("https://sports-management-system-4dj7.onrender.com/players");
    const players = await res.json();

    const player = players.find(p => p._id == id);

    if (!player) return;

    document.getElementById("name").value = player.name || "";
    document.getElementById("age").value = player.age || "";
    document.getElementById("sport").value = player.sport || "";
    document.getElementById("team").value = player.team || "";
    document.getElementById("position").value = player.position || "";
}

document.getElementById("editPlayerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = new URLSearchParams(window.location.search).get("id");

    const updated = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        sport: document.getElementById("sport").value,
        team: document.getElementById("team").value,
        position: document.getElementById("position").value
    };

    const res = await fetch(`https://sports-management-system-4dj7.onrender.com/players/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
    });

    if (res.ok) {
        alert("Updated Successfully");
        window.location.href = "/pages/players.html";
    } else {
        alert("Update failed");
    }
});

// ================= DASHBOARD =================

async function loadDashboardCount() {
    const totalEl = document.getElementById("totalPlayers");
    const teamEl = document.getElementById("totalTeams");
    const sportEl = document.getElementById("totalSports");

    if (!totalEl) return;

    const res = await fetch("https://sports-management-system-4dj7.onrender.com/players");
    const players = await res.json();

    totalEl.innerText = players.length;

    const teams = new Set(players.map(p => p.team).filter(t => t));
    const sports = new Set(players.map(p => p.sport).filter(s => s));

    teamEl.innerText = teams.size;
    sportEl.innerText = sports.size;
}

// ================= NAVIGATION =================

function goToDashboard() {
    window.location.href = "/pages/dashboard.html";
}

function goToPlayers() {
    window.location.href = "/pages/players.html";
}

function goToAddPlayer() {
    window.location.href = "/pages/add_player.html";
}

function logout() {
    window.location.href = "/pages/login.html";
}

// ================= INIT =================

document.addEventListener("DOMContentLoaded", () => {
    loadPlayerData();
    loadDashboardCount();
});
