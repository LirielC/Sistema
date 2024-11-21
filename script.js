let isLoggedIn = false;

class Pessoa {
    constructor(nome, email) {
        if (this.constructor === Pessoa) {
            throw new Error(" Não deve ser usada para realizar instanciamento");
        }
        this.nome = nome;
        this.email = email;
        
    }

    login() {
        throw new Error("Método 'login' deve ser implementado pelas classes filhas.");
    }
}

class Cliente extends Pessoa {
    constructor(cpf, nome, email) {
        super(nome, email); 
        this.cpf = cpf;
    } 

    

    /* login(cpf) {
        return this.cpf === cpf; 
    }
} */

class Livro {
    constructor(isbn, titulo, autor) {
        this.isbn = isbn;
        this.titulo = titulo;
        this.autor = autor;
    }
}

class Bibliotecario extends Pessoa {
    constructor(id, nome, email, senha) {
        super(nome, email);
        this.id = id;
        this.senha = senha;
        this.livros = [];
        this.clientes = [];
        this.livrosAlugados = [];
    }

    login(id, senha) {
        return String(this.id) === String(id) && this.senha === senha;
    }
   

       

    cadastrarLivro(event) {
        event.preventDefault();
        const isbn = document.getElementById("isbn").value;
        const titulo = document.getElementById("titulo").value;
        const autor = document.getElementById("autor").value;

        if (this.livros.some(livro => livro.isbn === isbn)) {
            document.getElementById("mensagemCadastroLivro").textContent = "Erro: ISBN já foi cadastrado";
        } else {
            const novoLivro = new Livro(isbn, titulo, autor);
            this.livros.push(novoLivro);
            document.getElementById("mensagemCadastroLivro").textContent = "Livro cadastrado com sucesso";
        }
    }
      alugarLivro(event) {
            event.preventDefault();
            const isbn = document.getElementById("isbnAluguel").value;
            const cpf = document.getElementById("cpfAluguel").value;
            const dataDevolucao = document.getElementById("dataDevolucao").value;

          if (!validarCPF(cpf)) {
              document.getElementById("mensagemAluguel").textContent = "Erro: CPF inválido ou digitado incorretamente";
              return;
          }

          if (!validarData(dataDevolucao)) {
              document.getElementById("mensagemAluguel").textContent = "Erro: Data de devolução inválida verifique novamente";
              return;
          }

            const livro = this.livros.find(livro => livro.isbn === isbn);
            if (!livro) {
                document.getElementById("mensagemAluguel").textContent = "Erro: Livro não encontrado";
                return;
            }

            const cliente = this.clientes.find(cliente => cliente.cpf === cpf);
            if (!cliente) {
                document.getElementById("mensagemAluguel").textContent = "Erro: Cliente não encontrado no sistema";
                return;
            }

            if (this.livrosAlugados.some(aluguel => aluguel.livro.isbn === isbn)) {
                document.getElementById("mensagemAluguel").textContent = "Erro: Livro já foi alugado";
                return;
            }

            this.livrosAlugados.push({ livro, cliente, dataDevolucao });
            document.getElementById("mensagemAluguel").textContent = "Livro alugado com sucesso";
        }
    

    consultarLivro() {
        const consulta = document.getElementById("consultaLivro").value.toLowerCase();
        const resultados = this.livros.filter(livro =>
            livro.isbn.includes(consulta) ||
            livro.titulo.toLowerCase().includes(consulta) ||
            livro.autor.toLowerCase().includes(consulta)
        );

        const resultadosUl = document.getElementById("resultadosLivros");
        resultadosUl.innerHTML = resultados.length > 0
            ? resultados.map(livro => `<li>${livro.isbn} - ${livro.titulo} (${livro.autor})</li>`).join("")
            : "<li>Nenhum livro encontrado.</li>";
    }

    cadastrarCliente(event) {
        event.preventDefault();
        const cpf = document.getElementById("cpf").value;
        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;

          if (!validarCPF(cpf)) {
              document.getElementById("mensagemCadastroUsuario").textContent = "Erro: CPF inválido verifique novamente";
              return;
          }
         if (!validarEmail(email)) {
             document.getElementById("mensagemCadastroUsuario").textContent = "Erro: E-mail inválido, verifique novamente";
             return;
         }

        if (this.clientes.some(cliente => cliente.cpf === cpf)) {
            document.getElementById("mensagemCadastroUsuario").textContent = "Erro: CPF já encontra-se em nosso sistema";
        } else {
            const novoCliente = new Cliente(cpf, nome, email);
            this.clientes.push(novoCliente);
            document.getElementById("mensagemCadastroUsuario").textContent = "Usuário cadastrado";
        }
    }

