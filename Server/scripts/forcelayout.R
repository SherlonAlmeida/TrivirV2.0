needs("mp")
needs("Rtsne")
needs("jsonlite");
needs("fastrtext");
needs("stringi");
needs("stringr")
needs(tm)
needs(corpus)
needs(textstem);
needs(ngram)
needs(lsa)

#When running the code from RStudio, you need to comment the lines above and uncomment the lines bellow
# library("mp")
# library("Rtsne")
# library("jsonlite")
# library("fastrtext")
# library("stringi")
# library("stringr")
# library(tm);
# library(corpus);
# library(textstem);
# library(ngram);
# library(lsa);

#Sherlon: This function concatenates the Scatterplot and Graph Data
concatenateScatterAndGraphData <- function(path_core, path_users, projtech, embtech){
  conn <- file(sprintf("%s/coordinates.json", path_users), encoding = "latin1");
  jsondata <- as.character(readLines(conn, warn = FALSE));
  jsondata <- iconv(jsondata, to = "utf8")
  df_coord <- fromJSON(jsondata);
  close(conn)

  conn <- file(sprintf("%s/force-directed-graph.json", path_users), encoding = "latin1");
  jsondata <- as.character(readLines(conn, warn = FALSE));
  jsondata <- iconv(jsondata, to = "utf8")
  df_graph <- fromJSON(jsondata);
  close(conn)

  #Sherlon: Generates the Nested JSON to the Force Layout Visualization
  new_data <- list()
    scatterdata <- df_coord
    graphdata <- df_graph
  new_data$scatterdata <- scatterdata
  new_data$graphdata <- graphdata
  write(toJSON(new_data, pretty = TRUE), sprintf("%s/concatenateScatterAndGraphData.json", path_users))
}


createForceLayoutData <- function(path_core, path_users, projtech, embtech){
  coord_body <- c(); #Store the document content (text)
  coord_bodypreprocessed <- c(); #Store the document content (pre-processed text)

  #Data structures to store all the graph information
  fileList <- list.files(path = corpus, full.names = TRUE, recursive = TRUE)
  docnames <- c();       #Store the filenames
  source_link <- c();    #Store the source documents
  target_link <- c();    #Store the target documents
  distanceCos_link <- c();  #Store the cosine distance between the documents (1 is similar)
  similarity_link <- c();   #Store the distance between the documents (0 is similar)
  iter <- 0;             #Sum the number of connections in the graph
  #threshold <- 0.30;    #Set a threshold number for the cosine distance (0 <= distCos <= 1)
  max_neighbors <- 10;   #Set a max number of neighbors to each node

  #Retrieve the document files from the corpus
  for (indexFile in 1:length(fileList)){
    #Read the document content
    conn <- file(fileList[indexFile],open="rt")
    doc <- readLines(conn);
    close(conn);
    doc <- concatenate(doc);
    coord_body[indexFile] <- doc;
    source("corpussettings.R")
    doc <- textPreprocess(doc, TRUE, corpus);
    coord_bodypreprocessed[indexFile] <- doc;

    docnames[indexFile] = basename(fileList[indexFile]);

    #Retrieve the similar documents of each document
    doclist <- c();
    doclist <- getNeighborhood(docnames[indexFile], path_core, path_users, embtech, max_neighbors);
    for (new_link in 1:length(doclist)){
      name <- names(doclist[new_link]);
      distanceCos <- doclist[new_link];

      #Creates a connection only if the similarity is over a threshold
      #if (distanceCos > threshold) {
        source_link[iter] <- docnames[indexFile];
        target_link[iter] <- name;
        #Sherlon: The names are wrong. It is necessary to change all variables with Distance by Similarity and vice versa.
        distanceCos_link[iter] <- distanceCos; #Sherlon: (Here is SIMILARITY) Cosine similarity (The higher the value, the more similar)
        similarity_link[iter] <- (1 - distanceCos); #Sherlon: (Here is DISTANCE) Converts similarity into distance (The closer the more similar)
        iter <- iter + 1;
      #}
    }

  }

  #Sherlon: Generates the Nested JSON to the Force Layout Visualization
  #OBS.: Na verdade 'value' eh  a Distancia do Cosseno (Menor eh mais similar) enquanto 'cosdist' eh a similaridade do cosseno (Maior eh mais similar).
  graph <- list()
    nodes <- data.frame('id' = docnames, 'group' = 1, 'body' = coord_body, 'body_preprocessed' = coord_bodypreprocessed);
    links <- data.frame('source' = source_link, 'target' = target_link, 'value' = similarity_link, 'cosdist' = distanceCos_link);
  graph$nodes <- nodes
  graph$links <- links
  write(toJSON(graph, pretty = TRUE), sprintf("%s/force-directed-graph.json", path_users))
}


getNeighborhood <- function(document, path_core, path_users, embtech, max_neighbors){
  k <- max_neighbors;
  #retrieve the wordembeddings representation or bag of words representation  
  if (embtech == "word_embeddings"){
    Embedding <- read.csv(file=sprintf("%s/wordembedding.csv", path_core), header=TRUE, check.names=FALSE)
    
    Docnames <- Embedding[,length(Embedding[1,])];
    
    Embedding <- Embedding[,2:(length(Embedding[1,]) - 1)];
    
  }else if (embtech == "bagofwords"){
    Embedding <- read.csv(file=sprintf("%s/bagofwords.csv", path_core), header=TRUE, check.names=FALSE)
    
    Docnames <- Embedding[,1];
    
    Embedding <- Embedding[,2:(length(Embedding[1,]))];
  }

  Embedding <- t(Embedding);
  colnames(Embedding) <- Docnames

  distanceCos <- cosine(Embedding[,document], Embedding);

  distanceCos <- distanceCos[order(-distanceCos)]

  distanceCos <- distanceCos[2:(k+1)];

  return(distanceCos);
}