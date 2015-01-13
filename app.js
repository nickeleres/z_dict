
(function($){


			//---------SINGLE ENTRY MODEL----------
			var Entry = Backbone.Model.extend({

					urlRoot: '/api/bears/',

					defaults: function(){
						return{

							task: '',
							description: ''
						}
					},

					parse: function(response){
						response.id = response._id;
						return response;
					},

					idAttribute: "_id",
				});

			//------------ENTRY MODEL COLLECTION------------
			var EntryList = Backbone.Collection.extend({

					url: '/api/bears',

					model: Entry
				});

			//-----INSTANCIATE COLLECTION----
			var dictionary = new EntryList();

			//-----SINGLE ENTRY VIEW------
			var EntryView = Backbone.View.extend({
				model: new Entry(),
				tagName:'div',
				className: 'singleEntry',

				events:{
					'click .edit': 'edit',
					'click .delete': 'delete',
					'keypress .definition': 'updateOnEnter',
					'click .save': 'save'
				},

				initialize: function(){
					this.template = _.template($("#dictionary_template").html());

				},

				delete: function(ev){
					ev.preventDefault;
					// dictionary.remove(this.model);
					(this.model).destroy({success: function(model, response){
						console.log('destroyed');
					}});

				},

				edit: function(ev){
					ev.preventDefault;
					this.$('.definition').attr('contenteditable', true).focus();

				},

				save: function(ev){
					ev.preventDefault;
					saved.add(this.model);
					dictionary.remove(this.model);
					saved.comparator = 'word';
					console.log(this.model.toJSON());

				},

				close: function(){
					var definition = this.$('.definition').text();
					this.model.set('definition', definition);
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

						console.log(dictionary.toJSON());

						$('#body').children('input').val('');

						return false;
				
					});

				}
			})

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
			var dictionaryView = new DictionaryView();
			var router = new Router();

			router.on('route:home', function(){

				console.log('router home');

				homeView.render();
				dictionaryView.render();

				});

			router.on('route:login', function(){

				console.log('router login');

				loginView.render();

				});

			Backbone.history.start();

		var appView = new DictionaryView();

	})(jQuery);


	// //---------SAVED ENTRY VIEW-----------
	// 		var SavedView = Backbone.View.extend({

	// 			model: saved,

	// 			initialize: function(){
	// 				this.model.fetch();

	// 				this.model.on('add', this.render, this);
	// 				this.model.on('remove', this.render, this);
	// 				this.model.on('reset', this.render, this);

	// 			},

	// 			render: function(){
	// 				this.$el = $('#saved');
	// 				var self = this;
	// 				console.log('render');
	// 				self.$el.html('');
	// 				_.each(this.model.toArray(), function(entry, i){
	// 					self.$el.append(new EntryView({model: entry}).render().$el);
	// 				});

	// 				return this;
	// 			}
	// 		});
