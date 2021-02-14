# needs(stringi);
# needs(stringr);
# needs(tm);
# needs(corpus);
# needs(textstem);
# needs(ngram);
# needs(bibliometrix);

#When running the code from RStudio, you need to comment the lines above and uncomment the lines bellow
library("stringi");
library("stringr")
library(tm)
library(corpus)
library(textstem)
library(ngram)
library("bibliometrix")
suppressMessages(library(textclean)) #Sherlon: Adicionei esta biblioteca para remover os caracteres NON-ASCII

extractCorpus <- function(input, dirName, source){
  if (source == "ieee"){
    extractIEEE(input, dirName);
  }else if (source == "parsifal"){
    extractParsifal(input, dirName);
  }else if (source == "scopus"){
    extractScopus(input, dirName);
  }else if (source == "wos"){
    extractWos(input, dirName);
  }else if (source == "acm"){
    extractACM(input, dirName);
  }
}

#Sherlon: Criei esta função para remover os caracteres NON-ASCII de strings
removeNonAsciiCharacters <-function(string, encoding){
	Encoding(string) <- encoding
	string <- replace_non_ascii(string, replacement = "", remove.nonconverted = TRUE)
	return (string);
}


defaultPreprocess <-function(text, withoutstopwords){
  connBase <- file("stop-word-list.txt",open="rt")
  stopwordlist <- readLines(connBase);
  close(connBase);
  
  #Sherlon: A funcao gSub Substitui TODAS as ocorrencias de uma palavra por outra em um texto.
  text <- tolower(text);             #Sherlon: Converte o texto em minusculo
  #text <- removePunctuation(text);	 #Sherlon: Remove pontuacao
  #text <- removeNumbers(text);	     #Sherlon: Remove numeros
  #text <- stripWhitespace(text);	   #Sherlon: Remove espacos em excesso
  
  text <- gsub("<[^>]*>'`","", text)
  
  if (withoutstopwords){
    text <- removeWords(text, stopwordlist)
  }
  
  text <- gsub("\\W"," ", text)
  text <- gsub("\\d"," ", text) #Remove os numeros
  text <- str_squish(text);     #Remove espacos multiplos dentro de uma string Ex. " oi    pessoal,   tudo bem?" -> "oi pessoal, tudo bem?"
  
  text <- stri_trans_general(text,"Latin-ASCII")
  
  return(text)
}


extractACM <- function(input, dirName){
  corpus <- read.csv(file = input, header=TRUE, check.names=FALSE)
  #Create the directory for the files
  dir.create(sprintf("../../data/%s", dirName));
  count <- 1L;
  for (i in 1:length(corpus[,1])){
    title <- iconv(corpus[i,'title'], to = "utf8");
    author <- iconv(corpus[i,'author'], to = "utf8");
    year <- corpus[i, 'year'];
    keywords <- iconv(corpus[i, 'keywords'], to = "utf8");
    
	#Sherlon: Ao inves de preprocessar apenas o title, eu estou preprocessanto outros atributos antes de salvar no article
	#PREPROCESSA O CONTEUDO DE title
	#title <- stri_trans_general(title,"Latin-ASCII")
    #title <- defaultPreprocess(title, FALSE)
	
	#PREPROCESSA O CONTEUDO DE abstract
	#abstract <- stri_trans_general(abstract,"Latin-ASCII")
	#abstract <- defaultPreprocess(abstract, FALSE) #Sherlon: Estou passando FALSE pois nao precisa remover stopwords do arquivo original que vai ser gerado na pasta data
	
	#Sherlon: Remove caracteres NON-ASCII de Strings
	title <- removeNonAsciiCharacters(title, "latin1")
	abstract <- removeNonAsciiCharacters(abstract, "latin1")
	
	article <- paste(title, author, year, keywords, sep = "\n");
    
    conn<-file(sprintf("../../data/%s/%i-document.txt",dirName, count), encoding = "utf8")
	count <- count + 1;
	
    writeLines(article, conn)
    close(conn)
  }
}


