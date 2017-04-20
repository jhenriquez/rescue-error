export class Rule {
  constructor (public condition: (err:Error)=>Boolean, public apply: Function) { }

  static matches(...args) {
    return (rule) => rule.condition(...args);
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
  }
}