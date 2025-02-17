export class Modal {

    constructor(){
        this.modal = null;
        this.param = null;        
    }

    async init(param){
        this.param = param;
        let appModal = document.querySelector('#appModal');
        this.modal = new bootstrap.Modal(appModal);
        if(this.param.size) appModal.querySelector('.modal-dialog').classList.add(this.param.size);
        if(this.param.label) appModal.querySelector('#appModalLabel').innerHTML = this.param.label;
        this.modal.show();
        this.events();
    }

    events(){

        document.querySelectorAll('.closeModal').forEach(element => {
            element.addEventListener('click', (event) => {
                this.close();
            });
        });

        this.modal._element?.addEventListener('hidden.bs.modal', event => {
            if(this.param.size) appModal.querySelector('.modal-dialog').classList.remove(this.param.size);
            if(this.param.label) appModal.querySelector('#appModalLabel').innerHTML = 'Modal title';
        });
    }

    close(){
        this.modal.hide();                
        let backDrop = document.querySelector('.modal-backdrop');
        if(backDrop) backDrop.remove();
    }
}