const { MissingParamError } = require('../../utils/errors')
const { AuthUseCase } = require('./')
const makeAuthUseCase = () => {
  const userEmailRepository = makeFindUserEmailRepositorySpy()
  const encrypter = makeEncrypter()
  const sut = new AuthUseCase(userEmailRepository, encrypter)
  return { sut, userEmailRepository, encrypter }
}
const makeFindUserEmailRepositorySpy = () => {
  class FindUserEmailRepositorySpy {
    user = {
      password: 'hashed_password'
    }

    async findByEmail (email) {
      this.email = email
      return this.user
    }
  }
  const userEmailRepository = new FindUserEmailRepositorySpy()
  return userEmailRepository
}
const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
    }
  }
  const encrypterSpy = new EncrypterSpy()
  return encrypterSpy
}
describe('Auth UseCase', () => {
  test('Should throw null if no email is provided', async () => {
    const { sut } = makeAuthUseCase()
    sut.accessToken = null
    const ps = sut.auth()
    expect(ps).rejects.toThrow(new MissingParamError('email'))
  })
  test('Should throw null if no password is provided', async () => {
    const { sut } = makeAuthUseCase()
    sut.accessToken = null
    const ps = sut.auth('email@gmail.com')
    expect(ps).rejects.toThrow(new MissingParamError('password'))
  })
  test('Should call FindUserEmailRepository with correct mail', async () => {
    const { sut, userEmailRepository } = makeAuthUseCase()
    await sut.auth('email@gmail.com', '123')
    expect(userEmailRepository.email).toBe('email@gmail.com')
  })
  test('Should throw if no FindUserEmailRepository is provided', async () => {
    const { sut } = makeAuthUseCase()
    sut.userEmailRepository = null
    const ps = sut.auth('email@gmail.com', '123')
    expect(ps).rejects.toThrow()
  })
  test('Should return null FindUserEmailRepository return null', async () => {
    const { sut, userEmailRepository } = makeAuthUseCase()
    userEmailRepository.user = null
    const accessToken = await sut.auth('email@gmail.com', 'any_password')
    expect(accessToken).toBeNull()
  })
  test('Should return null if an invalid email is provided', async () => {
    const { sut } = makeAuthUseCase()
    const accessToken = await sut.auth('invalid@gmail.com', 'any_password')
    expect(accessToken).toBeNull()
  })
  test('Should return null if an invalid password is provided', async () => {
    const { sut } = makeAuthUseCase()
    const accessToken = await sut.auth('valid@gmail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypter, userEmailRepository } = makeAuthUseCase()
    await sut.auth('valid@gmail.com', 'hashed_password')
    expect(encrypter.password).toBe('hashed_password')
    expect(encrypter.hashedPassword).toBe(userEmailRepository.user.password)
  })
})
