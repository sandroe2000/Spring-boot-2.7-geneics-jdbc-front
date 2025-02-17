import { VisualSql } from './VisualSql.js';
import { SqlCode } from './SqlCode.js'

import Split from '/src/assets/split.js/dist/split.es.js';

export class Layout {

    constructor(app){
        this.app = app;
        this.editor;
        this.obj = {};
        this.tempParamValues = [];
        this.tableList = {};
        this.splitW = null;
        this.splitH = null;
        this.visualSql = null;
        this.sqlCode = null;
    }

    async init(){

        this.sqlCode = new SqlCode(this.app);
        this.visualSql = new VisualSql(this.app, this.sqlCode );

        this.loadSplitJs();
        await this.visualSql.loadTableList();
        this.sqlCode.loadSqlEditor();
        this.loadLayoutPanels();

        await this.events();
        await this.sqlCode.events();
        await this.visualSql.events();
    }

    loadSplitJs(){

        let that = this;
        this.splitW = Split(['#leftPanel', '#rightPanel'],{
            minSize: 0,
            sizes: [75, 25],
            gutterSize: 8
        });

        this.splitH = Split(['#rightTopPanel', '#rightBottomPanel'], {
            direction: 'vertical',
            minSize: 0,
            sizes: [60, 40],
            gutterSize: 8,
            onDrag: function (sizes) { 
                that.loadLayoutPanels();
            }
        });

        if(window.innerWidth < 1081){
            this.splitW.setSizes([30, 70]);
        }else{
            this.splitW.setSizes([15, 85]);
        }
    }

    loadLayoutPanels(){
        document.querySelector('#sqlEditor').style.height = `${document.querySelector('#rightTopPanel').offsetHeight - 90}px`;
        document.querySelector('#sqlVisual').style.height = `${document.querySelector('#rightTopPanel').offsetHeight - 90}px`;

        document.querySelector('#panelSqlResult').style.height = `${document.querySelector('#rightBottomPanel').offsetHeight - 90}px`;
        document.querySelector('#panelParameters').style.height = `${document.querySelector('#rightBottomPanel').offsetHeight - 90}px`;
        document.querySelector('#panelFieldAlias').style.height = `${document.querySelector('#rightBottomPanel').offsetHeight - 90}px`;
    }

    async events(){

        window.addEventListener("resize", (event) => {
            if(window.innerWidth < 1081){
                this.splitW.setSizes([30, 70]);
            }else{
                this.splitW.setSizes([15, 85]);
            }
            if(window.innerHeight> 1080){
                this.splitH.setSizes([75, 25]);
            }else{
                this.splitH.setSizes([60,40]);
            }
        });

        document.querySelector('#lnkVisualMode').addEventListener('click', async (event) => {             
            document.querySelector('#sqlEditor').classList.add('hide');
            document.querySelector('#sqlVisual').classList.remove('hide');
            document.querySelector('#btnToggleSql').textContent = 'Visual Sql';
        }, false);

        document.querySelector('#lnkCodeMode').addEventListener('click', async (event) => {             
            document.querySelector('#sqlEditor').classList.remove('hide');
            document.querySelector('#sqlVisual').classList.add('hide');
            document.querySelector('#btnToggleSql').textContent = 'Sql Code';
        }, false);
        
    }
}

document.addEventListener("readystatechange", (event) => { 
    new Layout().init(); 
});