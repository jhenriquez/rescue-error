import {
        Rule,
        ifAttributeRule,
        IfMessageRule,
        DefaultRule,
        IfTypeRule
       } from "./rules";

export class Rescue {
  constructor (err: Error) {
    if (!(err instanceof Error)) {
      throw new Error('The provided value should be an instance or a subtype of Error.');
    }

    this.contextError = err;
  }

  contextError: Error;
  rules: Rule[] = [];

  ifAttribute (property : string, action: Function): Rescue {
    this.rules.push(new ifAttributeRule(property, action));
    return this;
  }

  ifMessage (regex: RegExp, action: Function): Rescue {
    this.rules.push(new IfMessageRule(regex, action));
    return this;
  }

  ifType (type: Function, action: Function): Rescue {
    this.rules.push(new IfTypeRule(type, action));
    return this;
  }

  default (action: Function) : Rescue {
    this.rules.push(new DefaultRule(action));
    return this;
  }

  do () : void {
    let [ applicableRule ] = this.rules.filter(Rule.matches(this.contextError)).sort(Rule.sortRulesArray());
    if (applicableRule) { return applicableRule.apply(this.contextError); }
    throw new Error('No rules were applied.');
  }
}
