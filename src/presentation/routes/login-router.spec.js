class LoginRouter {
  route (httpRequest) {
    const { email, password } = httpRequest.body
    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
  }
}
describe('Login router', () => {
  test('Should return 400 if no email is provider', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
describe('Login router', () => {
  test('Should return 400 if no password is provider', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_mail@sitiodigital.com.br'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
