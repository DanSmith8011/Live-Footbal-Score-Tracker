const statsButton = document.getElementById('stats-button')
const eventsButton = document.getElementById('events-button')
const lineupsButton = document.getElementById('lineups-button')
const eventFeed = document.getElementById('updates-tracker')
const statsFeed = document.getElementById('stats-tab')



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