    consultarCliente() {
        const consulta = document.getElementById("consultaUsuario").value.toLowerCase();
        const resultados = this.clientes.filter(cliente =>
            cliente.cpf.includes(consulta) ||
            cliente.nome.toLowerCase().includes(consulta) ||
            cliente.email.toLowerCase().includes(consulta)
        );

        const resultadosUl = document.getElementById("resultadosUsuarios");
        const historicoDiv = document.getElementById("historicoUsuario");
        const historicoUl = document.getElementById("historicoAlugueis");

        resultadosUl.innerHTML = "";
        historicoUl.innerHTML = "";
        historicoDiv.classList.add("hidden");

        if (resultados.length === 0) {
            resultadosUl.innerHTML = "<li>Nenhum usuário encontrado.</li>";
        } else {
            resultadosUl.innerHTML = resultados.map((cliente, index) =>
                `<li>
                    ${cliente.cpf} - ${cliente.nome} (${cliente.email}) 
                    <button onclick="bibliotecario.exibirHistoricoAlugueis('${cliente.cpf}')">Ver Histórico</button>
                </li>`
            ).join("");
        }
    }
     verLivrosAlugados() {
         const resultadosUl = document.getElementById("resultadosLivrosAlugados");
         if (this.livrosAlugados.length === 0) {
             resultadosUl.innerHTML = "<li>Nenhum livro alugado.</li>";
         } else {
             resultadosUl.innerHTML = this.livrosAlugados.map(aluguel =>
                 `<li>${aluguel.livro.titulo} (${aluguel.livro.isbn}) - Alugado por ${aluguel.cliente.nome} (CPF: ${aluguel.cliente.cpf}), Devolução: ${aluguel.dataDevolucao}</li>`
             ).join("");
         }
     }
                 
    exibirHistoricoAlugueis(cpf) {
        const historicoDiv = document.getElementById("historicoUsuario");
        const historicoUl = document.getElementById("historicoAlugueis");
        historicoUl.innerHTML = "";

        const alugueis = this.livrosAlugados.filter(aluguel => aluguel.cliente.cpf === cpf);

        if (alugueis.length === 0) {
            historicoUl.innerHTML = "<li>Nenhum histórico de aluguéis encontrado.</li>";
        } else {
            historicoUl.innerHTML = alugueis.map(aluguel =>
                `<li>
                    Livro: ${aluguel.livro.titulo} (ISBN: ${aluguel.livro.isbn})<br>
                    Data de Devolução: ${aluguel.dataDevolucao}
                </li>`
            ).join("");
        }

        historicoDiv.classList.remove("hidden");
    }
}


const bibliotecario = new Bibliotecario(1, "Luke Dunphy", "admin@gmail.com", "admin123");


function handleLogin(event) {
    event.preventDefault();
    const id = document.getElementById("loginId").value.trim();
    const senha = document.getElementById("loginSenha").value.trim();
    console.log(`ID Inserido: ${id}, Senha Inserida: ${senha}`);
    console.log(`ID Armazenado: ${bibliotecario.id}, Senha Armazenada: ${bibliotecario.senha}`);


    if (bibliotecario.login(id, senha)) {
        isLoggedIn = true;
        showSection("menu");
        document.getElementById("mensagemLogin").textContent = "";
    } else {
        document.getElementById("mensagemLogin").textContent = "Erro: ID ou senha inválidos";
    }
}
  function validarCPF(cpf) {
      cpf = cpf.replace(/[^\d]/g, ""); 

      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
          return false;
      }

      const calcularDigito = (base) => {
          let soma = 0;
          for (let i = 0; i < base.length; i++) {
              soma += parseInt(base[i]) * (base.length + 1 - i);
          }
          let resto = soma % 11;
          return resto < 2 ? 0 : 11 - resto;
      };

      const baseCPF = cpf.slice(0, 9);
      const digito1 = calcularDigito(baseCPF); 
      const digito2 = calcularDigito(baseCPF + digito1); 

      return digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
  }

  function validarData(data) {
      const hoje = new Date();
      const dataInserida = new Date(data);
      return dataInserida >= hoje;
  }
  function validarEmail(email) {
      
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return regexEmail.test(email);
  }





    document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}

function showSection(sectionId) {
    if (!isLoggedIn && sectionId !== "login") {
        alert("Faça login para acessar esta funcionalidade.");
        return;
    }

    document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");

   
    if (sectionId === "cadastrarLivro") {
        document.getElementById("isbn").value = "";
        document.getElementById("titulo").value = "";
        document.getElementById("autor").value = "";
        document.getElementById("mensagemCadastroLivro").textContent = "";
    } else if (sectionId === "cadastrarUsuario") {
        document.getElementById("cpf").value = "";
        document.getElementById("nome").value = "";
        document.getElementById("email").value = "";
        document.getElementById("mensagemCadastroUsuario").textContent = "";
    } else if (sectionId === "alugarLivro") {
        document.getElementById("isbnAluguel").value = "";
        document.getElementById("cpfAluguel").value = "";
        document.getElementById("dataDevolucao").value = "";
        document.getElementById("mensagemAluguel").textContent = "";
     
        
      }
    else if (sectionId === "consultarUsuario") {
        document.getElementById("consultaUsuario").value = ""; 
        document.getElementById("resultadosUsuarios").innerHTML = ""; 
        document.getElementById("historicoUsuario").classList.add("hidden"); 
        document.getElementById("historicoAlugueis").innerHTML = ""; 
    }
    
    }





function logout() {
    isLoggedIn = false; 
    showSection("login");
    alert("Você foi desconectado.");
}
