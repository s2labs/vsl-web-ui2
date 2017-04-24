import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		reload() {
			location.reload();
		},
       		logout() {
			// only works for firefox and old versions of chrome, cf. http://stackoverflow.com/questions/9724489/clear-ssl-client-certificate-state-from-javascript/9724667#9724667
			if (window.crypto) window.crypto.logout();
		}
	}

});
