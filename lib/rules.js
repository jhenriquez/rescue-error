"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Rule = (function () {
    function Rule(condition, predicate) {
        this.condition = condition;
        this.predicate = predicate;
    }
    return Rule;
}());
exports.Rule = Rule;
var ifAttributeRule = (function (_super) {
    __extends(ifAttributeRule, _super);
    function ifAttributeRule(property, predicate) {
        var _this = _super.call(this, function (ctx) { return _this.hasTruthyProperty(_this.property, ctx); }, predicate) || this;
        _this.property = property;
        return _this;
    }
    ifAttributeRule.prototype.hasTruthyProperty = function (property, ctx) {
        return Boolean(ctx[property]);
    };
    return ifAttributeRule;
}(Rule));
exports.ifAttributeRule = ifAttributeRule;
var IfMessageRule = (function (_super) {
    __extends(IfMessageRule, _super);
    function IfMessageRule(regex, predicate) {
        return _super.call(this, function (ctx) { return regex.test(ctx.message); }, predicate) || this;
    }
    return IfMessageRule;
}(Rule));
exports.IfMessageRule = IfMessageRule;
var IfTypeRule = (function (_super) {
    __extends(IfTypeRule, _super);
    function IfTypeRule(type, predicate) {
        var _this = _super.call(this, function (ctx) { return ctx instanceof type; }, predicate) || this;
        _this.type = type;
        return _this;
    }
    return IfTypeRule;
}(Rule));
exports.IfTypeRule = IfTypeRule;
var DefaultRule = (function (_super) {
    __extends(DefaultRule, _super);
    function DefaultRule(predicate) {
        return _super.call(this, function (_) { return true; }, predicate) || this;
    }
    return DefaultRule;
}(Rule));
exports.DefaultRule = DefaultRule;
