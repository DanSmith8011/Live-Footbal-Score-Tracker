let season = []
const apiKey = window.API_KEY

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
const navBar = document.getElementById('stats-lineup-nav"')


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
        headers: {"x-apisports-key" : API_KEY}
    })
    const data = await response.json()
    season = data.response
    console.log(season)
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
        fixtureCard.dataset.id = fixture.fixture.id

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

fixturesLog.addEventListener ('click', async function (e) {
    const card = e.target.closest('article');

    if (!card) return;
    const matchId = card.dataset.id

    let matchEvents = []

    try {
        const response = await fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${matchId}`, {
            method: 'GET',
            headers: {"x-apisports-key" : API_KEY} 
        });


        if(!response.ok) {
            throw new Error(`Failed to fetch match events. Status: ${response.status}`)
        }
        const data = await response.json();
        matchEvents = data.response
        console.log(matchEvents)
        

    } catch (error) {
        console.error('Caught an error during the fetch:', error.message);

        return 'Unavailable'
    }

    

    const selectedFixture = season.find(fixture => fixture.fixture.id == matchId)
    console.log(selectedFixture)
    if (selectedFixture) {
        selectedFixture.events = matchEvents
        
        const headerContainer = document.getElementById('match-header-container')
        headerContainer.innerHTML = createMatchHeader(selectedFixture)
        const contentContainer = document.getElementById("match-content-container")
        contentContainer.innerHTML = createEvents(selectedFixture)

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

function createEvents (matchData) {

const events = matchData.events

if (!events || events.length === 0) {
    return `<p style="color: #94a3b8; text-align: center; padding: 1rem;">No events recorded for this match.</p>`;
    }

    return events.map(event => {
        return `
        <li class='event-item'>
        <span class='event-time'>${event.time.elapsed}</span>
        <span class='event-type'>${event.type}</span>
        <span class='event-detail'>
        <strong>${event.player.name}</strong> (${event.team.name})
        ${event.assist ? `- Assist: ${event.assist.name}` : ''}
        </span>
        </li>
        `
    }).join('');
}

