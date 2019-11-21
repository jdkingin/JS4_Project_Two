
let slideIndex = 1;

//Open Modal
function openModal()
{
    const modal = document.getElementById("modal");
    modal.style.display = "block";   
}

function openCalModal()
{
    const calModal = document.getElementById("calModal");
    calModal.style.display = "block";  
}

//Close modal
function closeModal()
{
    modal.style.display = "none";
}

showSlides(slideIndex);

//Next/Prev controls
function plusSlides(n)
{
    showSlides(slideIndex += n);
}

//Thumbnail image controls
function currentSlide(n)
{
    showSlides(slideIndex = n);
}

function showSlides(n)
{
    let i;
    let slides = document.getElementsByClassName("imgSlides");
    let dots = document.getElementsByClassName("demo");
    let captionText = document.getElementById("caption");

    if(n > slides.length){slideIndex = 1}
    if(n < 1){slideIndex = slides.length}

    for(i = 0; i < slides.length; i++) 
    {
        slides[i].style.display = "none";
    }
    for(i = 0; i < dots.length; i++)
    {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    captionText.innerHTML = dots[slideIndex-1].alt;
}