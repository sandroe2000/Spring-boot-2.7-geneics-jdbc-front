export class Fields {

    constructor(entity){
        this.entity = entity;
    }

    template(){
        return `
        <form id="frmField">
            <div class="row">
                <div class="col-sm-3">
                    <input type="hidden" id="id" />
                    <input type="hidden" id="entityId" />
                    <label class="col-form-label" for="fieldName">Field name</label>
                    <input type="text" class="form-control" id="fieldName" />
                </div>
                <div class="col-sm-3">
                    <label class="col-form-label" for="fieldSize">Field label</label>
                    <input type="text" class="form-control" id="fieldlabel" />
                </div>
                <div class="col-sm-3">
                    <label class="col-form-label" for="fieldType">Field type</label>
                    <select class="form-select" id="fieldType">
                        <option value="">Selecione</option>
                        <option value="boolean">BOOLEAN</option>
                        <option value="date">DATE</option>
                        <option value="number">NUMBER</option>
                        <option value="UUID">UUID</option>
                        <option value="varchar">VARCHAR</option>
                    </select>
                </div>
                <div class="col-sm-3">
                    <label class="col-form-label" for="fieldSize">Field size</label>
                    <input type="number" class="form-control" id="fieldSize" />
                </div>
            </div>

            <div class="row pt-3">
                <div class="col-sm-2">
                    <div class="form-check" style="margin-top: 7px">
                        <input class="form-check-input" type="checkbox" id="disabled" />
                        <label class="form-check-label" for="disabled">is Disabled?</label>
                    </div>
                </div>
                <div class="col-sm-2">
                    <div class="form-check" style="margin-top: 7px">
                        <input class="form-check-input" type="checkbox" id="primaryKey" />
                        <label class="form-check-label" for="primaryKey">is Primary Key?</label>
                    </div>
                </div>
                <div class="col-sm-2">
                    <div class="form-check" style="margin-top: 7px">
                        <input class="form-check-input" type="checkbox" id="foreignKey" />
                        <label class="form-check-label" for="foreignKey">is Forigen Key?</label>                                        
                    </div>                            
                </div>
                <div id="colForeignEntity" class="col-sm-3" style="visibility: hidden;">
                    <label class="col-form-label" for="foreignEntity">Forigen Key(Entity Name)</label>
                    <select class="form-select" id="foreignEntity" disabled>
                        <option value="">Selecione</option>
                    </select>
                </div>
                <div id="colForeignKey" class="col-sm-3" style="visibility: hidden">
                    <label class="col-form-label" for="foreignField">Forigen Key(Field Name)</label>
                    <select class="form-select" id="foreignField" disabled>
                        <option value="">Selecione</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-3 offset-sm-9 mt-3">
                    <button type="button" class="btn btn-secondary me-2">Clear</button>
                    <button type="button" class="btn btn-primary">OK</button>
                </div>
            </div>
            <hr />
            <div class="table-responsive">
                <table class="table" width="100%" id="field-tab">
                    <thead>
                        <tr>
                            <th>PK/FK</th>
                            <th>Field Name</th>
                            <th>Label</th>
                            <th>Type</th>
                            <th>Lenght</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in data.rowData">
                            <td>
                                <i class="bi bi-key-fill" title="Primary Key"></i>
                                <i class="bi bi-node-plus-fill" title="Foreign Key"></i>
                            </td>
                            <td>{{ item.fieldName }}</td>
                            <td>{{ item.fieldLabel }}</td>
                            <td>{{ item.fieldType }}</td>
                            <td>{{ item.fieldSize }}</td>
                            <td class="align-right">
                                <i class="bi bi-pencil-square me-2" title="Edit"></i>
                                <i class="bi bi-arrow-up-square me-2" title="Set Up"></i>
                                <i class="bi bi-arrow-down-square me-2" title="Set Down"></i>
                                <i class="bi bi-sliders me-2" title="Configuraçãoes"></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </form>`;
    }

    events(){

        document.querySelector('#appModalLabel').innerHTML = '<i class="bi bi-diagram-3 ms-2 me-2"></i> Entity Fields';

        document.querySelector('#primaryKey').addEventListener('click', (event) => {
            if(document.querySelector('#primaryKey').checked){
                document.querySelector('#foreignKey').checked = false;
                document.querySelector('#foreignKey').disabled = true;
                document.querySelector('#colForeignEntity').style.visibility = 'hidden';
                document.querySelector('#colForeignKey').style.visibility = 'hidden';
            }else{
                document.querySelector('#foreignKey').disabled = false;
            }
        });

        document.querySelector('#foreignKey').addEventListener('click', (event) => {
            if(document.querySelector('#foreignKey').checked){
                document.querySelector('#primaryKey').checked = false;
                document.querySelector('#primaryKey').disabled = true;
                document.querySelector('#colForeignEntity').style.visibility = 'visible';
                document.querySelector('#colForeignKey').style.visibility = 'visible';
            }else{
                document.querySelector('#primaryKey').disabled = false;
                document.querySelector('#colForeignEntity').style.visibility = 'hidden';
                document.querySelector('#colForeignKey').style.visibility = 'hidden';
            }
        });
    }

}