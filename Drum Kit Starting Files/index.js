var numberOfDrums = document.querySelectorAll('.drum').length;

for ( i = 0; i < numberOfDrums; i++ ) {

    document.querySelectorAll('.drum')[i].addEventListener('click', function () {
        var audio = new Audio('sounds/crash.mp3');
        audio.play();
    });

}