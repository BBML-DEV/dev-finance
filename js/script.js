const Modal = {
 
    open() {
        const abrir =  document.querySelector(".modal-overlay");
        abrir.classList.add("active")
            
    },
    close() {
        const fechar = document.querySelector(".modal-overlay");
        fechar.classList.remove("active");
    }
}

const Storage = {
    get(){
       return JSON.parse(localStorage.getItem("dev.fincance:transacoes")) || [];
    },  
    set(transacoes){
        localStorage.setItem("dev.fincance:transacoes", JSON.stringify(transacoes));
    }
}

const Transacao = {
        all: Storage.get(),
        add(transacao){
            Transacao.all.push(transacao);
            App.reload();
        },
        remove(index){
            Transacao.all.splice(index, 1);
            App.reload();
        },
        incomes(){
            let income = 0;
            Transacao.all.forEach(transacao =>{
                if(transacao.amount > 0){
                    income += transacao.amount;
                }
            });
            return income;
        },
        expenses() { 
            let expense = 0;
            Transacao.all.forEach(transacao => {
                if (transacao.amount < 0 ) {
                    expense += transacao.amount;
                }
            });
            return expense;
        },
        //entrada menos a saida
        total() {
            return Transacao.incomes() + Transacao.expenses();
        }
    }

const DOM = {
        containerDeTransacoes: document.querySelector("#data-table tbody"),

        addTransacao(transacao, index) {
            const tr = document.createElement('tr');
            tr.innerHTML = DOM.innerHTMLTransacao(transacao, index);
            tr.dataset.index = index
            this.containerDeTransacoes.appendChild(tr)
        },
        innerHTMLTransacao (transacao, index) {
            const CSSclass= transacao.amount > 0 ? "income": "expense";

            const amount = utilitarios.formatoMoeda(transacao.amount);

            const html = `
                <td class="${CSSclass}">${transacao.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="${CSSclass}">${transacao.date}</td>
                <td>
                 <img onclick="Transacao.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
                </td>
            `;
    
            return html
        },
        atualizarBalance(){
            document.getElementById("incomeDisplay").innerHTML = utilitarios.formatoMoeda(Transacao.incomes());
            document.getElementById("expenseDisplay").innerHTML = utilitarios.formatoMoeda(Transacao.expenses());
            document.getElementById("totalDisplay").innerHTML = utilitarios.formatoMoeda(Transacao.total());
        }, 
        limparTransacao(){
            this.containerDeTransacoes.innerHTML = " ";
        }
    }

const utilitarios = {
        formatoMoeda(valor){
           const signal = Number(valor) < 0 ? "-" : " ";
           valor = String(valor).replace(/\D/g, " ")
           valor = Number(valor) / 100;

           valor = valor.toLocaleString("pt-BR", {
               style: "currency",
               currency: "BRL"
           });
          return signal + valor;
        },
        formatarAmount(valor){
            valor = Number(valor.replace(/\,\./g, "")) * 100
            return valor
        },
        formatarDate(date){
            const separarData = date.split("-");
            return `${separarData[2]}/${separarData[1]}/${separarData[0]}`
        }
    }

const Form = {
      description: document.querySelector("input#description"),
      amount: document.querySelector("input#amount"),
      date: document.querySelector("input#date"),
    
    getValores(){
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value
        }
    },
    validarCampos(){
        const description = this.getValores().description;
        const amount = this.getValores().amount;
        const date = this.getValores().date;

        if ( description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos");
          }
     
    },
    formatarValores(){
        let description = this.getValores().description;
        let amount = this.getValores().amount;
        let date = this.getValores().date;


        amount = utilitarios.formatarAmount(amount);
        date = utilitarios.formatarDate(date);

        return {
            description,
            amount,
            date
        }
    },
    salvarTransacao(transacao){
        Transacao.add(transacao)
    },
    limparCampos(){
       this.description.value = " ";
       this.amount.value = " ";
       this.date.value = " ";
    },
    enviar(event){
        event.preventDefault();

        try {
            //valida todos os campos
            this.validarCampos();
            // formata todos os campos
            const transacao = this.formatarValores();
            //salvar
            this.salvarTransacao(transacao);
            //limpar campos
            this.limparCampos();
            //fechar
            Modal.close();
        } catch (error) {
            alert(error.message);
        }
        

     
      
    }
}

const App = {
    init(){
        Transacao.all.forEach((transacao, index) => {
            DOM.addTransacao(transacao, index)
        });

        DOM.atualizarBalance();
        
        Storage.set(Transacao.all);
    },
    reload(){
        DOM.limparTransacao();
        App.init()
    },
}

App.init();




