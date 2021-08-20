import {
  EqualExpression,
  LambdaExpression,
  MemberExpression,
  NotExpression,
  ParameterExpression,
  ValueExpression,
} from '../src/expressions';

test('Lambda expression not equal with single parameter, should compile correctly', () => {
  const paramter = new ParameterExpression<{ Name: string }>('u');
  const expression = new LambdaExpression(
    new NotExpression(
      new EqualExpression(
        new MemberExpression(paramter, 'Name'),
        new ValueExpression('Ashot')
      )
    ),
    paramter
  );

  expect(expression.compile()).toBe("(u) => !(u.Name === 'Ashot')");
})

test('Lambda expression with multiple parameters', () => {
  const firstParamter = new ParameterExpression<{ Name: string }>('u');
  const secondParameter = new ParameterExpression<{index: number}>('i');
  const expression = new LambdaExpression(
    new NotExpression(
      new EqualExpression(
        new MemberExpression(firstParamter, 'Name'),
        new ValueExpression('Ashot')
      )
    ),
    firstParamter, secondParameter
  );

  expect(expression.compile()).toBe("(u) => !(u.Name === 'Ashot')");
})
