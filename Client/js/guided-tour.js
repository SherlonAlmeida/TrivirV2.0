function guided_tour(){
	
	//Description: Style and Content for each hint
	var load_string = '<div style="color:yellow; font-size:24px;">Load <br></div> <div style="color:white; font-size:18px;">Click in Load button to insert <br> the Corpus in the system</div>';
	var seed_string = '<div style="color:yellow; font-size:24px;">Seed <br></div> <div style="color:white; font-size:18px;">Click in Seed button to <br> choose the initial query (Seed)</div>';
	var train_string = '<div style="color:yellow; font-size:24px;">Train <br></div> <div style="color:white; font-size:18px;">You can click in Train button <br> to retrain the classfier.</div>';
	var export_string = '<div style="color:yellow; font-size:24px;">Export <br></div> <div style="color:white; font-size:18px;">This button allows you to <br> export the data of this session</div>';
	var tips_string = '<div style="color:yellow; font-size:24px;">Guided Tour (Tips) <br></div> <div style="color:white; font-size:18px;">You can run the Guided Tutorial <br> whenever you want by clicking here</div>';
	var scatterplot_view_string = '<div style="color:yellow; font-size:20px;">Scatterplot View <br> </div> <div style="color:white; font-size:18px;">Each circle <br> represents a <br> Corpus document </div>';
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
	var focus_string = '<div style="color:yellow; font-size:24px;">Focus List <br></div> <div style="color:white; font-size:18px;">This functionality shows <br> a list of the Relevant and <br> Seed documents</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';
	var suggestion_string = '<div style="color:yellow; font-size:24px;">Suggestion List <br></div> <div style="color:white; font-size:18px;">This functionality shows <br> a list of suggested as <br> relevant documents</div><div style="color:chartreuse; font-size:18px;">Click in the button! </div>';

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
			//Focus List
			'click .btn.btn-outline-info.btn-sm' : focus_string,
			'showSkip' : false
		},
		{
			//Suggestion List
			'click .btn.btn-outline-warning.btn-sm' : suggestion_string,
			'showSkip' : false
		},
		{
			//Tips Button (Guided Tour)
			'next .fa.fa-question-circle' : tips_string,
			'showSkip' : false
		}
	];

	enjoyhint_instance.set(enjoy_script_steps); //Set the description of Hints

	enjoyhint_instance.run(); //Runs the Guided Tour
}

/*Estrutura basica do Jquery: quando o documento estiver pronto (pagina carregada), faca...*/
$(document).ready(function(){

});