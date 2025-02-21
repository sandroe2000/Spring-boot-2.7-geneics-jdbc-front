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

}
