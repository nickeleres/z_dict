
(function($){


			//-----------ENTRY MODEL----------
			var Entry = Backbone.Model.extend({

					urlRoot: '/api/bears/',

					defaults: function(){

						return{

							task: '',
							description: ''
						}
					},

					idAttribute: "_id"
				});
			//--------------LIST MODEL---------------------

			var List = Backbone.Model.extend({

					urlRoot: '/api/lists/',

					defaults: function(){

						return{

							title: ''
						}
					},

					idAttribute: '_id'
			});

			//------------ENTRY MODEL COLLECTION------------
			var EntryList = Backbone.Collection.extend({

					url: '/api/bears',

					model: Entry
				});

			//-----------LIST MODEL COLLECTION--------------
			var ListList = Backbone.Collection.extend({

					url: '/api/lists',

					model: List
			});

			//-----INSTANCIATE COLLECTION----
			var dictionary = new EntryList();
			var list_collection = new ListList(); 

			//-----SINGLE ENTRY VIEW------
			var EntryView = Backbone.View.extend({

				model: new Entry(),
				tagName:'div',
				className: 'singleEntry',

				events:{
					'click .edit': 'edit',
					'click .delete': 'delete',
					'click .completed': 'completed',
					'keypress .definition': 'updateOnEnter',
					'click .save': 'save'
				},

				initialize: function(){
					this.template = _.template($("#dictionary_template").html());

				},

				delete: function(ev){
					ev.preventDefault;
					(this.model).destroy({success: function(model, response){
						console.log('single entry destroyed');
					}});

				},

				edit: function(ev){
					ev.preventDefault;
					this.$('.definition').attr('contenteditable', true).focus();

				},

				close: function(){
					var definition = this.$('.definition').text();
					this.model.set('description', definition);
					this.model.save();
					this.$('.definition').attr('contenteditable', false).blur();

				},

				updateOnEnter: function(ev){
					if(ev.which == 13){
						this.close();
					}
				},

				render: function(){
					this.$el.html(this.template(this.model.toJSON()));
					return this;
				},

				completed: function(){
					var task = (this).$el;

					console.log(task);

					if(!task.hasClass('toggle')){

						task.addClass('toggle');

						$('#entries').append(task);

					} else {
						task.removeClass('toggle');

						$('#entries').prepend(task);
					}
				}
			});

			//----------SINGLE LIST VIEW--------------
			var ListView = Backbone.View.extend({

					model: new List(),
					tagName: 'div',
					className: 'singleList',

					events:{
						'click .delete': 'delete'
					},

					initialize: function(){

						this.template = _.template($('#list_template').html());
					},

					render: function(){

						this.$el.html(this.template(this.model.toJSON()));
						return this;
					},

					delete: function(ev){
						ev.preventDefault;

						(this.model).destroy({success: function(model, response){
							console.log('list destroyed');
						}});
					}
			});

			//--------------DICTIONARY VIEW------------
			var DictionaryView = Backbone.View.extend({

				model: dictionary,

				initialize: function(){
					this.model.fetch();

					this.model.on('add', this.render, this);
					this.model.on('remove', this.render, this);
					this.model.on('reset', this.render, this);

				},

				render: function(){

					this.$el = $('#entries');

					var self = this;

					self.$el.html('');

					_.each(this.model.toArray(), function(entry, i){
						self.$el.append(new EntryView({model: entry}).render().$el);
					});

					return this;
				}
			});

			//-------------LISTLIST VIEW----------

			var ListListView = Backbone.View.extend({

				model: list_collection,


				initialize: function(){
					this.model.fetch();

					this.model.on('reset', this.render, this);
					this.model.on('add', this.render, this);
					this.model.on('remove', this.render, this);
					
				},

				render: function(){

					this.$el = $('#list_entries');

					var self = this;

					self.$el.html('');

					_.each(this.model.toArray(), function(list, i){
						self.$el.append(new ListView({model: list}).render().$el);

					});

					return this;
				}
			});

			//------------HOME VIEW--------------
			var HomeView = Backbone.View.extend({
				el:$('#main'),

				render: function(){

					this.template = _.template($('#home_template').html());

					this.$el.html(this.template);

					$('#new-entry').submit(function(ev){

						var entry = new Entry({task: $('#word').val(), description: $('#definition').val() });

						dictionary.add(entry);

						entry.save();

						console.log(entry.toJSON());

						$('#tasks-body').children('input').val('');

						return false;
				
					});

					$('#new-list').submit(function(ev){

						var list_entry = new List({title: $('#list').val() });

						console.log(list_entry.toJSON());

						list_collection.add(list_entry);

						console.log(list_collection.toJSON());

						list_entry.save();

						$('#list-body').children('input').val('');

						return false;
					});

				}
			});

			//---------LOGIN VIEW----------------
			var LoginView = Backbone.View.extend({
				el: $('#main'),

				render: function(){

					this.template = _.template($('#login_template').html());

					this.$el.html(this.template);

					$('#login').submit(function(ev){

						var userName = $('#userName').val();
						var userPass = $('#userPassword').val();

						console.log('logged username is ' + userName);
						console.log('logged password is ' + userPass);

						$('#login').children('input').val('');

					});
				}
			});

			//--------------ROUTER----------------
			var Router =  Backbone.Router.extend({

				routes:{
					'': 'home',
					'home':'home',
					'login': 'login' 
				}
			});

			var homeView = new HomeView();
			var loginView = new LoginView();
			var listListView = new ListListView();
			var dictionaryView = new DictionaryView();
			var router = new Router();

			router.on('route:home', function(){

				console.log('router home');

				homeView.render();
				dictionaryView.render();
				listListView.render();

				});

			router.on('route:login', function(){

				console.log('router login');

				loginView.render();

				});

			Backbone.history.start();

		var appView = new DictionaryView();

	})(jQuery);

