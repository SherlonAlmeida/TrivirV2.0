function guided_tour(){
	
	//Description: Style and Content for each hint
	var load_string = '<div style="color:yellow; font-size:24px;">Load <br></div> <div style="color:white; font-size:18px;">Click in Load button to insert <br> the Corpus in the system</div>';
	var seed_string = '<div style="color:yellow; font-size:24px;">Seed <br></div> <div style="color:white; font-size:18px;">Click in Seed button to <br> choose the initial query (Seed)</div>';
	var train_string = '<div style="color:yellow; font-size:24px;">Train <br></div> <div style="color:white; font-size:18px;">You can click in Train button <br> to retrain the classfier.</div>';
	var export_string = '<div style="color:yellow; font-size:24px;">Export <br></div> <div style="color:white; font-size:18px;">This button allows you to <br> export the data of this session</div>';
	var tips_string = '<div style="color:yellow; font-size:24px;">Guided Tour (Tips) <br></div> <div style="color:white; font-size:18px;">You can run the Guided Tutorial <br> whenever you want by clicking here</div>';
	
	var scatterplot_view_string = '<div style="color:yellow; font-size:20px;">Scatterplot View <br> </div> <div style="color:white; font-size:18px;">Each circle <br> represents a <br> Corpus document </div>';
	var seed_color_string = '<div style="color:yellow; font-size:20px;">Seed Documents <br> </div> <div style="color:white; font-size:18px;">The GREEN circles represents the most <br> relevant documents for your search. <br><br> You will classify a document as SEED when you <br> notice that it is very interesting for your search. <br><br> When you do that, the 10 most similar documents to <br> the seed will be set automatically to Relevant (Blue)</div>';
	var relevant_color_string = '<div style="color:yellow; font-size:20px;">Relevant Documents <br> </div> <div style="color:white; font-size:18px;">The BLUE circles represents the relevant <br> documents of your search. <br><br> If you want, you can classify a relevant <br> document as SEED or NOT RELEVANT to exemplify <br> to the system what you want to retrieve or not</div>';
	var not_relevant_color_string = '<div style="color:yellow; font-size:20px;">Not Relevant Documents <br> </div> <div style="color:white; font-size:18px;">The RED circles represents the <br> not relevant document for your search. <br><br> You can classify a not relevant document as <br> relevant ou increase the RED label to set automatically <br> the 10 most similar documents as not relevant too. </div>';
	var suggested_color_string = '<div style="color:yellow; font-size:20px;">Suggested Documents <br> </div> <div style="color:white; font-size:18px;">The YELLOW circles represents the <br> potential interesting documents according <br> to the system algorithm. <br><br> The system will learn from your feedback <br> and improve the recommendation over time. <br><br> To help the system learn, you can <br> retrain the algorithm after some classifications. </div>';
	var unlabeled_color_string = '<div style="color:yellow; font-size:20px;">Unlabeled Documents <br> </div> <div style="color:white; font-size:18px;">The GRAY circles represents the unlabeled documents. <br><br> You can classify them into RELEVANT or NOT RELEVANT. </div>';
	var circle_string = '<div style="color:yellow; font-size:20px;">Read Documents <br> </div> <div style="color:white; font-size:18px;"> This functionality avoids the re-reading <br> process by changing the circle color of <br> the circle\'s border. <br><br> Read Documents: all the circles with white border. <br> Unread Documents: all the circles with black border.</div>';
	
	var filter_term_string = '<div style="color:yellow; font-size:24px;">Filter by terms <br></div> <div style="color:white; font-size:18px;">Search for words in the <br> documents titles</div>';
	var filter_knn_string = '<div style="color:yellow; font-size:24px;">Filter Similar Documents <br></div> <div style="color:white; font-size:18px;">Visualize the K most similar documents <br> to the initial query</div>';
	var filter_occlusion_activate_string = '<div style="color:yellow; font-size:24px;">Filter Interesting Documents <br></div><div style="color:white; font-size:18px;">Visualize documents on focus <br> and suggestion lists only</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var filter_occlusion_deactivate_string = '<div style="color:yellow; font-size:24px;">Filter Interesting Documents <br></div><div style="color:white; font-size:18px;">The Scatterplot View <br> will be reseted</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var document_view_string = '<div style="color:yellow; font-size:24px;">Document View <br></div> <div style="color:white; font-size:18px;">This functionality allows to <br> read the document content</div>';
	var wordcloud_view_string = '<div style="color:yellow; font-size:24px;">Word Cloud View <br></div> <div style="color:white; font-size:18px;">This functionality allows <br> to see the main terms in <br> the content of a document</div>';
	var terms_view_string = '<div style="color:yellow; font-size:24px;">Terms View <br></div> <div style="color:white; font-size:18px;">This functionality shows <br> important terms in the initial query</div>';
	var terms_view_string_add = '<div style="color:yellow; font-size:24px;">Terms View <br></div> <div style="color:white; font-size:18px;">You can ADD new terms</div>';
	var terms_view_string_synonyms = '<div style="color:yellow; font-size:24px;">Terms View <br></div> <div style="color:white; font-size:18px;">You can visualize SYNONYMS of each term</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	
	var signature_string = '<div style="color:yellow; font-size:24px;">Signature List <br></div> <div style="color:white; font-size:18px;">This functionality shows <br> 3-grams that are 3 words <br> that appears in the documents <br> exactly in this order</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var signature_container_string = '<div style="color:yellow; font-size:24px;">Signature List: 3-Grams <br></div> <div style="color:white; font-size:18px;"> Each line represents one 3-gram. <br><br> The 3-Gram List is shown in ascending order <br> by frequency in the whole Corpus. <br> </div>';
	var signature_search_string = '<div style="color:yellow; font-size:24px;">Signature List: Filter by given terms <br></div> <div style="color:white; font-size:18px;"> You can search by 3-Grams containing <br> specific terms. </div>';
	var signature_filter_string = '<div style="color:yellow; font-size:24px;">Signature List: Filter by important terms <br></div> <div style="color:white; font-size:18px;"> You can search by 3-Grams containing <br> the important terms from Terms View. <br> </div>';
	var focus_string = '<div style="color:yellow; font-size:24px;">Focus List <br></div> <div style="color:white; font-size:18px;">This functionality shows <br> a list of the Relevant and <br> Seed documents</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var focus_container_string = '<div style="color:yellow; font-size:24px;">Focus List <br></div> <div style="color:white; font-size:18px;"> Each line represents a corpus document. <br><br> You can select them and in the list and <br> them will be highlited in the Scatterplot View. </div>';
	var suggestion_string = '<div style="color:yellow; font-size:24px;">Suggestion List <br></div> <div style="color:white; font-size:18px;">This functionality shows <br> a list of suggested as <br> relevant documents</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var suggestion_container_string = '<div style="color:yellow; font-size:24px;">Suggestion List <br></div> <div style="color:white; font-size:18px;"> Each line represents a suggested document <br> by the system algorithm. <br><br> You can select them and in the list and <br> them will be highlited in the Scatterplot View. </div>';

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