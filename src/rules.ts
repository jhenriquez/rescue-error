enum RulePriority { normal = 0, default }

export class Rule {
  constructor (public predicate: (err:Error)=>Boolean, public apply: Function) { }

  priority: RulePriority = RulePriority.normal;

  static matches(contextError: Error) {
    return (rule: Rule) => rule.predicate(contextError);
  }

  static sortRulesArray () {
    return (a: Rule, b: Rule) => a.priority - b.priority;
  }
}

export class ifAttributeRule extends Rule {
  constructor (private property: string, apply: Function) {
    super((ctx: Error) => this.hasTruthyProperty(this.property, ctx), apply);
  }

  private hasTruthyProperty (property: string, ctx: any): Boolean {
    return Boolean(ctx[property]);
  }
}

export class IfMessageRule extends Rule {
  constructor (regex: RegExp, apply: Function) {
    super((ctx: Error) => regex.test(ctx.message), apply);
  }
}

export class IfTypeRule extends Rule {
  constructor (private type: Function, apply: Function) {
    super((ctx: Error) => ctx instanceof type, apply);
  }
}

export class DefaultRule extends Rule {
  constructor (apply: Function) {
    super(_ => true, apply);
    this.priority = RulePriority.default;
  }
}