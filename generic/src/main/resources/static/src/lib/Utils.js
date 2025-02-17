export class Utils {
  
  navbarScrollLeft(navBar) {
    document.querySelector(navBar).setAttribute("data-position", -1);
    this.navbarScrollRight(navBar);
  }

  navbarScrollRight(navBar) {
    let position = new Number(
      document.querySelector(navBar).getAttribute("data-position")
    );
    position++;
    let filler = document.querySelector(navBar);
    filler.style.left = -(position * 100) + "px";
    document.querySelector(navBar).setAttribute("data-position", position);
  }

  formatDateTime(dateVal) {
    let dateObj = new Date(dateVal);
    return dateObj.toLocaleString("pt-BR").replace(",", "");
  }

  uuidv4() {
    // Generate a standard UUID
    const uuid = crypto.randomUUID();

    // Extract the first character (hexadecimal digit)
    const uuidString = uuid.toString();
    const firstChar = uuidString.charAt(0);

    // Convert the first character to a letter
    const letterIndex = parseInt(firstChar, 16);
    const letter = String.fromCharCode("a".charCodeAt(0) + letterIndex);

    // Combine the modified first character with the rest of the UUID
    const customUUID = letter + uuidString.substring(1);

    return customUUID;
  }

  dragElement(el) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.querySelector(`div#${el.id} div.card-header`)) {
      /* if present, the header is where you move the DIV from:*/
      document.querySelector(`div#${el.id} div.card-header`).onmousedown =
        dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      el.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      el.style.top = el.offsetTop - pos2 + "px";
      el.style.left = el.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}
