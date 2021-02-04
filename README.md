TRIVIR's code is relative to the paper: "TRIVIR: A Visualization System to Support Document Retrieval
with High Recall" submitted to the DocEng 2019 ACM Conference.
The code will be available on April 30th, 2019.

Este arquivo contém a descrição das pastas e arquivos deste projeto.

(Em desenvolvimento...)
Descrição:

	Client: Contém a implementação do front-end do sistema.
		-images: possui as imagens utilizadas no sistema (Ícones).
		-js: possui os arquivos que gerenciam a lógica envolvida com a interface do sistema.
		-nodemodules: possui os arquivos de dependências, como o bootstrap.
		-style: possui os arquivos CSS que possuem o estilo aplicado na interface do sistema.
		trivir.html: possui a implementação do front end do sistema.

	Server:
		-nodemodules: possui os arquivos de dependências.
		-scripts: possui os scripts backend do sistema, na linguagem R.
		index.js: possui a configuração do servidor e de suas funcionalidades.
			-Existem função de Callback que assim que identificarem a requisição pelo front-end executam os scripts R.
				-Todas as funções de Callback chamam o arquivo main.R passando por parâmetro os scripts a serem executados.

Fluxo de Execução:
	-O servidor (index.js) fica ouvindo por requisições da interface do sistema (trivir.html).
		Quando uma ação for identificada:
			-O servidor (index.js) invoca as funções R do backend do sistema, na pasta scripts.
			-Basicamente o servidor chama o arquivo main.R, o qual verifica o comando solicitado e executa as funções desejadas do backend do sistema.
	-A interface (trivir.html) utiliza os códigos javascript para identificar a interação do usuário com o sistema.
		Quando uma ação for identificada:
			-O arquivo javascript correspondente realiza a requisição para o servidor.

Referências:
	D3.js:
		Site: https://d3js.org/
		Galeria D3: https://github.com/d3/d3/wiki/Gallery
		Curso Udemy: https://www.udemy.com/course/d3js-data-visualization-projects/
	Visualizações:
		Gerais: https://www.d3-graph-gallery.com/index.html
		Wordcloud:
			Diversas: https://www.d3-graph-gallery.com/wordcloud.html
			Tutorial Basico 1: https://www.d3-graph-gallery.com/graph/wordcloud_basic.html
			Tutorial Basico 2: https://www.d3-graph-gallery.com/graph/wordcloud_custom.html
			Tutorial Basico 3: https://www.d3-graph-gallery.com/graph/wordcloud_size.html
			(Usado) Wordcloud Completa: https://www.jasondavies.com/wordcloud/
				Github: https://github.com/jasondavies/d3-cloud
				Tutorial: https://www.youtube.com/watch?v=1KEiTIu0k44
		Force Layout:
			Documentation: https://github.com/d3/d3-force
			Gerais: https://www.d3-graph-gallery.com/network.html
			Force-Directed Graph: https://observablehq.com/@d3/force-directed-graph
			Force-Layout with labels: https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
			Disjoint Force-Directed Graph: https://observablehq.com/@d3/disjoint-force-directed-graph
			Force-Directed Graph 1: http://bl.ocks.org/jhb/5955887
			(Interação com Parametros) Force-Directed Graph 2: https://bl.ocks.org/steveharoz/8c3e2524079a8c440df60c1ab72b5d03
			Force-Directed Graph 3: https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
			Force Directed Graph:
				Link 1: http://emptypipes.org/2017/04/29/d3v4-selectable-zoomable-force-directed-graph/
				(Usado) Link 2: https://bl.ocks.org/pkerpedjiev/f2e6ebb2532dae603de13f0606563f5b
				Link 3: https://bl.ocks.org/puzzler10/4438752bb93f45dc5ad5214efaa12e4a
			Input Buttons:
				(Usado) Slider: https://www.w3schools.com/howto/howto_js_rangeslider.asp
				Script Dinâmico: https://pt.stackoverflow.com/questions/138489/como-fa%C3%A7o-para-mostrar-o-value-do-input-type-range
				(Usado) Script Dinâmico: https://pt.stackoverflow.com/questions/15529/valores-em-tempo-real-na-classe-input-type-range
		Sankey Graph:
			Gerais: https://www.d3-graph-gallery.com/sankey.html
		Zooming:
			(Usado) Tutorial: https://www.d3-graph-gallery.com/graph/interactivity_zoom.html
			Initial Zoom: https://stackoverflow.com/questions/49960250/set-initial-d3-zoom-based-on-boundary-dynamically-v4
		Tour Website Tools (Guided Tour):
			Link: https://ourcodeworld.com/articles/read/328/top-10-best-tour-website-guide-javascript-and-jquery-plugins
			(Usado) EnjoyHint: 
				Site: https://xbsoftware.com/products/enjoyhint/
				Documentation: https://github.com/xbsoftware/enjoyhint
				Tutorial: https://www.sitepoint.com/hints-creation-with-enjoyhint/
				Example1: https://github.com/sitepoint-editors/enjoyhint-demo
				Example2: https://www.codeseek.co/eanbowman/enjoyhint-demo-yVbgEP
	W3C Schools:
		-Apresenta exemplos e dicas úteis para o desenvolvimento web.
		Site: https://www.w3schools.com/default.asp
	Functionalities:
		Check Radio (Select different visualizations):
			Front-End: https://getbootstrap.com/docs/4.0/components/forms/#checkboxes-and-radios
			Back-End: https://stackoverflow.com/questions/596351/how-can-i-know-which-radio-button-is-selected-via-jquery
		Nested JSON for send data via POST: (Sherlon: Usei para criar o grafo do Force Layout)
			Link: https://stackoverflow.com/questions/51658128/create-nested-json-obj-in-r-for-httrpost
	Vis-KT:
		Original:
			Sistema: http://vis-kt.vicg.icmc.usp.br/IC3/ (sherlon)
		Eric: 
			Sistema: http://vis-kt.vicg.icmc.usp.br/IC5/ (Sherlon)
			Sankey: http://vis-kt.vicg.icmc.usp.br/IC5/sankey.html
	Javascript:
		Sheet Cheat: https://websitesetup.org/javascript-cheat-sheet/
		Remove elements from Json: https://stackoverflow.com/questions/13394653/json-remove-element-by-value
	Instalação biblioteca de ordenação JSON:
		Link: https://www.npmjs.com/package/sort-json-array
	Compilador R online (Realizar testes):
		Link: https://www.tutorialspoint.com/execute_r_online.php
	Cheat Sheets are extremely useful:
		R: https://rstudio.com/wp-content/uploads/2016/10/r-cheat-sheet-3.pdf