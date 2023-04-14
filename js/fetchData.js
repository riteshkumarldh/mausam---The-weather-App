const currentLocationButton = document.querySelector("[data-current-btn]");



const API_KEY = "4f46732062f42662447d5770c3ef673e";





// onClick of currentLocationButton
currentLocationButton.addEventListener("click", (e) => {
    navigator.geolocation.getCurrentPosition(onSuccess , onError);
});

const onSuccess = () => {
    console.log("success");
}

const onError = () => {
    console.log("not accessible");
}

