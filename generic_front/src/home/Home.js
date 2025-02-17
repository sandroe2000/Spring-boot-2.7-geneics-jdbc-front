import Split from '/src/assets/split.js/dist/split.es.js';

export class Home {

    constructor(app){
        this.app = app;
        this.editor;
        this.obj = {};
        this.tempParamValues = [];
        this.tableList = {};
    }

    async init(){

        Split(['#leftPanel', '#rightPanel'], {
            gutterSize: 7,
            minSize: 0,
            sizes: [15, 85]
        });

        Split(['#rightTopPanel', '#rightBottomPanel'], {
            direction: 'vertical',
            minSize: 70,
            gutterSize: 7,
            sizes: [50, 50],
            onDrag: function (sizes) { 
                document.querySelector('#sqlEditor').style.height = `${document.querySelector('#rightTopPanel').offsetHeight - 82}px`;
                document.querySelector('#sqlVisual').style.height = `${document.querySelector('#rightTopPanel').offsetHeight - 82}px`;
                document.querySelector('#cardResult').style.height = `${document.querySelector('#rightBottomPanel').offsetHeight - 83}px`;
                document.querySelector('#cardParameters').style.height = `${document.querySelector('#rightBottomPanel').offsetHeight - 83}px`;
            }
        });

        this.loadTableList();
        this.loadSqlEditor();
        this.events();
    }

    async loadTableList(){   

        let list = [];
        let url = `http://localhost:8092/api/v1/generic/find/1`;
        let query = await this.app.fetch.postData(url, []);

        if(!Array.isArray(query)) return false;
        
        for(let item of query){
            let tb = {
                content: item.name,
                tr: {
                    pk: item.name
                }
            };

            let url2 = `http://localhost:8092/api/v1/generic/find/2`;
            let query2 = await this.app.fetch.postData(url2, [{_key: 'tableName', _value: item.name}]);

            if(Array.isArray(query2)){
                for(let item2 of query2){
                    if(item.name == item2.pk){
                        if(!tb.tr.fk){
                            tb.tr.fk = [];
                        }
                        tb.tr.fk.push(item2.fk);
                    }
                }
            }
            list.push(tb);
        }

        for(let item of list){
            let btn = `<button type='button' class='list-group-item text-start' pk='${item.tr?.pk}' fk='${item.tr?.fk}'>
                    <i class='bi bi-grid-3x3 me-2'></i>${item.content}
                </button>`;
            document.querySelector('#listTableResult').insertAdjacentHTML('afterbegin', btn)
        }
        
    }

    initObj(){
        this.obj = {
            id: '',
            _sql: '',
            fieldNames: [],
            parameters: [],
            result: [],
            _limit: 10,
            _offset: 0
        };
    }

