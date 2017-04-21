'use strict';

const chai   = require('chai');
const sinon  = require('sinon');
const Rescue = require('../../lib/rescue').Rescue;

describe('Rescue', () => {
  describe('#()', () => {

    it ('expects an Error or a substype. Throws an exception if provided otherwise', () => {
      let expectedMessage = /(?:error|subtype)/i;
      chai.expect((_ => new Rescue())).to.throw(Error, expectedMessage);
      chai.expect((_ => new Rescue({}))).to.throw(Error, expectedMessage);
      chai.expect((_ => new Rescue(1))).to.throw(Error, expectedMessage);
    });

  });

  describe('Rescue Rules', () => {

    let sampleError;
    let ifAttributeSpy;
    let ifMessageSpy;
    let ifTypeSpy;
    let defaultSpy;

    beforeEach(() => {
      sampleError = new Error('This is a sample error.');
      ifAttributeSpy = sinon.spy();
      ifMessageSpy = sinon.spy();
      ifTypeSpy = sinon.spy();
      defaultSpy = sinon.spy();
    });

    describe('#ifAttribute(String, Fn)', () => {

      it('rule matches and executes if the provided property exists on the context error.', () => {
        sampleError.sampleProperty = true;
        new Rescue(sampleError).ifAttribute('sampleProperty', ifAttributeSpy).do();
        ifAttributeSpy.should.have.been.calledWith(sampleError);
      });

      it('rule matches only if the property value is truthy', () => {
        sampleError.sampleProperty = false;

        /*
         * Rescue will throw an error when no default
         */
        try {
          new Rescue(sampleError).ifAttribute('sampleProperty', ifAttributeSpy).do();
        } catch (err) {
          ifAttributeSpy.should.not.have.been.calledWith(sampleError);
        }

      });

      it('returns an instance of Rescue', () => {
        new Rescue(sampleError).ifAttribute('sampleProperty', ifAttributeSpy).should.be.an.instanceOf(Rescue);
      });

    });

    describe('#ifMessage(RegEx, Fn)', () => {

      it('rule is applied if the provided RegEx matches the message description of the Error.', () => {
        new Rescue(sampleError).ifMessage(/sample/i, ifMessageSpy).do();
        ifMessageSpy.should.have.been.calledWith(sampleError);
      });

      it('rule is NOT applied if the provided message does not match.', () => {
        try {
          new Rescue(sampleError).ifMessage(/nothing/i, ifMessageSpy).do();
        } catch (err) {
          ifMessageSpy.should.not.have.been.called;
        }
      });

    });

    describe('#ifType(constructor, Fn)', () => {
      it('rule applies if error matches the given type', () => {
        let uriError = new URIError('There is something wrong with the URL.');
        new Rescue(uriError)
                .ifType(URIError, ifTypeSpy)
                .do();
        ifTypeSpy.should.have.been.calledWith(uriError);
      });
    });

    describe('#default(Fn)', () => {
      it ('creates a fallback operation for when no rule applies.', () => {
        new Rescue(sampleError)
                .default(defaultSpy)
                .do();
        defaultSpy.should.have.been.calledWith(sampleError);
      });
    });

    describe('#do()', () => {
      it('should apply ONLY the first rule that matches. ifAttribute', () => {
        sampleError.sampleProperty = true;

        new Rescue(sampleError)
                .ifAttribute('sampleProperty', ifAttributeSpy)
                .ifMessage(/sample/i, ifMessageSpy)
                .do();

        ifAttributeSpy.should.have.been.calledWith(sampleError);
        ifMessageSpy.should.not.have.been.called;
      });

      it('should apply ONLY the first rule that matches. ifMessage', () => {
        sampleError.sampleProperty = true;

        new Rescue(sampleError)
                .ifMessage(/sample/i, ifMessageSpy)
                .ifAttribute('sampleProperty', ifAttributeSpy)
                .do();

        ifMessageSpy.should.have.been.calledWith(sampleError);
        ifAttributeSpy.should.not.have.been.called;
      });

      it('throws an Error if no rule applies and no default operation is set.', () => {
        chai.expect(() => {
          new Rescue(sampleError)
                  .ifAttribute('nothing', ifAttributeSpy)
                  .ifMessage(/none/, ifMessageSpy)
                  .do();
        }).to.throw(Error, 'No rules were applied.');
      });

      it('fallsback to the default operation when no rules applies.', () => {
        new Rescue(sampleError)
                .default(defaultSpy)
                .ifAttribute('nothing', ifAttributeSpy)
                .ifMessage(/none/, ifMessageSpy)
                .do();

        defaultSpy.should.have.been.calledWith(sampleError);
        ifAttributeSpy.should.not.have.been.called;
        ifMessageSpy.should.not.have.been.called;
      });

      it('does not fallback to the default operation if other rules apply.', () => {
        new Rescue(sampleError)
                .default(defaultSpy)
                .ifType(Error, ifTypeSpy)
                .ifMessage(/none/, ifMessageSpy)
                .do();

        ifTypeSpy.should.have.been.called;
        defaultSpy.should.not.have.been.called;
        ifMessageSpy.should.not.have.been.called;
      });
    });

  });

});