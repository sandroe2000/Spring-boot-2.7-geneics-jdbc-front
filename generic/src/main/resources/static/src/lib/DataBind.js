export class DataBind {

    constructor(){ 
        this.init();
    }

    init( formId ){

        let data = new Proxy({}, {
            set (obj, key, value){                
                obj[key] = value;
                let fields = document.querySelectorAll(`[databind="${key}"]`);                
                for (let field of fields){
                    field.value = value;
                }
                return true;
            }
        });

        document.addEventListener('input', function (event) {
            if (!event.target.closest('form').id == formId) return;
            data[event.target.getAttribute('databind')] = event.target.value;
        });

        return data;
     }

     loadData( load, data, formId ){

        Object.keys(load).forEach(key => {
            if(load[key] instanceof Object){
                Array.from( document.querySelector(`#${formId}`).elements ).forEach(input => {
                    let val = false;
                    if(input.hasAttribute('databind') && input.getAttribute('databind').indexOf('.') > -1){
                        val = true;
                    }
                    if(val && input.getAttribute('databind').indexOf(key) > -1){
                        data[input.getAttribute('databind')] = jsonPath(load, `$..${input.getAttribute('databind')}`).toString()
                    }
                });                
            }else{
                data[key] = load[key];
            }
            console.log(data);
        });
    }
}