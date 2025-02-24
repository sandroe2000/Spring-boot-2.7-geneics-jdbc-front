import { Fetch } from './Fetch.js';
import { Modal } from './Modal.js';
import { Utils } from "./Utils.js";
//import { DataBind } from './DataBind.js';

export class App {

    constructor(){
        this.components = [];
        this.routes = [];
        this.fetch = new Fetch();
        this.utils = new Utils();
        this.modal = new Modal();
        //this.dataBind = new DataBind();
    }

    //--> ROUTER
    async init(){
        //let uri = '/src/modules/routes.json';
        //this.routes = await this.fetch.getData(uri);
        this.routes = [
            {
                name: "#",
                path: "/src/layout/Layout.js",
                css: true,
                app: true
            }
        ];
        this.callRender(window.location.hash);
        this.events();
    }

    events(){
        window.onhashchange = async (event) => {
            //await this.callRender(window.location.hash);
            //event.preventDefault();
        };

        window.addEventListener('hide.bs.modal', () => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        });
    }

    async callRender(path) {
 
        if(path=="#") return false;
        if(path=="") path="#";
        let result = this.routes.find( (route) => route.name === path.replace(/^#\//, "") ) ;
        if(!result){
            result = {
                name: "#Http404",
                path: '/src/lib/error/Http404.js',
            };
        }
        //await this.render(result);
        await this.render({
            name: "#",
            path: "/src/layout/Layout.js",
            css: true,
            app: true
        });
    }

    //--> RENDER
    async render(cls) {
        
        let target = cls.target || '#app';
        let position = cls.position || 'beforeend';
        let content = '';
        let params = cls.params || null;
        let name = cls.path.substring((cls.path.lastIndexOf('/') + 1), cls.path.indexOf('.js'));
        let component = await this.getComponentByName(name);

        if(!component){
            const imported = await import(cls.path);
            if(cls.app){
                component = new imported[name](this, params);
            }else{
                component = new imported[name](params);
            }
            this.components.push(component);
        }

        try {
            if(cls.css) await this.loadCSS(cls.path.toLowerCase().replace('.js', '.css'));
        } catch (err) {
            console.warn('Deu ruim CSS ->', err);
        }

        if(typeof component?.template === 'function') {
            content = await component.template();
        }else{
            content = await this.loadHTML(cls.path.toLowerCase().replace('.js', '.html'));
        }

        //... MODAL
        if (target == '.modal' && content) {
            await this.modal.init(params);
            document.querySelector('.modal-body').replaceChildren();
            document.querySelector('.modal-body').insertAdjacentHTML(position, content);
        } else if (content){
            document.querySelector(target).replaceChildren();
            document.querySelector(target).insertAdjacentHTML(position, content);
        }

        if(typeof component?.init === 'function') await component.init(params?.init);
        //debugger;
    }

    async loadCSS(css) {
        let style = document.createElement('link');
            style.href = css;
            style.type = 'text/css';
            style.rel = 'stylesheet';
        let head = document.getElementsByTagName('head')[0];
            head.append(style);
    }

    async loadHTML(html) {
        try {
            return await fetch(html, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html',
                },
            }).then(response => response.text());
        } catch (err) {
            console.log('Class sem template HTML ->', err);
        }
    }

    getComponentByName(name){
        //debugger;
        for(let comp in this.components){
            if(this.components[comp].constructor.name == name){
                return this.components[comp];
            }
        }
        return null;
    }

    async config(configKey){

        let url = `http://localhost:8092/api/v1/generic/configs/${configKey}`;
        let result = await this.fetch.getData(url, '');
        return result.configValue;
    }
}

document.addEventListener("readystatechange", (event) => { 
    new App().init(); 
});
