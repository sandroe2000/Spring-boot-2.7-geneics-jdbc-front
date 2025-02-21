import { Utils } from "/src/lib/Utils.js";

export class SqlCode {

    constructor(app){
        this.app = app;
        this.tempParamValues = [];
        this.editor = this.app.getComponentByName('Layout').editor;
        this.obj = this.app.getComponentByName('Layout').obj;
        this.format = null
        this.utils = new Utils();
        this.tableInFocus = null;
    }

    template(){
        return null;
    }

    loadSqlEditor(){
    
        this.editor = monaco.editor.create(document.querySelector('#sqlEditor'), {
            automaticLayout: true,
            language: 'sql',
            value: ''
        });

        document.querySelector('#sqlEditor').style.height = `${document.querySelector('#rightTopPanel').offsetHeight - 90}px`;

        this.editor.getModel().onDidChangeContent((event) => {
            this.editorChange();
        });

        if(this.editor.getValue()){
            this.editorChange();
        }

        this.editor.addAction({
            id: 'execSql',
            label: 'Executar SQL',
            keybindings: [ monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter ],
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1.5,
            run: () => { this.execSql(); }
        });

        this.editor.addAction({
            id: 'formatSql',
            label: 'Formatar SQL',
            keybindings: [ monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Space ],
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1.5,
            run: () => { this.formatSql() }
        });
    }

    async formatSql(){

        this.editor.setValue( format(this.editor.getValue(),{
            language: 'sql', // Defaults to "sql"
            indent: '    ', // Defaults to two spaces,
            uppercase: true, // Defaults to false
            linesBetweenQueries: 2 // Defaults to 1
        }) );
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
            let keyValue = item.replaceAll('\n','').replaceAll('\r','').trim().split(' AS ');
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

    async buildQuery(id, type){

        if(type == "OBJECT_NAME"){
            var line = this.editor.getPosition();
            var range = new monaco.Range(line.lineNumber, line.column, line.lineNumber, line.column);
            var id_ = { major: 1, minor: 1 };
            var text = id.toUpperCase();
            var op = {identifier: id_, range: range, text: text, forceMoveMarkers: true};
            this.editor.executeEdits("my-source", [op]);
            //this.editor.insert( id.toUpperCase() );
            return false;
        }

        let url = `http://localhost:8092/api/v1/generic/buildQuery`;
        let data = await this.app.fetch.getData(url, `id=${id}&type=${type}`);
        
        if(type == "SELECT"){

            let str = 'SELECT ';
            for(let item of data){
                str += `   ${item.columnName} AS ${item.columnName}, `;
            }
            str += 'FROM '+id;
            str += ' ORDER BY 1 OFFSET 0 ROWS FETCH NEXT 100 ROWS ONLY'

            this.editor.setValue(str.replace(', FROM', ' FROM'));
            this.formatSql();
            return false;
        }

        if(type == "DISCRIBE"){
        
            let str =   `${this.setLenght('ordinalPos', 12)}${this.setLenght('columnName', 24)}${this.setLenght('constraintType', 16)}${this.setLenght('dataType', 12)}${this.setLenght('isNullable', 12)}${this.setLenght('maxLength', 12)}${this.setLenght('fkTableName', 24)}\n`;
            for(let item of data){
                str += `${this.setLenght(item.ORDINAL_POSITION, 12)}${this.setLenght(item.columnName, 24)}${this.setLenght(item.constraintType, 16)}${this.setLenght(item.dataType, 12)}${this.setLenght(item.isNullable, 12)}${this.setLenght(item.maxLength, 12)}${this.setLenght(item.fkTableName, 24)}\n`;
            }
            this.editor.setValue(str);
        }
    }

    setLenght(str, len){
        return str + ' '.repeat(len - str.length);
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

        document.querySelector('#listTableResult').addEventListener('click', async (event) => { 
            if(document.querySelector('#sqlVisual').classList.contains('hide')){

                this.tableInFocus = event.target.getAttribute('pk');

                if(event.target.classList.contains('bi-chevron-compact-down')){
                   
                    let panelHide = event.target.closest('button').nextElementSibling;
                    
                    if(panelHide.classList.contains('hide')){
                        panelHide.classList.remove('hide'); 
                    }else{
                        panelHide.classList.add('hide');
                    }
                    
                }else{
                    await this.app.render({
                        path: "/src/layout/InsertionType.js",
                        target: ".modal",
                        app: true,
                        params: {
                            sqlCode: this,
                            label: "Chose the type of insertion"
                        }
                    });
                }


            }else{
                let visual = this.app.getComponentByName('VisualSql');

                await visual.createDivTable( event.target );
                //this.criaDiv(50, 100, event.target.getAttribute('pk'), event.target.getAttribute('fk'))
            }
        }, false);
    }
}