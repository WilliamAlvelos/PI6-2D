var canvas, ctx;
var x;

var clientes = [];
var atendentes = [];
var balcao;

var menu = 0;



var front_image = new Image();
front_image.src = 'assets/frente.png';
var right_image = new Image();
right_image.src = 'assets/direita.png';
var back_image = new Image();
back_image.src = 'assets/atras.png';

var sucesso_image = new Image();
sucesso_image.src = 'assets/sucesso.png';

var falha_image = new Image();
falha_image.src = 'assets/falha.png';

var atendente_image = new Image();
atendente_image.src = 'assets/front.png';

var probabilidadeDeCompra;
var quantidadeDePessoas;
var quantidadeDePessoasTimer;
var clientesQueJaPassaram = 0;
var clientesQueEntraram = 0;

var vendas = 0;

var meuTimer;

var timerVerifica;

var estaSimulando = 0;
//no artigo escrever que os valores aleatorios da tabela sao exatos e o do sistema nao


function Balcao(I) {

  I.x = 10;
  I.y = 100;
  I.width = 365;
  I.height = 80;
  I.color = "#939399";
  I.yVelocity = 0;
  I.xVelocity = 0;

  I.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  return I;
}


function Atendentes(I) {

  I.x = I.x;
  I.y = I.y;
  I.width = 60;
  I.height = 350;
  I.color = "#000";

  I.draw = function() {
    ctx.fillStyle = this.color;
    ctx.drawImage(atendente_image,this.x, this.y, this.width, this.height);
  };

  return I;
}




function Cliente(I) {
  clientesQueEntraram++;
  I.active = true;
  I.x = 50 + (I.fila * 150);
  I.y = window.innerHeight - 15;
  I.width = 50;
  I.height = 360;
  I.color = "#000";
  I.movimento = 0;
  I.yVelocity = -I.speed;
  I.xVelocity = 0;
  I.comprou = 0;
  I.imagem = back_image;

  I.inBounds = function() {
    return I.x >= 0 && I.x <= CANVAS_WIDTH &&
      I.y >= 0 && I.y <= CANVAS_HEIGHT;
  };

  I.draw = function() {
    ctx.fillStyle = this.color;
    ctx.drawImage(I.imagem,this.x, this.y, this.width, this.height);

  };

  I.compra = function(){
  	if(probabilidadeDeCompra > Math.random()*100){
  		vendas++;
  		I.comprou = 1;
  	}else{
  		I.comprou = 0;
  	}

  }

  I.update = function() {
  	if(this.movimento == 1 && this.x > (80 + (I.fila * 150))){
  		I.x -= I.xVelocity;
    	I.y -= I.yVelocity;
    	I.imagem = front_image;

    	if(I.comprou == 0){
    		I.imagem = falha_image;

    	}else{
    		I.imagem = sucesso_image;
    	}
  	}
  	//ve se o cliente chegou em um valor com 20 pixels de diferenca entre o caixa
  	else if(this.y < balcao.y + balcao.height + 20){
  		if(window.innerWidth > 600){
  			I.x -= I.yVelocity/4;
  		}else{
  			I.x -= I.yVelocity/2;
  		}

    	I.y -= I.xVelocity;
    	I.imagem = right_image;
    	if (I.movimento == 0) {
    		this.compra();
    		clientesQueJaPassaram++;
    	}

    	I.movimento = 1;
  	}
  	else{
    	I.x += I.xVelocity;
    	I.y += I.yVelocity;
  	}

  };

  return I;
}



function criarTela(){
	canvas = document.getElementById("tela");
    //canvas.setAttribute("class", "container");
	canvas.setAttribute("width",387);
	canvas.setAttribute("height",window.innerHeight);
	canvas.style.position = "relative";
	document.body.appendChild(canvas);
	ctx = canvas.getContext("2d");
	x = 10;
}

function hideMenu(){
	if(menu == 0){
		document.getElementById("mainMenu").style.display = "none";
		resize();
		menu = 1;
		document.getElementById("buttonHide").innerHTML = "Mostrar o Menu";

	}
	else if(menu == 1){
		menu = 0;
		document.getElementById("mainMenu").style.display = "block";
		resize();
		document.getElementById("buttonHide").innerHTML = "Esconder o Menu";
	}

}

