export class Command {

    constructor(app){
        this.app = app;
        this.outputEditor = null;
    }

    template(){
        return `
            <form onsubmit="return false;">
                <div class="row">
                    <div class="col-12">
                        <div class="font-monospace bg-dark" id="output" style="height: 400px; overflow-y: auto; color: #20c997; padding: 10px"></div>
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-12">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" id="command" placeholder="Enter command" aria-describedby="run">
                            <button class="btn btn-primary" type="button" id="run">Run</button>
                        </div>
                    </div>
                </div>
            </form>
        `;
    }

    init(){

        this.events();
    }

   async run(){
        let command = document.getElementById('command').value;
        let url = `http://localhost:8092/api/v1/generic/command`;
        let result = await this.app.fetch.postData(url, command);
        try{
            let lines = result.output.split('\n');
            for (const line of lines) {
                document.querySelector('#output').insertAdjacentHTML('beforeend', `<pre>${line.replaceAll('<', '&#60;')}</pre>`);
            }
            document.querySelector('#output').insertAdjacentHTML('beforeend', `<pre>&nbsp;</pre>`);
        } catch(e){
            vNotify.warning({title:'Erro ao executar commando', text: result});
        }
    }

    events(){

        document.querySelector('#run').addEventListener('click', (event) => {            
            this.run();
        });

        document.querySelector('#run').addEventListener('keydown', (event) => {
            if (event.code === 'Enter') this.run();
        });
    }
}