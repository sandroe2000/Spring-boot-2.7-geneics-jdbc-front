export class InsertionType {

    constructor(app, param){
        this.app = app;
        this.param = param;
        this.sqlCode = param.sqlCode;
    }

    template(){
        return `
            <form>
                <div class="row mb-2">
                    <div class="col-md-12">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="buildQuery" id="rdoObjectName" value="OBJECT_NAME">
                            <label class="form-check-label" for="rdoObjectName">
                                Object name
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="buildQuery" id="rdoSelect" value="SELECT">
                            <label class="form-check-label" for="rdoSelect">
                                Select
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="buildQuery" id="rdoDescribe" value="DESCRIBE">
                            <label class="form-check-label" for="rdoDescribe">
                                Describe
                            </label>
                        </div>
                    </div>
                </div>                
                <div class="row mb-2 mt-3">
                    <div class="col-md-12 d-flex justify-content-end pt-2">
                        <button class="btn btn-light me-2" id="btnInsertionTypeCancel" type="button">Cancel</button>
                        <button class="btn btn-dark" id="btnInsertionTypeOk" type="button">Ok</button>
                    </div>
                </div>
            </form>`;
    }

    async init(){

        await this.events();
    }

    async events(){ 

        document.querySelector('#btnInsertionTypeOk').addEventListener('click', async (event) => {
            let selected = document.querySelector('input[name="buildQuery"]:checked');
            
            this.sqlCode.buildQuery(this.sqlCode.tableInFocus, selected.value);
            await this.app.modal.close();
        }, false);

        document.querySelector('#btnInsertionTypeCancel').addEventListener('click', (event) => {
            this.app.modal.close();
        }, false);        
    }
}