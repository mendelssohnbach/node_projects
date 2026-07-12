import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidNumber, isValidEmail } from './validators.js';

describe('isValidNumber', () => {
  test('数字のみの文字列はtrueを返す', () => {
    assert.equal(isValidNumber('123'), true);
  });

  test('0のみの文字列はtrueを返す', () => {
    assert.equal(isValidNumber('0'), true);
  });

  test('先頭に0がある数字文字列もtrueを返す', () => {
    assert.equal(isValidNumber('007'), true);
  });

  test('空文字はfalseを返す', () => {
    assert.equal(isValidNumber(''), false);
  });

  test('数字以外の文字を含む場合はfalseを返す', () => {
    assert.equal(isValidNumber('abc'), false);
  });

  test('数字と文字が混在する場合はfalseを返す', () => {
    assert.equal(isValidNumber('123abc'), false);
  });

  test('数字の間にスペースがある場合はfalseを返す', () => {
    assert.equal(isValidNumber('12 34'), false);
  });

  test('マイナス符号を含む場合はfalseを返す', () => {
    assert.equal(isValidNumber('-123'), false);
  });

  test('小数点を含む場合はfalseを返す', () => {
    assert.equal(isValidNumber('12.3'), false);
  });
});

describe('isValidEmail', () => {
  test('一般的な形式のメールアドレスはtrueを返す', () => {
    assert.equal(isValidEmail('a@b.com'), true);
  });

  test('複数のドットを含むドメインでもtrueを返す', () => {
    assert.equal(isValidEmail('alice.smith@example.co.jp'), true);
  });

  test('空文字はfalseを返す', () => {
    assert.equal(isValidEmail(''), false);
  });

  test('@を含まない文字列はfalseを返す', () => {
    assert.equal(isValidEmail('invalid'), false);
  });

  test('@の後にドットがない場合はfalseを返す', () => {
    assert.equal(isValidEmail('a@b'), false);
  });

  test('@の前に文字がない場合はfalseを返す', () => {
    assert.equal(isValidEmail('@b.com'), false);
  });

  test('ドメインにドットがない場合はfalseを返す', () => {
    assert.equal(isValidEmail('a@bcom'), false);
  });

  test('@の直後にスペースを含む場合はfalseを返す', () => {
    assert.equal(isValidEmail('a@b .com'), false);
  });

  test('文字列内に@形式の部分文字列が含まれていればtrueを返す（部分一致の仕様）', () => {
    assert.equal(isValidEmail('a b@c.com'), true);
  });
});