extractIEEE <- function(input, dirName){
  corpus <- read.csv(file = input, header=TRUE, check.names=FALSE)
  #Create the directory for the files
  dir.create(sprintf("../../data/%s", dirName));
  count <- 1L;
  for (i in 1:length(corpus[,1])){
    title <- iconv(corpus[i,'Document Title'], to = "utf8");
    author <- iconv(corpus[i,'Authors'], to = "utf8");
    abstract <-iconv(corpus[i, 'Abstract'], to = "utf8");
    year <- corpus[i, 'Publication_Year'];
    keywords <- iconv(corpus[i, 'Author Keywords'], to = "utf8");
	
	#Sherlon: Ao inves de preprocessar apenas o title, eu estou preprocessanto outros atributos antes de salvar no article
	#PREPROCESSA O CONTEUDO DE title
	#title <- stri_trans_general(title,"Latin-ASCII")
    #title <- defaultPreprocess(title, FALSE)
	
	#PREPROCESSA O CONTEUDO DE abstract
	#abstract <- stri_trans_general(abstract,"Latin-ASCII")
	#abstract <- defaultPreprocess(abstract, FALSE) #Sherlon: Estou passando FALSE pois nao precisa remover stopwords do arquivo original que vai ser gerado na pasta data
	
	#Sherlon: Remove caracteres NON-ASCII de Strings
	title <- removeNonAsciiCharacters(title, "latin1")
	abstract <- removeNonAsciiCharacters(abstract, "latin1")
	
    article <- paste(title, author, year, abstract, keywords, sep = "\n");
    
    conn<-file(sprintf("../../data/%s/%i-document.txt",dirName, count), encoding = "utf8")
	count <- count + 1;
	
    writeLines(article, conn)
    close(conn)
  }
}

extractParsifal <- function(input, dirName){
  #Retrieve csv 
  corpus <- read.csv(file= input, header=TRUE, check.names=FALSE);
  #Create the directory for the files
  dir.create(sprintf("../../data/%s", dirName));
  count <- 1L;
  for (i in 1:length(corpus[,1])){
    title <- iconv(corpus[i,'title'], to = "utf8");
    author <- iconv(corpus[i,'author'], to = "utf8");
    abstract <-iconv(corpus[i, 'abstract'], to = "utf8");
    year <- corpus[i, 'year'];
    keywords <- iconv(corpus[i, 'author_keywords'], to = "utf8");
    
    if (keywords == ""){
      keywords <- iconv(corpus[i, 'keywords'], to = "utf8");
    }
	
	#Sherlon: Ao inves de preprocessar apenas o title, eu estou preprocessanto outros atributos antes de salvar no article
	#PREPROCESSA O CONTEUDO DE title
	#title <- stri_trans_general(title,"Latin-ASCII")
    #title <- defaultPreprocess(title, FALSE)
	
	#PREPROCESSA O CONTEUDO DE abstract
	#abstract <- stri_trans_general(abstract,"Latin-ASCII")
	#abstract <- defaultPreprocess(abstract, FALSE) #Sherlon: Estou passando FALSE pois nao precisa remover stopwords do arquivo original que vai ser gerado na pasta data
    
	#Sherlon: Remove caracteres NON-ASCII de Strings
	title <- removeNonAsciiCharacters(title, "latin1")
	abstract <- removeNonAsciiCharacters(abstract, "latin1")
	
    if (abstract != ""){
      article <- paste(title, author, year, abstract, keywords, sep = "\n");
    }else{
      article <- paste(title, author, year, keywords, sep = "\n");
	}
	
	conn<-file(sprintf("../../data/%s/%i-document.txt",dirName, count), encoding = "utf8")
	count <- count + 1;
    
    writeLines(article, conn)
    close(conn)
  }
}


