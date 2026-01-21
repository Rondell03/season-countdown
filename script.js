function getNextSeason() {
    const now = new Date();
    const year = now.getFullYear();
    const seasons = [
        { name: 'Spring', start: new Date(year, 2, 20) }, // March 20
        { name: 'Summer', start: new Date(year, 5, 21) }, // June 21
        { name: 'Fall', start: new Date(year, 8, 22) }, // September 22
        { name: 'Winter', start: new Date(year, 11, 21) } // December 21
    ];

    let nextSeason = seasons.find(season => now < season.start);
    if (!nextSeason) {
        nextSeason = seasons[0]; // Next year
    }
    return nextSeason;
}

function setSeasonalBackground(seasonName) {
    const seasonLower = seasonName.toLowerCase();
    document.body.style.backgroundImage = `url('backgrounds/${seasonLower}.png')`;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function updateCountdown() {
    const nextSeason = getNextSeason();
    const now = new Date();
    const timeDiff = nextSeason.start - now;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('countdown');
    const todayDateElement = document.getElementById('today-date');
    const seasonDateElement = document.getElementById('season-date');
    const seasonName = document.getElementById('next-season');

    setSeasonalBackground(nextSeason.name);
    todayDateElement.innerHTML = `${formatDate(now)}`;
    seasonDateElement.innerHTML = `${formatDate(nextSeason.start)}`;
    seasonName.innerHTML = `${nextSeason.name}`;

    let displayText = '';
    displayText = `${days} Days until ${nextSeason.name}`;

    countdownElement.innerHTML = displayText;
}

setInterval(updateCountdown, 1000);