    loadSqlEditor(){

        this.editor = monaco.editor.create(document.querySelector('#sqlEditor'), {
            automaticLayout: true,
            value: [
                'SELECT ',
                '    tpub.tipo_publico_id    AS id, ',
                '    tpub.inativo            AS inativo, ',
                '    tpub.descricao          AS descricao ',
                'FROM ',
                '    tipo_publico tpub ',
                'WHERE ',
                '    1 = 1 ',
                '    AND tpub.descricao LIKE :descricao ',
                'ORDER BY tpub.descricao ASC ',
                'LIMIT 10 ',
                'OFFSET 0 '].join('\n'),
            language: 'pgsql'
        });

        this.editor.getModel().onDidChangeContent((event) => {
            this.editorChange();
        });

        if(this.editor.getValue()){
            this.editorChange();
        }
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

    editorChange(){

        let editorVal = this.editor.getValue();

        this.setTabConditionParameters();
        
        this.obj._sql = editorVal;
        this.obj.fieldNames = this.changeAlias(editorVal);
        this.obj.parameters = this.changeParams(editorVal)
    }

    changeAlias(editorVal){

        let pre = document.querySelector('#cardFieldsAlias pre');
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

        let pre = document.querySelector('#cardParameters pre');
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

    execSqlError(err){

        let table = document.querySelector('#cardResult');
        table.querySelector('thead').innerHTML = '';
        table.querySelector('tbody').innerHTML = '';
        
        document.querySelector('#resultInfo').style.display = 'none';
        document.querySelector('#resultDetail').innerHTML = err;
    }

    setTable(obj){

        let table = document.querySelector('#cardResult');
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

    async createDivTable(element){
 
        let fk = element.getAttribute('fk');
        fk = fk == 'undefined' ? '' : ` fk='${fk}'`;
        let pk = element.getAttribute('pk');
        let sqlVisual = document.querySelector('#sqlVisual');
        
        let url = `http://localhost:8092/api/v1/generic/find/3`;
        let result = await this.app.fetch.postData(url, [{_key: 'table', _value: pk}]);

        let row = "";
        for(let item of result){

            let constraintType = '';
            if (item.constraint_type == 'PRIMARY KEY'){
                constraintType = 'PK';
            } else if (item.constraint_type == 'CHECK'){
                constraintType = 'CK';
            } else if(item.to_table != '') {
                constraintType = 'FK';
            }
            
            row += `<div class='row g-0'>                    
                    <div class='col-auto me-2'>
                        <input id='${item.column_name}' type='checkbox' class='form-check-input' />
                    </div>
                    <div class='col-auto pk-fk me-2' style="width: 15px">${constraintType}</div>
                    <div class='col text-truncate' title='${item.column_name}'>
                        <label for='${item.column_name}'>${item.column_name}</label>
                    </div>
                    <div class='col-auto ms-2'>
                        <i class='bi bi-arrow-down-up'></i>
                    </div>
                </div>`;
        }
        
        let html = `<div class='card table-float' id='${pk}' pk='${pk}'${fk}>
                <div class='card-header'>${element.textContent}</div>
                <div class='card-body'>	
                    ${row}
                </div>
            </div>`;

        if(!sqlVisual?.querySelector(`#sqlVisual #${pk}`)){
            
            sqlVisual.insertAdjacentHTML('afterbegin', html);

            let card = sqlVisual.querySelector(`#${pk}`);
            
            let qtd = sqlVisual.querySelectorAll(`#sqlVisual div.card.table-float`).length;
                qtd == 0 ? 1 : qtd > 10 ? 1 : qtd;    
                
            let topIni = 50;
                
            card.style.top = `${topIni+(30*qtd)}px`;
            card.style.left = `${30*qtd}px`;
            card.style.zIndex = `${200+qtd}`;

            this.dragElement( card );
            this.setLineFromTo( card );
        }
    }

    dragElement(elmnt) {

        let that = this;
    
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.querySelector(`div#${elmnt.id} div.card-header`)) {
          /* if present, the header is where you move the DIV from:*/
          document.querySelector(`div#${elmnt.id} div.card-header`).onmousedown = dragMouseDown;
        } else {
          /* otherwise, move the DIV from anywhere inside the DIV:*/
          elmnt.onmousedown = dragMouseDown;
        }
      
        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        };
      
        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + 'px';
          elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px';
    
          that.setLineFromTo(elmnt);
        }
      
        function closeDragElement() {
          /* stop moving when mouse button is released:*/
          document.onmouseup = null;
          document.onmousemove = null;
        }
      }

      setLineFromTo(from){

        let container = document.querySelector('#sqlVisual');
        let listTo = [0];

        if(from.hasAttribute('fk')){
          listTo = from.getAttribute('fk')?.split(',');
        }
        
        if(listTo[0]){
          listTo.forEach(element => {
            let to = container.querySelector(`#${element}`);
            let line = document.querySelector(`#line_${element}_${from.id}`);
            if(to){
              if(!line){
                line = `
                <div id='line_${element}_${from.id}' from='${from.id}' to='${to.id}' class='line'>
                  <div class='line-in'>
                    <p>inner join Tipo_de_publico on</p> 
                    <p>Pessoa.Codigo = Tipo_de_publico.Pessoa_codigo</p> 
                  </div>
                </div>
                `;
                container.insertAdjacentHTML('afterbegin', line);
                document.querySelector(`#line_${element}_${from.id}`).addEventListener('click', (event) => {
                  this.changeJoin(event);
                });
              }
              this.adjustLine(from, to, document.querySelector(`#line_${element}_${from.id}`));
              return;
            }
          });

        }

        let recall = container.querySelectorAll(`div[fk*='${from.getAttribute('id')}']`);
            recall.forEach(element => {
                this.setLineFromTo(element);
            });
      }

