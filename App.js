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
const navBar = document.getElementById('stats-lineup-nav')
const backButton = document.getElementById('back-btn')
const lineupContainer = document.getElementById('lineups-view')
const matchContentContainer = document.getElementById('match-content-container')


const mockLineups = [
    {
        team: {name: 'Arsenal'}, 
        formation: "4-3-3",
        startXI: [
            { player : {number: 1, name: 'David Raya', pos: 'G'} }, 
            { player : {number: 12, name: 'Jurrien Timber', pos: 'RB'} },
            { player : {number: 15, name: 'Ezri Konsa', pos: 'CB'} },  
            { player : {number: 6, name: 'Gabriel Magalhães', pos: 'CB'} }, 
            { player : {number: 33, name: 'Riccardo Calafiori', pos: 'LB'} },
            { player : {number: 41, name: 'Declan Rice', pos: 'CDM'} },
            { player : {number: 39, name: 'Bruno Guimaraes', pos: 'CM'} },
            { player : {number: 8, name: 'Martin Odegaard', pos: 'CAM'} },
            { player : {number: 20, name: 'Noni Madueke', pos: 'RW'} },
            { player : {number: 17, name: 'Christos Tzolis', pos: 'LW'} },
            { player : {number: 29, name: 'Kai Havertz', pos: 'ST'} }
        ],

        substitutes: [
             { player : {number: 13, name: 'Kepa Arrizabalaga', pos: 'GK'} },  
            { player : {number: 3, name: 'Cristhian Mosquera', pos: 'CB'} }, 
            { player : {number: 4, name: 'Ben White', pos: 'RB'} },
            { player : {number: 5, name: 'Piero Hincapié', pos: 'CB'} },
            { player : {number: 49, name: 'Myles Lewis-Skelly', pos: 'CM'} },
            { player : {number: 23, name: 'Mikel Merino', pos: 'CM'} },
            { player : {number: 36, name: 'Martín Zubimendi', pos: 'CDM'} },
            { player : {number: 10, name: 'Eberechi Eze', pos: 'CAM'} },
            { player : {number: 14, name: 'Viktor Gyökeres', pos: 'ST'} }
        ]
    },
{
        team: { name: 'Hull City' },
        formation: "5-4-1",
        startXI: [
            { player: { number: 19, name: 'Konstantinos Tzolakis', pos: 'G' } },
            { player: { number: 2, name: 'Lewie Coyle', pos: 'RB' } },
            { player: { number: 15, name: 'John Egan', pos: 'CB' } },
            { player: { number: 6, name: 'Semi Ajayi', pos: 'CB' } },
            { player: { number: 32, name: 'Nobel Mendy', pos: 'CB' } },
            { player: { number: 21, name: 'Elliot Stroud', pos: 'LB' } },
            { player: { number: 27, name: 'Regan Slater', pos: 'RM' } },
            { player: { number: 29, name: 'Lucas Gourna-Douath', pos: 'CM' } },
            { player: { number: 42, name: 'Tim Iroegbunam', pos: 'CM' } },
            { player: { number: 50, name: 'Mohamed-Ali Cho', pos: 'LM' } },
            { player: { number: 9, name: 'Oli McBurnie', pos: 'ST' } }
        ],
        substitutes: [
            { player: { number: 1, name: 'Jack Butland', pos: 'GK' } },
            { player: { number: 18, name: 'Brooke Norton-Cuffy', pos: 'RB' } },
            { player: { number: 22, name: 'Lucas Herrington', pos: 'CB' } },
            { player: { number: 3, name: 'Ryan Giles', pos: 'LB' } },
            { player: { number: 14, name: 'Jens Hjertø-Dahl', pos: 'CM' } },
            { player: { number: 36, name: 'Christos Mouzakitis', pos: 'CM' } },
            { player: { number: 7, name: 'Sorba Thomas', pos: 'LW' } },
            { player: { number: 11, name: 'Joe Gelhardt', pos: 'ST' } },
            { player: { number: 47, name: 'Robinio Vaz', pos: 'ST' } }
        ]
    }

]

eventsButton.addEventListener('click', function (e) {
    e.preventDefault();
    eventFeed.classList.remove('hidden')
    statsFeed.classList.add('hidden')
    eventsButton.classList.add('active')
    statsButton.classList.remove('active')
    lineupsButton.classList.remove('active')
})

statsButton.addEventListener('click', function (e){
    e.preventDefault();
    eventFeed.classList.add('hidden')
    statsFeed.classList.remove('hidden')
    eventsButton.classList.remove('active')
    statsButton.classList.add('active')
    lineupsButton.classList.remove('active')
})

lineupsButton.addEventListener('click', function (e) {
    e.preventDefault();
    renderLineups(mockLineups)
    eventFeed.classList.add('hidden')
    statsFeed.classList.add('hidden')
    eventsButton.classList.remove('active')
    statsButton.classList.remove('active')
    lineupsButton.classList.add('active')
    lineupContainer.classList.remove('hidden')
})



backButton.addEventListener('click', function (e){
    e.preventDefault();
    showListView()

})

function showDetailView(matchId) {
    listView.classList.add('hidden')    
    detailView.classList.remove('hidden')  
}

function showListView() {
    listView.classList.remove('hidden')    
    detailView.classList.add('hidden')   
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
    e.preventDefault()
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
        const assistText = event.type === 'Goal' ? event.assist?.name && event.assist.name !== 'null' ? `Assist: ${event.assist.name}` : '' : ''
        const subsText = event.type === 'subst' ? event.assist?.name && event.assist.name !== 'null' ? `Substitute: ${event.assist.name}` : '' : ''

        return `
        <li class='event-item'>
        <span class='event-time'>${event.time.elapsed}'</span>
        <span class='event-type'>${event.type} ${createEmoji(event)}</span>
        <span class='event-detail'>
        <strong>${event.player.name}</strong> (${event.team.name}) ${assistText} ${subsText}
        </span>
        </li>
        `
    }).join('');
}


function createEmoji (checkEvent) {
    const eventType = checkEvent.type ? checkEvent.type.toLowerCase() : ''
    const eventDetail = checkEvent.detail ?checkEvent.detail.toLowerCase() : ''

    if (eventType.includes('goal')) {
        return '⚽';
    }

    if (eventType.includes('subst')) {
        return '🔄';
    }

    if (eventDetail.includes('red card')) {
        return '🟥';
    }

    if (eventDetail.includes('yellow card')) {
        return '🟨';
    }

    return '';
}

function createLineups(lineups) {
return lineups.map((teamData, index) => {

    const homeOrAway = index === 0 ? 'Home' : 'Away';

    const startingEleven = teamData.startXI.map(player => {
        return `<h3>${player.player.name}</h3>
        <h3>${player.player.number}</h3>`;
        
    }).join('');
    const subs = teamData.substitutes.map(player => {
        return`<h3>${player.player.name}</h3>
        <h3>${player.player.number}</h3>`;
        
    }).join('')
    return `
    <div class = 'team-card'>
        <h2>${teamData.team.name} (${homeOrAway})</h2>
        <p>Formation: ${teamData.formation}</p>
        <div class='players-list'>
        ${startingEleven}
        </div>

        <div class='subs-list'>
        ${subs}
        </div>
        </div>
    `
}).join('')
}

function renderLineups(lineupsData) {
    matchContentContainer.innerHTML = createLineups(lineupsData)
}



