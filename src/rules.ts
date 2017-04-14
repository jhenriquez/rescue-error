export class Rule {
  constructor (public condition: (err:Error)=>Boolean, public predicate: Function) { }
}

export class ifAttributeRule extends Rule {
  constructor (private property: string, predicate: Function) {
    super((ctx: Error) => this.hasTruthyProperty(this.property, ctx), predicate);
  }

  private hasTruthyProperty (property: string, ctx: any): Boolean {
    return Boolean(ctx[property]);
  }
}

export class IfMessageRule extends Rule {
  constructor (regex: RegExp, predicate: Function) {
    super((ctx: Error) => regex.test(ctx.message), predicate);
  }
}

export class IfTypeRule extends Rule {
  constructor (private type: Function, predicate: Function) {
    super((ctx: Error) => ctx instanceof type, predicate);
  }
}

export class DefaultRule extends Rule {
  constructor (predicate: Function) {
    super(_ => true, predicate);
  }
}