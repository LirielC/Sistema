let isLoggedIn = false;
//JavaScript não tem diretamente o conceito de classe abstrata, mas podemos simular
class Pessoa {
    constructor(nome, email) {
        if (this.constructor === Pessoa) {
            throw new Error(" Não deve ser usada para realizar instanciamento");
        }
        this.nome = nome;
        this.email = email;
        
    }

    login() {
        throw new Error("Método 'login' deve ser implementado pelas classes derivadas.");
    }
}

class Cliente extends Pessoa {
    constructor(cpf, nome, email) {
        super(nome, email); // Chama o construtor da superclasse
        this.cpf = cpf;
    } 

    //Tentando aplicar um polimorfismo aqui 

    login(cpf) {
        return this.cpf === cpf; //adicionado apesar de cliente não poder realizar o login no sistema
    }
}

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
            document.getElementById("mensagemCadastroLivro").textContent = "Erro: ISBN já cadastrado!";
        } else {
            const novoLivro = new Livro(isbn, titulo, autor);
            this.livros.push(novoLivro);
            document.getElementById("mensagemCadastroLivro").textContent = "Livro cadastrado com sucesso!";
        }
    }
      alugarLivro(event) {
            event.preventDefault();
            const isbn = document.getElementById("isbnAluguel").value;
            const cpf = document.getElementById("cpfAluguel").value;
            const dataDevolucao = document.getElementById("dataDevolucao").value;

            const livro = this.livros.find(livro => livro.isbn === isbn);
            if (!livro) {
                document.getElementById("mensagemAluguel").textContent = "Erro: Livro não encontrado!";
                return;
            }

            const cliente = this.clientes.find(cliente => cliente.cpf === cpf);
            if (!cliente) {
                document.getElementById("mensagemAluguel").textContent = "Erro: Cliente não encontrado!";
                return;
            }

            if (this.livrosAlugados.some(aluguel => aluguel.livro.isbn === isbn)) {
                document.getElementById("mensagemAluguel").textContent = "Erro: Livro já está alugado!";
                return;
            }

            this.livrosAlugados.push({ livro, cliente, dataDevolucao });
            document.getElementById("mensagemAluguel").textContent = "Livro alugado com sucesso!";
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

        if (this.clientes.some(cliente => cliente.cpf === cpf)) {
            document.getElementById("mensagemCadastroUsuario").textContent = "Erro: CPF já cadastrado!";
        } else {
            const novoCliente = new Cliente(cpf, nome, email);
            this.clientes.push(novoCliente);
            document.getElementById("mensagemCadastroUsuario").textContent = "Usuário cadastrado com sucesso!";
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
                  //historico de alugueis implementado usando cpf como 'chave'
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

// Criação do objeto bibliotecário para logar no sistema
const bibliotecario = new Bibliotecario(1, "Admin", "admin@example.com", "admin123");

// Função de login
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
        document.getElementById("mensagemLogin").textContent = "Erro: ID ou senha inválidos!";
    }
}

// Alternar entre seções esse aqui tava dando bug aí troquei.
//function showSection(sectionId) {
    //document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    //document.getElementById(sectionId).classList.remove("hidden");
//}
/*function showSection(sectionId) {
    if (!isLoggedIn && sectionId !== "login") {
        alert("Faça login para acessar esta funcionalidade.");
        return;
    }


    document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");
}
*/
function showSection(sectionId) {
    if (!isLoggedIn && sectionId !== "login") {
        alert("Faça login para acessar esta funcionalidade.");
        return;
    }

    document.querySelectorAll("section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");

    // Limpar o campo de formulário ao mudar de secão, era algo que não tinha antes ai adicionei
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
}



// Logout
function logout() {
    isLoggedIn = false; // Redefine o estado de login para falso, o bibliotecário não pode fazer mais nada sem logar.
    showSection("login");
    alert("Você foi desconectado.");
}
