import { Rule,
         ifAttributeRule,
         IfMessageRule,
         DefaultRule, IfTypeRule
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
  defaultRule: Rule;

  ifAttribute (property : string, predicate: Function): Rescue {
    this.rules.push(new ifAttributeRule(property, predicate));
    return this;
  }

  ifMessage (regex: RegExp, predicate: Function): Rescue {
    this.rules.push(new IfMessageRule(regex, predicate));
    return this;
  }

  ifType (type: Function, predicate: Function): Rescue {
    this.rules.push(new IfTypeRule(type, predicate));
    return this;
  }

  default (predicate: Function) : Rescue {
    this.defaultRule = new DefaultRule(predicate);
    return this;
  }

  do () : void {
    let applicableRule = this.rules.filter((r) => r.condition(this.contextError)).shift() || this.defaultRule;
    if (applicableRule) { return applicableRule.predicate(this.contextError); }
    throw new Error('No rules were applied.');
  }
}
