export class VisualSql {

    constructor(app, sqlCode){
        this.app = app;
        this.data = [];
        this.dataNode = {};
        this.params = {};
        this.sqlCode = sqlCode;
    }

    template(){
        return null;
    }

    async loadTableList(){   
    
        this.data  = [];
        let list = [];
        document.querySelector('#listTableResult').innerHTML = '';

        try{
            let url = `http://localhost:8092/api/v1/generic/find/1`;
            list = await this.app.fetch.postData(url, [
                {
                    _key: 'name', 
                    _value: '%'+document.querySelector('#searchTable').value+'%'
                }
            ]);
        }catch(err){
            vNotify.error({title:'No data found'});
            return false;
        }

        let lookup = [];
        
        for(let item of list){
            
            let jsonText = `{"tableName": "${item.tableName}", "columns": []}`;
            
            if(lookup.indexOf(jsonText) === -1){
                lookup.push(jsonText);
                this.data .push(JSON.parse(jsonText));
            }
        }

        for(let table of this.data ){
            
            for(let item of list){
                
                let json = {
                    columnName: item.columnName,
                    dataType: item.dataType,
                    isNullable: item.isNullable,
                    constraintType: item.constraintType,
                    referencedTableName: item.fkTableName
                }

                if(table.tableName == item.tableName){
                    table.columns.push(json);
                }
            }
        }
        
        for(let item of this.data ){
            
            let fk = '';
            let pk = '';
            let columns = '';
           
            for(let col of item.columns){
                if(col.referencedTableName){
                    fk += ','+col.referencedTableName;
                }
                if(col.constraintType){
                    pk += ','+col.constraintType;
                }
                if(col.columnName){
                    columns += `<li style="padding-left: 30px">&#8226; ${col.columnName}</li>`;
                }
            }
            let btn = `<button type='button' class='list-group-item text-start d-flex justify-content-between' pk='${item.tableName}' fk='${fk.substring(1)}'>
                    <div pk='${item.tableName}'><i class='bi bi-grid-3x3 me-2'></i>${item.tableName}</div><i class="bi bi-chevron-compact-down"></i>
                </button>                
                <ul class='list-fields hide'></i>${columns}</ul>`;

            document.querySelector('#listTableResult').insertAdjacentHTML('afterbegin', btn)
        }
    }

    setDataNode(id){
        this.dataNode = this.data.find( obj => obj.tableName == id);
    }

