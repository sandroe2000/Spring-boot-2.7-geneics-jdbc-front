export class VisualSql {

    constructor(app, sqlCode){
        this.app = app;
        this.result = [];
        this.params = {};
        this.sqlCode = sqlCode;
    }

    async loadTableList(){   
    
        this.result = [];
        document.querySelector('#listTableResult').innerHTML = '';

        let url = `http://localhost:8092/api/v1/generic/find/1`;
        let list = await this.app.fetch.postData(url, [
            {
                _key: 'name', 
                _value: '%'+document.querySelector('#searchTable').value+'%'
            }
        ]);

        /*[
            {
                table_name: '',
                columns: [
                    {
                        column_name: '',
                        udt_name: '',
                        constraint_type: '',
                        fk_table: ''
                    }
                ]
            }
        ]*/

        let lookup = [];
        
        for(let item of list){
            
            let jsonText = `{"tableName": "${item.tableName}", "columns": []}`;
            
            if(lookup.indexOf(jsonText) === -1){
                lookup.push(jsonText);
                this.result.push(JSON.parse(jsonText));
            }
        }

        for(let table of this.result){
            
            for(let item of list){
                
                let json = {
                    columnName: item.columnName,
                    dataType: item.dataType,
                    isNullable: item.isNullable,
                    referencedTableName: item.fkTableName
                }

                if(table.tableName == item.tableName){
                    table.columns.push(json);
                }
            }
        }
        
        for(let item of this.result){
            
            let fk = '';
            let pk = '';
           
            for(let col of item.columns){
                if(col.referencedTableName){
                    fk += ','+col.referencedTableName;
                }
                if(col.constraintType){
                    pk += ','+col.constraintType;
                }
            }
            let btn = `<button type='button' class='list-group-item text-start' pk='${item.tableName}' fk='${fk.substring(1)}'>
                    <i class='bi bi-grid-3x3 me-2'></i>${item.tableName}
                </button>`;

            document.querySelector('#listTableResult').insertAdjacentHTML('afterbegin', btn)
        }
    }

    async createDivTable(element){

        let that = this;

        let fk = element.getAttribute('fk');
        let pk = element.getAttribute('pk');
        let sqlVisual = document.querySelector('#sqlVisual');
        let result = this.result.find( obj => obj.tableName == pk);
        let row = "";
      
        for(let item of result.columns){

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

        let html = `<div class='card table-float' id='${pk}' fk='${fk}'>
                <div class='card-header d-flex justify-content-between'>
                    <span><i class="bi bi-node-plus-fill me-2"></i> ${element.textContent}</span>
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

        let that = this;
        let container = document.querySelector('#sqlVisual');
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        if (document.querySelector(`div#${elmnt.id} div.card-header`)) {
            document.querySelector(`div#${elmnt.id} div.card-header`).onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }

        //if (elmnt.id) {
        //    elmnt.onmousedown = dragMouseDown;
        //} else {
        //    elmnt.onmousedown = dragMouseDown;
        //}

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
            //that.moveLine(elmnt);

            document.querySelector('#visualStatsX1').textContent = (elmnt.offsetTop - pos2);
            document.querySelector('#visualStatsY1').textContent = (elmnt.offsetLeft - pos1);

            //TODO: AO LIBERAR DRAG -> VALIDAR POSIÇÃO DO DIV E SE NECESSARIO CORRI-LA.
            if(container.offsetTop == elmnt.offsetTop){

                elmnt.style.top = (elmnt.offsetTop + 20) + 'px';
                closeDragElement();
                that.setLineFromTo(elmnt);
            }

            if(container.offsetLeft == elmnt.offsetLeft){

                elmnt.style.left = (elmnt.offsetLeft + 20) + 'px';
                closeDragElement();
                that.setLineFromTo(elmnt);
            }

            if((container.offsetLeft + container.offsetWidth) == (elmnt.offsetLeft + elmnt.offsetWidth)){
                elmnt.style.left = (elmnt.offsetLeft - 20) + 'px';
                closeDragElement();
                that.setLineFromTo(elmnt);
            }
            
            if((container.offsetTop + container.offsetHeight) == (elmnt.offsetTop + elmnt.offsetHeight)){
                elmnt.style.top = (elmnt.offsetTop - 20) + 'px';
                closeDragElement();
                that.setLineFromTo(elmnt);
            }
            
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;

            //VALIDAR POSIÇÃO DO DIV E SE NECESSARIO CORRI-LA.
            document.querySelectorAll('.table-float').forEach(element => {
                if(container.offsetTop >= element.offsetTop){
                    element.style.top = (container.offsetTop + 20) + 'px';
                    that.setLineFromTo(element);
                }
                if(container.offsetLeft >= element.offsetLeft){
                    element.style.left = (container.offsetLeft + 20) + 'px';
                    that.setLineFromTo(element);
                }
                if((container.offsetLeft + container.offsetWidth) <= (element.offsetLeft + element.offsetWidth)){
                    element.style.left = (((container.offsetLeft + container.offsetWidth) - element.offsetWidth) - 20) + 'px';
                    that.setLineFromTo(element);
                }
                if((container.offsetTop + container.offsetHeight) <= (element.offsetTop + element.offsetHeight)){
                    element.style.top = (((container.offsetTop + container.offsetHeight) - element.offsetHeight) - 20) + 'px';
                    that.setLineFromTo(element);
                }
            });
        }
    }

    setLineFromTo(from){

        let obj = this.result.find( obj => obj.tableName == from.id);
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

        /*
        document.querySelector('#btn2').addEventListener('click', async (event) => {
            this.criaDiv(100, 160, 'div3', 'div1');   
        });
        document.querySelector('#btn3').addEventListener('click', async (event) => { 
            this.criaDiv(20, 80, 'div1', '');     
        });
        */
    }

    /*
    //--> https://programacaoscriptsweb.blogspot.com/2012/10/ligando-duas-divs-com-um-conector-sem.html  
    criaDiv(_x, _y, id, fk){

        let sqlVisual = document.querySelector('#sqlVisual');

        let div = document.createElement("div");
            div.setAttribute('id', id);
            div.setAttribute('fk', fk);
            div.setAttribute('class', 'gerada');
            div.setAttribute('style', `width:200px;height:100px;top:${_y}px;left:${_x}px`);

        let col1 = document.createElement("div");
            col1.setAttribute('class', 'col-md-2 ps-1');

        let icon = document.createElement("i");
            icon.setAttribute('class', 'bi bi-node-plus-fill');

        let col2 = document.createElement("div");
            col2.setAttribute('class', 'col-md-8');

        let col3 = document.createElement("div");
            col3.setAttribute('class', 'col-md-2');

        let row = document.createElement("div");
            row.setAttribute('class', 'row g-0');

        div.appendChild(row);

        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);

        col1.appendChild(icon);

        sqlVisual.insertAdjacentElement('afterbegin', div);

        this.dragElement(div);
        this.criaConector(div)
    }

    setParams(div1, div2){

        let obj1 = div1.querySelector(`.bi-node-plus-fill`);
        let obj2 = div2.querySelector(`.bi-node-plus-fill`);
        let w = 16;
        let h = 21;

        this.params = {
            obj1: obj1,
            obj2: obj2,
            _x1: obj1.offsetLeft + div1.offsetLeft,
            _y1: obj1.offsetTop + div1.offsetTop,
            _x2: obj2.offsetLeft + div2.offsetLeft,
            _y2: obj2.offsetTop + div2.offsetTop,
            _width1: w,
            _height1: h,
            _height2: h,
            sqlVisual: document.querySelector('#sqlVisual'),
            widthX: (obj2.offsetLeft + div2.offsetLeft) - ((obj1.offsetLeft + div1.offsetLeft)+h),
            difYe: (obj2.offsetTop + div2.offsetTop) + h/2 - ((obj1.offsetTop + div1.offsetTop) + h/2),
        };

    }

    criaConector(obj){

        let div1 = obj;

        if(!div1.getAttribute('fk') || div1.getAttribute('fk').length == 0) {
            return false;
        }

        for(let item of obj.getAttribute('fk').split(',')){
            
            if(!item) continue;

            let lineA = document.createElement("div");
                lineA.setAttribute('id', `${div1.getAttribute('id')}_${item}_A`);
                lineA.setAttribute('class', 'conecta');

            let lineB = document.createElement("div");
                lineB.setAttribute('id', `${div1.getAttribute('id')}_${item}_B`);
                lineB.setAttribute('class', 'conecta');

            let lineC = document.createElement("div");
                lineC.setAttribute('id', `${div1.getAttribute('id')}_${item}_C`);
                lineC.setAttribute('class', 'conecta');

            sqlVisual.insertAdjacentElement('afterbegin', lineA);
            sqlVisual.insertAdjacentElement('afterbegin', lineB);
            sqlVisual.insertAdjacentElement('afterbegin', lineC);
        }

        this.moveLine(obj);
    }

    
    moveLine(obj){

        document.querySelectorAll(`div[fk*="${obj.getAttribute('id')}"]`).forEach(element => {
            this.moveLine(element);
        });

        let div1 = obj;
        let div2 = null;
        
        for(let item of obj.getAttribute('fk').split(',')){

            if(!item) continue;

            div2 = document.querySelector(`#${item}`);

            if(!div2) continue;

            this.setParams(div1, div2);

            let h, w, l, t  = 0;

            if((this.params.widthX/2) >= 0){
                w = this.params.widthX/2;
                l = parseInt(this.params._x1+this.params._width1);               
            }else{
                w = Math.abs(this.params.widthX/2) - this.params._width1;
                l = parseInt(this.params._x1) - w; 
            }
            let lineA = document.querySelector(`#${div1.getAttribute('id')}_${div2.getAttribute('id')}_A`);
                lineA.removeAttribute('style');
                lineA.setAttribute('style', `width:${w}px; height:1px; top:${parseInt(this.params._y1+this.params._height1/2)}px; left:${l}px`);

            if(this.params.difYe >= 0){
                h = this.params.difYe;
                t = parseInt(this.params._y1+this.params._height1/2);                
            }else{
                h = Math.abs(this.params.difYe);
                t = parseInt(this.params._y1+this.params._height1/2) - h; 
            }
            let lineB = document.querySelector(`#${div1.getAttribute('id')}_${div2.getAttribute('id')}_B`);
                lineB.removeAttribute('style');
                lineB.setAttribute('style', `width:1px; height:${h}px; top:${t}px; left:${parseInt(this.params._x1+this.params._width1+this.params.widthX/2)}px`);
                
            if((this.params.widthX/2) >= 0){
                w = this.params.widthX/2;
                l = parseInt(this.params._x1+this.params._width1+this.params.widthX/2);               
            }else{
                w = Math.abs(this.params.widthX/2) - this.params._width1;
                l = parseInt(this.params._x1+this.params._width1+this.params.widthX/2) - w; 
            }
            let lineC = document.querySelector(`#${div1.getAttribute('id')}_${div2.getAttribute('id')}_C`);
                lineC.removeAttribute('style');
                lineC.setAttribute('style', `width:${w}px; height:1px; top:${parseInt(this.params._y2+this.params._height2/2)}px; left:${l}px`);
        }

        document.querySelector('#visualStatsX1').textContent = this.params._x1;
        document.querySelector('#visualStatsY1').textContent = this.params._y1;

        document.querySelector('#visualStatsX2').textContent = this.params._x2;
        document.querySelector('#visualStatsY2').textContent = this.params._y2;
    }
    */
}