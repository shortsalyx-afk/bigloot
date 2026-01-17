// server.js - ULTIMATE BIGLOOT EDITION
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- DATABASE (In Memory) ---
let users = []; 

const mkItem = (id, name, val, rare, chance, emoji) => ({ id, name, price: val, rarity: rare, chance, img: emoji });

// --- 20 BOXES ---
const ALL_BOXES = [
    { id: "noob", name: "NOOB BOX", price: 2, img: "💩", items: [ mkItem(1, "Nothing", 0, "common", 50, "💨"), mkItem(2, "Tissue", 0.1, "common", 40, "🧻"), mkItem(3, "Spinner", 5, "rare", 9, "😵‍💫"), mkItem(4, "Steam 10€", 10, "legendary", 1, "🎮") ]},
    { id: "snack", name: "MUNCHIES", price: 4, img: "🍔", items: [ mkItem(5, "Chips", 2, "common", 60, "🥔"), mkItem(6, "Soda", 3, "common", 30, "🥤"), mkItem(7, "Prime", 15, "rare", 9, "🍹"), mkItem(8, "Pizza Year", 500, "legendary", 1, "🍕") ]},
    { id: "meme", name: "MEME LORD", price: 5, img: "🤡", items: [ mkItem(9, "Pepe", 1, "common", 50, "🐸"), mkItem(10, "Shrek", 10, "rare", 40, "🤮"), mkItem(11, "Doge", 150, "legendary", 10, "🐕") ]},
    { id: "gamer", name: "PRO GAMER", price: 15, img: "🕹️", items: [ mkItem(12, "Mousepad", 5, "common", 60, "⬛"), mkItem(13, "RGB Mouse", 60, "rare", 30, "🖱️"), mkItem(14, "Keyboard", 150, "rare", 9, "⌨️"), mkItem(15, "RTX 4090", 2000, "legendary", 1, "💾") ]},
    { id: "console", name: "CONSOLE", price: 25, img: "🎮", items: [ mkItem(16, "Cable", 5, "common", 50, "🔌"), mkItem(17, "Skin", 15, "common", 40, "🎨"), mkItem(18, "Switch", 300, "rare", 9, "👾"), mkItem(19, "PS5 Pro", 600, "legendary", 1, "🤖") ]},
    { id: "apple", name: "APPLE FAN", price: 30, img: "🍎", items: [ mkItem(20, "Cloth", 25, "common", 60, "🌫️"), mkItem(21, "AirTags", 35, "common", 30, "🏷️"), mkItem(22, "AirPods", 250, "rare", 9, "🎧"), mkItem(23, "iPhone 15", 1200, "legendary", 1, "📱") ]},
    { id: "stream", name: "STREAMER", price: 40, img: "📡", items: [ mkItem(24, "Webcam", 50, "common", 60, "📷"), mkItem(25, "Mic", 150, "rare", 30, "🎙️"), mkItem(26, "StreamDeck", 250, "rare", 9, "🎛️"), mkItem(27, "Studio", 5000, "legendary", 1, "🎬") ]},
    { id: "kicks", name: "SNEAKERS", price: 60, img: "👟", items: [ mkItem(28, "Laces", 5, "common", 60, "🧶"), mkItem(29, "Socks", 20, "common", 30, "🧦"), mkItem(30, "Jordans", 400, "rare", 9, "👞"), mkItem(31, "Red Octobers", 8000, "legendary", 1, "🦖") ]},
    { id: "drip", name: "HYPEBEAST", price: 80, img: "🧢", items: [ mkItem(32, "Brick", 50, "common", 70, "🧱"), mkItem(33, "Hoodie", 300, "rare", 25, "🦍"), mkItem(34, "Gucci Bag", 1500, "legendary", 5, "👜") ]},
    { id: "vintage", name: "VINTAGE", price: 20, img: "🧥", items: [ mkItem(35, "Old Hat", 10, "common", 50, "🧢"), mkItem(36, "Band Tee", 40, "rare", 40, "👕"), mkItem(37, "Levis 501", 150, "legendary", 10, "👖") ]},
    { id: "gym", name: "GYM RAT", price: 10, img: "💪", items: [ mkItem(38, "Shaker", 5, "common", 60, "🥤"), mkItem(39, "Creatine", 30, "rare", 35, "💊"), mkItem(40, "Full Gym", 2000, "legendary", 5, "🏋️") ]},
    { id: "music", name: "STUDIO", price: 45, img: "🎧", items: [ mkItem(41, "CD", 10, "common", 50, "💿"), mkItem(42, "Vinyl", 30, "common", 40, "📀"), mkItem(43, "Gibson", 3000, "legendary", 10, "🎸") ]},
    { id: "photo", name: "CAMERA", price: 55, img: "📸", items: [ mkItem(44, "SD Card", 20, "common", 70, "💾"), mkItem(45, "Lens", 300, "rare", 25, "🔭"), mkItem(46, "Sony A7", 2500, "legendary", 5, "📷") ]},
    { id: "anime", name: "OTAKU", price: 12, img: "👺", items: [ mkItem(47, "Poster", 5, "common", 60, "📜"), mkItem(48, "Manga", 15, "common", 30, "📘"), mkItem(49, "Katana", 200, "legendary", 10, "⚔️") ]},
    { id: "crypto", name: "CRYPTO", price: 100, img: "₿", items: [ mkItem(50, "Rekt", 0, "common", 70, "📉"), mkItem(51, "Ledger", 80, "rare", 25, "🔐"), mkItem(52, "1 ETH", 2500, "legendary", 4, "💎"), mkItem(53, "1 BTC", 45000, "legendary", 1, "🚀") ]},
    { id: "cash", name: "CASH KING", price: 200, img: "💵", items: [ mkItem(54, "10€ Bill", 10, "common", 80, "💶"), mkItem(55, "50€ Bill", 50, "common", 15, "💶"), mkItem(56, "Briefcase", 10000, "legendary", 5, "💼") ]},
    { id: "gold", name: "GOLD RUSH", price: 250, img: "⚱️", items: [ mkItem(57, "Pyrite", 1, "common", 60, "🪨"), mkItem(58, "Silver", 30, "common", 35, "🥈"), mkItem(59, "Gold Bar", 60000, "legendary", 5, "🧱") ]},
    { id: "watch", name: "ROLEX", price: 500, img: "⌚", items: [ mkItem(60, "Casio", 50, "common", 80, "⏱️"), mkItem(61, "Tissot", 400, "rare", 15, "🕰️"), mkItem(62, "Daytona", 35000, "legendary", 5, "👑") ]},
    { id: "cars", name: "SUPERCAR", price: 1000, img: "🏎️", items: [ mkItem(63, "Freshener", 2, "common", 60, "🌲"), mkItem(64, "Tire", 100, "rare", 35, "🍩"), mkItem(65, "Lambo", 250000, "legendary", 5, "🏎️") ]},
    { id: "yacht", name: "BILLIONAIRE", price: 5000, img: "⚓", items: [ mkItem(66, "Life Vest", 50, "common", 80, "🦺"), mkItem(67, "Jet Ski", 15000, "rare", 19, "🚤"), mkItem(68, "Mega Yacht", 5000000, "legendary", 1, "🚢") ]}
];

