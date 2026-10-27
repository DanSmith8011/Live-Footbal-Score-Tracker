let season = []

const statsButton = document.getElementById('stats-button')
const eventsButton = document.getElementById('events-button')
const lineupsButton = document.getElementById('lineups-button')
const eventFeed = document.getElementById('updates-tracker')
const statsFeed = document.getElementById('stats-tab')
const homeTeamName = document.getElementById('home-team-name')
const awayTeamName = document.getElementById('away-team-name')
const homeTeamBadge = document.querySelector('.home-badge')
const awayBadgeTeam = document.querySelector('.away-badge')
const listView = document.getElementById('list-view');
const detailView = document.getElementById('detail-view');
const fixturesLog = document.getElementById('fixtures-container')

eventsButton.addEventListener('click', function (e) {
    eventFeed.classList.remove('hidden')
    statsFeed.classList.add('hidden')
    eventsButton.classList.add('active')
    statsButton.classList.remove('active')
    lineupsButton.classList.remove('active')
})

statsButton.addEventListener('click', function (e){
    eventFeed.classList.add('hidden')
    statsFeed.classList.remove('hidden')
    eventsButton.classList.remove('active')
    statsButton.classList.add('active')
    lineupsButton.classList.remove('active')
})

function showDetailView(matchId) {
    listView.hidden = true;     
    detailView.hidden = false;   
}

function showListView() {
    detailView.hidden = true;   
    listView.hidden = false;     
}

async function getSeason() {
    const url = 'https://v3.football.api-sports.io/fixtures?league=39&season=2024'
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {"x-apisports-key" : apiKey}
    })
    const data = await response.json()
    season = data.response
    return season
}

async function initApp() {
    await getSeason()
    renderFixtures(season);
}

initApp()

function renderFixtures(season) {
    fixturesLog.innerHTML = ''
    season.forEach(fixture => {
        const fixtureCard = document.createElement('article')
        fixtureCard.dataset.id = fixture.id

        fixtureCard.innerHTML = `
            <h5>${fixture.teams.home.name}</h5>
            <img src="${fixture.teams.home.logo}" alt="${fixture.teams.home.name}">
            <strong>${fixture.goals.home ?? 0} - ${fixture.goals.away ?? 0}</strong>
            <img src="${fixture.teams.away.logo}" alt="${fixture.teams.away.name}">
            <h5>${fixture.teams.away.name}</h5>
        `;

        fixturesLog.appendChild(fixtureCard)
    })
}

fixturesLog.addEventListener ('click', function (e) {
    const matchId = e.target.dataset.id;
    const selectedFixture = season.find(fixture => fixture.id == matchId)

    if (selectedFixture) {
        const headerContainer = document.getElementById('match-header-container')
        headerContainer.innerHTML = createMatchHeader(selectedFixture)

        document.getElementById('list-view').classList.add('hidden')
        document.getElementById('detail-view').classList.remove('hidden')
    }
})

  function createMatchHeader(match) {
    return `
        <div class='teams-container'>
            <div class='team-home'>
                <img class='home-badge' src='${match.teams.home.logo}' alt='Home Team Logo'>
                <h2>${match.teams.home.name}</h2>
            </div>
            <div class='score-display'>
                <span>${match.goals.home ?? 0}</span>
                <span>:</span>
                <span>${match.goals.away ?? 0}</span>
            </div>
            <div class='team-away'>
                <img class='away-badge' src='${match.teams.away.logo}' alt='Away Team Logo'>
                <h2>${match.teams.away.name}</h2>
            </div>
        </div>
    `;
}