      async changeJoin(event){

        await this.app.render({
            path: "/src/home/Join.js",
            target: ".modal",
            params: {
                from: event.target.closest('div[class="line"]').getAttribute('from'),
                to: event.target.closest('div[class="line"]').getAttribute('to'),
                size: 'modal-lg',
                label: "Condidtion"
            },
            notCss: true
        });
      }
    
      adjustLine (from, to, line) {
    
        var fT = from.offsetTop  + from.offsetHeight/2;
        var tT = to.offsetTop      + to.offsetHeight/2;
        var fL = from.offsetLeft + from.offsetWidth/2;
        var tL = to.offsetLeft     + to.offsetWidth/2;
      
        var CA   = Math.abs(tT - fT);
        var CO   = Math.abs(tL - fL);
        var H    = Math.sqrt(CA*CA + CO*CO);
        var ANG  = 180 / Math.PI * Math.acos( CA/H );
      
        if(tT > fT){
            var top  = (tT-fT)/2 + fT;
        }else{
            var top  = (fT-tT)/2 + tT;
        }
        if(tL > fL){
            var left = (tL-fL)/2 + fL;
        }else{
            var left = (fL-tL)/2 + tL;
        }
      
        if(( fT < tT && fL < tL) || ( tT < fT && tL < fL) || (fT > tT && fL > tL) || (tT > fT && tL > fL)){
          ANG *= -1;
        }
        top-= H/2;
      
        line.style['-webkit-transform'] = 'rotate('+ ANG +'deg)';
        line.style['-moz-transform'] = 'rotate('+ ANG +'deg)';
        line.style['-ms-transform'] = 'rotate('+ ANG +'deg)';
        line.style['-o-transform'] = 'rotate('+ ANG +'deg)';
        line.style['-transform'] = 'rotate('+ ANG +'deg)';
    
        line.style.top    = top+'px';
        line.style.left   = left+'px';
        line.style.height = H + 'px';
        line.style.alignContent = 'center';
    }

    async saveFileSql(){

        let url = `http://localhost:8092/api/v1/generic/save`;
        this.obj = await this.app.fetch.postData(url, this.obj);
        this.execSqlError(JSON.stringify(this.obj, null, 2));
    }

    events(){

        document.querySelector('#btnExecSql').addEventListener('click', async (event) => { 
            let result = await this.execSql() 
        }, false);

        document.querySelector('#listTableResult').addEventListener('click', async (event) => { 
            if(document.querySelector('#sqlVisual').classList.contains('hide')){
                await this.app.render({
                    path: "/src/home/InsertionType.js",
                    target: ".modal",
                    params: {
                        label: "Chose the type of insertion"
                    },
                    app: true
                });
            }else{
                await this.createDivTable( event.target );
            }
        }, false);

        document.querySelector('#lnkVisualMode').addEventListener('click', async (event) => {             
            document.querySelector('#sqlEditor').classList.add('hide');
            document.querySelector('#sqlVisual').classList.remove('hide');
        }, false);

        document.querySelector('#lnkCodeMode').addEventListener('click', async (event) => {             
            document.querySelector('#sqlEditor').classList.remove('hide');
            document.querySelector('#sqlVisual').classList.add('hide');
        }, false);

        document.querySelector('#btnOpenFileSql').addEventListener('click', async (event) => { 
            await this.app.render({
                path: "/src/home/OpenSql.js",
                target: ".modal",
                params: {
                    label: "Open SQL File",
                    size: 'modal-lg'
                },
                app: true
            });         
        }, false);

        document.querySelector('#btnSaveFileSql').addEventListener('click', async (event) => {
            await this.execSql();
            await this.saveFileSql();        
        });

    }
}