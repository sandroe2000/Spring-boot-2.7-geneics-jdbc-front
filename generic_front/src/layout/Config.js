export class Config {

    constructor(app){
        this.app = app;
    }

    template(){
        return `
            <form onsubmit="return false;">
                <div class="row mb-3">
                    <div class="col">
                        <label for="chave">Chave</label>
                        <input type="text" class="form-control" id="chave" />
                    </div>
                    <div class="col">
                        <label for="valor">Valor</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="valor" />
                            <button class="btn btn-dark" type="button" id="save">
                                <i class="bi bi-floppy2-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="table-responsive" id="panelConfigResult">
                    <table id="tblConfigResult" class="table table-sm table-striped table-hover">
                        <thead>
                            <tr>
                                <th>config_id</th>
                                <th>_key</th>
                                <th>_value</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>								
                </div>
            </form>
        `;
    }

    async init(){

        await this.setTable();
        this.events();
    }

    async setTable(){

        let url = `http://localhost:8092/api/v1/generic/configs/page`;
        let result = await this.app.fetch.postData(url, {});

        let table = document.querySelector('#panelConfigResult');
        table.querySelector('tbody').innerHTML = '';

        if(!result.content?.length) return false;

        for(let row of result.content){
            let tbody = `<tr>
                    <td class='nowrap'>${row['configId']}</td>
                    <td class='nowrap'>${row['configKey']}</td>
                    <td class='nowrap'>${row['configValue']}</td>
                </tr>`;
            table.querySelector('tbody').insertAdjacentHTML('beforeend', tbody);
        }   
    }

    events(){

        document.querySelector('#save').addEventListener('click', (event) => {            
            console.log('Saving.....');
        });
    }
}