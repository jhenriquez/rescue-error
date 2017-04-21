"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rules_1 = require("./rules");
var Rescue = (function () {
    function Rescue(err) {
        this.rules = [];
        if (!(err instanceof Error)) {
            throw new Error('The provided value should be an instance or a subtype of Error.');
        }
        this.contextError = err;
    }
    Rescue.prototype.ifAttribute = function (property, predicate) {
        this.rules.push(new rules_1.ifAttributeRule(property, predicate));
        return this;
    };
    Rescue.prototype.ifMessage = function (regex, predicate) {
        this.rules.push(new rules_1.IfMessageRule(regex, predicate));
        return this;
    };
    Rescue.prototype.ifType = function (type, predicate) {
        this.rules.push(new rules_1.IfTypeRule(type, predicate));
        return this;
    };
    Rescue.prototype.default = function (predicate) {
        this.rules.push(new rules_1.DefaultRule(predicate));
        return this;
    };
    Rescue.prototype.do = function () {
        var applicableRule = this.rules.filter(rules_1.Rule.matches(this.contextError)).sort(rules_1.Rule.sortRulesArray())[0];
        if (applicableRule) {
            return applicableRule.apply(this.contextError);
        }
        throw new Error('No rules were applied.');
    };
    return Rescue;
}());
exports.Rescue = Rescue;
