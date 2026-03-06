document.addEventListener('DOMContentLoaded', () => {
    const rex = document.getElementById('rex');
    const feedBtn = document.getElementById('feed-btn');
    let isFeeding = false;

    feedBtn.addEventListener('click', () => {
        if (isFeeding) return;
        
        isFeeding = true;
        feedBtn.disabled = true;
        
        // Remove idle class and add chomp class
        rex.classList.remove('idle');
        rex.classList.add('chomp');
        
        // Wait 1.5 seconds then revert to idle
        setTimeout(() => {
            rex.classList.remove('chomp');
            rex.classList.add('idle');
            
            feedBtn.disabled = false;
            isFeeding = false;
        }, 1500);
    });
});
