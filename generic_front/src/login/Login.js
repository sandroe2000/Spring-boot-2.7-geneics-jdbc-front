export class Login {
    constructor(app){
        this.app = app;
    }

    init(){
        console.log('Login has been cancelled!');
    }

    template() {
        return `<h1 class="login-h1">Login</h1>`;
    }
}