const $ = document
let pageNumber = 1
let maxPages;
let createdCharectersElements;
let charactersDiv = $.querySelector(".charactersDiv")
let listOfBookmarkedCharecters = JSON.parse(localStorage.getItem('bookmarkedCharacters')) || [];
let hoverArea = $.querySelector('.gameDivPartHoverArea');
let cards = $.querySelectorAll('.mortycard1, .rickcard1, .mortycard2, .rickcard2, .mortycard3, .rickcard3');
let mortyCards = $.querySelectorAll('.mortycard');
let rickCards = $.querySelectorAll('.rickcard');
let cardIsPlaced = false
let gameCardsData = []
let mortyScore = 0
let rickScore = 0
let mortyScoreElement = $.querySelector(".mortyScore")
let rickScoreElement = $.querySelector(".rickScore")
let winOrLoseElement = $.querySelector(".winOrLoseStatus")
let mortyCard1 = $.querySelector(".mortycard1")
let mortyCard2 = $.querySelector(".mortycard2")
let mortyCard3 = $.querySelector(".mortycard3")
let rickCard1 = $.querySelector(".rickcard1")
let rickCard2 = $.querySelector(".rickcard2")
let rickCard3 = $.querySelector(".rickcard3")

async function loadCharacters() {
    let apiLink = "https://rickandmortyapi.com/api/character/?page=" + pageNumber

    let request = await fetch(apiLink)
        .then(response => response.json())
        .then(data => {
            maxPages = data.info.pages
            createCharacters(data)
            console.log(data)
        })
}

async function createCharacters(data) {
    createdCharectersElements = ""
    data.results.forEach(function (characterData) {
        createdCharectersElements += `
        <div class="charactersDivCardDiv">
            <div style="background-image: url('${characterData.image}')" class="charactersDivCardDivImage"></div>
            <div class="charactersDivaddFav addFav"></div>
            <span class="charactersDivCardDivName charactersDivCardDivInfo">${characterData.name}</span>
            <span class="charactersDivCardDivStatus charactersDivCardDivInfo">${characterData.status}</span>
            <span class="charactersDivCardDivGender charactersDivCardDivInfo">${characterData.gender}</span>
            <span class="charactersDivCardDivSpecies charactersDivCardDivInfo">${characterData.species}</span>
        </div>
        `
    })
    charactersDiv.innerHTML += createdCharectersElements
    if (pageNumber < maxPages) {
        ++pageNumber
    }
    addToFavorites()
    updateFavorites()

}

function addToFavorites() {
    let charactersDivaddFav = $.querySelectorAll(".charactersDivaddFav");
    charactersDivaddFav.forEach(function (icon) {
        icon.addEventListener("click", function () {
            let bookmarkedCartName = icon.parentElement.children[2].innerHTML;

            if (listOfBookmarkedCharecters.includes(bookmarkedCartName)) {
                let index = listOfBookmarkedCharecters.indexOf(bookmarkedCartName);
                listOfBookmarkedCharecters.splice(index, 1);

                localStorage.setItem('bookmarkedCharacters', JSON.stringify(listOfBookmarkedCharecters));

                updateFavorites();
            } else {
                listOfBookmarkedCharecters.push(bookmarkedCartName);

                localStorage.setItem('bookmarkedCharacters', JSON.stringify(listOfBookmarkedCharecters));

                updateFavorites();
            }
        });
    });
}

function updateFavorites() {
    let charactersDivCardDivs = $.querySelectorAll('.charactersDivCardDiv');

    charactersDivCardDivs.forEach(function (box) {
        let nameElement = box.querySelector('.charactersDivCardDivName');
        let name = nameElement.innerHTML;

        let addFavElement = box.querySelector('.charactersDivaddFav');

        if (listOfBookmarkedCharecters.includes(name)) {
            addFavElement.classList.remove('addFav');
            addFavElement.classList.add('removeFav');
        } else {
            addFavElement.classList.remove('removeFav');
            addFavElement.classList.add('addFav');
        }
    });
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 826) + 1;
}

async function setGameCardsData() {
    for (let i = 1; i <= 6; i++) {
        let apiLink = "https://rickandmortyapi.com/api/character/" + generateRandomNumber()
        let request = await fetch(apiLink)
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                let cardId = data.id
                let cardImage = data.image
                let cardGender = data.gender
                let cardSpecies = data.species
                let cardStatus = data.status

                gameCardsData.push({
                    cardId: cardId,
                    cardImage: cardImage,
                    cardGender: cardGender,
                    cardSpecies: cardSpecies,
                    cardStatus: cardStatus
                });
            })
    }
    console.log(gameCardsData)
}

async function setGameCardsOnClick() {
    for (let i = 0; i <= 5; i++) {
        switch (i) {
            case 0:
                mortyCard1.style.backgroundImage = "url(" + gameCardsData[i].cardImage + ")"
                break;
            case 1:
                mortyCard2.style.backgroundImage = "url(" + gameCardsData[i].cardImage + ")"
                break;
            case 2:
                mortyCard3.style.backgroundImage = "url(" + gameCardsData[i].cardImage + ")"
                break;
            case 3:
                rickCard1.style.backgroundImage = "url(" + gameCardsData[i].cardImage + ")"
                break;
            case 4:
                rickCard2.style.backgroundImage = "url(" + gameCardsData[i].cardImage + ")"
                break;
            case 5:
                rickCard3.style.backgroundImage = "url(" + gameCardsData[i].cardImage + ")"
                break;
        }


    }
    setTimeout(finalCardScores, 1000)
}

async function finalCardScores() {
    // Morty Score
    for (let i = 0; i <= 2; i++) {
        if (gameCardsData[i].cardSpecies === "Human") {
            mortyScore += 10
        }
        if (gameCardsData[i].cardStatus === "Alive") {
            mortyScore += 15
        }
    }
    // Rick Score
    for (let i = 3; i <= 5; i++) {
        if (gameCardsData[i].cardGender === "Male") {
            rickScore += 20
        }
        if (gameCardsData[i].cardStatus === "Dead") {
            rickScore += 5
        }
    }
    mortyScoreElement.innerHTML = "Morty Score: " + mortyScore
    rickScoreElement.innerHTML = "Rick Score: " + rickScore
    if (mortyScore > rickScore) {
        winOrLoseElement.innerHTML = "You Won!"
    } else if (mortyScore < rickScore) {
        winOrLoseElement.innerHTML = "You Lose!"
    } else if (mortyScore == rickScore) {
        winOrLoseElement.innerHTML = "Draw!"
    }
}

setGameCardsData()
loadCharacters()

window.addEventListener('load', function () {
    listOfBookmarkedCharecters = JSON.parse(localStorage.getItem('bookmarkedCharacters')) || [];
});

window.addEventListener('scroll', function () {
    let scrollProgress = (window.scrollY + window.innerHeight) / $.documentElement.scrollHeight;

    if (scrollProgress === 1) {
        loadCharacters();
    }
});

hoverArea.addEventListener('mouseover', function () {
    cards.forEach(function (card) {
        const className = card.classList[1];
        card.classList.add(className + 'OnHover');
    });
});

hoverArea.addEventListener('mouseout', function () {
    cards.forEach(function (card) {
        if (!cardIsPlaced) {
            const className = card.classList[1];
            card.classList.remove(className + 'OnHover');
        }
    });
});

hoverArea.addEventListener("click", function () {
    cards.forEach(function (card) {
        const className = card.classList[1];
        card.classList.add(className + 'OnHover');
        cardIsPlaced = true
    })
    setTimeout(setGameCardsOnClick, 3000)
})