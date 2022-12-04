const { EmailValidator } = require('./')
const validator = require('validator')

const makeSut = () => {
  return new EmailValidator()
}
describe('Email validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid@email.com')
    expect(isEmailValid).toBe(true)
  })
  test('Should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('validemail.com')
    expect(isEmailValid).toBe(false)
  })
  test('Should call validator with correct email', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    sut.isValid('validemail.com')
    expect(validator.email).toBe('validemail.com')
  })
})
