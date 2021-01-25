function guided_tour(){
	
	//Description: Style and Content for each hint
	var load_string = '<div style="color:yellow; font-size:24px;">Load <br></div> <div style="color:white; font-size:18px;">Click Load button to insert <br> the Corpus into the system.</div>';
	var seed_string = '<div style="color:yellow; font-size:24px;">Seed <br></div> <div style="color:white; font-size:18px;">Click Seed button to choose <br> the initial query (SEED Document). <br><br> A SEED is a document considered <br> highly relevant to your search.</div>';
	var train_string = '<div style="color:yellow; font-size:24px;">Train <br></div> <div style="color:white; font-size:18px;">Click Train button to <br> retrain the classifier.</div>';
	var export_string = '<div style="color:yellow; font-size:24px;">Export <br></div> <div style="color:white; font-size:18px;">Click Export button to <br> export the session data.</div>';
	
	var scatterplot_view_string = '<div style="color:yellow; font-size:20px;">Scatterplot View <br> </div> <div style="color:white; font-size:18px;">Each circle<br>represents a<br>document from<br>the corpus.</div>';
	var seed_color_string = '<div style="color:yellow; font-size:20px;">Seed Documents <br> </div> <div style="color:white; font-size:18px;">The GREEN circles indicate highly <br> relevant documents to your search. <br><br> You will classify a document as SEED when you <br> notice that it is very interesting for your search. <br><br> The 10 most similar documents to a SEED <br> are set automatically as RELEVANT (Blue).</div>';
	var relevant_color_string = '<div style="color:yellow; font-size:20px;">Relevant Documents <br> </div> <div style="color:white; font-size:18px;">The BLUE circles represent documents <br> RELEVANT to your search. <br><br> You may change the classification <br> of a document to SEED or NOT <br> RELEVANT if you wish.</div>';
	var not_relevant_color_string = '<div style="color:yellow; font-size:20px;">Not Relevant Documents <br> </div> <div style="color:white; font-size:18px;">The RED circles represent the <br> documents NOT RELEVANT <br> to your search. <br><br> You can change the classification <br> to RELEVANT if you wish. <br><br> Or you can click the \"+\" button <br> to set also as NOT RELEVANT <br> the 10 documents most similar to it. </div>';
	var suggested_color_string = '<div style="color:yellow; font-size:20px;">Suggested Documents <br> </div> <div style="color:white; font-size:18px;">The YELLOW circles indicate the <br> documents SUGGESTED as potentially <br> relevant by the system. <br><br> The system will learn from your feedback <br> and improve its recommendations over time. <br><br> To help the system learn, you can <br> retrain the classification algorithm <br> after some iterations. </div>';
	var unlabeled_color_string = '<div style="color:yellow; font-size:20px;">Unlabeled Documents <br> </div> <div style="color:white; font-size:18px;">The GRAY circles represent the <br> documents NOT YET LABELED. <br><br> You can classify any of them as <br> RELEVANT or NOT RELEVANT <br> if you wish. </div>';
	var circle_string = '<div style="color:yellow; font-size:20px;">Read Documents <br> </div> <div style="color:white; font-size:18px;"> The border of the circles indicates <br> whether it has already been read: <br><br> All the circles with a WHITE border <br> indicates a READ document. <br><br> A BLACK border indicates an <br> UNREAD document.</div><div style="color:chartreuse; font-size:18px;">Click in the document! </div>';
	
	var filter_term_string = '<div style="color:yellow; font-size:24px;">Filter by terms <br></div> <div style="color:white; font-size:18px;">Search for words in the <br> document titles.</div>';
	var filter_knn_string = '<div style="color:yellow; font-size:24px;">Filter Similar Documents <br></div> <div style="color:white; font-size:18px;">Visualize the K most similar <br> documents to the initial query.</div>';
	var filter_occlusion_activate_string = '<div style="color:yellow; font-size:24px;">Filter Interesting Documents <br></div><div style="color:white; font-size:18px;">Display documents on Focus <br> and Suggestion lists only.</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var filter_occlusion_deactivate_string = '<div style="color:yellow; font-size:24px;">Filter Interesting Documents <br></div><div style="color:white; font-size:18px;">Reset Scatterplot View.</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var document_view_string = '<div style="color:yellow; font-size:24px;">Document View <br></div> <div style="color:white; font-size:18px;">Display contents of <br> a selected document.</div>';
	var wordcloud_view_string = '<div style="color:yellow; font-size:24px;">Word Cloud View <br></div> <div style="color:white; font-size:18px;">Shows most frequent <br> words in a document.</div>';
	var terms_view_string = '<div style="color:yellow; font-size:24px;">Terms View <br></div> <div style="color:white; font-size:18px;">Shows important terms in <br> the initial query.</div>';
	var terms_view_string_add = '<div style="color:yellow; font-size:24px;">Terms View <br></div> <div style="color:white; font-size:18px;">ADD new terms.</div>';
	var terms_view_string_synonyms = '<div style="color:yellow; font-size:24px;">Terms View <br></div> <div style="color:white; font-size:18px;">Displays SYNONYMS of <br> each term.</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	
	var signature_string = '<div style="color:yellow; font-size:24px;">Signature List <br></div> <div style="color:white; font-size:18px;">Shows 3-grams (frequent 3 word <br> sentences in the documents).</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var signature_container_string = '<div style="color:yellow; font-size:24px;">Signature List: 3-Grams <br></div> <div style="color:white; font-size:18px;"> Each line shows a 3-Gram. <br><br> 3-Grams are shown in ascending <br> frequency of occurrence in Corpus.</div>';
	var signature_search_string = '<div style="color:yellow; font-size:24px;">Signature List: Filter by given terms <br></div> <div style="color:white; font-size:18px;"> Search for 3-Grams containing <br> specific terms. </div>';
	var signature_filter_string = '<div style="color:yellow; font-size:24px;">Signature List: Filter by important terms <br></div> <div style="color:white; font-size:18px;"> Search for 3-Grams containing <br> terms from Terms View. </div>';
	var focus_string = '<div style="color:yellow; font-size:24px;">Focus List <br></div> <div style="color:white; font-size:18px;">Shows a list of the RELEVANT <br> and SEED documents.</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var focus_container_string = '<div style="color:yellow; font-size:24px;">Focus List <br></div> <div style="color:white; font-size:18px;"> Each line represents a document: <br><br> Selecting a line will highlight <br> the corresponding document in <br> the Scatterplot View.</div>';
	var suggestion_string = '<div style="color:yellow; font-size:24px;">Suggestion List <br></div> <div style="color:white; font-size:18px;">Shows the list of documents <br> SUGGESTED as relevant.</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var suggestion_container_string = '<div style="color:yellow; font-size:24px;">Suggestion List <br></div> <div style="color:white; font-size:18px;"> Each line represents a SUGGESTED document. <br><br> Selecting a line will highlight <br> the corresponding document in <br> the Scatterplot View. </div>';
	var tips_string = '<div style="color:yellow; font-size:24px;">Guided Tour (Tips) <br></div> <div style="color:white; font-size:18px;">You can run the Guided Tutorial <br> whenever you want by clicking here.</div>';
	
	var enjoyhint_instance = new EnjoyHint({}); //Initialize EnjoyHint

	var enjoy_script_steps = [ //Creates a new Hint
		{
			//Load Button
			'next .btn.btn-load-dataset' : load_string,
			'showSkip' : false
		},
		{
			//Seed Button
			'next .btn.btn-seed' : seed_string,
			'showSkip' : false
		},
		{
			//Train Button
			'next .btn.btn-train' : train_string,
			'showSkip' : false
		},
		{
			//Export Button
			'next .btn.btn-export-session' : export_string,
			'showSkip' : false
		},
		{
			//Scatterplot View
			'next #ScatterplotView' : scatterplot_view_string,
			'showSkip' : false
		},
		{
			//Scatterplot View: Seed Documents
			'next #SeedColor' : seed_color_string,
			'showSkip' : false
		},
		{
			//Scatterplot View: Relevant Documents
			'next #RelevantColor' : relevant_color_string,
			'showSkip' : false
		},
		{
			//Scatterplot View: Not Relevant Documents
			'next #NotRelevantColor' : not_relevant_color_string,
			'showSkip' : false
		},
		{
			//Scatterplot View: Suggested Documents
			'next #SuggestedColor' : suggested_color_string,
			'showSkip' : false
		},
		{
			//Scatterplot View: Unlabeled Documents
			'next #UnlabeledColor' : unlabeled_color_string,
			'showSkip' : false
		},
		{
			//Scatterplot View: Read Documents
			'next .dot' : circle_string,
			'showSkip' : false,
			'shape': 'circle',
		  	'radius': 30
		},
		{
			//Filter by terms
			'next #searchdocument' : filter_term_string,
			'showSkip' : false
		},
		{
			//Filter KNN
			'next #filterscatterplot' : filter_knn_string,
			'showSkip' : false
		},
		{
			//Filter oclusion (Activate)
			'click #filterrelevantsbutton' : filter_occlusion_activate_string,
			'showSkip' : false
		},
		{
			//Filter oclusion (Deactivate)
			'click #resetscatterplotbutton' : filter_occlusion_deactivate_string,
			'showSkip' : false
		},
		{
			//Document View
			'next #DocumentView' : document_view_string,
			'showSkip' : false
		},
		{
			//Word Cloud View
			'next #WordCloudView' : wordcloud_view_string,
			'showSkip' : false
		},
		{
			//Terms View (All)
			'next #termscontainer' : terms_view_string,
			'showSkip' : false
		},
		{
			//Terms View (Add Terms)
			'next #addterm' : terms_view_string_add,
			'showSkip' : false
		},
		{
			//Terms View (Visualize Synonyms)
			'next .terms-bar' : terms_view_string_synonyms,
			'showSkip' : false
		},
		{
			//Signature List
			'click .btn.btn-outline-light.btn-sm.active' : signature_string,
			'showSkip' : false
		},
		{
			//Signature Container
			'next #signaturemenucontainer' : signature_container_string,
			'showSkip' : false
		},
		{
			//Signature Search
			'next #signaturesearch' : signature_search_string,
			'showSkip' : false
		},
		{
			//Signature Filter
			'next #filtersignaturebutton' : signature_filter_string,
			'showSkip' : false
		},
		{
			//Focus List
			'click .btn.btn-outline-info.btn-sm' : focus_string,
			'showSkip' : false
		},
		{
			//Focus Container
			'next #focuscontainer' : focus_container_string,
			'showSkip' : false
		},
		{
			//Suggestion List
			'click .btn.btn-outline-warning.btn-sm' : suggestion_string,
			'showSkip' : false
		},
		{
			//Suggestion Container
			'next #suggestioncontainer' : suggestion_container_string,
			'showSkip' : false
		},
		{
			//Tips Button (Guided Tour)
			'next .fa.fa-question-circle' : tips_string,
			'showSkip' : false,
			'nextButton' : {className: "myNext", text: "Finish"}
		}
	];

	enjoyhint_instance.set(enjoy_script_steps); //Set the description of Hints

	enjoyhint_instance.run(); //Runs the Guided Tour
}

/*Estrutura basica do Jquery: quando o documento estiver pronto (pagina carregada), faca...*/
$(document).ready(function(){

});