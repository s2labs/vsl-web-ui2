
export default {
  name: 'disable-overscroll',
  initialize: function(app) {

    //from http://stackoverflow.com/a/2890530/521791
    document.ontouchstart = document.ontouchmove = function(e){ 
      e.preventDefault(); 
    }; 
    
    window.app = app;
  }
};