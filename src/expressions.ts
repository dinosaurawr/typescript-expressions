export enum ExpressionType {
  Void = 1,
  Member,
  And,
  Or,
  Equal,
  Parameter,
  Lambda,
  Value,
  Not,
  ArrayIndex
}

export abstract class Expression<TReturnType = unknown> {
  protected _type: ExpressionType = ExpressionType.Void;

  abstract compile(): string;

  evaluate(): TReturnType {
    return eval(this.compile());
  }
}

export abstract class BinaryExpression<TReturnType = unknown> extends Expression<
  TReturnType
> {
  protected _left: Expression;
  protected _right: Expression;
}

export class ParameterExpression<TParamType = unknown> extends Expression<TParamType> {
  _type = ExpressionType.Parameter;

  protected _parameterName: string;

  constructor(name: string) {
    super();
    this._parameterName = name;
  }

  compile(): string {
    return `${this._parameterName}`;
  }
}

export class LambdaExpression<
  TParamType = unknown,
  TReturnType = unknown
> extends Expression<(param: TParamType) => TReturnType> {
  _type = ExpressionType.Lambda;

  protected _body: Expression;
  protected _parameters: ParameterExpression<TParamType>[];

  constructor(
    body: Expression<TReturnType>,
    ...parameters: ParameterExpression<TParamType>[]
  ) {
    super();
    this._parameters = parameters;
    this._body = body;
  }

  getCompiledParameters(): string[] {
    return this._parameters.map((p, index) => index > 0 ? p.compile() + ',' : p.compile())
  }

  compile(): string {
    return `(${this.getCompiledParameters().join('')}) => ${this._body.compile()}`;
  }
}

export class NotExpression extends Expression<boolean> {
  protected _expression: Expression;

  constructor(expr: Expression<boolean>) {
    super();
    this._expression = expr;
  }

  compile(): string {
    return `!${this._expression.compile()}`;
  }
}

export class EqualExpression extends BinaryExpression<boolean> {
  _type = ExpressionType.Equal;

  constructor(left: Expression, right: Expression) {
    super();
    this._left = left;
    this._right = right;
  }

  compile(): string {
    return `(${this._left.compile()} === ${this._right.compile()})`;
  }
}

export class MemberExpression<
  TFromType,
  TProp extends keyof TFromType
> extends Expression<TFromType[TProp]> {
  _type = ExpressionType.Member;

  protected _parameter: Expression<TFromType>;
  protected _indexedParameterName: keyof TFromType;

  constructor(parameter: Expression<TFromType>, indexName: TProp) {
    super();
    this._parameter = parameter;
    this._indexedParameterName = indexName;
  }

  compile(): string {
    return `${this._parameter.compile()}.${this._indexedParameterName}`;
  }
}

export class ValueExpression<T = unknown> extends Expression<T> {
  _type = ExpressionType.Value;

  protected _value: T;

  constructor(value: T) {
    super();
    this._value = value;
  }

  compile(): string {
    return `'${this._value.toString()}'`;
  }
}

export class OrExpression extends BinaryExpression<boolean> {
  _type = ExpressionType.Or;
  constructor(left: Expression, right: Expression) {
    super();
    this._left = left;
    this._right = right;
  }

  compile(): string {
    return `(${this._left.compile()} || ${this._right.compile()})`;
  }
}

export class AndExpression extends BinaryExpression<boolean> {
  _type = ExpressionType.And;

  constructor(left: Expression, right: Expression) {
    super();
    this._left = left;
    this._right = right;
  }

  compile(): string {
    return `(${this._left.compile()} && ${this._right.compile()})`;
  }
}

export class ArrayIndexExpression<TItemType = unknown> extends Expression<TItemType> {
  _type = ExpressionType.ArrayIndex;

  protected _from: Expression<Array<TItemType>>;
  protected _index: number;

  constructor(array: Expression<Array<TItemType>>, index: number) {
    super();
    this._from = array;
    this._index = index;
  }

  compile(): string {
    return `${this._from.compile()}[${this._index}]`;
  }
}
