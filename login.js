const express = require('express')
const router = express.Router()

module.exports = () => {
  const route = new SignUpRouter()
  router.get('/signup', ExpressRouterAdapter.adapt(route))
}

class ExpressRouterAdapter {
  static adapt (router) {
    return async (req, res) => {
      const httpResponse = await router.route({ props: req.body })
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
// Presentation
// signup-router
class SignUpRouter {
  async route ({ props }) {
    const { email, password, repeatPassword } = props
    const user = new SignUpUseCase().signUp(email, password, repeatPassword)
    return {
      statusCode: 200,
      body: user
    }
  }
}
// Domain
// signup-usecase
class SignUpUseCase {
  async signUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      return new AddAccountRepository().add(email, password)
    }
    throw new Error('Passwords do not match')
  }
}
// Infra
// add-account-repository
const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')
class AddAccountRepository {
  async add (email, password) {
    const user = await AccountModel.create({ email, password })
    return user
  }
}
