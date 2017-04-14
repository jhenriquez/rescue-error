/*
 * This file is used to define global behaviors for the specs.
 */


/*
 * Load chai should assertions and attach the sinon chai plugin before anything else runs.
 */
const chai         = require('chai');
const sinonPlugin  = require('sinon-chai');


before(() => {
  chai.should();
  chai.use(sinonPlugin);
});