// --- ENDPOINTS ---

// Register & Login
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if(users.find(u => u.username === username)) return res.json({ success: false, message: "User exists!" });
    const newUser = { username, password, balance: 0, inventory: [] };
    users.push(newUser);
    res.json({ success: true, user: newUser });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    user ? res.json({ success: true, user }) : res.json({ success: false, message: "Wrong credentials" });
});

app.get('/api/me', (req, res) => {
    const user = users.find(u => u.username === req.headers['x-username']);
    user ? res.json(user) : res.status(401).json({ error: "Not logged in" });
});

// Deposit
app.post('/api/deposit', (req, res) => {
    const user = users.find(u => u.username === req.headers['x-username']);
    if(user) { user.balance += parseFloat(req.body.amount); res.json({ success: true, newBalance: user.balance }); }
    else res.status(401).json({ error: "User not found" });
});

// Game Logic
app.get('/api/boxes', (req, res) => res.json(ALL_BOXES.map(b => ({ id: b.id, name: b.name, price: b.price, img: b.img }))));

app.get('/api/box/:id', (req, res) => {
    const box = ALL_BOXES.find(b => b.id === req.params.id);
    box ? res.json(box) : res.status(404).json({error:"Not found"});
});

app.post('/api/open-box/:id', (req, res) => {
    const user = users.find(u => u.username === req.headers['x-username']);
    if (!user) return res.status(401).json({ error: "Please Login First" });
    const box = ALL_BOXES.find(b => b.id === req.params.id);
    if (!box || user.balance < box.price) return res.status(400).json({ error: "Not enough money!" });

    user.balance -= box.price;
    let rnd = Math.random() * 100, sum = 0, winner = box.items[0];
    for (let i of box.items) { sum += i.chance; if (rnd <= sum) { winner = i; break; } }
    
    // Προσθέτουμε ένα unique ID για να ξεχωρίζουμε τα items
    const wonItem = { ...winner, uniqueId: Date.now() + Math.random() };
    user.inventory.push(wonItem);
    
    res.json({ success: true, winner, newBalance: user.balance });
});

// SELL ITEM ENDPOINT (NEW)
app.post('/api/sell', (req, res) => {
    const user = users.find(u => u.username === req.headers['x-username']);
    if (!user) return res.status(401).json({ error: "Login first" });
    
    const { uniqueId, price } = req.body;
    
    // Find and remove item
    const itemIndex = user.inventory.findIndex(i => i.uniqueId === uniqueId);
    if (itemIndex > -1) {
        user.inventory.splice(itemIndex, 1); // Delete from inventory
        user.balance += parseFloat(price); // Add money
        res.json({ success: true, newBalance: user.balance, inventory: user.inventory });
    } else {
        res.status(404).json({ error: "Item not found" });
    }
});

app.listen(3000, () => console.log("ULTIMATE SERVER READY ON 3000"));
