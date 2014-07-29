import Ember from 'ember';
import Util from "subledger-app/utils/util";

export default Ember.Handlebars.makeBoundHelper(Util.formatAmount);