import { Base64 } from '/src/assets/js-base64/base64.mjs';

export class Fetch {

    constructor() {
        //this.token = this.getCookie('LOGIN_TOKEN');
        let username = "sam";//"john"
        let password = "sam";//"john"
        this.headers = {
            'Authorization': `Basic ${Base64.encode(username+":"+password)}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    async getData(url, params) {
        let result = false;
        await fetch(`${url}?${params}&uuidv4=${this.uuidv4()}`, {
            method: 'GET',
            headers: this.headers
        }).then(async (resp) => {
            if (resp.ok) {
                result = resp.json();
            } else {
                result = resp.text()
                .then(text => { 
                    let err = JSON.parse(text)['message'];
                    let msg = err.substring(err.indexOf('ERROR:'), err.indexOf('.]'));
                    if(msg) alert(msg);
                    throw new Error(text);
                });
            }
        });
        return result;
    }

    async setData(url, json) {
        let uri = `${url}?uuidv4=${this.uuidv4()}&id=${json.codigo}`;
        let method = "PUT";
        let result = false;
        if (!json.codigo) {
            delete json.codigo;
            uri = `${url}?uuidv4=${this.uuidv4()}`
            method = "POST"
        }
        await fetch(uri, {
            method: method,
            headers: this.headers,
            body: JSON.stringify(json)
        }).then(async (resp) => {
            if (resp.ok) {
                result = resp.json();
            } else {
                result = resp.text()
                .then(text => { 
                    let err = JSON.parse(text)['message'];
                    let msg = err.substring(err.indexOf('ERROR:'), err.indexOf('.]'));
                    if(msg) alert(msg);
                    throw new Error(text);
                });
            }
        });
        return result;
    }

    async postData(url, json) {
        let result = false;
        await fetch(url, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(json)
        }).then(async (resp) => {
            if (resp.ok) {
                result = resp.json();
            } else {
                result = resp.text()
                .then(text => { 
                    let err = JSON.parse(text)['message'];
                    return err;
                    //throw new Error(text);
                });
            }
        });
        return result;
    }

    async putData(url, json) {
        let result = false;
        const response = await fetch(url, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(json)
        }).then(async (resp) => {
            if (resp.ok) {
                result = resp.json();
            } else {
                result = resp.text()
                .then(text => { 
                    let err = JSON.parse(text)['message'];
                    let msg = err.substring(err.indexOf('ERROR:'), err.indexOf('.]'));
                    if(msg) alert(msg);
                    throw new Error(text);
                });
            }
        });
        return result;
    }

    /*async deleteData(url) {
        const response = await fetch(url, {
            method: "DELETE",
            headers: this.headers,
        });
        if (response.ok) {
            return;
        } else {
            console.log( JSON.stringify(response) );
        }
        return false;
    }*/
    async deleteData(url) {
        const response = await fetch(url, {
             method: "DELETE",
             headers: this.headers
         }).then(async (resp) => {
            if(!resp.ok){
                return resp.text()
                    .then(text => { 
                        let err = JSON.parse(text)['message'];
                        let msg = err.substring(err.indexOf('ERROR:'), err.indexOf('.]'));
                        //if(msg) alert(msg);
                        throw new Error(text);
                    })
            }else{
                return;
            }
        });
         return false;
     }

    async setLogin(url, json) {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("username", json.username);
        urlencoded.append("password", json.password);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.text())
            .then((result) => {
                document.cookie = `LOGIN_TOKEN=${encodeURIComponent(JSON.parse(result).access_token)}`;
            })
            .catch(error => console.log('error', error));
    }

    async getTemplate(url, params) {
        const response = await fetch(`${url}?uuidv4=${this.uuidv4()}${params}`, {
            method: 'GET',
            headers: this.headers
        });
        return response.text();
    }

    async combo(comboId, params) {

        let sel = document.querySelector(comboId);
        let url = sel.getAttribute('combo-url');
        let arr = sel.getAttribute('combo-data').split(',');
        let data = await this.postData(url, {});
        
        let opt = document.createElement("option");
            opt.value = "";
            opt.text = "Selecione";
        sel.add(opt);
        data.content?.forEach(element => {
            let opt = document.createElement("option");
            opt.value = element[arr[0]];
            opt.text = element[arr[1]];
            sel.add(opt);
        });
    }

    getCookie(name) {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
}