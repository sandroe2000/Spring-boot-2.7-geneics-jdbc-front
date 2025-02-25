import Split from '/src/assets/split.js/dist/split.es.js';

export class Layout {

    constructor(app){
        this.app = app;
        this.obj = {};
        this.tableList = {};
        this.splitW = null;
        this.splitH = null;
        this.visualSql = null;
        this.sqlCode = null;
    }

    async init(){

        await this.app.render({
            path: "/src/layout/VisualSql.js",
            app: true
        });

        await this.app.render({
            path: "/src/layout/SqlCode.js",
            app: true
        });

        this.visualSql = this.app.getComponentByName('VisualSql');
        this.sqlCode = this.app.getComponentByName('SqlCode');

        this.loadSplitJs();

        await this.visualSql.loadTableList();
        this.sqlCode.loadSqlEditor();
        this.loadLayoutPanels();

        await this.events();
        await this.sqlCode.events();
        await this.visualSql.events();
    }

    async formatSql(str){
        
        let result = format(str);
        return result;
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
            document.querySelectorAll('.btn-icon').forEach((el) => el.classList.add('disabled'));
        }, false);

        document.querySelector('#lnkCodeMode').addEventListener('click', async (event) => {             
            document.querySelector('#sqlEditor').classList.remove('hide');
            document.querySelector('#sqlVisual').classList.add('hide');
            document.querySelector('#btnToggleSql').textContent = 'Sql Code';
            document.querySelectorAll('.btn-icon').forEach((el) => el.classList.remove('disabled'));
        }, false);
        
    }
}

document.addEventListener("readystatechange", (event) => { 
    new Layout().init(); 
});