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
	Visualizações:
		Gerais: https://www.d3-graph-gallery.com/index.html
		Wordcloud: https://www.d3-graph-gallery.com/wordcloud.html
		Wordcloud Basica: https://www.d3-graph-gallery.com/graph/wordcloud_basic.html
		Tutorial: https://www.youtube.com/watch?v=1KEiTIu0k44
		Wordcloud Completa: https://www.jasondavies.com/wordcloud/
	D3.js:
		Site: https://d3js.org/
		Galeria D3: https://github.com/d3/d3/wiki/Gallery
	W3C Schools:
		Site: https://www.w3schools.com/default.asp
	Vis-KT:
		Sistema: http://vis-kt.vicg.icmc.usp.br/IC3/