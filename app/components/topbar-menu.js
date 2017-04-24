import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		reload() {
			location.reload();
		}
	}

});
