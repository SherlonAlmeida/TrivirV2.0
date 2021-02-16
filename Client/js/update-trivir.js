function loadButton(){
	alert("Clicou no Load!");
}

/*Estrutura basica do Jquery: quando o documento estiver pronto (pagina carregada), faca...*/
$(document).ready(function(){
	/*Define o efeito de Mouse Over sobre o botao*/
	$("#LoadButton").on("mouseover", function(){
		//Deste jeito estamos adicionando a classe efeito no botao, ou seja, o CSS vai aplicar um novo estilo que foi definido no arquivo CSS
		$("#LoadButton.btn.btn-load-dataset").addClass("effect");
	}).on("mouseout", function(){
		//Esta eh a forma hardcoded de aplicar um novo estilo
		$("#LoadButton.btn.btn-load-dataset").removeClass("effect");
	});
	
	$("#SeedButton").on("mouseover", function(){
		$("#SeedButton.btn.btn-seed").addClass("effect");
	}).on("mouseout", function(){
		$("#SeedButton.btn.btn-seed").removeClass("effect");
	});
	
	$("#TrainButton").on("mouseover", function(){
		$("#TrainButton.btn.btn-train").addClass("effect");
	}).on("mouseout", function(){
		$("#TrainButton.btn.btn-train").removeClass("effect");
	});
	
	$("#ExportButton").on("mouseover", function(){
		$("#ExportButton.btn.btn-export-session").addClass("effect");
	}).on("mouseout", function(){
		$("#ExportButton.btn.btn-export-session").removeClass("effect");
	});
	
	
	/*Detecta o clique no botao*/
	$("#LoadButton").click(function(){
		loadButton();
	});
	
	$("#SeedButton").click(function(){
		alert("Clicou no Seed");
	});
	
	//Treina o sistema de recomendação novamente
	$("#TrainButton").click(function(e){
        RetrainClassifier();
	});
	
	$("#ExportButton").click(function(){
		//alert("Clicou no Export");
		var downloadButton = document.getElementById("exportDataDownload");
		downloadButton.href = "http://127.0.0.1:3000/exportsessiondata";
	});
	
	/*Se o usuario clicar no botao de dicas iniciara o Tour pelas funcionalidades do sistema*/
	$("#TipsButton").click(function(){
		//alert("Clicou no Tips");
		guided_tour();
	});
});