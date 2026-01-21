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

function generateCountdownImage(days, seasonName) {
    return new Promise((resolve) => {
        const seasonLower = seasonName.toLowerCase();
        const img = new Image();
        img.src = `backgrounds/${seasonLower}.png`;
        const logoImg = new Image();
        logoImg.src = 'backgrounds/logo.png';
        const nextSeason = getNextSeason();

        let imagesLoaded = 0;
        
        const checkAllLoaded = () => {
            imagesLoaded++;
            if (imagesLoaded === 2) {
                renderImage();
            }
        };

        img.onload = checkAllLoaded;
        logoImg.onload = checkAllLoaded;

        const renderImage = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1200;
            canvas.height = 630;

            const ctx = canvas.getContext('2d');

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const logoWidth = 300;
            const logoHeight = 120;
            ctx.drawImage(logoImg, canvas.width / 2 - logoWidth / 2, 30, logoWidth, logoHeight);

            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.font = 'bold 120px Arial';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(`${days} until ${seasonName}`, canvas.width / 2, canvas.height / 2 - 50);

            ctx.font = '32px Arial';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText(`${formatDate(nextSeason.start)}`, canvas.width / 2, canvas.height / 2 + 80);

            ctx.globalAlpha = 0.5;
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText('https://rondell03.github.io/season-countdown/', canvas.width / 2, canvas.height - 20);
            ctx.globalAlpha = 1.0;

            resolve(canvas);
        };
    });
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
updateCountdown();

document.getElementById('share-btn').addEventListener('click', async function () {
    const nextSeason = getNextSeason();
    const now = new Date();
    const timeDiff = nextSeason.start - now;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    const button = this;
    button.textContent = 'Generating...';
    button.disabled = true;

    try {
        const canvas = await generateCountdownImage(days, nextSeason.name);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${nextSeason.name}-countdown.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        button.textContent = 'Generate An Image';
    } catch (error) {
        console.error('Error generating image:', error);
        button.textContent = 'Error - Try Again';
    } finally {
        button.disabled = false;
    }
});