extractScopus <- function(input, dirName){
  #Retrieve csv 
  corpus <- read.csv(file= input, header=TRUE, check.names=FALSE);
  #Create the directory for the files
  dir.create(sprintf("../../data/%s", dirName));
  count <- 1L;
  for (i in 1:length(corpus[,1])){
    title <- iconv(corpus[i,'Title'], to = "utf8");
    author <- iconv(corpus[i,1], to = "utf8");
    abstract <-iconv(corpus[i, 'Abstract'], to = "utf8");
    year <- corpus[i, 'Year'];
    keywords <- iconv(corpus[i, 'Author Keywords'], to = "utf8");
    
	#Sherlon: Ao inves de preprocessar apenas o title, eu estou preprocessanto outros atributos antes de salvar no article
	#PREPROCESSA O CONTEUDO DE title
	#title <- stri_trans_general(title,"Latin-ASCII")
    #title <- defaultPreprocess(title, FALSE)

	#PREPROCESSA O CONTEUDO DE abstract
	#abstract <- stri_trans_general(abstract,"Latin-ASCII")
	#abstract <- defaultPreprocess(abstract, FALSE) #Sherlon: Estou passando FALSE pois nao precisa remover stopwords do arquivo original que vai ser gerado na pasta data
	
	#Sherlon: Remove caracteres NON-ASCII de Strings
	title <- removeNonAsciiCharacters(title, "latin1")
	abstract <- removeNonAsciiCharacters(abstract, "latin1")
	
    article <- paste(title, author, year, abstract, keywords, sep = "\n");
    article <- stri_trans_general(article,"Latin-ASCII")
	
    conn<-file(sprintf("../../data/%s/%i-document.txt",dirName, count), encoding = "utf8")
	count <- count + 1;
	
    writeLines(article, conn)
    close(conn)
  }
}


extractWos <- function(input, dirName){
  D <- readFiles(input)
  #Create the directory for the files
  dir.create(sprintf("../../data/%s", dirName));
  M <- convert2df(D, dbsource = "isi", format = "bibtex")
  count <- 1L;
  for (i in 1:length(M[,1])){
    title <- iconv(M[i, 'TI'], to = "utf8");
    author <- iconv(M[i, 'AU'], to = "utf8");
    abstract <-iconv(M[i, 'AB'], to = "utf8");
    #references <- iconv(corpus[i, 'References'], to = "utf8");
    year <- M[i, 'PY'];
    keywords <- iconv(M[i, 'DE'], to = "utf8");
    
	#Sherlon: Ao inves de preprocessar apenas o title, eu estou preprocessanto outros atributos antes de salvar no article
	#PREPROCESSA O CONTEUDO DE title
	#title <- stri_trans_general(title,"Latin-ASCII")
    #title <- defaultPreprocess(title, FALSE)
	
	#PREPROCESSA O CONTEUDO DE abstract
	#abstract <- stri_trans_general(abstract,"Latin-ASCII")
	#abstract <- defaultPreprocess(abstract, FALSE) #Sherlon: Estou passando FALSE pois nao precisa remover stopwords do arquivo original que vai ser gerado na pasta data
	
	#Sherlon: Remove caracteres NON-ASCII de Strings
	title <- removeNonAsciiCharacters(title, "latin1")
	abstract <- removeNonAsciiCharacters(abstract, "latin1")
	
	#article <- paste(title, author, year, abstract, keywords, references, sep = "\n");
    article <- paste(title, author, year, abstract, keywords, sep = "\n");
    
	conn<-file(sprintf("../../data/%s/%i-document.txt",dirName, count), encoding = "utf8")
	count <- count + 1;
    
    writeLines(article, conn)
    close(conn)
  }
}

#file directory (.bib, .csv), corpus name (your choice), database (ieee, parsifal, scopus, wos) 
#extractCorpus("C:/Users/Amanda Dias/Documents/scopus.csv", "vis papers scopus", "scopus")#Exemplo Amanda
#extractCorpus("C:/Users/sherl/Documents/TRIVIR/Dataset_Sherlon.bib", "Sherlon3DObjectRetrieval", "wos") #Usuario Sherlon (Primeira Tentativa - Arquivo .bib do WoS)
#extractCorpus("C:/Users/sherl/Documents/TRIVIR/Dataset_Text.csv", "SherlonText", "parsifal") #Usuario Sherlon

#DEMO SISTEMA
extractCorpus("C:/Users/sherl/Documents/TRIVIR_Estudo_Validacao/Datasets/corpus_selfdriving_develop.csv", "develop", "scopus") #Usuario admin
