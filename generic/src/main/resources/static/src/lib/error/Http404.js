export class Http404 {

    constructor(){
    }

    template(){
        return `<h2>404</h2>`;
    }

    async  init(){
        await this.events();
    }

    async events(){ }
}