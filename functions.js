"use strict"

const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {

  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    content.classList.toggle("active");

  });
}
