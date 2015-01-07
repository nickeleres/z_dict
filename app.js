(function($){


			//---------SINGLE ENTRY MODEL----------
				var Entry = Backbone.Model.extend({
					defaults: function(){
						return{
							word: '',
							definition: ''
						}
					}
				});

			//------------ENTRY MODEL COLLECTION------------
			EntryList = Backbone.Collection.extend({

					model: Entry
				});

			//-----INSTANCIATE COLLECTION----
			var dictionary = new EntryList();
			var saved = new EntryList();



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
					dictionary.remove(this.model);
					saved.remove(this.model);

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
				el: $('#header'),

				initialize: function(){
					this.model.on('add', this.render, this);
					this.model.on('remove', this.render, this);

				},

				render: function(){
					var self = this;
					self.$el.html('');
					_.each(this.model.toArray(), function(entry, i){
						self.$el.append((new EntryView({model: entry})).render().$el);
					});

					return this;
				}
			});

			//---------SAVED ENTRY VIEW-----------
			var SavedView = Backbone.View.extend({
				model: saved,
				el: $('#header'),

				initialize: function(){
					this.model.on('add', this.savedRender, this);
					this.model.on('remove', this.savedRender, this);

				},

				savedRender: function(){
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
				el: $('#header'),

				render: function(){

					this.template = _.template($('#login_template').html());

					this.$el.html(this.template(this.template));
				}
			});


			//-------BINDING DATA ENTRY TO NEW MODEL VIEW-------
			$(document).ready(function(){
				$('#new-entry').submit(function(ev){
					var entry = new Entry({word: $('#word').val(), definition: $('#definition').val() });

					dictionary.add(entry);

					dictionary.comparator = 'word';

					console.log(dictionary.toJSON());

					$('.form-group').children('input').val('');

					return false;
				});

				var appView = new DictionaryView();

				var savedView = new SavedView();
			});


			//--------------ROUTER----------------
			var Router =  Backbone.Router.extend({

				routes:{
					'home':'home',
					'login': 'login' 
				}
			});

			var dictionaryView = new DictionaryView();
			var entryView = new EntryView();
			var loginView = new LoginView();

			var router = new Router();

			router.on('route:home', function(){

				console.log('router home');

				entryView.render();

				});

			router.on('route:login', function(){

				console.log('login page');

				loginView.render();

				});

			Backbone.history.start();

		})(jQuery);









