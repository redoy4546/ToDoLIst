// adda common class to all the buttons
let deleteBtn = document.getElementsByClassName('btnn');
let array = Array.prototype.slice.call(deleteBtn);

// converting html collection to array, to use array methods
array.forEach(function (just) {
  // iterate and add the event handler to it
  just.addEventListener('click', function (e) {
    e.target.parentNode.remove();
  });
});
