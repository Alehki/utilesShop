window.addEventListener("load", () => {
  setTimeout(() => {

    const splash = document.getElementById("splash");

    splash.style.transition = "opacity 1s ease";
    splash.style.opacity = "0";

    setTimeout(() => {
      splash.style.display = "none";
    }, 1000);

  }, 4000);
});