    async createDivTable(){

        let that = this;

        let fk = this.dataNode.columns.filter(item => item.referencedTableName != '');
        let pk = this.dataNode.tableName;
        let sqlVisual = document.querySelector('#sqlVisual');
        //let result = this.data.find( obj => obj.tableName == pk);
        let row = "";
      
        for(let item of this.dataNode.columns){

            let constraintType = '';
            if (item.constraintType == 'PRIMARY KEY'){
                constraintType = 'PK';
            } else if (item.constraintType == 'CHECK'){
                constraintType = 'CK';
            } else if(item.referencedTableName) {
                constraintType = 'FK';
            }
            
            row += `<div class='row g-0'>                   
                    <div class='col-auto me-2'>
                        <input id='${pk}_${item.columnName}' type='checkbox' class='form-check-input' />
                    </div>
                    <div class='col-auto pk-fk me-2' style="width: 15px">${constraintType}</div>
                    <div class='col text-truncate' title='${item.columnName}'>
                        <label for='${pk}_${item.columnName}'>${item.columnName}</label>
                    </div>
                    <div class='col-auto ms-2'>
                        <i class='bi bi-arrow-down-up'></i>
                    </div>
                </div>`;
        }

        let html = `<div class='card table-float' id='${pk}' fk='${fk[0]?.referencedTableName}'>
                <div class='card-header d-flex justify-content-between'>
                    <span><i class="bi bi-node-plus-fill me-2"></i> ${pk}</span>
                    <i class="bi bi-x-square close-visual-sql"></i>
                </div>
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
            
            this.dragElement(card);
            this.setLineFromTo(card);
        }
    }

    dragElement(elmnt) {

        const draggable = elmnt
        let container = document.querySelector('#sqlVisual');
        let isDragging = false;
        let offsetX, offsetY;

        draggable.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            offsetX = e.clientX - draggable.offsetLeft;
            offsetY = e.clientY - draggable.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            e.preventDefault();
            if (isDragging) {
                // Calculate the new position in steps of 10px
                let newX = Math.round((e.clientX - offsetX) / 10) * 10;
                let newY = Math.round((e.clientY - offsetY) / 10) * 10;

                // Apply the new position
                draggable.style.left = `${newX}px`;
                draggable.style.top = `${newY}px`;

                this.setLineFromTo(draggable);
                document.querySelector('#visualStatsX1').textContent = (newX);
                document.querySelector('#visualStatsY1').textContent = (newY);
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;

            document.querySelectorAll('.table-float').forEach(element => {
                if(container.offsetTop >= element.offsetTop){
                    element.style.top = (container.offsetTop + 20) + 'px';
                    this.setLineFromTo(element);
                }
                if(container.offsetLeft >= element.offsetLeft){
                    element.style.left = (container.offsetLeft + 20) + 'px';
                    this.setLineFromTo(element);
                }
                if((container.offsetLeft + container.offsetWidth) <= (element.offsetLeft + element.offsetWidth)){
                    element.style.left = (((container.offsetLeft + container.offsetWidth) - element.offsetWidth) - 20) + 'px';
                    this.setLineFromTo(element);
                }
                if((container.offsetTop + container.offsetHeight) <= (element.offsetTop + element.offsetHeight)){
                    element.style.top = (((container.offsetTop + container.offsetHeight) - element.offsetHeight) - 20) + 'px';
                    this.setLineFromTo(element);
                }
            });
        });
    }

    setLineFromTo(from){

        let obj = this.data .find( obj => obj.tableName == from.id);
        let container = document.querySelector('#sqlVisual');
        let listTo = obj.columns.filter(item => item.referencedTableName);

        if (Array.isArray(listTo) && listTo.length) {
            listTo.forEach(element => {                
                let to = container.querySelector(`#${element.referencedTableName}`);
                let line = document.querySelector(`#line_${element.referencedTableName}_${from.id}`);
                if(to){
                    if(!line){
                        line = `
                        <div id='line_${element.referencedTableName}_${from.id}' from='${from.id}' to='${to.id}' class='line'>
                        <div class='line-in'>
                            <p>inner join Tipo_de_publico on</p> 
                            <p>Pessoa.Codigo = Tipo_de_publico.Pessoa_codigo</p> 
                        </div>
                        </div>
                        `;
                        container.insertAdjacentHTML('afterbegin', line);
                        document.querySelector(`#line_${element.referencedTableName}_${from.id}`).addEventListener('click', (event) => {
                        this.changeJoin(event);
                        });
                    }
                    this.adjustLine(from, to, document.querySelector(`#line_${element.referencedTableName}_${from.id}`));
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
            app: true,
            params: {
                from: event.target.closest('div[class="line"]').getAttribute('from'),
                to: event.target.closest('div[class="line"]').getAttribute('to'),
                size: 'modal-lg',
                label: "Condidtion"
            }
        });
    }

    adjustLine (from, to, line) {

        var fT = from.offsetTop + 19;
        var fL = from.offsetLeft + 17;
        var tT = to.offsetTop + 19;
        var tL = to.offsetLeft + 17;

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

    copiarSql(str){
        navigator.clipboard.writeText(str)
        .then(() => {
            vNotify.info({title:'Text copied'});
            console.log('Text copied');
        })
        .catch((err) => console.error(err.name, err.message));
    }

    async events(){

        document.querySelector('#sqlVisual').addEventListener('click', (event) => {
            if(event.target.classList.contains('close-visual-sql')){
                let id = event.target.closest('.card').getAttribute('id');
                document.querySelectorAll(`[id*="_${id}"]`).forEach(element => {
                    element.remove();
                });
                event.target.closest('.card').remove();
            }
            
        }, false);

        document.querySelector('#btnRefreshTableSearch').addEventListener('click', async (event) => {
            await this.loadTableList();        
        });

        if ('clipboard' in navigator) {
            document.querySelector('#tblSqlResult tbody').addEventListener('dblclick', (event) => {
                let str = event.target.closest('td').textContent;
                this.copiarSql(str);
            });
        }

        document.querySelector('#tblSqlResult tbody').addEventListener('contextmenu', (event) => {

            event.preventDefault();
            if(document.querySelector('#tblContextMenu')) return false;

            let contextmenu = `<ul id="tblContextMenu" class="dropdown-menu" eTarget="${event.target.closest('td').textContent}">
                    <li><a class="dropdown-item" id="menuCopiar" href="javascript:void(0);">Copiar</a></li>
                    <li><a class="dropdown-item" href="javascript:void(0);">Editar</a></li>
                    <li><a class="dropdown-item" href="javascript:void(0);">Excluir</a></li>
                </ul>`;
            document.querySelector('body').insertAdjacentHTML('afterbegin', contextmenu);
            document.querySelector('#tblContextMenu').style.top = `${event.clientY}px`; 
            document.querySelector('#tblContextMenu').style.left = `${event.clientX}px`;

            document.querySelector('#tblContextMenu').addEventListener('click', (e) => {
                if(e.target.id == 'menuCopiar'){
                    let str = document.querySelector('#tblContextMenu').getAttribute('eTarget');
                    this.copiarSql(str);
                }
                document.querySelector('#tblContextMenu').remove();
            });

        });
    }
}