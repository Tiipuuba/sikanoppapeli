function saveSettings() {

    if (document.getElementById('p1').checked) {
        var players = 1
    } else {
        var players = 2
    }

    var pointamount = document.getElementById('points').value
    if (pointamount === "") {
        var pointamount = 100
    } else if (isNaN(parseInt(pointamount)) || parseInt(pointamount) < 1) {
        const faulty = document.getElementById("faulty")
        faulty.innerHTML = "Anna positiivinen luku numeroina"
        document.getElementById('pointamount').appendChild(faulty)
        return
    }

    if (document.getElementById('d1').checked) {
        var dices = 1
    } else {
        var dices = 2
    }

    localStorage.setItem("players", players);
    localStorage.setItem("pointamount", pointamount);
    localStorage.setItem("dices", dices);
    // "tasoittava" means for player two to have chance for draw
    // instead of giving player one advantage with possible extra turn by going first
    localStorage.setItem("tasoittava", false)
    localStorage.setItem("doubles", 0)

    location.href = 'peli.html';
}

function initializeGame() {
    const players = localStorage.getItem("players")
    const pointamount = localStorage.getItem("pointamount")
    const dices = localStorage.getItem("dices")

    // Handles making of "players"
    const player = document.createElement("h2");
    player.innerHTML = "Pelaaja 1. pisteet: <span id='p1points'>0</span>"
    player.setAttribute('id', "playerone")
    document.getElementById('right').appendChild(player);

    if (players === "2") {
    const playertwo = document.createElement("h2");
    playertwo.innerHTML = "Pelaaja 2. pisteet: <span id='p2points'>0</span>"
    playertwo.setAttribute('id', "playertwo")
    document.getElementById('right').appendChild(playertwo);
    }

    document.getElementById("start").remove()

    //Handles making wincondition and turn text
    const points = document.createElement("h2")
    points.innerHTML = pointamount + ' pistettä voittoon.'
    document.getElementById('wincondition').appendChild(points)


    const turn = document.createElement("h2")
    turn.innerHTML = "Pelaaja <span id='pelaaja'>1</span>. vuoro"
    turn.setAttribute('id', "pturn")
    document.getElementById('wincondition').appendChild(turn)
    
    //Adds pig dice
    const dice = document.createElement("img")
    dice.setAttribute('id', "diceone");
    dice.src = './art/noppa_1.png'
    document.getElementById('dices').appendChild(dice)

    if (dices === "2") {
        const dicetwo = document.createElement("img")
        dicetwo.setAttribute('id', "dicetwo");
        dicetwo.src = './art/noppa_1.png'
        document.getElementById('dices').appendChild(dicetwo)
    }

    //Creates playing buttons "roll" and "stay"
    const roll = document.createElement('button');
    roll.textContent = 'Heitä';
    document.getElementById('buttons').appendChild(roll);
    roll.onclick = rollDice;

    const stay = document.createElement('button');
    stay.textContent = 'Lopeta vuoro';
    document.getElementById('buttons').appendChild(stay);
    stay.onclick = stayHere;

    const totalpoints = document.createElement("h2")
    totalpoints.innerHTML = "Pisteitä yhteensä: <span id='pointstotal'>0</span>"
    document.getElementById('pptotal').appendChild(totalpoints)

}

function rollDice() {
    const dices = localStorage.getItem("dices")
    const tasoittava = localStorage.getItem("tasoittava")
    let doubles = localStorage.getItem("doubles")

    let pointElement = document.getElementById('pointstotal')
    let point = parseFloat(pointElement.innerHTML)

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;

    let dice = document.getElementById("diceone")
    dice.src = `./art/noppa_${dice1}.png`

    if (dices === "1") {

        pointElement.innerHTML = point + dice1

        if (dice1 === 1) {
            changeTurn()
        }


    } else if (dices === "2") {
        let dicet = document.getElementById("dicetwo")
        dicet.src = `./art/noppa_${dice2}.png`

        if (dice1 === 1 && dice2 === 1) {
            pointElement.innerHTML = point + 25
            var double = parseInt(doubles) + 1
            localStorage.setItem("doubles", double)

        } else if ((dice1 === 1 && dice2 !== 1) || (dice1 !== 1 && dice2 === 1)){
            if (tasoittava === "true") {
                winner("1")
            } else {
                changeTurn()
            }

        } else if (dice1 === dice2){
            pointElement.innerHTML = point + ((dice1 + dice2)*2)
            var double = parseInt(doubles) + 1
            localStorage.setItem("doubles", double)

        } else {
            pointElement.innerHTML = point + dice1 + dice2
        }
    }

    if (double === 3) {
        changeTurn()
    }
}

function stayHere() {
    const wincon = localStorage.getItem("pointamount")
    const tasoittava = localStorage.getItem("tasoittava")
    const players = localStorage.getItem("players")

    let pointElement = document.getElementById('pointstotal')
    let point = parseFloat(pointElement.innerHTML)

    let ptElement = document.getElementById('pelaaja')
    let playerturn = parseFloat(ptElement.innerHTML);
    let ppElement = document.getElementById(`p${playerturn}points`);
    ppElement.innerHTML = point + parseFloat(ppElement.innerHTML)

    if (players === "1" && parseInt(ppElement.innerHTML) >= parseInt(wincon)) {
        winner("1")
        return;
    }

    if (parseInt(ppElement.innerHTML) >= parseInt(wincon) && ptElement.innerHTML === "2" && tasoittava === "true") {
        winner("3")
        return;
    }   else if ((ppElement.innerHTML) < parseInt(wincon) && ptElement.innerHTML === "2" && tasoittava === "true") {
        winner("1")
        return;
    }   else if (parseInt(ppElement.innerHTML) >= parseInt(wincon) && ptElement.innerHTML === "2") {
        winner("2")
        return;
    }   else if (parseInt(ppElement.innerHTML) >= parseInt(wincon) && ptElement.innerHTML === "1" && tasoittava === "true") {
        winner("1")
        return;
    }   else if (parseInt(ppElement.innerHTML) >= parseInt(wincon) && ptElement.innerHTML === "1") {
        localStorage.setItem("tasoittava", true)
        const taso = document.getElementById("pturn")
        taso.innerHTML = "Pelaaja <span id='pelaaja'>1</span>. tasoittavavuoro"
    }
    changeTurn()  
}

function changeTurn() {
    const players = localStorage.getItem("players")

    localStorage.setItem("doubles", 0)

    let pointElement = document.getElementById('pointstotal')
    let ptElement = document.getElementById('pelaaja')

    pointElement.innerHTML = 0
    if (ptElement.innerHTML === "1" && players === "2") {
        ptElement.innerHTML = "2"
    } else {
        ptElement.innerHTML = "1"
    }
}

function winner(whoWon) {
    const players = localStorage.getItem("players")
    const win = document.createElement('h1')

    document.getElementById('playerone').remove()
    if (players === "2") {
        document.getElementById('playertwo').remove()
    }

    if (whoWon !== "3") {
        win.innerHTML = `Voittaja: pelaaja ${whoWon}.`
    } else if (whoWon === "3") {
        win.innerHTML = "Tasapeli."
    }
    
    document.getElementById('right').appendChild(win)
    document.getElementById('left').remove()
}