function atualizar(){
	x++;
	desenhar();

	if(quantidadeDePessoasTimer != quantidadeDePessoas){
		clearTimeout(meuTimer);
		quantidadeDePessoasTimer = quantidadeDePessoas;
		meuTimer = setInterval(function(){ criarCliente(); }, 60000*2/quantidadeDePessoasTimer);
	}

	clientes.forEach(function(cliente) {
    	cliente.update();
  	});

	document.getElementById("compra").innerHTML = "Probabilidade de Compra: " + document.getElementById("probabilidadeDeCompra").value + "%";
	document.getElementById("pessoas").innerHTML = "Quantidade de Pessoas: " + document.getElementById("quantidadeDePessoas").value *4 + " pessoas";
	document.getElementById("vendas").innerHTML = "Numero de Vendas: " + vendas;
	document.getElementById("valor").innerHTML = "Valor arrecadado das Vendas: R$" + vendas*30 + ",00";
	document.getElementById("passaram").innerHTML = "Já Passaram " + clientesQueJaPassaram + " pessoas";

	

  	probabilidadeDeCompra = document.getElementById("probabilidadeDeCompra").value;
  	quantidadeDePessoas = document.getElementById("quantidadeDePessoas").value *4;

	window.requestAnimationFrame(atualizar);
}


function comecaSimulacao(){
	estaSimulando = 1;
	document.getElementById("quantidadeDePessoas").disabled = true;
	document.getElementById("probabilidadeDeCompra").disabled = true;
	document.getElementById("verifica").disabled = true;

	vendas = 0;
	clientesQueEntraram = clientesQueEntraram - clientesQueJaPassaram;
	clientesQueJaPassaram = 0;

}

function desenhar(){
	ctx.clearRect(0,0,window.innerWidth + 4000, window.innerHeight + 40000);

	balcao.draw();

	atendentes.forEach(function(atendente){
		atendente.draw();
	});

	clientes.forEach(function(cliente) {
    	cliente.draw();
  	});
}

function iniciar(){

	quantidadeDePessoas = document.getElementById("quantidadeDePessoas").value;
	meuTimer = setInterval(function(){ criarCliente(); }, 60000*2/quantidadeDePessoas);

	criaAtendentes();
	//cria o balcao
	balcao = Balcao({

	});

	criarTela();
	resize();
	atualizar();
}

function criaAtendentes(){
	//cria atendente numero 1 
	atendentes.push(Atendentes({
            x: 200,
            y: 10
    }));

	//atendente numero 2
	atendentes.push(Atendentes({
        x: 50,
        y: 10
    }));

}



function gaussiana(){
	var generator = new Random(1);

    // The nextGaussian() function returns a normal distribution of random numbers with the following parameters: a mean of zero and a standard deviation of one
    var num = generator.nextGaussian();
    var standardDeviation = 60;
    var mean = 200;
    // Multiply by the standard deviation and add the mean.
    var x = standardDeviation * num + mean;
}



function criarCliente(){


	if(estaSimulando == 1 && clientesQueEntraram == quantidadeDePessoas){
		if(clientesQueEntraram == clientesQueJaPassaram){
			document.getElementById("quantidadeDePessoas").disabled = false;
			document.getElementById("probabilidadeDeCompra").disabled = false;
			document.getElementById("verifica").disabled = false;
		}
	}else{

		clientes.push(Cliente({
            	speed: 4,
        	    fila: 0
    	}));

    	clientes.push(Cliente({
            	speed: 4,
        	    fila: 1
    	}));
	}

}

function resize(){    
    $("#tela").outerHeight($(window).height()-$("#tela").offset().top- Math.abs($("#tela").outerHeight(true) - $("#tela").outerHeight()));
  }
  $(document).ready(function(){
    resize();
    $(window).on("resize", function(){                      
        resize();
    });
  });

window.addEventListener("load",iniciar);