export class SqlCode {

    constructor(app){
        this.app = app;

        this.editor = this.app.getComponentByName('Layout').editor;
        this.obj = this.app.getComponentByName('Layout').obj;
    }

    loadSqlEditor(){
    
        this.editor = monaco.editor.create(document.querySelector('#sqlEditor'), {
            automaticLayout: true,
            value: '',
            language: 'pgsql'
        });

        document.querySelector('#sqlEditor').style.height = `${document.querySelector('#rightTopPanel').offsetHeight - 90}px`;

        this.editor.getModel().onDidChangeContent((event) => {
            this.editorChange();
        });

        if(this.editor.getValue()){
            this.editorChange();
        }
    }

    editorChange(){

        let editorVal = this.editor.getValue();

        this.setTabConditionParameters();
        
        this.obj._sql = editorVal;
        this.obj.fieldNames = this.changeAlias(editorVal);
        this.obj.parameters = this.changeParams(editorVal)
    }

    changeAlias(editorVal){

        let pre = document.querySelector('#panelFieldAlias pre');
        let start = editorVal.indexOf('SELECT')+6;
        let end = editorVal.indexOf('FROM');

        if(start<0 || end<0) {
            pre.innerHTML = '[]';
            return false;
        }

        let strAlias = editorVal.substring(start, end).split(',');
        let listAlias = [];
        
        for(let item of strAlias){
            let keyValue = item.replaceAll('\n','').replaceAll(' ','').split('AS');
            let alias = {_key: keyValue[0], _value: keyValue[1]};
            listAlias.push(alias);
        }
        pre.innerHTML = JSON.stringify(listAlias, null, 2);
        return listAlias;
    }

    changeParams(editorVal){

        let pre = document.querySelector('#panelParameters pre');
        let start = editorVal.indexOf('WHERE')+5;
        
        if(start<0) {
            pre.innerHTML = '[]';
            return false;
        }

        let strParams = editorVal.substring(start);
        let listParams = [];
        let parameters = [];
        let regexp = /(^|:\w+)/gm;
        let matchAll = strParams.matchAll(regexp);
            matchAll = Array.from(matchAll);
        
        for(let item of matchAll){
            if(item[0].startsWith(':')){ 
                listParams.push({_key: item[0].replace(':', ''), _value: `<input type='text' class='temp-param mb-1' style='width: 80px' value='' id='${item[0].replace(':', '')}' />`});
                parameters.push({_key: item[0].replace(':', ''), _value: ''});
            }
        }

        pre.innerHTML = JSON.stringify(listParams, null, 2);

        this.setParamValues();

        return parameters;
    }

    setParamValues(){

        document.querySelectorAll('.temp-param').forEach(element => {
            for(let temp of this.tempParamValues){
                if(element.id == temp.id){
                    element.value = temp.value;
                }
            }
        });

    }

    setTable(obj){

        let table = document.querySelector('#panelSqlResult');
        table.querySelector('thead').innerHTML = '';
        table.querySelector('tbody').innerHTML = '';

        document.querySelector('#resultInfo').style.display = 'block';
        document.querySelector('#resultDetail').innerHTML = '';

        if(!obj.result?.length) return false;

        let th = '';
        for(let item of obj.fieldNames){
            th += `<th>${item._value}</th>`;
        }
        let theah = `<tr>${th}</tr>`;
        table.querySelector('thead').insertAdjacentHTML('afterbegin', theah);

        for(let row of obj.result){
            let td = '';
            for(let item of obj.fieldNames){
                td += `<td class='nowrap'>${row[item._value]}</td>`;
            }
            let tbody = `<tr>${td}</tr>`;
            table.querySelector('tbody').insertAdjacentHTML('beforeend', tbody);
        }   
    }

    async execSql() {

        //TODO: VALIDAR SINTAXE SQL ANTES DO ENVIO
        let frm = document.querySelector('#frmParms')?.elements;
        for(let el of frm){
            for(let item of this.obj.parameters){
                if(item._key == el.getAttribute('id')){
                    if(el.value == '') {

                        alert('Obrigatório preencher valor dos parametros!');

                        this.setTabConditionParameters();

                        el.focus();
                        return false;

                    }
                    item._value = el.value;

                    let newParam = {id:item._key, value:el.value};
                    if (!this.tempParamValues.find(item => item.id === newParam.id)) {
                        this.tempParamValues.push(newParam);
                    }

                    this.tempParamValues.forEach(element => {
                        if(element.id === newParam.id) {
                            element.value = newParam.value;
                        }
                    });
                }
            }
        }

        let url = `http://localhost:8092/api/v1/generic`;
        this.obj.result = await this.app.fetch.postData(url, this.obj);

        this.setTabSqlResult();

        if(!Array.isArray(this.obj.result)){
            this.execSqlError(this.obj.result);
            return false;
        }

        this.setTable(this.obj);

        return this.obj;
    }

    async saveFileSql(){

        let url = `http://localhost:8092/api/v1/generic/save`;
        let result = await this.app.fetch.postData(url, this.obj);
        this.execSqlError(JSON.stringify(result, null, 2));
    }

    execSqlError(err){

        let table = document.querySelector('#panelSqlResult');
        table.querySelector('thead').innerHTML = '';
        table.querySelector('tbody').innerHTML = '';

        document.querySelector('#resultInfo').style.display = 'none';
        document.querySelector('#resultDetail').innerHTML = err;
    }

    setTabConditionParameters(){
        let newTab = document.querySelector(`#indexTabs button[data-bs-target='#conditionParametersTabPane']`);
        let tabTrigger = new bootstrap.Tab(newTab);
        tabTrigger.show();
    }

    setTabSqlResult(){
        let newTab = document.querySelector(`#indexTabs button[data-bs-target='#sqlResultTabPane']`);
        let tabTrigger = new bootstrap.Tab(newTab);
        tabTrigger.show();
    }

    async events(){

        document.querySelector('#btnSaveFileSql').addEventListener('click', async (event) => {
            await this.execSql();
            await this.saveFileSql();        
        });

        document.querySelector('#btnExecSql').addEventListener('click', async (event) => { 
            let result = await this.execSql(); 
        }, false);

        document.querySelector('#btnClearSql').addEventListener('click', async (event) => {
            this.editor.setValue( '' ) ;
        }, false);

        document.querySelector('#btn1Sql').addEventListener('click', async (event) => {
            let str = ['SELECT ',    
                '   metadata_id AS metadata_id, ',    
                '   _sql        AS _sql, ',
                '   _limit      AS _limit, ',
                '   _offset     AS _offset ',
                ' FROM ',
                '   generic_metadata '].join('\n');
            this.editor.setValue( str ) ;
        }, false);
    }
}